from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
import logging
from models import VO2MaxBenchmark, VO2MaxBenchmarkCreate
from utils.database import prepare_for_mongo, parse_from_mongo, db

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/benchmarks", response_model=VO2MaxBenchmark)
async def save_vo2_benchmark(benchmark: VO2MaxBenchmarkCreate):
    """Save a VO2 Max benchmark test result"""
    try:
        benchmark_obj = VO2MaxBenchmark(**benchmark.dict())
        benchmark_data = prepare_for_mongo(benchmark_obj.dict())
        await db.vo2_benchmarks.insert_one(benchmark_data)
        
        logger.info(f"VO2 Max benchmark saved for player: {benchmark.player_id}")
        return benchmark_obj
    except Exception as e:
        logger.error(f"Error saving VO2 benchmark: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save VO2 benchmark: {str(e)}"
        )

@router.get("/benchmarks/{player_id}", response_model=List[VO2MaxBenchmark])
async def get_vo2_benchmarks(player_id: str):
    """Get all VO2 Max benchmarks for a player"""
    try:
        benchmarks = await db.vo2_benchmarks.find(
            {"player_id": player_id}
        ).sort("test_date", -1).to_list(1000)
        
        return [VO2MaxBenchmark(**parse_from_mongo(benchmark)) for benchmark in benchmarks]
    except Exception as e:
        logger.error(f"Error fetching VO2 benchmarks: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch VO2 benchmarks"
        )

@router.get("/benchmarks/latest/{player_id}", response_model=Optional[VO2MaxBenchmark])
async def get_latest_vo2_benchmark(player_id: str):
    """Get the latest VO2 Max benchmark for a player"""
    try:
        benchmark = await db.vo2_benchmarks.find_one(
            {"player_id": player_id}, 
            sort=[("test_date", -1)]
        )
        
        if benchmark:
            return VO2MaxBenchmark(**parse_from_mongo(benchmark))
        return None
    except Exception as e:
        logger.error(f"Error fetching latest VO2 benchmark: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch latest VO2 benchmark"
        )

@router.delete("/benchmarks/{benchmark_id}")
async def delete_vo2_benchmark(benchmark_id: str):
    """Delete a specific VO2 Max benchmark"""
    try:
        result = await db.vo2_benchmarks.delete_one({"id": benchmark_id})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Benchmark not found"
            )
        
        return {"message": "Benchmark deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting VO2 benchmark: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete benchmark"
        )

@router.get("/calculate")
async def calculate_vo2_max(
    age: int,
    gender: str,
    resting_heart_rate: float,
    max_heart_rate: float
):
    """Calculate VO2 Max using ACSM formulas"""
    try:
        # Validate inputs
        if age < 10 or age > 80:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Age must be between 10 and 80 years"
            )
        
        if gender.lower() not in ['male', 'female', 'm', 'f']:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Gender must be 'male' or 'female'"
            )
        
        if resting_heart_rate < 30 or resting_heart_rate > 120:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Resting heart rate must be between 30 and 120 bpm"
            )
        
        if max_heart_rate < 120 or max_heart_rate > 220:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Max heart rate must be between 120 and 220 bpm"
            )
        
        # ACSM Formulas
        if gender.lower() in ['male', 'm']:
            # For males: VO2 Max = (0.21 * Max Heart Rate) – (0.84 * Age) – (0.25 * Resting Heart Rate) + 84
            vo2_max = (0.21 * max_heart_rate) - (0.84 * age) - (0.25 * resting_heart_rate) + 84
        else:
            # For females: VO2 Max = (0.12 * Max Heart Rate) – (0.64 * Age) – (0.35 * Resting Heart Rate) + 65.4
            vo2_max = (0.12 * max_heart_rate) - (0.64 * age) - (0.35 * resting_heart_rate) + 65.4
        
        # Round to 1 decimal place
        vo2_max = round(vo2_max, 1)
        
        # Determine fitness level
        fitness_level = get_fitness_level(vo2_max, age, gender.lower())
        
        return {
            "vo2_max": vo2_max,
            "fitness_level": fitness_level,
            "inputs": {
                "age": age,
                "gender": gender.lower(),
                "resting_heart_rate": resting_heart_rate,
                "max_heart_rate": max_heart_rate
            },
            "formula_used": "ACSM",
            "source": "https://sporthypnosis.net/elementor-1032/"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error calculating VO2 Max: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to calculate VO2 Max"
        )

def get_fitness_level(vo2_max: float, age: int, gender: str) -> str:
    """Determine fitness level based on VO2 Max, age, and gender"""
    # Basic fitness level categorization
    if gender == 'male':
        if age <= 19:
            if vo2_max >= 56: return 'Excellent'
            if vo2_max >= 47: return 'Good'
            if vo2_max >= 37: return 'Average'
            return 'Below Average'
        elif age <= 29:
            if vo2_max >= 52: return 'Excellent'
            if vo2_max >= 43: return 'Good'
            if vo2_max >= 33: return 'Average'
            return 'Below Average'
        elif age <= 39:
            if vo2_max >= 48: return 'Excellent'
            if vo2_max >= 39: return 'Good'
            if vo2_max >= 29: return 'Average'
            return 'Below Average'
        else:  # 40+
            if vo2_max >= 44: return 'Excellent'
            if vo2_max >= 35: return 'Good'
            if vo2_max >= 25: return 'Average'
            return 'Below Average'
    else:  # female
        if age <= 19:
            if vo2_max >= 48: return 'Excellent'
            if vo2_max >= 39: return 'Good'
            if vo2_max >= 29: return 'Average'
            return 'Below Average'
        elif age <= 29:
            if vo2_max >= 44: return 'Excellent'
            if vo2_max >= 35: return 'Good'
            if vo2_max >= 25: return 'Average'
            return 'Below Average'
        elif age <= 39:
            if vo2_max >= 40: return 'Excellent'
            if vo2_max >= 31: return 'Good'
            if vo2_max >= 21: return 'Average'
            return 'Below Average'
        else:  # 40+
            if vo2_max >= 36: return 'Excellent'
            if vo2_max >= 27: return 'Good'
            if vo2_max >= 17: return 'Average'
            return 'Below Average'