from fastapi import APIRouter, HTTPException, status
from typing import List, Optional, Dict, Any
import logging
from models import (
    DailyProgress, DailyProgressCreate, WeeklyProgress, WeeklyProgressCreate,
    PerformanceMetric, ExerciseCompletion, ExerciseCompletionCreate
)
from utils.database import prepare_for_mongo, parse_from_mongo, db
from datetime import datetime, timezone, timedelta

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/daily", response_model=DailyProgress)
async def log_daily_progress(progress: DailyProgressCreate):
    """Log daily training progress and exercise completions"""
    try:
        # Create exercise completions
        completed_exercises = []
        for completion_data in progress.completed_exercises:
            completion = ExerciseCompletion(**completion_data.dict())
            completed_exercises.append(completion)
        
        # Create daily progress entry
        daily_progress = DailyProgress(
            player_id=progress.player_id,
            routine_id=progress.routine_id,
            completed_exercises=completed_exercises,
            overall_rating=progress.overall_rating,
            energy_level=progress.energy_level,
            motivation_level=progress.motivation_level,
            daily_notes=progress.daily_notes,
            total_time_spent=progress.total_time_spent
        )
        
        # Save to database
        progress_data = prepare_for_mongo(daily_progress.dict())
        await db.daily_progress.insert_one(progress_data)
        
        # Update performance metrics based on completed exercises
        await update_performance_metrics(progress.player_id, completed_exercises)
        
        logger.info(f"Daily progress logged for player: {progress.player_id}")
        return daily_progress
        
    except Exception as e:
        logger.error(f"Error logging daily progress: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to log daily progress: {str(e)}"
        )

@router.get("/daily/{player_id}", response_model=List[DailyProgress])
async def get_daily_progress(player_id: str, days: int = 30):
    """Get daily progress history for a player"""
    try:
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
        progress_entries = await db.daily_progress.find(
            {
                "player_id": player_id,
                "date": {"$gte": start_date}
            }
        ).sort("date", -1).to_list(1000)
        
        return [DailyProgress(**parse_from_mongo(entry)) for entry in progress_entries]
    except Exception as e:
        logger.error(f"Error fetching daily progress: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch daily progress"
        )

@router.post("/weekly", response_model=WeeklyProgress)
async def log_weekly_progress(progress: WeeklyProgressCreate):
    """Log weekly training progress"""
    try:
        weekly_progress = WeeklyProgress(**progress.dict())
        progress_data = prepare_for_mongo(weekly_progress.dict())
        await db.weekly_progress.insert_one(progress_data)
        
        logger.info(f"Weekly progress logged for player: {progress.player_id}")
        return weekly_progress
        
    except Exception as e:
        logger.error(f"Error logging weekly progress: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to log weekly progress: {str(e)}"
        )

@router.get("/weekly/{player_id}", response_model=List[WeeklyProgress])
async def get_weekly_progress(player_id: str):
    """Get weekly progress history for a player"""
    try:
        progress_entries = await db.weekly_progress.find(
            {"player_id": player_id}
        ).sort("created_at", -1).to_list(1000)
        
        return [WeeklyProgress(**parse_from_mongo(entry)) for entry in progress_entries]
    except Exception as e:
        logger.error(f"Error fetching weekly progress: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch weekly progress"
        )

@router.get("/metrics/{player_id}")
async def get_performance_metrics(player_id: str):
    """Get performance metrics and progress tracking"""
    try:
        # Get recent performance metrics
        metrics = await db.performance_metrics.find(
            {"player_id": player_id}
        ).sort("measurement_date", -1).to_list(1000)
        
        # Get daily progress for visualization
        progress_entries = await db.daily_progress.find(
            {"player_id": player_id}
        ).sort("date", -1).limit(30).to_list(1000)
        
        # Calculate improvement trends
        improvement_data = calculate_improvement_trends(metrics)
        
        # Get next assessment date
        next_assessment = await get_next_assessment_date(player_id)
        
        return {
            "metrics": [PerformanceMetric(**parse_from_mongo(metric)) for metric in metrics],
            "daily_progress": [DailyProgress(**parse_from_mongo(entry)) for entry in progress_entries],
            "improvement_trends": improvement_data,
            "next_assessment": next_assessment
        }
        
    except Exception as e:
        logger.error(f"Error fetching performance metrics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch performance metrics"
        )

@router.get("/summary/{player_id}")
async def get_progress_summary(player_id: str):
    """Get a comprehensive progress summary for a player"""
    try:
        # Get latest assessment for baseline
        assessment = await db.assessments.find_one(
            {"player_name": player_id},
            sort=[("created_at", -1)]
        )
        
        if not assessment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No assessment found for player"
            )
        
        # Get training completion stats
        thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
        
        daily_sessions = await db.daily_progress.count_documents(
            {
                "player_id": player_id,
                "date": {"$gte": thirty_days_ago}
            }
        )
        
        # Get performance trends
        metrics = await db.performance_metrics.find(
            {"player_id": player_id}
        ).sort("measurement_date", -1).to_list(100)
        
        trends = calculate_improvement_trends(metrics)
        
        # Calculate training consistency
        training_consistency = min(100, (daily_sessions / 30) * 100)
        
        return {
            "player_id": player_id,
            "assessment_date": assessment.get("created_at"),
            "overall_score": assessment.get("overall_score", 0),
            "performance_level": assessment.get("performance_level", "Developing"),
            "training_sessions_30_days": daily_sessions,
            "training_consistency_percentage": round(training_consistency, 1),
            "improvement_trends": trends,
            "next_assessment_date": await get_next_assessment_date(player_id)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating progress summary: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate progress summary"
        )

# Helper functions
async def update_performance_metrics(player_id: str, completed_exercises: List[ExerciseCompletion]):
    """Update performance metrics based on completed exercises"""
    try:
        # Get current program to determine phase and week
        program = await db.periodized_programs.find_one(
            {"player_id": player_id}, 
            sort=[("created_at", -1)]
        )
        
        if not program:
            return
        
        current_week = calculate_current_week(program)
        current_phase = calculate_current_phase(program)
        
        # Update metrics based on exercise performance
        for exercise in completed_exercises:
            if exercise.performance_rating and exercise.performance_rating >= 4:
                # Good performance - create positive metric entry
                metric = PerformanceMetric(
                    player_id=player_id,
                    metric_name=f"{exercise.exercise_id}_performance",
                    value=exercise.performance_rating,
                    phase_number=current_phase,
                    week_number=current_week
                )
                
                metric_data = prepare_for_mongo(metric.dict())
                await db.performance_metrics.insert_one(metric_data)
        
    except Exception as e:
        logger.error(f"Error updating performance metrics: {e}")

def calculate_current_week(program: Dict[str, Any]) -> int:
    """Calculate current week in program"""
    start_date = program["program_start_date"]
    if isinstance(start_date, str):
        start_date = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
    current_date = datetime.now(timezone.utc)
    days_elapsed = (current_date - start_date).days
    return (days_elapsed // 7) + 1

def calculate_current_phase(program: Dict[str, Any]) -> int:
    """Calculate current phase in program"""
    current_week = calculate_current_week(program)
    week_count = 0
    
    for i, macro_cycle in enumerate(program["macro_cycles"]):
        week_count += macro_cycle["duration_weeks"]
        if current_week <= week_count:
            return i + 1
    
    return len(program["macro_cycles"])

def calculate_improvement_trends(metrics: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Calculate improvement trends from performance metrics"""
    trends = {}
    
    # Group metrics by type
    metric_groups = {}
    for metric in metrics:
        metric_type = metric["metric_name"]
        if metric_type not in metric_groups:
            metric_groups[metric_type] = []
        metric_groups[metric_type].append(metric)
    
    # Calculate trends for each metric type
    for metric_type, metric_list in metric_groups.items():
        if len(metric_list) >= 2:
            # Sort by date
            sorted_metrics = sorted(metric_list, key=lambda x: x["measurement_date"])
            first_value = sorted_metrics[0]["value"]
            last_value = sorted_metrics[-1]["value"]
            
            if first_value > 0:
                improvement_percentage = ((last_value - first_value) / first_value) * 100
                trends[metric_type] = {
                    "improvement_percentage": round(improvement_percentage, 2),
                    "trend_direction": "up" if improvement_percentage > 0 else "down",
                    "data_points": len(sorted_metrics)
                }
    
    return trends

async def get_next_assessment_date(player_id: str) -> Optional[datetime]:
    """Get the next assessment date for a player"""
    try:
        # Get player's program to find next assessment date
        program = await db.periodized_programs.find_one(
            {"player_id": player_id},
            sort=[("created_at", -1)]
        )
        
        if program:
            next_date = program.get("next_assessment_date")
            if isinstance(next_date, str):
                return datetime.fromisoformat(next_date.replace('Z', '+00:00'))
            return next_date
        
        # Default to 4 weeks from now
        return datetime.now(timezone.utc) + timedelta(weeks=4)
        
    except Exception as e:
        logger.error(f"Error getting next assessment date: {e}")
        return datetime.now(timezone.utc) + timedelta(weeks=4)