import React, { useState, useEffect, createContext, useContext } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Badge } from "./components/ui/badge";
import { Progress } from "./components/ui/progress";
import { useSpeechSynthesis, useSpeechRecognition } from "react-speech-kit";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from "recharts";
import { Activity, Target, TrendingUp, Mic, MicOff, Volume2, VolumeX, Square, Trophy, Users, Music, Bell, Coins, Gift, Zap, Crown, Star, Flame, Languages, Globe, BarChart3, Award, ArrowUp, ArrowDown, Equal, BookOpen, Lightbulb, Scale, Heart, Timer, Ruler, Info, HelpCircle } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Age-Based Professional Soccer Standards
const AGE_BASED_STANDARDS = {
  // Youth (14-17 years)
  youth: {
    sprint_40m: { elite: 5.0, pro: 5.5, semi: 6.0, amateur: 6.8 },
    sprint_100m: { elite: 12.0, pro: 13.0, semi: 14.0, amateur: 15.5 },
    cone_drill: { elite: 7.0, pro: 7.8, semi: 8.5, amateur: 9.5 },
    ladder_drill: { elite: 6.8, pro: 7.5, semi: 8.2, amateur: 9.0 },
    shuttle_run: { elite: 9.0, pro: 9.8, semi: 10.5, amateur: 11.5 },
    sit_reach: { elite: 35, pro: 28, semi: 22, amateur: 18 },
    shoulder_flexibility: { elite: 185, pro: 180, semi: 175, amateur: 165 },
    hip_flexibility: { elite: 130, pro: 120, semi: 110, amateur: 100 },
    juggling_count: { elite: 200, pro: 100, semi: 50, amateur: 25 },
    dribbling_time: { elite: 10.0, pro: 12.0, semi: 14.0, amateur: 16.0 },
    passing_accuracy: { elite: 88, pro: 82, semi: 75, amateur: 65 },
    shooting_accuracy: { elite: 75, pro: 68, semi: 60, amateur: 50 },
    bmi: { elite: 21.0, pro: 22.0, semi: 23.0, amateur: 24.5 },
    body_fat: { elite: 10, pro: 12, semi: 15, amateur: 18 },
    muscle_mass: { elite: 42, pro: 40, semi: 38, amateur: 35 },
    resting_heart_rate: { elite: 50, pro: 55, semi: 60, amateur: 70 },
    vo2_max: { elite: 58, pro: 52, semi: 48, amateur: 42 }
  },
  // Young Adult (18-23 years)
  youngAdult: {
    sprint_40m: { elite: 4.2, pro: 4.8, semi: 5.2, amateur: 6.0 },
    sprint_100m: { elite: 10.5, pro: 11.2, semi: 12.0, amateur: 13.5 },
    cone_drill: { elite: 6.0, pro: 6.8, semi: 7.5, amateur: 8.5 },
    ladder_drill: { elite: 5.8, pro: 6.5, semi: 7.2, amateur: 8.0 },
    shuttle_run: { elite: 8.0, pro: 8.8, semi: 9.5, amateur: 10.5 },
    sit_reach: { elite: 45, pro: 38, semi: 32, amateur: 25 },
    shoulder_flexibility: { elite: 190, pro: 185, semi: 180, amateur: 175 },
    hip_flexibility: { elite: 140, pro: 130, semi: 120, amateur: 110 },
    juggling_count: { elite: 500, pro: 300, semi: 150, amateur: 50 },
    dribbling_time: { elite: 8.5, pro: 10.0, semi: 12.0, amateur: 15.0 },
    passing_accuracy: { elite: 95, pro: 88, semi: 80, amateur: 70 },
    shooting_accuracy: { elite: 85, pro: 78, semi: 70, amateur: 60 },
    bmi: { elite: 22.5, pro: 23.5, semi: 24.5, amateur: 26.0 },
    body_fat: { elite: 8, pro: 12, semi: 15, amateur: 18 },
    muscle_mass: { elite: 48, pro: 45, semi: 42, amateur: 38 },
    resting_heart_rate: { elite: 45, pro: 50, semi: 55, amateur: 65 },
    vo2_max: { elite: 65, pro: 58, semi: 52, amateur: 45 }
  },
  // Adult (24-30 years)
  adult: {
    sprint_40m: { elite: 4.3, pro: 4.9, semi: 5.3, amateur: 6.2 },
    sprint_100m: { elite: 10.8, pro: 11.5, semi: 12.3, amateur: 14.0 },
    cone_drill: { elite: 6.2, pro: 7.0, semi: 7.7, amateur: 8.7 },
    ladder_drill: { elite: 6.0, pro: 6.7, semi: 7.4, amateur: 8.2 },
    shuttle_run: { elite: 8.2, pro: 9.0, semi: 9.7, amateur: 10.8 },
    sit_reach: { elite: 42, pro: 35, semi: 29, amateur: 22 },
    shoulder_flexibility: { elite: 188, pro: 183, semi: 178, amateur: 172 },
    hip_flexibility: { elite: 135, pro: 125, semi: 115, amateur: 105 },
    juggling_count: { elite: 450, pro: 280, semi: 130, amateur: 45 },
    dribbling_time: { elite: 8.8, pro: 10.3, semi: 12.5, amateur: 15.5 },
    passing_accuracy: { elite: 93, pro: 86, semi: 78, amateur: 68 },
    shooting_accuracy: { elite: 82, pro: 75, semi: 67, amateur: 57 },
    bmi: { elite: 23.0, pro: 24.0, semi: 25.0, amateur: 26.5 },
    body_fat: { elite: 9, pro: 13, semi: 16, amateur: 20 },
    muscle_mass: { elite: 46, pro: 43, semi: 40, amateur: 36 },
    resting_heart_rate: { elite: 48, pro: 53, semi: 58, amateur: 68 },
    vo2_max: { elite: 62, pro: 55, semi: 49, amateur: 42 }
  },
  // Veteran (31+ years)
  veteran: {
    sprint_40m: { elite: 4.6, pro: 5.2, semi: 5.8, amateur: 6.8 },
    sprint_100m: { elite: 11.5, pro: 12.3, semi: 13.5, amateur: 15.0 },
    cone_drill: { elite: 6.8, pro: 7.5, semi: 8.3, amateur: 9.2 },
    ladder_drill: { elite: 6.5, pro: 7.2, semi: 8.0, amateur: 8.8 },
    shuttle_run: { elite: 8.8, pro: 9.5, semi: 10.3, amateur: 11.5 },
    sit_reach: { elite: 38, pro: 32, semi: 26, amateur: 20 },
    shoulder_flexibility: { elite: 185, pro: 180, semi: 175, amateur: 168 },
    hip_flexibility: { elite: 128, pro: 118, semi: 108, amateur: 98 },
    juggling_count: { elite: 350, pro: 220, semi: 100, amateur: 35 },
    dribbling_time: { elite: 9.5, pro: 11.0, semi: 13.5, amateur: 16.5 },
    passing_accuracy: { elite: 90, pro: 83, semi: 75, amateur: 65 },
    shooting_accuracy: { elite: 78, pro: 72, semi: 64, amateur: 54 },
    bmi: { elite: 23.5, pro: 24.5, semi: 25.5, amateur: 27.0 },
    body_fat: { elite: 11, pro: 15, semi: 18, amateur: 22 },
    muscle_mass: { elite: 44, pro: 41, semi: 38, amateur: 34 },
    resting_heart_rate: { elite: 52, pro: 57, semi: 62, amateur: 72 },
    vo2_max: { elite: 58, pro: 51, semi: 46, amateur: 39 }
  }
};

// Assessment Field Explanations
const ASSESSMENT_EXPLANATIONS = {
  sprint_40m: {
    title: "40m Sprint Test",
    description: "Measures explosive acceleration and short-distance speed. Critical for quick bursts during matches.",
    importance: "Essential for beating defenders, chasing loose balls, and quick reactions.",
    tips: "Focus on proper starting position, drive phase, and maintaining form throughout the sprint."
  },
  sprint_100m: {
    title: "100m Sprint Test", 
    description: "Evaluates maximum running speed and sustained acceleration over longer distance.",
    importance: "Important for breakaway runs, covering large distances quickly, and overall pace.",
    tips: "Work on running mechanics, stride length, and maintaining speed endurance."
  },
  cone_drill: {
    title: "Cone Agility Drill",
    description: "Tests ability to change direction quickly while maintaining control and balance.",
    importance: "Crucial for dribbling, defending, and navigating tight spaces during play.",
    tips: "Keep low center of gravity, use short quick steps, and stay balanced throughout turns."
  },
  ladder_drill: {
    title: "Speed Ladder Drill",
    description: "Measures foot speed, coordination, and neuromuscular efficiency.",
    importance: "Improves quick feet for ball skills, defensive positioning, and rapid movements.",
    tips: "Stay on balls of feet, maintain rhythm, and focus on precision over pure speed."
  },
  shuttle_run: {
    title: "Shuttle Run Test",
    description: "Evaluates multi-directional speed, deceleration, and change of direction ability.",
    importance: "Reflects match-realistic movements with stops, starts, and direction changes.",
    tips: "Practice efficient deceleration techniques and explosive re-acceleration."
  },
  sit_reach: {
    title: "Sit and Reach Flexibility",
    description: "Measures hamstring and lower back flexibility, key for injury prevention.",
    importance: "Prevents muscle strains, improves kicking range, and enhances overall mobility.",
    tips: "Regular stretching routine, warm-up properly, and focus on gradual improvement."
  },
  shoulder_flexibility: {
    title: "Shoulder Range of Motion",
    description: "Tests shoulder joint mobility and flexibility for optimal upper body movement.",
    importance: "Important for throw-ins, goalkeeper movements, and balance during play.",
    tips: "Dynamic warm-ups, shoulder circles, and targeted stretching exercises."
  },
  hip_flexibility: {
    title: "Hip Flexibility Assessment",
    description: "Evaluates hip joint mobility crucial for kicking, running, and defensive movements.",
    importance: "Essential for powerful shots, long passes, and injury prevention.",
    tips: "Hip flexor stretches, dynamic leg swings, and mobility work."
  },
  juggling_count: {
    title: "Ball Juggling Test",
    description: "Measures ball control, touch, and coordination with different body parts.",
    importance: "Fundamental skill that translates to better first touch and ball mastery.",
    tips: "Start with consistent touches, use both feet, progress to thighs and head."
  },
  dribbling_time: {
    title: "Dribbling Speed Test",
    description: "Evaluates ability to maintain ball control while moving at speed through obstacles.",
    importance: "Critical for beating defenders and maintaining possession under pressure.",
    tips: "Keep ball close, use both feet, and maintain vision while dribbling."
  },
  passing_accuracy: {
    title: "Passing Accuracy Test",
    description: "Measures precision and consistency in delivering the ball to targets.",
    importance: "Foundation of team play and maintaining possession in competitive matches.",
    tips: "Focus on technique, follow through, and practice with both feet."
  },
  shooting_accuracy: {
    title: "Shooting Accuracy Test",
    description: "Tests ability to hit target areas consistently when shooting at goal.",
    importance: "Directly impacts goal-scoring ability and team's offensive effectiveness.",
    tips: "Practice placement over power, follow through, and shooting from various angles."
  },
  bmi: {
    title: "Body Mass Index (BMI)",
    description: "Ratio of weight to height, indicating overall body composition balance.",
    importance: "Optimal BMI ensures good strength-to-weight ratio for soccer performance.",
    tips: "Maintain through balanced diet and regular training, focusing on muscle development."
  },
  body_fat: {
    title: "Body Fat Percentage",
    description: "Proportion of body weight that is fat tissue versus lean muscle mass.",
    importance: "Lower body fat improves speed, agility, and endurance while reducing injury risk.",
    tips: "Combine cardiovascular training with strength work and proper nutrition."
  },
  muscle_mass: {
    title: "Muscle Mass Percentage",
    description: "Proportion of body weight consisting of skeletal muscle tissue.",
    importance: "Higher muscle mass provides power, strength, and injury protection.",
    tips: "Progressive resistance training, adequate protein intake, and recovery time."
  },
  resting_heart_rate: {
    title: "Resting Heart Rate",
    description: "Heart beats per minute when at complete rest, indicating cardiovascular fitness.",
    importance: "Lower RHR suggests better cardiovascular efficiency and fitness level.",
    tips: "Improve through consistent aerobic training and proper recovery."
  },
  vo2_max: {
    title: "VO2 Max (Aerobic Capacity)",
    description: "Maximum oxygen uptake during intense exercise, measuring cardiorespiratory fitness.",
    importance: "Determines endurance capacity and ability to maintain high intensity throughout match.",
    tips: "High-intensity interval training, long runs, and sport-specific conditioning."
  }
};

// Exercise Explanations for Training Programs
const EXERCISE_EXPLANATIONS = {
  speedTraining: {
    title: "Speed Training Exercises",
    exercises: {
      "Sprint Intervals": "Short bursts of maximum speed with recovery periods to improve acceleration and top speed",
      "Acceleration Drills": "Focus on explosive starts from various positions to improve first step quickness",
      "Hill Sprints": "Running uphill to build power and strength while improving running mechanics",
      "Resistance Sprints": "Using parachutes or sleds to build explosive power and stride strength"
    }
  },
  agilityTraining: {
    title: "Agility & Coordination Exercises", 
    exercises: {
      "Cone Weaving": "Zigzag patterns through cones to improve change of direction and body control",
      "Ladder Drills": "Quick feet patterns to enhance coordination and neuromuscular efficiency",
      "Box Drills": "Multi-directional movements in square patterns to improve spatial awareness",
      "Reaction Drills": "Response-based movements to improve decision-making speed"
    }
  },
  ballSkills: {
    title: "Ball Control & Technical Skills",
    exercises: {
      "Juggling Progression": "Building from basic juggling to advanced patterns using all body parts",
      "Cone Dribbling": "Navigating through obstacles while maintaining close ball control",
      "Wall Passes": "Quick combination plays against wall to improve passing accuracy and timing",
      "Shooting Drills": "Target practice from various angles and distances to improve accuracy"
    }
  },
  fitnessTraining: {
    title: "Physical Conditioning Exercises",
    exercises: {
      "Interval Running": "Alternating high and low intensity periods to build cardiovascular endurance",
      "Plyometric Jumps": "Explosive jumping exercises to develop power and muscle elasticity",
      "Core Strengthening": "Planks, bridges, and rotational exercises for stability and injury prevention",
      "Flexibility Routine": "Dynamic and static stretching to maintain and improve range of motion"
    }
  }
};

// Language Context (keeping existing translations)
const LanguageContext = createContext();

const translations = {
  en: {
    appTitle: "🔥 Yoyo the Fire Boy ⚽",
    appSubtitle: "✨ Professional soccer training program generator with AI-powered insights ✨",
    badges: {
      igniteYourPower: "🔥 Ignite Your Power",
      trainWithFriends: "👥 Train with Friends", 
      collectTrophies: "🏆 Collect Trophies & Coins"
    },
    highlights: {
      title: "🌟 Soccer Player Development Guide",
      subtitle: "Essential references and benchmarks for building elite soccer players"
    },
    standards: {
      title: "📊 Age-Based Professional Standards",
      subtitle: "Performance benchmarks tailored to your age group for optimal development",
      currentLevel: "Your Current Level",
      targetLevel: "Age-Appropriate Target",
      ultimateGoal: "Ultimate Elite Goal",
      ageGroup: "Age Group Standards"
    },
    assessment: {
      title: "🔥 Yoyo the Fire Boy Assessment 🔥",
      subtitle: "✨ Discover your true power and ignite the fire on the field! ✨",
      explanations: "📖 Assessment Guide & Explanations",
      playerName: "Fire Warrior Name",
      playerNamePlaceholder: "Enter your name, champion!",
      starAge: "Star Age",
      agePlaceholder: "How old are you?",
      powerPosition: "Power Position",
      positionPlaceholder: "Choose your battle position",
      positions: {
        goalkeeper: "🥅 Fortress Guardian",
        defender: "🛡️ Defense Warrior", 
        midfielder: "⚡ Midfield Master",
        forward: "🗡️ Fire Striker",
        striker: "🔥 Net Destroyer"
      },
      speedMetrics: "⚡ Super Speed Power",
      agilityMetrics: "🎯 Golden Agility Skills",
      flexibilityMetrics: "🧘‍♂️ Magic Flexibility Power",
      ballHandling: "⚽ Ball Control Magic ✨",
      bodyComposition: "⚖️ Body Composition & Fitness",
      fields: {
        sprint40: "🏃‍♂️ 40m Sprint (seconds)",
        sprint100: "🚀 100m Sprint (seconds)", 
        coneDrill: "🔶 Cone Drill (seconds)",
        ladderDrill: "🪜 Ladder Drill (seconds)",
        shuttleRun: "🔄 Shuttle Run (seconds)",
        sitReach: "🤸‍♂️ Sit & Reach (cm)",
        shoulderFlex: "💪 Shoulder Flexibility (degrees)",
        hipFlex: "🦵 Hip Flexibility (degrees)",
        juggling: "🤹‍♂️ Magic Juggling Count",
        dribbling: "🏃‍♂️ Magic Dribbling Time (seconds)",
        passing: "🎯 Passing Accuracy (%)",
        shooting: "⚽ Deadly Shooting Accuracy (%)",
        bmi: "⚖️ Body Mass Index (BMI)",
        bodyFat: "📉 Body Fat Percentage (%)",
        muscleMass: "💪 Muscle Mass Percentage (%)",
        restingHeartRate: "❤️ Resting Heart Rate (BPM)",
        vo2Max: "🫁 VO2 Max (ml/kg/min)"
      },
      submitButton: "🚀 Ignite the Fire and Start the Glory Journey! 🚀",
      submitting: "🔥 Creating Yoyo's Fire Profile..."
    },
    training: {
      title: "🔥 Fire Training Programs for Yoyo {playerName} 🔥",
      benchmarkTitle: "📊 Your Performance Benchmark Analysis",
      currentVsGoal: "Current Performance vs Age-Appropriate Goals",
      exerciseExplanations: "💡 Exercise Explanations & Techniques",
      aiProgram: "🤖 Yoyo's Smart Fire Program",
      ronaldoTemplate: "👑 Legendary Ronaldo Template",
      generating: "🔥 Generating...",
      ageGroup: "Age Group: {age} years ({category})",
      performanceLevel: "Performance Level: {level}",
      mainWeaknesses: "Main Areas for Improvement:",
      mainStrengths: "Key Strengths to Maintain:",
      trainingFocus: "Primary Training Focus:"
    },
    common: {
      selectPlayer: "Select Fire Warrior",
      tabs: {
        highlights: "🌟 Development Guide",
        standards: "📊 Age-Based Standards",
        assessment: "🔥 Assessment",
        training: "🚀 Training Programs"
      },
      showExplanation: "Show Explanation",
      hideExplanation: "Hide Explanation",
      elite: "Elite",
      professional: "Professional", 
      semiPro: "Semi-Pro",
      amateur: "Amateur",
      youth: "Youth (14-17)",
      youngAdult: "Young Adult (18-23)",
      adult: "Adult (24-30)",
      veteran: "Veteran (31+)"
    }
  },
  ar: {
    appTitle: "🔥 يويو الفتى الناري ⚽",
    appSubtitle: "✨ مولد برامج التدريب الاحترافية مع رؤى مدعومة بالذكاء الاصطناعي ✨",
    badges: {
      igniteYourPower: "🔥 أشعل النار في قوتك",
      trainWithFriends: "👥 تدرب مع الأصدقاء",
      collectTrophies: "🏆 اجمع الكؤوس والعملات"
    },
    highlights: {
      title: "🌟 دليل تطوير لاعب كرة القدم",
      subtitle: "المراجع الأساسية والمعايير لبناء لاعبي كرة قدم نخبة"
    },
    standards: {
      title: "📊 المعايير الاحترافية حسب العمر",
      subtitle: "معايير الأداء المصممة لمجموعتك العمرية للتطوير الأمثل",
      currentLevel: "مستواك الحالي",
      targetLevel: "الهدف المناسب للعمر",
      ultimateGoal: "الهدف النهائي النخبوي",
      ageGroup: "معايير المجموعة العمرية"
    },
    assessment: {
      title: "🔥 تقييم يويو الفتى الناري 🔥",
      subtitle: "✨ اكتشف قوتك الحقيقية وأشعل النار في الملعب! ✨",
      explanations: "📖 دليل التقييم والشروحات",
      playerName: "اسم المحارب الناري",
      playerNamePlaceholder: "أدخل اسمك يا بطل!",
      starAge: "عمر النجم",
      agePlaceholder: "كم عمرك؟",
      powerPosition: "مركز القوة",
      positionPlaceholder: "اختر مركزك في المعركة",
      positions: {
        goalkeeper: "🥅 حارس الحصن",
        defender: "🛡️ محارب الدفاع",
        midfielder: "⚡ سيد الوسط",
        forward: "🗡️ مهاجم ناري",
        striker: "🔥 مدمر الشباك"
      },
      speedMetrics: "⚡ قوة السرعة الخارقة",
      agilityMetrics: "🎯 مهارات الرشاقة الذهبية",
      flexibilityMetrics: "🧘‍♂️ قوة المرونة السحرية",
      ballHandling: "⚽ سحر التحكم بالكرة ✨",
      bodyComposition: "⚖️ تركيب الجسم واللياقة",
      fields: {
        sprint40: "🏃‍♂️ عدو 40 متر (ثانية)",
        sprint100: "🚀 عدو 100 متر (ثانية)",
        coneDrill: "🔶 تدريب المخاريط (ثانية)",
        ladderDrill: "🪜 تدريب السلم (ثانية)",
        shuttleRun: "🔄 الجري المكوكي (ثانية)",
        sitReach: "🤸‍♂️ الجلوس والوصول (سم)",
        shoulderFlex: "💪 مرونة الكتف (درجة)",
        hipFlex: "🦵 مرونة الورك (درجة)",
        juggling: "🤹‍♂️ عدد الشقلبات السحرية",
        dribbling: "🏃‍♂️ وقت المراوغة الساحرة (ثانية)",
        passing: "🎯 دقة التمرير (%)",
        shooting: "⚽ دقة التسديد القاتلة (%)",
        bmi: "⚖️ مؤشر كتلة الجسم",
        bodyFat: "📉 نسبة الدهون (%)",
        muscleMass: "💪 نسبة الكتلة العضلية (%)",
        restingHeartRate: "❤️ معدل ضربات القلب أثناء الراحة",
        vo2Max: "🫁 VO2 الأقصى (مل/كغ/دقيقة)"
      },
      submitButton: "🚀 أشعل النار وابدأ رحلة المجد! 🚀",
      submitting: "🔥 جاري إنشاء ملف يويو الناري..."
    },
    training: {
      title: "🔥 برامج التدريب الناري ليويو {playerName} 🔥",
      benchmarkTitle: "📊 تحليل معايير الأداء الخاصة بك",
      currentVsGoal: "الأداء الحالي مقابل الأهداف المناسبة للعمر",
      exerciseExplanations: "💡 شروحات التمارين والتقنيات",
      aiProgram: "🤖 برنامج يويو الذكي الناري",
      ronaldoTemplate: "👑 قالب رونالدو الأسطوري",
      generating: "🔥 جاري الإنشاء...",
      ageGroup: "المجموعة العمرية: {age} سنة ({category})",
      performanceLevel: "مستوى الأداء: {level}",
      mainWeaknesses: "المجالات الرئيسية للتحسين:",
      mainStrengths: "نقاط القوة الرئيسية للمحافظة عليها:",
      trainingFocus: "التركيز التدريبي الأساسي:"
    },
    common: {
      selectPlayer: "اختيار المحارب الناري",
      tabs: {
        highlights: "🌟 دليل التطوير",
        standards: "📊 المعايير حسب العمر",
        assessment: "🔥 التقييم",
        training: "🚀 برامج التدريب"
      },
      showExplanation: "إظهار الشرح",
      hideExplanation: "إخفاء الشرح",
      elite: "نخبة",
      professional: "احترافي",
      semiPro: "شبه احترافي", 
      amateur: "هاوي",
      youth: "شباب (14-17)",
      youngAdult: "شاب بالغ (18-23)",
      adult: "بالغ (24-30)",
      veteran: "متمرس (31+)"
    }
  }
};

// Language Provider Component (keeping existing implementation)
const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [direction, setDirection] = useState('ltr');

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    const newDir = newLang === 'ar' ? 'rtl' : 'ltr';
    setLanguage(newLang);
    setDirection(newDir);
    
    document.documentElement.setAttribute('dir', newDir);
    document.documentElement.setAttribute('lang', newLang);
    document.body.setAttribute('dir', newDir);
    document.body.className = `lang-${newLang} dir-${newDir}`;
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const formatText = (text, params = {}) => {
    let formatted = text;
    Object.keys(params).forEach(key => {
      formatted = formatted.replace(`{${key}}`, params[key]);
    });
    return formatted;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage, t, formatText }}>
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language Toggle Component
const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm border-orange-300 text-orange-700 hover:bg-orange-50"
    >
      <Globe className="w-4 h-4 mr-2" />
      {language === 'en' ? 'العربية' : 'English'}
    </Button>
  );
};

// Age-Based Standards Component
const AgeBasedStandards = () => {
  const { t, direction } = useLanguage();

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-300">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-cyan-800 flex items-center justify-center">
            <BarChart3 className={`${direction === 'rtl' ? 'ml-3' : 'mr-3'} w-8 h-8`} />
            {t('standards.title')}
          </CardTitle>
          <CardDescription className="text-cyan-600 text-lg">
            {t('standards.subtitle')}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Age Group Standards Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(AGE_BASED_STANDARDS).map(([ageGroup, standards]) => (
          <Card key={ageGroup} className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-300">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center">
                <Award className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-5 h-5`} />
                {t(`common.${ageGroup}`)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Speed Standards */}
                <div className="bg-red-50 p-3 rounded-lg">
                  <h4 className="font-bold text-red-800 mb-2">⚡ Speed Standards</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>40m Sprint: <Badge variant="outline">{standards.sprint_40m.elite}s (Elite)</Badge></div>
                    <div>100m Sprint: <Badge variant="outline">{standards.sprint_100m.elite}s (Elite)</Badge></div>
                  </div> 
                </div>

                {/* Agility Standards */}
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-bold text-yellow-800 mb-2">🎯 Agility Standards</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Cone Drill: <Badge variant="outline">{standards.cone_drill.elite}s (Elite)</Badge></div>
                    <div>Ladder Drill: <Badge variant="outline">{standards.ladder_drill.elite}s (Elite)</Badge></div>
                  </div>
                </div>

                {/* Ball Control Standards */}
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-bold text-purple-800 mb-2">⚽ Ball Control Standards</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Juggling: <Badge variant="outline">{standards.juggling_count.elite} (Elite)</Badge></div>
                    <div>Passing: <Badge variant="outline">{standards.passing_accuracy.elite}% (Elite)</Badge></div>
                  </div>
                </div>

                {/* Fitness Standards */}
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-bold text-green-800 mb-2">💪 Fitness Standards</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>BMI: <Badge variant="outline">{standards.bmi.elite} (Elite)</Badge></div>
                    <div>VO2 Max: <Badge variant="outline">{standards.vo2_max.elite} (Elite)</Badge></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Level Explanation */}
      <Card className="bg-gradient-to-r from-gold-50 to-yellow-50 border-2 border-gold-300">
        <CardHeader>
          <CardTitle className="text-gold-800">📊 Performance Level Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-gold-200">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-gold-600" />
              <h4 className="font-bold text-gold-800">Elite</h4>
              <p className="text-sm text-gold-600">Professional/International level performance</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <Award className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-bold text-green-800">Professional</h4>
              <p className="text-sm text-green-600">High-level competitive standard</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <Star className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-bold text-blue-800">Semi-Pro</h4>
              <p className="text-sm text-blue-600">Advanced amateur/semi-professional</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <Users className="w-8 h-8 mx-auto mb-2 text-gray-600" />
              <h4 className="font-bold text-gray-800">Amateur</h4>
              <p className="text-sm text-gray-600">Recreational/beginner level</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Assessment Field Explanation Component
const FieldExplanation = ({ fieldName, isVisible, onToggle }) => {
  const { direction } = useLanguage();
  const explanation = ASSESSMENT_EXPLANATIONS[fieldName];
  
  if (!explanation) return null;

  return (
    <div className="mt-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="text-xs text-blue-600 hover:text-blue-800"
      >
        <HelpCircle className="w-3 h-3 mr-1" />
        {isVisible ? 'Hide Explanation' : 'Show Explanation'}
      </Button>
      
      {isVisible && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h5 className="font-bold text-blue-800 mb-1">{explanation.title}</h5>
          <p className="text-sm text-blue-700 mb-2" dir={direction}>{explanation.description}</p>
          <p className="text-xs text-blue-600 mb-1"><strong>Why it matters:</strong> {explanation.importance}</p>
          <p className="text-xs text-green-600"><strong>Tips:</strong> {explanation.tips}</p>
        </div>
      )}
    </div>
  );
};

// Get age category helper function
const getAgeCategory = (age) => {
  if (age >= 14 && age <= 17) return 'youth';
  if (age >= 18 && age <= 23) return 'youngAdult';
  if (age >= 24 && age <= 30) return 'adult';
  return 'veteran';
};

// Enhanced Assessment Component
const AssessmentForm = ({ onAssessmentCreated }) => {
  const { t, direction } = useLanguage();
  const [formData, setFormData] = useState({
    player_name: "",
    age: "",
    position: "",
    sprint_40m: "",
    sprint_100m: "",
    cone_drill: "",
    ladder_drill: "",
    shuttle_run: "",
    sit_reach: "",
    shoulder_flexibility: "",
    hip_flexibility: "",
    juggling_count: "",
    dribbling_time: "",
    passing_accuracy: "",
    shooting_accuracy: "",
    bmi: "",
    body_fat: "",
    muscle_mass: "",
    resting_heart_rate: "",
    vo2_max: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [explanationVisibility, setExplanationVisibility] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/assessments`, formData);
      onAssessmentCreated(response.data);
      setFormData({
        player_name: "",
        age: "",
        position: "",
        sprint_40m: "",
        sprint_100m: "",
        cone_drill: "",
        ladder_drill: "",
        shuttle_run: "",
        sit_reach: "",
        shoulder_flexibility: "",
        hip_flexibility: "",
        juggling_count: "",
        dribbling_time: "",
        passing_accuracy: "",
        shooting_accuracy: "",
        bmi: "",
        body_fat: "",
        muscle_mass: "",
        resting_heart_rate: "",
        vo2_max: ""
      });
    } catch (error) {
      console.error("Error creating assessment:", error);
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleExplanation = (fieldName) => {
    setExplanationVisibility(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const getFieldValidation = (fieldName, value, age) => {
    if (!value || !age) return null;
    
    const numValue = parseFloat(value);
    const ageCategory = getAgeCategory(parseInt(age));
    const standards = AGE_BASED_STANDARDS[ageCategory];
    
    if (!standards || !standards[fieldName]) return null;
    
    const { elite, pro, semi, amateur } = standards[fieldName];
    
    // For time-based metrics (lower is better)
    const timeBasedMetrics = ['sprint_40m', 'sprint_100m', 'cone_drill', 'ladder_drill', 'shuttle_run', 'dribbling_time'];
    const isTimeBased = timeBasedMetrics.includes(fieldName);
    
    let status = 'amateur';
    if (isTimeBased) {
      if (numValue <= elite) status = 'elite';
      else if (numValue <= pro) status = 'professional';
      else if (numValue <= semi) status = 'semiPro';
    } else {
      if (numValue >= elite) status = 'elite';
      else if (numValue >= pro) status = 'professional';
      else if (numValue >= semi) status = 'semiPro';
    }
    
    const colors = {
      elite: 'border-gold-400 bg-gold-50',
      professional: 'border-green-400 bg-green-50',
      semiPro: 'border-blue-400 bg-blue-50',
      amateur: 'border-orange-400 bg-orange-50'
    };
    
    return colors[status];
  };

  return (
    <Card className="max-w-5xl mx-auto bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 border-orange-300 fire-glow">
      <CardHeader className="text-center">
        <CardTitle className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent">
          {t('assessment.title')}
        </CardTitle>
        <CardDescription className="text-orange-700 text-lg font-semibold">
          {t('assessment.subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="player_name" className="text-orange-800 font-bold flex items-center">
                <Flame className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-4 h-4`} />
                {t('assessment.playerName')}
              </Label>
              <Input
                id="player_name"
                name="player_name"
                value={formData.player_name}
                onChange={handleChange}
                required
                className="border-orange-400 focus:border-red-500 bg-gradient-to-r from-orange-100 to-yellow-100"
                dir={direction}
                placeholder={t('assessment.playerNamePlaceholder')}
              />
            </div>
            <div>
              <Label htmlFor="age" className="text-orange-800 font-bold flex items-center">
                <Star className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-4 h-4`} />
                {t('assessment.starAge')}
              </Label>
              <Input
                id="age"
                name="age"
                type="number"
                min="14"
                max="50"
                value={formData.age}
                onChange={handleChange}
                required
                className="border-orange-400 focus:border-red-500 bg-gradient-to-r from-orange-100 to-yellow-100"
                placeholder={t('assessment.agePlaceholder')}
              />
              {formData.age && (
                <Badge className="mt-1 bg-blue-100 text-blue-800">
                  {t(`common.${getAgeCategory(parseInt(formData.age))}`)}
                </Badge>
              )}
            </div>
            <div>
              <Label htmlFor="position" className="text-orange-800 font-bold flex items-center">
                <Target className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-4 h-4`} />
                {t('assessment.powerPosition')}
              </Label>
              <Select onValueChange={(value) => setFormData({...formData, position: value})}>
                <SelectTrigger className="border-orange-400 focus:border-red-500 bg-gradient-to-r from-orange-100 to-yellow-100">
                  <SelectValue placeholder={t('assessment.positionPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="goalkeeper">{t('assessment.positions.goalkeeper')}</SelectItem>
                  <SelectItem value="defender">{t('assessment.positions.defender')}</SelectItem>
                  <SelectItem value="midfielder">{t('assessment.positions.midfielder')}</SelectItem>
                  <SelectItem value="forward">{t('assessment.positions.forward')}</SelectItem>
                  <SelectItem value="striker">{t('assessment.positions.striker')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Speed Metrics */}
          <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-lg p-6 border-2 border-red-300 fire-glow">
            <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
              <Zap className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} text-yellow-500`} />
              {t('assessment.speedMetrics')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="sprint_40m" className="text-red-700 font-semibold">{t('assessment.fields.sprint40')}</Label>
                <Input
                  id="sprint_40m"
                  name="sprint_40m"
                  type="number"
                  step="0.01"
                  min="3.5"
                  max="15"
                  value={formData.sprint_40m}
                  onChange={handleChange}
                  required
                  className={`border-red-400 focus:border-red-600 bg-gradient-to-r from-red-50 to-orange-50 ${getFieldValidation('sprint_40m', formData.sprint_40m, formData.age) || ''}`}
                  placeholder="e.g., 4.8"
                />
                <FieldExplanation 
                  fieldName="sprint_40m" 
                  isVisible={explanationVisibility.sprint_40m}
                  onToggle={() => toggleExplanation('sprint_40m')}
                />
              </div>
              <div>
                <Label htmlFor="sprint_100m" className="text-red-700 font-semibold">{t('assessment.fields.sprint100')}</Label>
                <Input
                  id="sprint_100m"
                  name="sprint_100m"
                  type="number"
                  step="0.01"
                  min="9"
                  max="20"
                  value={formData.sprint_100m}
                  onChange={handleChange}
                  required
                  className={`border-red-400 focus:border-red-600 bg-gradient-to-r from-red-50 to-orange-50 ${getFieldValidation('sprint_100m', formData.sprint_100m, formData.age) || ''}`}
                  placeholder="e.g., 11.5"
                />
                <FieldExplanation 
                  fieldName="sprint_100m" 
                  isVisible={explanationVisibility.sprint_100m}
                  onToggle={() => toggleExplanation('sprint_100m')}
                />
              </div>
            </div>
          </div>

          {/* Agility Metrics */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-6 border-2 border-yellow-400 fire-glow">
            <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
              <Target className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} text-orange-500`} />
              {t('assessment.agilityMetrics')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cone_drill" className="text-yellow-700 font-semibold">{t('assessment.fields.coneDrill')}</Label>
                <Input
                  id="cone_drill"
                  name="cone_drill"
                  type="number"
                  step="0.01"
                  min="5"
                  max="15"
                  value={formData.cone_drill}
                  onChange={handleChange}
                  required
                  className={`border-yellow-400 focus:border-orange-500 bg-gradient-to-r from-yellow-50 to-orange-50 ${getFieldValidation('cone_drill', formData.cone_drill, formData.age) || ''}`}
                  placeholder="e.g., 7.2"
                />
                <FieldExplanation 
                  fieldName="cone_drill" 
                  isVisible={explanationVisibility.cone_drill}
                  onToggle={() => toggleExplanation('cone_drill')}
                />
              </div>
              <div>
                <Label htmlFor="ladder_drill" className="text-yellow-700 font-semibold">{t('assessment.fields.ladderDrill')}</Label>
                <Input
                  id="ladder_drill"
                  name="ladder_drill"
                  type="number"
                  step="0.01"
                  min="4"
                  max="12"
                  value={formData.ladder_drill}
                  onChange={handleChange}
                  required
                  className={`border-yellow-400 focus:border-orange-500 bg-gradient-to-r from-yellow-50 to-orange-50 ${getFieldValidation('ladder_drill', formData.ladder_drill, formData.age) || ''}`}
                  placeholder="e.g., 6.8"
                />
                <FieldExplanation 
                  fieldName="ladder_drill" 
                  isVisible={explanationVisibility.ladder_drill}
                  onToggle={() => toggleExplanation('ladder_drill')}
                />
              </div>
              <div>
                <Label htmlFor="shuttle_run" className="text-yellow-700 font-semibold">{t('assessment.fields.shuttleRun')}</Label>
                <Input
                  id="shuttle_run"
                  name="shuttle_run"
                  type="number"
                  step="0.01"
                  min="6"
                  max="15"
                  value={formData.shuttle_run}
                  onChange={handleChange}
                  required
                  className={`border-yellow-400 focus:border-orange-500 bg-gradient-to-r from-yellow-50 to-orange-50 ${getFieldValidation('shuttle_run', formData.shuttle_run, formData.age) || ''}`}
                  placeholder="e.g., 9.1"
                />
                <FieldExplanation 
                  fieldName="shuttle_run" 
                  isVisible={explanationVisibility.shuttle_run}
                  onToggle={() => toggleExplanation('shuttle_run')}
                />
              </div>
            </div>
          </div>

          {/* Flexibility Metrics */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6 border-2 border-green-400 fire-glow">
            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
              {t('assessment.flexibilityMetrics')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="sit_reach" className="text-green-700 font-semibold">{t('assessment.fields.sitReach')}</Label>
                <Input
                  id="sit_reach"
                  name="sit_reach"
                  type="number"
                  step="0.1"
                  min="10"
                  max="60"
                  value={formData.sit_reach}
                  onChange={handleChange}
                  required
                  className={`border-green-400 focus:border-blue-500 bg-gradient-to-r from-green-50 to-blue-50 ${getFieldValidation('sit_reach', formData.sit_reach, formData.age) || ''}`}
                  placeholder="e.g., 32"
                />
                <FieldExplanation 
                  fieldName="sit_reach" 
                  isVisible={explanationVisibility.sit_reach}
                  onToggle={() => toggleExplanation('sit_reach')}
                />
              </div>
              <div>
                <Label htmlFor="shoulder_flexibility" className="text-green-700 font-semibold">{t('assessment.fields.shoulderFlex')}</Label>
                <Input
                  id="shoulder_flexibility"
                  name="shoulder_flexibility"
                  type="number"
                  min="160"
                  max="200"
                  value={formData.shoulder_flexibility}
                  onChange={handleChange}
                  required
                  className={`border-green-400 focus:border-blue-500 bg-gradient-to-r from-green-50 to-blue-50 ${getFieldValidation('shoulder_flexibility', formData.shoulder_flexibility, formData.age) || ''}`}
                  placeholder="e.g., 180"
                />
                <FieldExplanation 
                  fieldName="shoulder_flexibility" 
                  isVisible={explanationVisibility.shoulder_flexibility}
                  onToggle={() => toggleExplanation('shoulder_flexibility')}
                />
              </div>
              <div>
                <Label htmlFor="hip_flexibility" className="text-green-700 font-semibold">{t('assessment.fields.hipFlex')}</Label>
                <Input
                  id="hip_flexibility"  
                  name="hip_flexibility"
                  type="number"
                  min="90"
                  max="150"
                  value={formData.hip_flexibility}
                  onChange={handleChange}
                  required
                  className={`border-green-400 focus:border-blue-500 bg-gradient-to-r from-green-50 to-blue-50 ${getFieldValidation('hip_flexibility', formData.hip_flexibility, formData.age) || ''}`}
                  placeholder="e.g., 125"
                />
                <FieldExplanation 
                  fieldName="hip_flexibility" 
                  isVisible={explanationVisibility.hip_flexibility}
                  onToggle={() => toggleExplanation('hip_flexibility')}
                />
              </div>
            </div>
          </div>

          {/* Ball Handling Metrics */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 border-2 border-purple-400 fire-glow">
            <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
              {t('assessment.ballHandling')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="juggling_count" className="text-purple-700 font-semibold">{t('assessment.fields.juggling')}</Label>
                <Input
                  id="juggling_count"
                  name="juggling_count"
                  type="number"
                  min="5"
                  max="1000"
                  value={formData.juggling_count}
                  onChange={handleChange}
                  required
                  className={`border-purple-400 focus:border-pink-500 bg-gradient-to-r from-purple-50 to-pink-50 ${getFieldValidation('juggling_count', formData.juggling_count, formData.age) || ''}`}
                  placeholder="e.g., 85"
                />
                <FieldExplanation 
                  fieldName="juggling_count" 
                  isVisible={explanationVisibility.juggling_count}
                  onToggle={() => toggleExplanation('juggling_count')}
                />
              </div>
              <div>
                <Label htmlFor="dribbling_time" className="text-purple-700 font-semibold">{t('assessment.fields.dribbling')}</Label>
                <Input
                  id="dribbling_time"
                  name="dribbling_time"
                  type="number"
                  step="0.01"
                  min="6"
                  max="25"
                  value={formData.dribbling_time}
                  onChange={handleChange}
                  required
                  className={`border-purple-400 focus:border-pink-500 bg-gradient-to-r from-purple-50 to-pink-50 ${getFieldValidation('dribbling_time', formData.dribbling_time, formData.age) || ''}`}
                  placeholder="e.g., 12.3"
                />
                <FieldExplanation 
                  fieldName="dribbling_time" 
                  isVisible={explanationVisibility.dribbling_time}
                  onToggle={() => toggleExplanation('dribbling_time')}
                />
              </div>
              <div>
                <Label htmlFor="passing_accuracy" className="text-purple-700 font-semibold">{t('assessment.fields.passing')}</Label>
                <Input
                  id="passing_accuracy"
                  name="passing_accuracy"
                  type="number"
                  step="0.1"
                  min="40"
                  max="100"
                  value={formData.passing_accuracy}
                  onChange={handleChange}
                  required
                  className={`border-purple-400 focus:border-pink-500 bg-gradient-to-r from-purple-50 to-pink-50 ${getFieldValidation('passing_accuracy', formData.passing_accuracy, formData.age) || ''}`}
                  placeholder="e.g., 78.5"
                />
                <FieldExplanation 
                  fieldName="passing_accuracy" 
                  isVisible={explanationVisibility.passing_accuracy}
                  onToggle={() => toggleExplanation('passing_accuracy')}
                />
              </div>
              <div>
                <Label htmlFor="shooting_accuracy" className="text-purple-700 font-semibold">{t('assessment.fields.shooting')}</Label>
                <Input
                  id="shooting_accuracy"
                  name="shooting_accuracy"
                  type="number"
                  step="0.1"
                  min="30"
                  max="100"
                  value={formData.shooting_accuracy}
                  onChange={handleChange}
                  required
                  className={`border-purple-400 focus:border-pink-500 bg-gradient-to-r from-purple-50 to-pink-50 ${getFieldValidation('shooting_accuracy', formData.shooting_accuracy, formData.age) || ''}`}
                  placeholder="e.g., 65.2"
                />
                <FieldExplanation 
                  fieldName="shooting_accuracy" 
                  isVisible={explanationVisibility.shooting_accuracy}
                  onToggle={() => toggleExplanation('shooting_accuracy')}
                />
              </div>
            </div>
          </div>

          {/* Body Composition & Fitness */}
          <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg p-6 border-2 border-cyan-400 fire-glow">
            <h3 className="text-xl font-bold text-cyan-800 mb-4 flex items-center">
              <Scale className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} text-blue-500`} />
              {t('assessment.bodyComposition')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bmi" className="text-cyan-700 font-semibold">{t('assessment.fields.bmi')}</Label>
                <Input
                  id="bmi"
                  name="bmi"
                  type="number"
                  step="0.1"
                  min="18"
                  max="35"
                  value={formData.bmi}
                  onChange={handleChange}
                  className={`border-cyan-400 focus:border-blue-500 bg-gradient-to-r from-cyan-50 to-blue-50 ${getFieldValidation('bmi', formData.bmi, formData.age) || ''}`}
                  placeholder="e.g., 23.2"
                />
                <FieldExplanation 
                  fieldName="bmi" 
                  isVisible={explanationVisibility.bmi}
                  onToggle={() => toggleExplanation('bmi')}
                />
              </div>
              <div>
                <Label htmlFor="body_fat" className="text-cyan-700 font-semibold">{t('assessment.fields.bodyFat')}</Label>
                <Input
                  id="body_fat"
                  name="body_fat"
                  type="number"
                  step="0.1"
                  min="5"
                  max="35"
                  value={formData.body_fat}
                  onChange={handleChange}
                  className={`border-cyan-400 focus:border-blue-500 bg-gradient-to-r from-cyan-50 to-blue-50 ${getFieldValidation('body_fat', formData.body_fat, formData.age) || ''}`}
                  placeholder="e.g., 12.5"
                />
                <FieldExplanation 
                  fieldName="body_fat" 
                  isVisible={explanationVisibility.body_fat}
                  onToggle={() => toggleExplanation('body_fat')}
                />
              </div>
              <div>
                <Label htmlFor="muscle_mass" className="text-cyan-700 font-semibold">{t('assessment.fields.muscleMass')}</Label>
                <Input
                  id="muscle_mass"
                  name="muscle_mass"
                  type="number"
                  step="0.1"
                  min="25"
                  max="60"
                  value={formData.muscle_mass}
                  onChange={handleChange}
                  className={`border-cyan-400 focus:border-blue-500 bg-gradient-to-r from-cyan-50 to-blue-50 ${getFieldValidation('muscle_mass', formData.muscle_mass, formData.age) || ''}`}
                  placeholder="e.g., 42.8"
                />
                <FieldExplanation 
                  fieldName="muscle_mass" 
                  isVisible={explanationVisibility.muscle_mass}
                  onToggle={() => toggleExplanation('muscle_mass')}
                />
              </div>
              <div>
                <Label htmlFor="resting_heart_rate" className="text-cyan-700 font-semibold">{t('assessment.fields.restingHeartRate')}</Label>
                <Input
                  id="resting_heart_rate"
                  name="resting_heart_rate"
                  type="number"
                  min="35"
                  max="90"
                  value={formData.resting_heart_rate}
                  onChange={handleChange}
                  className={`border-cyan-400 focus:border-blue-500 bg-gradient-to-r from-cyan-50 to-blue-50 ${getFieldValidation('resting_heart_rate', formData.resting_heart_rate, formData.age) || ''}`}
                  placeholder="e.g., 55"
                />
                <FieldExplanation 
                  fieldName="resting_heart_rate" 
                  isVisible={explanationVisibility.resting_heart_rate}
                  onToggle={() => toggleExplanation('resting_heart_rate')}
                />
              </div>
              <div>
                <Label htmlFor="vo2_max" className="text-cyan-700 font-semibold">{t('assessment.fields.vo2Max')}</Label>
                <Input
                  id="vo2_max"
                  name="vo2_max"
                  type="number"
                  step="0.1"
                  min="30"
                  max="80"
                  value={formData.vo2_max}
                  onChange={handleChange}
                  className={`border-cyan-400 focus:border-blue-500 bg-gradient-to-r from-cyan-50 to-blue-50 ${getFieldValidation('vo2_max', formData.vo2_max, formData.age) || ''}`}
                  placeholder="e.g., 58.3"
                />
                <FieldExplanation 
                  fieldName="vo2_max" 
                  isVisible={explanationVisibility.vo2_max}
                  onToggle={() => toggleExplanation('vo2_max')}
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 hover:from-orange-700 hover:via-red-700 hover:to-yellow-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 fire-glow text-xl"
          >
            {isLoading ? t('assessment.submitting') : t('assessment.submitButton')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// Enhanced Training Program Component with Benchmarking
const TrainingProgram = ({ playerId, playerName, playerData }) => {
  const { t, formatText, direction } = useLanguage();
  const [programs, setPrograms] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, [playerId]);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${API}/training-programs/${playerId}`);
      setPrograms(response.data);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const generateProgram = async (programType) => {
    setIsGenerating(true);
    try {
      const response = await axios.post(`${API}/training-programs`, {
        player_id: playerId,
        program_type: programType
      });
      setPrograms([response.data, ...programs]);
    } catch (error) {
      console.error("Error generating program:", error);
    }
    setIsGenerating(false);
  };

  // Performance Analysis
  const analyzePerformance = (playerData) => {
    if (!playerData || !playerData.age) return null;
    
    const age = parseInt(playerData.age);
    const ageCategory = getAgeCategory(age);
    const standards = AGE_BASED_STANDARDS[ageCategory];
    
    const metrics = [
      'sprint_40m', 'sprint_100m', 'cone_drill', 'ladder_drill', 'shuttle_run',
      'sit_reach', 'shoulder_flexibility', 'hip_flexibility', 'juggling_count',
      'dribbling_time', 'passing_accuracy', 'shooting_accuracy'
    ];
    
    const weaknesses = [];
    const strengths = [];
    
    metrics.forEach(metric => {
      const playerValue = parseFloat(playerData[metric]);
      if (!playerValue || !standards[metric]) return;
      
      const { elite, pro, semi, amateur } = standards[metric];
      const timeBasedMetrics = ['sprint_40m', 'sprint_100m', 'cone_drill', 'ladder_drill', 'shuttle_run', 'dribbling_time'];
      const isTimeBased = timeBasedMetrics.includes(metric);
      
      let level = 'amateur';
      if (isTimeBased) {
        if (playerValue <= elite) level = 'elite';
        else if (playerValue <= pro) level = 'professional';
        else if (playerValue <= semi) level = 'semiPro';
      } else {
        if (playerValue >= elite) level = 'elite';
        else if (playerValue >= pro) level = 'professional';
        else if (playerValue >= semi) level = 'semiPro';
      }
      
      if (level === 'amateur') {
        weaknesses.push({
          metric,
          current: playerValue,
          target: isTimeBased ? semi : semi,
          improvement: isTimeBased ? (playerValue - semi).toFixed(2) : (semi - playerValue).toFixed(2)
        });
      } else if (level === 'elite' || level === 'professional') {
        strengths.push({
          metric,
          current: playerValue,
          level
        });
      }
    });
    
    return { weaknesses, strengths, ageCategory, age };
  };

  const performanceAnalysis = analyzePerformance(playerData);

  return (
    <div className="space-y-6">
      {/* Performance Benchmark Analysis */}
      {performanceAnalysis && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center">
              <BarChart3 className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-5 h-5`} />
              {t('training.benchmarkTitle')}
            </CardTitle>
            <CardDescription>
              {formatText(t('training.ageGroup'), { 
                age: performanceAnalysis.age, 
                category: t(`common.${performanceAnalysis.ageCategory}`)
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weaknesses */}
              {performanceAnalysis.weaknesses.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-bold text-red-800 mb-3 flex items-center">
                    <ArrowUp className="w-4 h-4 mr-2" />
                    {t('training.mainWeaknesses')}
                  </h4>
                  <div className="space-y-2">
                    {performanceAnalysis.weaknesses.slice(0, 3).map((weakness) => (
                      <div key={weakness.metric} className="bg-white p-2 rounded border">
                        <div className="font-semibold text-red-700 capitalize">
                          {weakness.metric.replace(/_/g, ' ')}
                        </div>
                        <div className="text-sm text-red-600">
                          Current: {weakness.current} → Target: {weakness.target}
                          <Badge className="ml-2 bg-red-100 text-red-800">
                            Needs {weakness.improvement} improvement
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Strengths */}
              {performanceAnalysis.strengths.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-bold text-green-800 mb-3 flex items-center">
                    <Trophy className="w-4 h-4 mr-2" />
                    {t('training.mainStrengths')}
                  </h4>
                  <div className="space-y-2">
                    {performanceAnalysis.strengths.slice(0, 3).map((strength) => (
                      <div key={strength.metric} className="bg-white p-2 rounded border">
                        <div className="font-semibold text-green-700 capitalize">
                          {strength.metric.replace(/_/g, ' ')}
                        </div>
                        <div className="text-sm text-green-600">
                          Current: {strength.current}
                          <Badge className={`ml-2 ${strength.level === 'elite' ? 'bg-gold-100 text-gold-800' : 'bg-green-100 text-green-800'}`}>
                            {t(`common.${strength.level}`)} Level
                          </Badge>
                        </div>
                      </div>  
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Training Focus Recommendation */}
      {performanceAnalysis && (
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center">
              <Target className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-5 h-5`} />
              {t('training.trainingFocus')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Speed Focus */}
              {performanceAnalysis.weaknesses.some(w => ['sprint_40m', 'sprint_100m'].includes(w.metric)) && (
                <div className="bg-red-100 p-3 rounded-lg">
                  <h5 className="font-bold text-red-800 mb-2">⚡ Speed Development Priority</h5>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Sprint interval training 3x/week</li>
                    <li>• Acceleration drills from various starts</li>
                    <li>• Hill sprints for power development</li>
                  </ul>
                </div>
              )}
              
              {/* Agility Focus */}
              {performanceAnalysis.weaknesses.some(w => ['cone_drill', 'ladder_drill', 'shuttle_run'].includes(w.metric)) && (
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <h5 className="font-bold text-yellow-800 mb-2">🎯 Agility Enhancement Priority</h5>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Cone weaving patterns daily</li>
                    <li>• Ladder drill progressions</li>
                    <li>• Multi-directional plyometrics</li>
                  </ul>
                </div>
              )}
              
              {/* Ball Skills Focus */}
              {performanceAnalysis.weaknesses.some(w => ['juggling_count', 'dribbling_time', 'passing_accuracy', 'shooting_accuracy'].includes(w.metric)) && (
                <div className="bg-purple-100 p-3 rounded-lg">
                  <h5 className="font-bold text-purple-800 mb-2">⚽ Technical Skills Priority</h5>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Daily juggling progression (15+ min)</li>
                    <li>• Cone dribbling circuits</li>
                    <li>• Passing accuracy drills</li>
                    <li>• Target shooting practice</li>
                  </ul>
                </div>
              )}
              
              {/* Fitness Focus */}
              {performanceAnalysis.weaknesses.some(w => ['vo2_max', 'resting_heart_rate'].includes(w.metric)) && (
                <div className="bg-green-100 p-3 rounded-lg">
                  <h5 className="font-bold text-green-800 mb-2">💪 Fitness Development Priority</h5>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Interval running 3x/week</li>
                    <li>• Long endurance runs</li>
                    <li>• High-intensity circuit training</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exercise Explanations */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300">
        <CardHeader>
          <CardTitle className="text-indigo-800 flex items-center">
            <Lightbulb className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-5 h-5`} />
            {t('training.exerciseExplanations')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(EXERCISE_EXPLANATIONS).map(([category, categoryData]) => (
              <div key={category} className="bg-white p-4 rounded-lg border border-indigo-200">
                <h4 className="font-bold text-indigo-800 mb-3">{categoryData.title}</h4>
                <div className="space-y-2">
                  {Object.entries(categoryData.exercises).map(([exercise, explanation]) => (
                    <div key={exercise} className="border-l-2 border-indigo-200 pl-3">
                      <div className="font-semibold text-indigo-700">{exercise}</div>
                      <div className="text-sm text-indigo-600" dir={direction}>{explanation}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Program Generation */}
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent mb-6">
          {formatText(t('training.title'), { playerName })}
        </h2>
        
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => generateProgram("AI_Generated")}
            disabled={isGenerating}
            className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 fire-glow ${direction === 'rtl' ? 'ml-4' : 'mr-4'}`}
          >
            {isGenerating ? t('training.generating') : t('training.aiProgram')}
          </Button>
          <Button
            onClick={() => generateProgram("Ronaldo_Template")}
            disabled={isGenerating}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 fire-glow"
          >
            {isGenerating ? t('training.generating') : t('training.ronaldoTemplate')}
          </Button>
        </div>
      </div>

      {/* Generated Programs */}
      <div className="grid gap-6">
        {programs.map((program) => (
          <Card key={program.id} className="bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200 fire-glow">
            <CardHeader>
              <CardTitle className="text-xl text-orange-800 flex items-center">
                <Flame className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-5 h-5`} />
                {program.program_type === "AI_Generated" ? "🤖 AI Smart Program" : "👑 Ronaldo Template"}
              </CardTitle>
              <CardDescription>
                Created: {new Date(program.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200 max-h-96 overflow-y-auto">
                <pre className={`whitespace-pre-wrap text-sm text-gray-700 ${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
                  {program.program_content}
                </pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Highlights Guide Component (simplified for space)
const HighlightsGuide = () => {
  const { t, direction } = useLanguage();

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-800 flex items-center justify-center">
            <BookOpen className={`${direction === 'rtl' ? 'ml-3' : 'mr-3'} w-8 h-8`} />
            {t('highlights.title')}
          </CardTitle>
          <CardDescription className="text-blue-600 text-lg">
            {t('highlights.subtitle')}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Elite Performance Standards */}
      <Card className="bg-gradient-to-r from-gold-50 to-yellow-50 border-2 border-gold-300">
        <CardHeader>
          <CardTitle className="text-gold-800 flex items-center">
            <Trophy className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-5 h-5`} />
            Elite Performance Benchmarks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-gold-200">
              <div className="text-2xl font-bold text-gold-600">4.2s</div>
              <div className="text-sm text-gold-800">40m Sprint (Elite)</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gold-200">
              <div className="text-2xl font-bold text-gold-600">95%</div>
              <div className="text-sm text-gold-800">Pass Accuracy (Elite)</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gold-200">
              <div className="text-2xl font-bold text-gold-600">500+</div>
              <div className="text-sm text-gold-800">Ball Juggling (Elite)</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gold-200">
              <div className="text-2xl font-bold text-gold-600">65</div>
              <div className="text-sm text-gold-800">VO2 Max (Elite)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { t, formatText, direction } = useLanguage();
  const [assessments, setAssessments] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [activeTab, setActiveTab] = useState("highlights");

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await axios.get(`${API}/assessments`);
      setAssessments(response.data);
    } catch (error) {
      console.error("Error fetching assessments:", error);
    }
  };

  const handleAssessmentCreated = (assessment) => {
    setAssessments([assessment, ...assessments]);
    setSelectedPlayer(assessment);
    setActiveTab("training");
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-orange-100 via-red-50 via-yellow-50 to-white fire-background`} dir={direction}>
      <LanguageToggle />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent mb-4 fire-glow">
            {t('appTitle')}
          </h1>
          <p className="text-orange-700 text-xl font-bold">
            {t('appSubtitle')}
          </p>
          <div className="flex justify-center items-center space-x-4 mt-4">
            <Badge className={`bg-yellow-100 text-yellow-800 text-lg p-2 ${direction === 'rtl' ? 'ml-4' : 'mr-4'}`}>
              <Flame className="w-4 h-4 ml-1" />
              {t('badges.igniteYourPower')}
            </Badge>
            <Badge className={`bg-blue-100 text-blue-800 text-lg p-2 ${direction === 'rtl' ? 'ml-4' : 'mr-4'}`}>
              <Users className="w-4 h-4 ml-1" />
              {t('badges.trainWithFriends')}
            </Badge>
            <Badge className="bg-green-100 text-green-800 text-lg p-2">
              <Trophy className="w-4 h-4 ml-1" />
              {t('badges.collectTrophies')}
            </Badge>
          </div>
        </div>

        {/* Player Selection */}
        {assessments.length > 0 && (
          <Card className="mb-8 bg-gradient-to-r from-white to-orange-50 border-2 border-orange-300 fire-glow">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center">
                <Crown className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-5 h-5`} />
                {t('common.selectPlayer')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {assessments.map((assessment) => (
                  <Button
                    key={assessment.id}
                    variant={selectedPlayer?.id === assessment.id ? "default" : "outline"}
                    onClick={() => setSelectedPlayer(assessment)}
                    className={`p-4 h-auto flex flex-col ${direction === 'rtl' ? 'items-end text-right' : 'items-start text-left'} fire-glow ${
                      selectedPlayer?.id === assessment.id 
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700' 
                        : 'border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    <span className="font-bold text-lg flex items-center">
                      <Flame className={`w-4 h-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                      {assessment.player_name}
                    </span>
                    <span className="text-sm opacity-75 flex items-center">
                      <span>{assessment.position} • Age {assessment.age}</span>
                      {assessment.age && (
                        <Badge className={`bg-blue-100 text-blue-800 ${direction === 'rtl' ? 'mr-2' : 'ml-2'}`}>
                          {t(`common.${getAgeCategory(assessment.age)}`)}
                        </Badge>
                      )}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-gradient-to-r from-orange-200 to-red-200">
            <TabsTrigger value="highlights" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white fire-glow">
              {t('common.tabs.highlights')}
            </TabsTrigger>
            <TabsTrigger value="standards" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white fire-glow">
              {t('common.tabs.standards')}
            </TabsTrigger>
            <TabsTrigger value="assessment" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white fire-glow">
              {t('common.tabs.assessment')}
            </TabsTrigger>
            <TabsTrigger value="training" disabled={!selectedPlayer} className="data-[state=active]:bg-orange-600 data-[state=active]:text-white fire-glow">
              {t('common.tabs.training')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="highlights">
            <HighlightsGuide />
          </TabsContent>

          <TabsContent value="standards">
            <AgeBasedStandards />
          </TabsContent>

          <TabsContent value="assessment">
            <AssessmentForm onAssessmentCreated={handleAssessmentCreated} />
          </TabsContent>

          <TabsContent value="training">
            {selectedPlayer && (
              <TrainingProgram 
                playerId={selectedPlayer.id} 
                playerName={selectedPlayer.player_name}
                playerData={selectedPlayer}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;