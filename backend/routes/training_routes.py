from fastapi import APIRouter, HTTPException, status
from typing import List, Optional, Dict, Any
import logging
from models import (
    PeriodizedProgram, PeriodizedProgramCreate, TrainingProgram, TrainingProgramCreate,
    DailyRoutine, MicroCycle, MacroCycle, Exercise
)
from utils.database import prepare_for_mongo, parse_from_mongo, db
from utils.llm_integration import generate_training_program, generate_adaptive_exercises
from exercise_database import (
    PERIODIZATION_TEMPLATES, EXERCISE_DATABASE, 
    generate_daily_routine, get_intensity_rating, get_focus_areas
)
from datetime import datetime, timezone, timedelta

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/periodized-programs", response_model=PeriodizedProgram)
async def create_periodized_program(program: PeriodizedProgramCreate):
    """Create a comprehensive periodized training program"""
    try:
        # Determine player weaknesses based on latest assessment
        assessment = await db.assessments.find_one(
            {"player_name": program.player_id}, 
            sort=[("created_at", -1)]
        )
        
        weaknesses = []
        if assessment:
            # Analyze assessment to identify weak areas
            if assessment.get("sprint_30m", 10) > 4.5:
                weaknesses.append("speed")
            if assessment.get("ball_control", 3) < 4:
                weaknesses.append("ball_control")
            if assessment.get("passing_accuracy", 80) < 75:
                weaknesses.append("passing")
            if assessment.get("game_intelligence", 3) < 4:
                weaknesses.append("tactical")
        
        # Create macro cycles
        macro_cycles = []
        current_date = datetime.now(timezone.utc)
        
        phases = ["foundation_building", "development_phase", "peak_performance"]
        total_weeks = 0
        
        for i, phase in enumerate(phases):
            template = PERIODIZATION_TEMPLATES[phase]
            phase_weeks = template["duration_weeks"]
            
            # Create micro cycles (weeks) for this phase
            micro_cycles = []
            for week in range(1, phase_weeks + 1):
                # Create daily routines for this week
                daily_routines = []
                for day in range(1, 6):  # 5 training days per week
                    routine_data = generate_daily_routine(phase, week, day, weaknesses)
                    
                    # Convert exercise data to Exercise objects
                    exercises = []
                    for ex_data in routine_data["exercises"]:
                        exercise = Exercise(
                            name=ex_data["name"],
                            category=ex_data["category"],
                            description=ex_data["description"],
                            instructions=ex_data["instructions"],
                            purpose=ex_data["purpose"],
                            expected_outcome=ex_data["expected_outcome"],
                            duration=ex_data["duration"],
                            intensity=ex_data["intensity"],
                            equipment_needed=ex_data["equipment_needed"],
                            progression=ex_data.get("progression")
                        )
                        exercises.append(exercise)
                    
                    daily_routine = DailyRoutine(
                        day_number=day,
                        phase=phase,
                        exercises=exercises,
                        total_duration=routine_data["total_duration"],
                        intensity_rating=routine_data["intensity_rating"],
                        focus_areas=routine_data["focus_areas"],
                        objectives=routine_data["objectives"]
                    )
                    daily_routines.append(daily_routine)
                
                micro_cycle = MicroCycle(
                    name=f"Week {total_weeks + week}: {template['phase_name']}",
                    cycle_number=total_weeks + week,
                    phase=phase,
                    daily_routines=daily_routines,
                    objectives=template["objectives"],
                    assessment_metrics=["sprint_30m", "ball_control", "passing_accuracy", "game_intelligence"]
                )
                micro_cycles.append(micro_cycle)
            
            # Create macro cycle
            start_date = current_date + timedelta(weeks=total_weeks)
            end_date = start_date + timedelta(weeks=phase_weeks)
            assessment_date = end_date + timedelta(days=1)
            
            macro_cycle = MacroCycle(
                name=f"Phase {i+1}: {template['phase_name']}",
                phase_number=i+1,
                duration_weeks=phase_weeks,
                micro_cycles=micro_cycles,
                start_date=start_date,
                end_date=end_date,
                assessment_date=assessment_date,
                objectives=template["objectives"],
                success_criteria=[
                    f"Improve weak areas by 15%",
                    f"Complete 90% of scheduled training",
                    f"Achieve {template['intensity_progression'][-1]}% intensity capacity"
                ]
            )
            macro_cycles.append(macro_cycle)
            total_weeks += phase_weeks
        
        # Create the full periodized program
        next_assessment = current_date + timedelta(weeks=program.assessment_interval_weeks)
        
        periodized_program = PeriodizedProgram(
            player_id=program.player_id,
            program_name=program.program_name,
            total_duration_weeks=total_weeks,
            macro_cycles=macro_cycles,
            next_assessment_date=next_assessment,
            program_objectives=program.program_objectives
        )
        
        # Save to database
        program_data = prepare_for_mongo(periodized_program.dict())
        await db.periodized_programs.insert_one(program_data)
        
        logger.info(f"Periodized program created for player: {program.player_id}")
        return periodized_program
        
    except Exception as e:
        logger.error(f"Error creating periodized program: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create periodized program: {str(e)}"
        )

@router.get("/periodized-programs/{player_id}", response_model=Optional[PeriodizedProgram])
async def get_player_program(player_id: str):
    """Get the current periodized program for a player"""
    try:
        program = await db.periodized_programs.find_one(
            {"player_id": player_id}, 
            sort=[("created_at", -1)]
        )
        
        if program:
            return PeriodizedProgram(**parse_from_mongo(program))
        return None
    except Exception as e:
        logger.error(f"Error fetching player program: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch player program"
        )

@router.get("/current-routine/{player_id}")
async def get_current_routine(player_id: str):
    """Get today's training routine for a player"""
    try:
        # Get player's current program
        program = await db.periodized_programs.find_one(
            {"player_id": player_id}, 
            sort=[("created_at", -1)]
        )
        
        if not program:
            return {"message": "No training program found", "routine": None}
        
        # Calculate current position in program
        start_date = program["program_start_date"]
        if isinstance(start_date, str):
            start_date = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        current_date = datetime.now(timezone.utc)
        days_elapsed = (current_date - start_date).days
        
        current_week = (days_elapsed // 7) + 1
        current_day = (days_elapsed % 7) + 1
        
        # Find current routine
        current_routine = None
        current_phase = None
        
        week_count = 0
        for macro_cycle in program["macro_cycles"]:
            for micro_cycle in macro_cycle["micro_cycles"]:
                week_count += 1
                if week_count == current_week:
                    current_phase = macro_cycle["phase_number"]
                    if current_day <= len(micro_cycle["daily_routines"]) and current_day <= 5:  # Only weekdays
                        current_routine = micro_cycle["daily_routines"][current_day - 1]
                    break
            if current_routine:
                break
        
        if not current_routine:
            return {"message": "Rest day or program completed", "routine": None}
        
        return {
            "routine": current_routine,
            "current_week": current_week,
            "current_day": current_day,
            "current_phase": current_phase,
            "program_name": program["program_name"]
        }
        
    except Exception as e:
        logger.error(f"Error fetching current routine: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch current routine"
        )

@router.post("/programs", response_model=TrainingProgram)
async def create_training_program(program: TrainingProgramCreate):
    """Create AI-generated training program (legacy endpoint)"""
    try:
        # Get player's latest assessment for context
        assessment = await db.assessments.find_one(
            {"player_name": program.player_id},
            sort=[("created_at", -1)]
        )
        
        if not assessment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No assessment found for player. Please complete assessment first."
            )
        
        # Generate AI training program
        program_content = await generate_training_program(assessment, week_number=1)
        
        # Create training program object
        training_program = TrainingProgram(
            player_id=program.player_id,
            program_type=program.program_type,
            program_content=program_content,
            weekly_schedule={},
            milestones=[],
            is_group=program.is_group or False,
            spotify_playlist=program.spotify_playlist
        )
        
        # Save to database
        program_data = prepare_for_mongo(training_program.dict())
        await db.training_programs.insert_one(program_data)
        
        logger.info(f"Training program created for player: {program.player_id}")
        return training_program
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating training program: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create training program: {str(e)}"
        )

@router.get("/programs/{player_id}", response_model=List[TrainingProgram])
async def get_player_programs(player_id: str):
    """Get all training programs for a player"""
    try:
        programs = await db.training_programs.find(
            {"player_id": player_id}
        ).sort("created_at", -1).to_list(1000)
        
        return [TrainingProgram(**parse_from_mongo(program)) for program in programs]
    except Exception as e:
        logger.error(f"Error fetching player programs: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch player programs"
        )

@router.post("/adaptive-exercises")
async def get_adaptive_exercises(
    player_id: str,
    phase: str = "development",
    week_number: int = 1
):
    """Generate adaptive exercises based on player weaknesses"""
    try:
        # Get player's latest assessment
        assessment = await db.assessments.find_one(
            {"player_name": player_id},
            sort=[("created_at", -1)]
        )
        
        if not assessment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No assessment found for player"
            )
        
        # Identify weaknesses
        weaknesses = []
        if assessment.get("sprint_30m", 10) > 4.5:
            weaknesses.append("speed")
        if assessment.get("ball_control", 3) < 4:
            weaknesses.append("technical")
        if assessment.get("game_intelligence", 3) < 4:
            weaknesses.append("tactical")
        
        # Generate adaptive exercises
        exercises = await generate_adaptive_exercises(weaknesses, phase, week_number)
        
        return {
            "player_id": player_id,
            "phase": phase,
            "week_number": week_number,
            "identified_weaknesses": weaknesses,
            "adaptive_exercises": exercises
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating adaptive exercises: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate adaptive exercises"
        )