// Complete Youth Scouting Handbook Standards and Assessment Framework

// Complete Age-Based Standards from Youth Scouting Handbook
export const YOUTH_HANDBOOK_STANDARDS = {
  // 12-14 years
  "12-14": {
    // Physical benchmarks
    sprint_30m: { 
      excellent: 4.5, 
      good: 4.7, 
      average: 4.9, 
      poor: 5.0,
      unit: "seconds",
      description: "30m sprint from standing start"
    },
    yo_yo_test: { 
      excellent: 1200, 
      good: 1000, 
      average: 900, 
      poor: 800,
      unit: "meters",
      description: "Yo-Yo Intermittent Recovery Test Level 1"
    },
    vo2_max: { 
      excellent: 52, 
      good: 50, 
      average: 49, 
      poor: 48,
      unit: "ml/kg/min",
      description: "Maximum oxygen uptake capacity"
    },
    vertical_jump: { 
      excellent: 40, 
      good: 35, 
      average: 32, 
      poor: 30,
      unit: "cm",
      description: "Countermovement jump height"
    },
    body_fat: { 
      excellent: 12, 
      good: 15, 
      average: 16, 
      poor: 18,
      unit: "%",
      description: "Body fat percentage (male)"
    },
    // Technical benchmarks (1-5 scale or percentage)
    ball_control: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "First touch and ball manipulation under pressure"
    },
    passing_accuracy: { 
      excellent: 75, 
      good: 70, 
      average: 65, 
      poor: 60,
      unit: "%",
      description: "Successful passes to target under pressure"
    },
    dribbling_success: { 
      excellent: 55, 
      good: 50, 
      average: 45, 
      poor: 40,
      unit: "%",
      description: "Successful 1v1 dribbling attempts"
    },
    shooting_accuracy: { 
      excellent: 60, 
      good: 55, 
      average: 50, 
      poor: 45,
      unit: "%",
      description: "Shots on target from various positions"
    },
    defensive_duels: { 
      excellent: 70, 
      good: 65, 
      average: 60, 
      poor: 55,
      unit: "%",
      description: "Defensive actions won (tackles, interceptions, headers)"
    },
    // Tactical awareness (1-5 scale)
    game_intelligence: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "Anticipation and reading of game situations"
    },
    positioning: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "Off-ball movement and spatial awareness"
    },
    decision_making: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "Speed and quality of decisions under pressure"
    },
    // Psychological traits (1-5 scale)
    coachability: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "Ability to receive feedback and implement changes"
    },
    mental_toughness: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "Composure and resilience under pressure"
    }
  },
  
  // 15-16 years
  "15-16": {
    // Physical benchmarks
    sprint_30m: { 
      excellent: 4.2, 
      good: 4.4, 
      average: 4.6, 
      poor: 4.7,
      unit: "seconds",
      description: "30m sprint from standing start"
    },
    yo_yo_test: { 
      excellent: 1600, 
      good: 1400, 
      average: 1300, 
      poor: 1200,
      unit: "meters",
      description: "Yo-Yo Intermittent Recovery Test Level 1"
    },
    vo2_max: { 
      excellent: 56, 
      good: 54, 
      average: 53, 
      poor: 52,
      unit: "ml/kg/min",
      description: "Maximum oxygen uptake capacity"
    },
    vertical_jump: { 
      excellent: 50, 
      good: 45, 
      average: 42, 
      poor: 40,
      unit: "cm",
      description: "Countermovement jump height"
    },
    body_fat: { 
      excellent: 10, 
      good: 12, 
      average: 14, 
      poor: 15,
      unit: "%",
      description: "Body fat percentage (male)"
    },
    // Technical benchmarks
    ball_control: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "First touch and ball manipulation under pressure"
    },
    passing_accuracy: { 
      excellent: 85, 
      good: 80, 
      average: 75, 
      poor: 70,
      unit: "%",
      description: "Successful passes to target under pressure"
    },
    dribbling_success: { 
      excellent: 65, 
      good: 60, 
      average: 55, 
      poor: 50,
      unit: "%",
      description: "Successful 1v1 dribbling attempts"
    },
    shooting_accuracy: { 
      excellent: 70, 
      good: 65, 
      average: 60, 
      poor: 55,
      unit: "%",
      description: "Shots on target from various positions"
    },
    defensive_duels: { 
      excellent: 75, 
      good: 70, 
      average: 65, 
      poor: 60,
      unit: "%",
      description: "Defensive actions won (tackles, interceptions, headers)"
    },
    // Tactical awareness
    game_intelligence: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "Anticipation and reading of game situations"
    },
    positioning: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "Off-ball movement and spatial awareness"
    },
    decision_making: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "Speed and quality of decisions under pressure"
    },
    // Psychological traits
    coachability: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "Ability to receive feedback and implement changes"
    },
    mental_toughness: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "Composure and resilience under pressure"
    }
  },
  
  // 17-18 years
  "17-18": {
    // Physical benchmarks
    sprint_30m: { 
      excellent: 4.0, 
      good: 4.2, 
      average: 4.4, 
      poor: 4.5,
      unit: "seconds",
      description: "30m sprint from standing start"
    },
    yo_yo_test: { 
      excellent: 2000, 
      good: 1800, 
      average: 1700, 
      poor: 1600,
      unit: "meters",
      description: "Yo-Yo Intermittent Recovery Test Level 1"
    },
    vo2_max: { 
      excellent: 60, 
      good: 58, 
      average: 57, 
      poor: 56,
      unit: "ml/kg/min",
      description: "Maximum oxygen uptake capacity"
    },
    vertical_jump: { 
      excellent: 60, 
      good: 55, 
      average: 52, 
      poor: 50,
      unit: "cm",
      description: "Countermovement jump height"
    },
    body_fat: { 
      excellent: 8, 
      good: 10, 
      average: 11, 
      poor: 12,
      unit: "%",
      description: "Body fat percentage (male)"
    },
    // Technical benchmarks
    ball_control: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "First touch and ball manipulation under pressure"
    },
    passing_accuracy: { 
      excellent: 90, 
      good: 85, 
      average: 80, 
      poor: 75,
      unit: "%",
      description: "Successful passes to target under pressure"
    },
    dribbling_success: { 
      excellent: 70, 
      good: 65, 
      average: 60, 
      poor: 55,
      unit: "%",
      description: "Successful 1v1 dribbling attempts"
    },
    shooting_accuracy: { 
      excellent: 75, 
      good: 70, 
      average: 65, 
      poor: 60,
      unit: "%",
      description: "Shots on target from various positions"
    },
    defensive_duels: { 
      excellent: 80, 
      good: 75, 
      average: 70, 
      poor: 65,
      unit: "%",
      description: "Defensive actions won (tackles, interceptions, headers)"
    },
    // Tactical awareness
    game_intelligence: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "Anticipation and reading of game situations"
    },
    positioning: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "Off-ball movement and spatial awareness"
    },
    decision_making: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "Speed and quality of decisions under pressure"
    },
    // Psychological traits
    coachability: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "Ability to receive feedback and implement changes"
    },
    mental_toughness: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "Composure and resilience under pressure"
    }
  },
  
  // Elite/Professional
  "elite": {
    // Physical benchmarks
    sprint_30m: { 
      excellent: 3.8, 
      good: 3.9, 
      average: 4.0, 
      poor: 4.1,
      unit: "seconds",
      description: "30m sprint from standing start"
    },
    yo_yo_test: { 
      excellent: 2400, 
      good: 2300, 
      average: 2200, 
      poor: 2100,
      unit: "meters",
      description: "Yo-Yo Intermittent Recovery Test Level 1"
    },
    vo2_max: { 
      excellent: 65, 
      good: 62, 
      average: 60, 
      poor: 58,
      unit: "ml/kg/min",
      description: "Maximum oxygen uptake capacity"
    },
    vertical_jump: { 
      excellent: 70, 
      good: 65, 
      average: 60, 
      poor: 55,
      unit: "cm",
      description: "Countermovement jump height"
    },
    body_fat: { 
      excellent: 6, 
      good: 8, 
      average: 9, 
      poor: 10,
      unit: "%",
      description: "Body fat percentage (male)"
    },
    // Technical benchmarks
    ball_control: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "First touch and ball manipulation under pressure"
    },
    passing_accuracy: { 
      excellent: 95, 
      good: 90, 
      average: 85, 
      poor: 80,
      unit: "%",
      description: "Successful passes to target under pressure"
    },
    dribbling_success: { 
      excellent: 75, 
      good: 70, 
      average: 65, 
      poor: 60,
      unit: "%",
      description: "Successful 1v1 dribbling attempts"
    },
    shooting_accuracy: { 
      excellent: 85, 
      good: 80, 
      average: 75, 
      poor: 70,
      unit: "%",
      description: "Shots on target from various positions"
    },
    defensive_duels: { 
      excellent: 85, 
      good: 80, 
      average: 75, 
      poor: 70,
      unit: "%",
      description: "Defensive actions won (tackles, interceptions, headers)"
    },
    // Tactical awareness
    game_intelligence: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "Anticipation and reading of game situations"
    },
    positioning: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "Off-ball movement and spatial awareness"
    },
    decision_making: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "Speed and quality of decisions under pressure"
    },
    // Psychological traits
    coachability: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "Ability to receive feedback and implement changes"
    },
    mental_toughness: { 
      excellent: 5, 
      good: 4, 
      average: 3, 
      poor: 2,
      unit: "1-5 scale",
      description: "Composure and resilience under pressure"
    }
  }
};

// Assessment category weights from handbook
export const ASSESSMENT_WEIGHTS = {
  technical: 0.40,    // 40% - Ball control, passing, dribbling, shooting, defending
  tactical: 0.30,     // 30% - Game intelligence, positioning, decision making
  physical: 0.20,     // 20% - Sprint, endurance, power, body composition
  psychological: 0.10 // 10% - Mental toughness, coachability, leadership
};

// Detailed assessment explanations for each test
export const ASSESSMENT_EXPLANATIONS = {
  // Physical assessments
  sprint_30m: {
    title: "30m Sprint Test",
    category: "Physical",
    weight: "20%",
    description: "Measures explosive acceleration and short-distance speed from a standing start over 30 meters.",
    importance: "Critical for beating defenders in short distances, chasing loose balls, and quick reactions in match situations.",
    protocol: "Standing start, electronic timing gates at 0m and 30m, maximum effort sprint with 3-5 minute recovery between attempts.",
    tips: "Focus on explosive first step, drive phase with forward lean, maintain acceleration throughout, avoid decelerating early.",
    scoring: "Measured in seconds - lower times indicate better performance. Elite youth: <4.0s, Professional: <3.8s"
  },
  
  yo_yo_test: {
    title: "Yo-Yo Intermittent Recovery Test Level 1",
    category: "Physical", 
    weight: "20%",
    description: "Progressive shuttle run test with brief recovery periods, measuring aerobic capacity and ability to recover between high-intensity efforts.",
    importance: "Reflects match-realistic demands with repeated high-intensity efforts followed by brief recovery periods.",
    protocol: "20m shuttles at increasing speeds with 10-second active recovery, controlled by audio signals, test ends when player can't keep pace.",
    tips: "Start conservatively, focus on efficient turning technique, maintain rhythm with audio cues, use recovery periods effectively.",
    scoring: "Measured in total meters covered. Elite youth: >2000m, Professional: >2200m"
  },
  
  vo2_max: {
    title: "VO2 Max (Maximum Oxygen Uptake)",
    category: "Physical",
    weight: "20%", 
    description: "Maximum amount of oxygen the body can utilize during intense exercise, indicating cardiovascular fitness level.",
    importance: "Determines endurance capacity and ability to maintain high intensity efforts throughout an entire match.",
    protocol: "Laboratory test on treadmill or field test estimation through shuttle runs or step tests with heart rate monitoring.",
    tips: "Improve through high-intensity interval training, long continuous runs, and sport-specific conditioning drills.",
    scoring: "Measured in ml/kg/min. Elite youth: >60, Professional: >65"
  },
  
  vertical_jump: {
    title: "Vertical Jump Test (Countermovement Jump)",
    category: "Physical",
    weight: "20%",
    description: "Measures lower body explosive power and jumping ability using a countermovement technique.",
    importance: "Essential for aerial duels, headers, goalkeeper reactions, and overall athletic performance and power output.",
    protocol: "Standing position, arms free, countermovement downward then explosive jump upward, measure maximum height reached.",
    tips: "Use full range of motion in countermovement, coordinate arm swing with leg drive, focus on explosive upward force.",
    scoring: "Measured in centimeters. Elite youth: >60cm, Professional: >70cm"
  },
  
  body_fat: {
    title: "Body Fat Percentage",
    category: "Physical",
    weight: "20%",
    description: "Proportion of body weight consisting of fat tissue, indicating overall body composition and fitness level.",
    importance: "Lower body fat percentages typically correlate with improved speed, agility, endurance, and reduced injury risk.",
    protocol: "DEXA scan, bioelectrical impedance, or skinfold measurements by trained professional for accuracy.",
    tips: "Maintain through balanced nutrition, cardiovascular training, strength training, and adequate hydration.",
    scoring: "Measured as percentage. Elite youth: 8-12%, Professional: 6-10%"
  },
  
  // Technical assessments
  ball_control: {
    title: "Ball Control & First Touch Assessment",
    category: "Technical",
    weight: "40%",
    description: "Overall ability to receive, control, and manipulate the ball with various body parts under different conditions and pressure.",
    importance: "Fundamental skill that forms the foundation for all other technical abilities and enables effective play under pressure.",
    protocol: "Receive balls from various angles, heights, and speeds. Assessed on first touch quality, close control, and ball manipulation.",
    tips: "Practice receiving with both feet, thigh, chest, and head. Focus on cushioning contact and immediate control of ball.",
    scoring: "1-5 scale: 1=Very Weak, 2=Weak, 3=Average, 4=Good, 5=Excellent"
  },
  
  passing_accuracy: {
    title: "Passing Accuracy Under Pressure",
    category: "Technical",
    weight: "40%",
    description: "Percentage of successful passes to designated targets while under time pressure and defensive pressure.",
    importance: "Foundation of team play, possession maintenance, and creating scoring opportunities through accurate distribution.",
    protocol: "Pass to targets at various distances (short 5-15m, medium 15-30m, long 30m+) with defenders applying pressure.",
    tips: "Focus on proper technique, body positioning, weight of pass, and maintain vision of target and pressure.",
    scoring: "Percentage successful. Elite youth: >80%, Professional: >90%"
  },
  
  dribbling_success: {
    title: "1v1 Dribbling Success Rate",
    category: "Technical",
    weight: "40%",
    description: "Percentage of successful dribbling attempts past defenders in controlled 1v1 situations.",
    importance: "Critical for beating defenders, creating space, progressing play, and maintaining possession under pressure.",
    protocol: "1v1 situations in 20x10m area, attacker attempts to dribble past defender to end line, multiple attempts recorded.",
    tips: "Vary pace and direction, use body feints, keep ball close under control, read defender's positioning and momentum.",
    scoring: "Percentage successful. Elite youth: >60%, Professional: >70%"
  },
  
  shooting_accuracy: {
    title: "Shooting Accuracy Test",
    category: "Technical", 
    weight: "40%",
    description: "Percentage of shots that hit designated target areas from various distances, angles, and under pressure.",
    importance: "Directly impacts goal-scoring ability and team's offensive effectiveness in converting chances to goals.",
    protocol: "Shots from various positions (inside box, edge of box, angles) at targets in goal corners and areas.",
    tips: "Focus on placement over power, proper foot contact, follow through, and quick shot preparation.",
    scoring: "Percentage on target. Elite youth: >65%, Professional: >75%"
  },
  
  defensive_duels: {
    title: "Defensive Duels Won",
    category: "Technical",
    weight: "40%",
    description: "Percentage of successful defensive actions including tackles, interceptions, aerial duels, and pressure situations.",
    importance: "Essential for defenders and all players in modern soccer for team defensive structure and ball recovery.",
    protocol: "Various defensive scenarios: 1v1 defending, aerial challenges, interception opportunities, tackle situations.",
    tips: "Focus on timing, body positioning, patience, reading attacker's intentions, and staying balanced.",
    scoring: "Percentage successful. Elite youth: >65%, Professional: >75%"
  },
  
  // Tactical assessments
  game_intelligence: {
    title: "Game Intelligence & Anticipation",
    category: "Tactical",
    weight: "30%",
    description: "Ability to read game situations, anticipate play development, and make intelligent decisions 1-2 seconds ahead.",
    importance: "Separates good players from great players, enables proactive rather than reactive play.",
    protocol: "Observed during small-sided games and match situations, rated on decision quality and anticipation.",
    tips: "Study game footage, practice visualization, focus on scanning surroundings, learn patterns of play.",
    scoring: "1-5 scale based on observation: 1=Very Weak, 2=Weak, 3=Average, 4=Good, 5=Excellent"
  },
  
  positioning: {
    title: "Positional Awareness & Movement",
    category: "Tactical",
    weight: "30%",
    description: "Off-ball movement, spatial awareness, ability to find space and close gaps according to tactical requirements.",
    importance: "Creates opportunities, provides support options, maintains team shape and tactical discipline.",
    protocol: "Observed during positional play exercises and match situations, rated on movement quality and timing.",
    tips: "Understand team tactics, communicate with teammates, scan constantly, move purposefully not randomly.",
    scoring: "1-5 scale based on observation: 1=Very Weak, 2=Weak, 3=Average, 4=Good, 5=Excellent"
  },
  
  decision_making: {
    title: "Decision Making Under Pressure",
    category: "Tactical",
    weight: "30%",
    description: "Speed and quality of decisions when under time pressure and defensive pressure.",
    importance: "Determines effectiveness in match situations where quick, correct decisions are crucial.",
    protocol: "Timed decision-making scenarios with multiple options, assessed on speed and quality of choices.",
    tips: "Practice decision-making drills, improve scanning habits, understand when to be quick vs. patient.",
    scoring: "1-5 scale based on speed and quality: 1=Very Weak, 2=Weak, 3=Average, 4=Good, 5=Excellent"
  },
  
  // Psychological assessments
  coachability: {
    title: "Coachability & Work Ethic",
    category: "Psychological",
    weight: "10%",
    description: "Ability to receive feedback, implement changes, maintain high effort levels, and show commitment to improvement.",
    importance: "Determines potential for development and ability to adapt to higher levels of play.",
    protocol: "Observed over multiple sessions, rated on response to instruction and effort levels.",
    tips: "Stay open to feedback, ask questions, maintain positive attitude, show consistent effort.",
    scoring: "1-5 scale based on observation: 1=Very Weak, 2=Weak, 3=Average, 4=Good, 5=Excellent"
  },
  
  mental_toughness: {
    title: "Mental Toughness & Resilience",
    category: "Psychological",
    weight: "10%",
    description: "Composure under pressure, ability to bounce back from mistakes, maintain performance in difficult situations.",
    importance: "Crucial for performing consistently at higher levels and handling pressure of competitive matches.",
    protocol: "Observed during pressure situations and after mistakes, rated on emotional control and recovery.",
    tips: "Practice visualization, develop pre-performance routines, focus on process not outcome, learn from mistakes.",
    scoring: "1-5 scale based on observation: 1=Very Weak, 2=Weak, 3=Average, 4=Good, 5=Excellent"
  }
};

// Helper functions for assessment evaluation
export const getAgeCategory = (age) => {
  if (age >= 12 && age <= 14) return '12-14';
  if (age >= 15 && age <= 16) return '15-16';
  if (age >= 17 && age <= 18) return '17-18';
  return 'elite';
};

export const evaluatePerformance = (value, metric, ageCategory) => {
  const standards = YOUTH_HANDBOOK_STANDARDS[ageCategory];
  if (!standards || !standards[metric]) return null;
  
  const { excellent, good, average, poor } = standards[metric];
  
  // For time-based metrics and body fat (lower is better)
  const lowerIsBetter = ['sprint_30m', 'body_fat'];
  // For all other metrics (higher is better)
  const higherIsBetter = ['yo_yo_test', 'vo2_max', 'vertical_jump', 'ball_control', 
    'passing_accuracy', 'dribbling_success', 'shooting_accuracy', 'defensive_duels',
    'game_intelligence', 'positioning', 'decision_making', 'coachability', 'mental_toughness'];
  
  if (lowerIsBetter.includes(metric)) {
    if (value <= excellent) return 'excellent';
    if (value <= good) return 'good';
    if (value <= average) return 'average';
    return 'poor';
  } else if (higherIsBetter.includes(metric)) {
    if (value >= excellent) return 'excellent';
    if (value >= good) return 'good';
    if (value >= average) return 'average';
    return 'poor';
  }
  
  return 'average';
};

export const calculateOverallScore = (assessmentData, ageCategory) => {
  if (!assessmentData || !ageCategory) return null;
  
  const physicalMetrics = ['sprint_30m', 'yo_yo_test', 'vo2_max', 'vertical_jump', 'body_fat'];
  const technicalMetrics = ['ball_control', 'passing_accuracy', 'dribbling_success', 'shooting_accuracy', 'defensive_duels'];
  const tacticalMetrics = ['game_intelligence', 'positioning', 'decision_making'];
  const psychologicalMetrics = ['coachability', 'mental_toughness'];
  
  const scoreMap = { excellent: 5, good: 4, average: 3, poor: 2, null: 0 };
  
  const calculateCategoryScore = (metrics) => {
    let totalScore = 0;
    let validMetrics = 0;
    
    metrics.forEach(metric => {
      const value = assessmentData[metric];
      if (value !== null && value !== undefined && value !== '') {
        const performance = evaluatePerformance(parseFloat(value), metric, ageCategory);
        totalScore += scoreMap[performance] || 0;
        validMetrics++;
      }
    });
    
    return validMetrics > 0 ? totalScore / validMetrics : 0;
  };
  
  const physicalScore = calculateCategoryScore(physicalMetrics);
  const technicalScore = calculateCategoryScore(technicalMetrics);
  const tacticalScore = calculateCategoryScore(tacticalMetrics);
  const psychologicalScore = calculateCategoryScore(psychologicalMetrics);
  
  const weightedScore = (
    physicalScore * ASSESSMENT_WEIGHTS.physical +
    technicalScore * ASSESSMENT_WEIGHTS.technical +
    tacticalScore * ASSESSMENT_WEIGHTS.tactical +
    psychologicalScore * ASSESSMENT_WEIGHTS.psychological
  );
  
  return {
    overall: weightedScore.toFixed(2),
    physical: physicalScore.toFixed(2),
    technical: technicalScore.toFixed(2),
    tactical: tacticalScore.toFixed(2),
    psychological: psychologicalScore.toFixed(2)
  };
};