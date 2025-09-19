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
import { Activity, Target, TrendingUp, Mic, MicOff, Volume2, VolumeX, Square, Trophy, Users, Music, Bell, Coins, Gift, Zap, Crown, Star, Flame, Languages, Globe, BarChart3, Award, ArrowUp, ArrowDown, Equal, BookOpen, Lightbulb, Scale, Heart, Timer, Ruler } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Professional Soccer Player Standards with Coach Indicators
const PROFESSIONAL_STANDARDS = {
  // Elite Level (Messi, Ronaldo, Mbappe)
  elite: {
    sprint_40m: 4.2,
    sprint_100m: 10.5,
    cone_drill: 6.0,
    ladder_drill: 5.8,
    shuttle_run: 8.0,
    sit_reach: 45,
    shoulder_flexibility: 190,
    hip_flexibility: 140,
    juggling_count: 500,
    dribbling_time: 8.5,
    passing_accuracy: 95,
    shooting_accuracy: 85,
    // Body Mass & Physical Indicators
    bmi: 22.5,
    body_fat: 8,
    muscle_mass: 48,
    resting_heart_rate: 45,
    vo2_max: 65,
    playerName: "Elite (Messi/Ronaldo/Mbappe)"
  },
  // Professional Level
  professional: {
    sprint_40m: 4.8,
    sprint_100m: 11.2,
    cone_drill: 6.8,
    ladder_drill: 6.5,
    shuttle_run: 8.8,
    sit_reach: 38,
    shoulder_flexibility: 185,
    hip_flexibility: 130,
    juggling_count: 300,
    dribbling_time: 10.0,
    passing_accuracy: 88,
    shooting_accuracy: 78,
    // Body Mass & Physical Indicators
    bmi: 23.5,
    body_fat: 12,
    muscle_mass: 45,
    resting_heart_rate: 50,
    vo2_max: 58,
    playerName: "Professional Level"
  },
  // Semi-Professional Level
  semiPro: {
    sprint_40m: 5.2,
    sprint_100m: 12.0,
    cone_drill: 7.5,
    ladder_drill: 7.2,
    shuttle_run: 9.5,
    sit_reach: 32,
    shoulder_flexibility: 180,
    hip_flexibility: 120,
    juggling_count: 150,
    dribbling_time: 12.0,
    passing_accuracy: 80,
    shooting_accuracy: 70,
    // Body Mass & Physical Indicators
    bmi: 24.5,
    body_fat: 15,
    muscle_mass: 42,
    resting_heart_rate: 55,
    vo2_max: 52,
    playerName: "Semi-Professional"
  },
  // Amateur Level
  amateur: {
    sprint_40m: 6.0,
    sprint_100m: 13.5,
    cone_drill: 8.5,
    ladder_drill: 8.0,
    shuttle_run: 10.5,
    sit_reach: 25,
    shoulder_flexibility: 175,
    hip_flexibility: 110,
    juggling_count: 50,
    dribbling_time: 15.0,
    passing_accuracy: 70,
    shooting_accuracy: 60,
    // Body Mass & Physical Indicators
    bmi: 26.0,
    body_fat: 18,
    muscle_mass: 38,
    resting_heart_rate: 65,
    vo2_max: 45,
    playerName: "Amateur Level"
  }
};

// Coach Indicators & Benchmarks
const COACH_INDICATORS = {
  speed: {
    excellent: "⚡ Elite Speed (40m < 4.5s)",
    good: "🏃 Good Speed (40m 4.5-5.5s)", 
    average: "🚶 Average Speed (40m 5.5-6.5s)",
    needsWork: "⏰ Needs Work (40m > 6.5s)"
  },
  agility: {
    excellent: "🎯 Elite Agility (Cone < 6.5s)",
    good: "⚡ Good Agility (Cone 6.5-7.5s)",
    average: "🔄 Average Agility (Cone 7.5-8.5s)", 
    needsWork: "🏃 Needs Work (Cone > 8.5s)"
  },
  ballControl: {
    excellent: "⚽ Master Ball Control (95%+ accuracy)",
    good: "✨ Good Ball Control (85-94% accuracy)",
    average: "🎯 Average Ball Control (70-84% accuracy)",
    needsWork: "🏋️ Needs Work (<70% accuracy)"
  },
  fitness: {
    excellent: "💪 Elite Fitness (VO2 Max > 60)",
    good: "🔥 Good Fitness (VO2 Max 50-60)",
    average: "⚡ Average Fitness (VO2 Max 40-49)",
    needsWork: "🏃 Needs Work (VO2 Max < 40)"
  }
};

// Soccer Development References
const SOCCER_REFERENCES = {
  technicalSkills: [
    "🎯 First Touch: Control ball within 1 meter on first contact",
    "⚽ Passing: 90%+ accuracy within 20 meters",
    "🏃 Dribbling: Beat 3+ defenders in confined space",
    "🥅 Shooting: 80%+ accuracy from penalty area",
    "🤹 Ball Juggling: 100+ touches without dropping"
  ],
  physicalAttributes: [
    "⚡ Speed: 40m sprint under 5.0 seconds",
    "🏃 Endurance: Run 12km+ during 90-minute match",
    "💪 Strength: Body weight in leg press minimum",
    "🤸 Agility: Change direction in under 2.5 seconds",
    "🧘 Flexibility: Touch toes comfortably"
  ],
  tacticalAwareness: [
    "👁️ Vision: Scan field every 2-3 seconds",
    "🧠 Decision Making: Choose best option within 1.5 seconds",
    "📍 Positioning: Maintain formation shape",
    "🔄 Transitions: Switch play style in 5 seconds",
    "⚽ Game Reading: Anticipate opponent moves"
  ],
  mentalStrength: [
    "🎯 Focus: Maintain concentration for 90 minutes",
    "💪 Resilience: Bounce back from mistakes quickly",
    "👑 Leadership: Communicate effectively with teammates",
    "🔥 Motivation: Self-driven improvement mindset",
    "😌 Pressure Handling: Perform under crowd pressure"
  ]
};

// Language Context
const LanguageContext = createContext();

// Translations
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
      subtitle: "Essential references and benchmarks for building elite soccer players",
      technicalSkills: "⚽ Technical Skills Mastery",
      physicalAttributes: "💪 Physical Development Standards", 
      tacticalAwareness: "🧠 Tactical Intelligence",
      mentalStrength: "👑 Mental Fortitude",
      coachTips: "👨‍🏫 Coach's Professional Tips",
      eliteStandards: "🏆 Elite Performance Standards"
    },
    standards: {
      title: "📊 Professional Standards & Body Composition",
      subtitle: "Complete physical and performance benchmarks for soccer excellence",
      bodyMass: "⚖️ Body Mass Index (BMI)",
      bodyFat: "📉 Body Fat Percentage",
      muscleMass: "💪 Muscle Mass Percentage", 
      heartRate: "❤️ Resting Heart Rate (BPM)",
      vo2Max: "🫁 VO2 Max (ml/kg/min)",
      physicalIndicators: "🏃‍♂️ Physical Performance Indicators",
      performanceMetrics: "⚡ Performance Metrics",
      coachAssessment: "👨‍🏫 Coach Assessment Numbers"
    },
    coachIndicators: {
      title: "👨‍🏫 Coach Performance Indicators",
      speedCategory: "Speed Category",
      agilityCategory: "Agility Rating",
      ballControlCategory: "Ball Control Level",
      fitnessCategory: "Fitness Status",
      overallRating: "Overall Player Rating",
      recommendedFocus: "Recommended Training Focus",
      nextLevelTarget: "Next Level Target",
      trainingPriority: "Training Priority Areas"
    },
    assessment: {
      title: "🔥 Yoyo the Fire Boy Assessment 🔥",
      subtitle: "✨ Discover your true power and ignite the fire on the field! ✨",
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
      placeholders: {
        lightningSpeed: "Lightning speed!",
        fasterThanWind: "Faster than wind!"
      },
      submitButton: "🚀 Ignite the Fire and Start the Glory Journey! 🚀",
      submitting: "🔥 Creating Yoyo's Fire Profile..."
    },
    benchmarking: {
      title: "🏆 Professional Standards Comparison",
      yourLevel: "Your Current Level",
      targetLevel: "Target Level",
      elite: "Elite (Messi/Ronaldo)",
      professional: "Professional",
      semiPro: "Semi-Professional", 
      amateur: "Amateur",
      above: "Above Standard",
      below: "Below Standard",
      meets: "Meets Standard",
      trainingGoals: "🎯 Training Goals",
      currentVsTarget: "Current vs Target Performance",
      improvementNeeded: "Improvement Needed",
      excellentPerformance: "Excellent Performance",
      goodPerformance: "Good Performance"
    },
    training: {
      title: "🔥 Fire Training Programs for Yoyo {playerName} 🔥",
      groupTraining: "Group training with friends",
      spotifyPlaceholder: "Spotify link for motivation (optional)",
      aiProgram: "🤖 Yoyo's Smart Fire Program",
      ronaldoTemplate: "👑 Legendary Ronaldo Template",
      generating: "🔥 Generating...",
      tabs: {
        content: "🔥 Fire Program Content",
        schedule: "⚡ Motivational Weekly Schedule", 
        milestones: "🏆 Glory Milestones"
      },
      days: {
        Monday: "Monday",
        Tuesday: "Tuesday",
        Wednesday: "Wednesday", 
        Thursday: "Thursday",
        Friday: "Friday",
        Saturday: "Saturday",
        Sunday: "Sunday"
      },
      weeklySchedule: {
        Monday: "🔥 Fire Speed Training",
        Tuesday: "⚽ Ball Control Challenge",
        Wednesday: "🧘‍♂️ Flexibility & Recovery Day",
        Thursday: "✨ Yoyo's Technical Skills",
        Friday: "⚔️ Match Simulation Battle",
        Saturday: "💪 Weakness Challenge",
        Sunday: "😴 Warrior's Rest Day"
      },
      target: "🔥 Fire Target"
    },
    common: {
      selectPlayer: "Select Fire Warrior",
      tabs: {
        highlights: "🌟 Development Guide",
        standards: "📊 Standards & Body Mass",
        assessment: "🔥 Assessment",
        training: "🚀 Training Programs", 
        progress: "🏆 Progress Tracking"
      },
      loading: "Loading...",
      error: "Error occurred",
      success: "Success!",
      coins: "coins",
      level: "Level",
      age: "Age"
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
      subtitle: "المراجع الأساسية والمعايير لبناء لاعبي كرة قدم نخبة",
      technicalSkills: "⚽ إتقان المهارات الفنية",
      physicalAttributes: "💪 معايير التطوير البدني",
      tacticalAwareness: "🧠 الذكاء التكتيكي",
      mentalStrength: "👑 القوة العقلية",
      coachTips: "👨‍🏫 نصائح المدرب المحترف",
      eliteStandards: "🏆 معايير الأداء النخبوي"
    },
    standards: {
      title: "📊 المعايير الاحترافية وتركيب الجسم",
      subtitle: "المعايير البدنية والأداء الكاملة للتميز في كرة القدم",
      bodyMass: "⚖️ مؤشر كتلة الجسم (BMI)",
      bodyFat: "📉 نسبة الدهون في الجسم",
      muscleMass: "💪 نسبة الكتلة العضلية",
      heartRate: "❤️ معدل ضربات القلب أثناء الراحة",
      vo2Max: "🫁 VO2 الأقصى (مل/كغ/دقيقة)",
      physicalIndicators: "🏃‍♂️ مؤشرات الأداء البدني",
      performanceMetrics: "⚡ مقاييس الأداء",
      coachAssessment: "👨‍🏫 أرقام تقييم المدرب"
    },
    coachIndicators: {
      title: "👨‍🏫 مؤشرات أداء المدرب",
      speedCategory: "فئة السرعة",
      agilityCategory: "تصنيف الرشاقة",
      ballControlCategory: "مستوى التحكم بالكرة",
      fitnessCategory: "حالة اللياقة",
      overallRating: "التقييم العام للاعب",
      recommendedFocus: "التركيز التدريبي الموصى به",
      nextLevelTarget: "هدف المستوى التالي",
      trainingPriority: "مجالات أولوية التدريب"
    },
    assessment: {
      title: "🔥 تقييم يويو الفتى الناري 🔥",
      subtitle: "✨ اكتشف قوتك الحقيقية وأشعل النار في الملعب! ✨",
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
      placeholders: {
        lightningSpeed: "سرعة البرق!",
        fasterThanWind: "أسرع من الريح!"
      },
      submitButton: "🚀 أشعل النار وابدأ رحلة المجد! 🚀",
      submitting: "🔥 جاري إنشاء ملف يويو الناري..."
    },
    benchmarking: {
      title: "🏆 مقارنة المعايير الاحترافية",
      yourLevel: "مستواك الحالي",
      targetLevel: "المستوى المستهدف",
      elite: "النخبة (ميسي/رونالدو)",
      professional: "احترافي",
      semiPro: "شبه احترافي",
      amateur: "هاوي",
      above: "فوق المعيار",
      below: "تحت المعيار",
      meets: "يحقق المعيار",
      trainingGoals: "🎯 أهداف التدريب",
      currentVsTarget: "الأداء الحالي مقابل المستهدف",
      improvementNeeded: "يحتاج تحسين",
      excellentPerformance: "أداء ممتاز",
      goodPerformance: "أداء جيد"
    },
    training: {
      title: "🔥 برامج التدريب الناري ليويو {playerName} 🔥",
      groupTraining: "تدريب جماعي مع الأصدقاء",
      spotifyPlaceholder: "رابط Spotify للتحفيز (اختياري)",
      aiProgram: "🤖 برنامج يويو الذكي الناري",
      ronaldoTemplate: "👑 قالب رونالدو الأسطوري",
      generating: "🔥 جاري الإنشاء...",
      tabs: {
        content: "🔥 محتوى البرنامج الناري",
        schedule: "⚡ الجدول الأسبوعي المحفز",
        milestones: "🏆 معالم المجد"
      },
      days: {
        Monday: "الإثنين",
        Tuesday: "الثلاثاء",
        Wednesday: "الأربعاء",
        Thursday: "الخميس", 
        Friday: "الجمعة",
        Saturday: "السبت",
        Sunday: "الأحد"
      },
      weeklySchedule: {
        Monday: "🔥 تدريب السرعة الناري",
        Tuesday: "⚽ تحدي التحكم بالكرة",
        Wednesday: "🧘‍♂️ يوم المرونة والتعافي",
        Thursday: "✨ مهارات يويو الفنية",
        Friday: "⚔️ معركة محاكاة المباراة",
        Saturday: "💪 تحدي نقاط الضعف",
        Sunday: "😴 يوم راحة المحارب"
      },
      target: "🔥 هدف ناري"
    },
    common: {
      selectPlayer: "اختيار المحارب الناري",
      tabs: {
        highlights: "🌟 دليل التطوير",
        standards: "📊 المعايير وكتلة الجسم",
        assessment: "🔥 التقييم",
        training: "🚀 برامج التدريب",
        progress: "🏆 تتبع التقدم"
      },
      loading: "جاري التحميل...",
      error: "حدث خطأ",
      success: "نجح!",
      coins: "عملة",
      level: "المستوى",
      age: "العمر"
    }
  }
};

// Language Provider Component
const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [direction, setDirection] = useState('ltr');

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    const newDir = newLang === 'ar' ? 'rtl' : 'ltr';
    setLanguage(newLang);
    setDirection(newDir);
    
    // Apply changes to document
    document.documentElement.setAttribute('dir', newDir);
    document.documentElement.setAttribute('lang', newLang);
    document.body.setAttribute('dir', newDir);
    
    // Force re-render by updating body class
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

// Custom hook to use language context
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

// Highlights/References Component
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technical Skills */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center">
              <Target className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-5 h-5`} />
              {t('highlights.technicalSkills')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {SOCCER_REFERENCES.technicalSkills.map((skill, index) => (
                <div key={index} className="flex items-start p-3 bg-white rounded-lg border border-green-200">
                  <div className={`text-sm ${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
                    {skill}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Physical Attributes */}
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center">
              <Zap className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-5 h-5`} />
              {t('highlights.physicalAttributes')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {SOCCER_REFERENCES.physicalAttributes.map((attribute, index) => (
                <div key={index} className="flex items-start p-3 bg-white rounded-lg border border-orange-200">
                  <div className={`text-sm ${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
                    {attribute}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tactical Awareness */}
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300">
          <CardHeader>
            <CardTitle className="text-purple-800 flex items-center">
              <Lightbulb className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-5 h-5`} />
              {t('highlights.tacticalAwareness')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {SOCCER_REFERENCES.tacticalAwareness.map((tactic, index) => (
                <div key={index} className="flex items-start p-3 bg-white rounded-lg border border-purple-200">
                  <div className={`text-sm ${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
                    {tactic}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mental Strength */}
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center">
              <Crown className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-5 h-5`} />
              {t('highlights.mentalStrength')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {SOCCER_REFERENCES.mentalStrength.map((mental, index) => (
                <div key={index} className="flex items-start p-3 bg-white rounded-lg border border-yellow-200">
                  <div className={`text-sm ${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
                    {mental}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Elite Standards Summary */}
      <Card className="bg-gradient-to-r from-gold-50 to-yellow-50 border-2 border-gold-300">
        <CardHeader>
          <CardTitle className="text-gold-800 flex items-center">
            <Trophy className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-5 h-5`} />
            {t('highlights.eliteStandards')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-gold-200">
              <div className="text-2xl font-bold text-gold-600">4.2s</div>
              <div className="text-sm text-gold-800">40m Sprint</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gold-200">
              <div className="text-2xl font-bold text-gold-600">95%</div>
              <div className="text-sm text-gold-800">Pass Accuracy</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gold-200">
              <div className="text-2xl font-bold text-gold-600">500+</div>
              <div className="text-sm text-gold-800">Ball Juggling</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gold-200">
              <div className="text-2xl font-bold text-gold-600">65</div>
              <div className="text-sm text-gold-800">VO2 Max</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Standards & Body Mass Component
const StandardsBodyMass = () => {
  const { t, direction } = useLanguage();

  const standardsData = Object.entries(PROFESSIONAL_STANDARDS).map(([level, data]) => ({
    level: data.playerName,
    bmi: data.bmi,
    bodyFat: data.body_fat,
    muscleMass: data.muscle_mass,
    heartRate: data.resting_heart_rate,
    vo2Max: data.vo2_max,
    sprint40: data.sprint_40m,
    passing: data.passing_accuracy
  }));

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-300">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-cyan-800 flex items-center justify-center">
            <Scale className={`${direction === 'rtl' ? 'ml-3' : 'mr-3'} w-8 h-8`} />
            {t('standards.title')}
          </CardTitle>
          <CardDescription className="text-cyan-600 text-lg">
            {t('standards.subtitle')}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Body Composition Standards Chart */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center">
            <BarChart3 className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-5 h-5`} />
            {t('standards.physicalIndicators')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={standardsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bmi" fill="#10b981" name="BMI" />
              <Bar dataKey="bodyFat" fill="#f59e0b" name="Body Fat %" />
              <Bar dataKey="muscleMass" fill="#dc2626" name="Muscle Mass %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Standards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(PROFESSIONAL_STANDARDS).map(([level, data]) => (
          <Card key={level} className={`border-2 ${
            level === 'elite' ? 'bg-gradient-to-br from-gold-50 to-yellow-50 border-gold-300' :
            level === 'professional' ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' :
            level === 'semiPro' ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300' :
            'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300'
          }`}>
            <CardHeader>
              <CardTitle className={`text-center text-lg ${
                level === 'elite' ? 'text-gold-800' :
                level === 'professional' ? 'text-green-800' :
                level === 'semiPro' ? 'text-blue-800' :
                'text-gray-800'
              }`}>
                <Crown className="w-5 h-5 mx-auto mb-2" />
                {data.playerName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <Scale className="w-4 h-4 mr-1" />
                    BMI:
                  </span>
                  <Badge variant="outline">{data.bmi}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <Activity className="w-4 h-4 mr-1" />
                    Body Fat:
                  </span>
                  <Badge variant="outline">{data.body_fat}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <Zap className="w-4 h-4 mr-1" />
                    Muscle:
                  </span>
                  <Badge variant="outline">{data.muscle_mass}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    HR:
                  </span>
                  <Badge variant="outline">{data.resting_heart_rate} BPM</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <Timer className="w-4 h-4 mr-1" />
                    VO2:
                  </span>
                  <Badge variant="outline">{data.vo2_max}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <Ruler className="w-4 h-4 mr-1" />
                    40m:
                  </span>
                  <Badge variant="outline">{data.sprint_40m}s</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coach Assessment Numbers */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300">
        <CardHeader>
          <CardTitle className="text-purple-800 flex items-center">
            <Award className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-5 h-5`} />
            {t('standards.coachAssessment')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-bold text-purple-800">{t('coachIndicators.speedCategory')}</h4>
              {Object.entries(COACH_INDICATORS.speed).map(([level, description]) => (
                <div key={level} className="p-3 bg-white rounded-lg border border-purple-200">
                  <div className={`text-sm ${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
                    {description}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-purple-800">{t('coachIndicators.agilityCategory')}</h4>
              {Object.entries(COACH_INDICATORS.agility).map(([level, description]) => (
                <div key={level} className="p-3 bg-white rounded-lg border border-purple-200">
                  <div className={`text-sm ${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
                    {description}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-purple-800">{t('coachIndicators.ballControlCategory')}</h4>
              {Object.entries(COACH_INDICATORS.ballControl).map(([level, description]) => (
                <div key={level} className="p-3 bg-white rounded-lg border border-purple-200">
                  <div className={`text-sm ${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
                    {description}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-purple-800">{t('coachIndicators.fitnessCategory')}</h4>
              {Object.entries(COACH_INDICATORS.fitness).map(([level, description]) => (
                <div key={level} className="p-3 bg-white rounded-lg border border-purple-200">
                  <div className={`text-sm ${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
                    {description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Enhanced Assessment Component with Body Mass
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
    // Body composition fields
    bmi: "",
    body_fat: "",
    muscle_mass: "",
    resting_heart_rate: "",
    vo2_max: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [coachIndicators, setCoachIndicators] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/assessments`, formData);
      onAssessmentCreated(response.data);
      
      // Calculate coach indicators
      const indicators = calculateCoachIndicators(formData);
      setCoachIndicators(indicators);
      
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

  const calculateCoachIndicators = (data) => {
    const sprint40 = parseFloat(data.sprint_40m) || 0;
    const coneDrill = parseFloat(data.cone_drill) || 0;
    const passingAccuracy = parseFloat(data.passing_accuracy) || 0;
    const vo2 = parseFloat(data.vo2_max) || 0;

    // Speed Category
    let speedCategory = 'needsWork';
    if (sprint40 > 0 && sprint40 < 4.5) speedCategory = 'excellent';
    else if (sprint40 >= 4.5 && sprint40 < 5.5) speedCategory = 'good';
    else if (sprint40 >= 5.5 && sprint40 < 6.5) speedCategory = 'average';

    // Agility Category
    let agilityCategory = 'needsWork';
    if (coneDrill > 0 && coneDrill < 6.5) agilityCategory = 'excellent';
    else if (coneDrill >= 6.5 && coneDrill < 7.5) agilityCategory = 'good';
    else if (coneDrill >= 7.5 && coneDrill < 8.5) agilityCategory = 'average';

    // Ball Control Category
    let ballControlCategory = 'needsWork';
    if (passingAccuracy >= 95) ballControlCategory = 'excellent';
    else if (passingAccuracy >= 85) ballControlCategory = 'good';
    else if (passingAccuracy >= 70) ballControlCategory = 'average';

    // Fitness Category
    let fitnessCategory = 'needsWork';
    if (vo2 > 60) fitnessCategory = 'excellent';
    else if (vo2 >= 50) fitnessCategory = 'good';
    else if (vo2 >= 40) fitnessCategory = 'average';

    return {
      speed: COACH_INDICATORS.speed[speedCategory],
      agility: COACH_INDICATORS.agility[agilityCategory],
      ballControl: COACH_INDICATORS.ballControl[ballControlCategory],
      fitness: COACH_INDICATORS.fitness[fitnessCategory]
    };
  };

  const getFieldValidation = (fieldName, value) => {
    if (!value) return null;
    
    const numValue = parseFloat(value);
    const eliteStandard = PROFESSIONAL_STANDARDS.elite[fieldName];
    const professionalStandard = PROFESSIONAL_STANDARDS.professional[fieldName];
    
    if (!eliteStandard) return null;
    
    // For time-based metrics (lower is better)
    const timeBasedMetrics = ['sprint_40m', 'sprint_100m', 'cone_drill', 'ladder_drill', 'shuttle_run', 'dribbling_time'];
    const isTimeBased = timeBasedMetrics.includes(fieldName);
    
    let status = 'amateur';
    if (isTimeBased) {
      if (numValue <= eliteStandard) status = 'elite';
      else if (numValue <= professionalStandard) status = 'professional';
      else if (numValue <= PROFESSIONAL_STANDARDS.semiPro[fieldName]) status = 'semiPro';
    } else {
      if (numValue >= eliteStandard) status = 'elite';
      else if (numValue >= professionalStandard) status = 'professional';
      else if (numValue >= PROFESSIONAL_STANDARDS.semiPro[fieldName]) status = 'semiPro';
    }
    
    const colors = {
      elite: 'border-gold-400 bg-gold-50',
      professional: 'border-green-400 bg-green-50',
      semiPro: 'border-yellow-400 bg-yellow-50',
      amateur: 'border-orange-400 bg-orange-50'
    };
    
    return colors[status];
  };

  // Show coach indicators if available
  if (coachIndicators) {
    return (
      <Card className="max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-300">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-purple-800 flex items-center justify-center">
            <Award className={`${direction === 'rtl' ? 'ml-3' : 'mr-3'} w-8 h-8`} />
            {t('coachIndicators.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(coachIndicators).map(([category, indicator]) => (
              <div key={category} className="p-4 bg-white rounded-lg border border-purple-200">
                <h4 className="font-bold text-purple-800 mb-2 capitalize">{category} Assessment:</h4>
                <div className={`text-sm ${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
                  {indicator}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button 
              onClick={() => setCoachIndicators(null)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              🔥 Continue to Training Programs
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 border-orange-300 fire-glow">
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
                value={formData.age}
                onChange={handleChange}
                required
                className="border-orange-400 focus:border-red-500 bg-gradient-to-r from-orange-100 to-yellow-100"
                placeholder={t('assessment.agePlaceholder')}
              />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sprint_40m" className="text-red-700 font-semibold">{t('assessment.fields.sprint40')}</Label>
                <Input
                  id="sprint_40m"
                  name="sprint_40m"
                  type="number"
                  step="0.01"
                  value={formData.sprint_40m}
                  onChange={handleChange}
                  required
                  className={`border-red-400 focus:border-red-600 bg-gradient-to-r from-red-50 to-orange-50 ${getFieldValidation('sprint_40m', formData.sprint_40m) || ''}`}
                  placeholder={t('assessment.placeholders.lightningSpeed')}
                />
              </div>
              <div>
                <Label htmlFor="sprint_100m" className="text-red-700 font-semibold">{t('assessment.fields.sprint100')}</Label>
                <Input
                  id="sprint_100m"
                  name="sprint_100m"
                  type="number"
                  step="0.01"
                  value={formData.sprint_100m}
                  onChange={handleChange}
                  required
                  className={`border-red-400 focus:border-red-600 bg-gradient-to-r from-red-50 to-orange-50 ${getFieldValidation('sprint_100m', formData.sprint_100m) || ''}`}
                  placeholder={t('assessment.placeholders.fasterThanWind')}
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
                  value={formData.cone_drill}
                  onChange={handleChange}
                  required
                  className={`border-yellow-400 focus:border-orange-500 bg-gradient-to-r from-yellow-50 to-orange-50 ${getFieldValidation('cone_drill', formData.cone_drill) || ''}`}
                />
              </div>
              <div>
                <Label htmlFor="ladder_drill" className="text-yellow-700 font-semibold">{t('assessment.fields.ladderDrill')}</Label>
                <Input
                  id="ladder_drill"
                  name="ladder_drill"
                  type="number"
                  step="0.01"
                  value={formData.ladder_drill}
                  onChange={handleChange}
                  required
                  className={`border-yellow-400 focus:border-orange-500 bg-gradient-to-r from-yellow-50 to-orange-50 ${getFieldValidation('ladder_drill', formData.ladder_drill) || ''}`}
                />
              </div>
              <div>
                <Label htmlFor="shuttle_run" className="text-yellow-700 font-semibold">{t('assessment.fields.shuttleRun')}</Label>
                <Input
                  id="shuttle_run"
                  name="shuttle_run"
                  type="number"
                  step="0.01"
                  value={formData.shuttle_run}
                  onChange={handleChange}
                  required
                  className={`border-yellow-400 focus:border-orange-500 bg-gradient-to-r from-yellow-50 to-orange-50 ${getFieldValidation('shuttle_run', formData.shuttle_run) || ''}`}
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
                  value={formData.sit_reach}
                  onChange={handleChange}
                  required
                  className={`border-green-400 focus:border-blue-500 bg-gradient-to-r from-green-50 to-blue-50 ${getFieldValidation('sit_reach', formData.sit_reach) || ''}`}
                />
              </div>
              <div>
                <Label htmlFor="shoulder_flexibility" className="text-green-700 font-semibold">{t('assessment.fields.shoulderFlex')}</Label>
                <Input
                  id="shoulder_flexibility"
                  name="shoulder_flexibility"
                  type="number"
                  value={formData.shoulder_flexibility}
                  onChange={handleChange}
                  required
                  className={`border-green-400 focus:border-blue-500 bg-gradient-to-r from-green-50 to-blue-50 ${getFieldValidation('shoulder_flexibility', formData.shoulder_flexibility) || ''}`}
                />
              </div>
              <div>
                <Label htmlFor="hip_flexibility" className="text-green-700 font-semibold">{t('assessment.fields.hipFlex')}</Label>
                <Input
                  id="hip_flexibility"  
                  name="hip_flexibility"
                  type="number"
                  value={formData.hip_flexibility}
                  onChange={handleChange}
                  required
                  className={`border-green-400 focus:border-blue-500 bg-gradient-to-r from-green-50 to-blue-50 ${getFieldValidation('hip_flexibility', formData.hip_flexibility) || ''}`}
                />
              </div>
            </div>
          </div>

          {/* Ball Handling Metrics */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 border-2 border-purple-400 fire-glow">
            <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
              {t('assessment.ballHandling')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="juggling_count" className="text-purple-700 font-semibold">{t('assessment.fields.juggling')}</Label>
                <Input
                  id="juggling_count"
                  name="juggling_count"
                  type="number"
                  value={formData.juggling_count}
                  onChange={handleChange}
                  required
                  className={`border-purple-400 focus:border-pink-500 bg-gradient-to-r from-purple-50 to-pink-50 ${getFieldValidation('juggling_count', formData.juggling_count) || ''}`}
                />
              </div>
              <div>
                <Label htmlFor="dribbling_time" className="text-purple-700 font-semibold">{t('assessment.fields.dribbling')}</Label>
                <Input
                  id="dribbling_time"
                  name="dribbling_time"
                  type="number"
                  step="0.01"
                  value={formData.dribbling_time}
                  onChange={handleChange}
                  required
                  className={`border-purple-400 focus:border-pink-500 bg-gradient-to-r from-purple-50 to-pink-50 ${getFieldValidation('dribbling_time', formData.dribbling_time) || ''}`}
                />
              </div>
              <div>
                <Label htmlFor="passing_accuracy" className="text-purple-700 font-semibold">{t('assessment.fields.passing')}</Label>
                <Input
                  id="passing_accuracy"
                  name="passing_accuracy"
                  type="number"
                  step="0.1"
                  value={formData.passing_accuracy}
                  onChange={handleChange}
                  required
                  className={`border-purple-400 focus:border-pink-500 bg-gradient-to-r from-purple-50 to-pink-50 ${getFieldValidation('passing_accuracy', formData.passing_accuracy) || ''}`}
                />
              </div>
              <div>
                <Label htmlFor="shooting_accuracy" className="text-purple-700 font-semibold">{t('assessment.fields.shooting')}</Label>
                <Input
                  id="shooting_accuracy"
                  name="shooting_accuracy"
                  type="number"
                  step="0.1"
                  value={formData.shooting_accuracy}
                  onChange={handleChange}
                  required
                  className={`border-purple-400 focus:border-pink-500 bg-gradient-to-r from-purple-50 to-pink-50 ${getFieldValidation('shooting_accuracy', formData.shooting_accuracy) || ''}`}
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
                  value={formData.bmi}
                  onChange={handleChange}
                  className={`border-cyan-400 focus:border-blue-500 bg-gradient-to-r from-cyan-50 to-blue-50 ${getFieldValidation('bmi', formData.bmi) || ''}`}
                />
              </div>
              <div>
                <Label htmlFor="body_fat" className="text-cyan-700 font-semibold">{t('assessment.fields.bodyFat')}</Label>
                <Input
                  id="body_fat"
                  name="body_fat"
                  type="number"
                  step="0.1"
                  value={formData.body_fat}
                  onChange={handleChange}
                  className={`border-cyan-400 focus:border-blue-500 bg-gradient-to-r from-cyan-50 to-blue-50 ${getFieldValidation('body_fat', formData.body_fat) || ''}`}
                />
              </div>
              <div>
                <Label htmlFor="muscle_mass" className="text-cyan-700 font-semibold">{t('assessment.fields.muscleMass')}</Label>
                <Input
                  id="muscle_mass"
                  name="muscle_mass"
                  type="number"
                  step="0.1"
                  value={formData.muscle_mass}
                  onChange={handleChange}
                  className={`border-cyan-400 focus:border-blue-500 bg-gradient-to-r from-cyan-50 to-blue-50 ${getFieldValidation('muscle_mass', formData.muscle_mass) || ''}`}
                />
              </div>
              <div>
                <Label htmlFor="resting_heart_rate" className="text-cyan-700 font-semibold">{t('assessment.fields.restingHeartRate')}</Label>
                <Input
                  id="resting_heart_rate"
                  name="resting_heart_rate"
                  type="number"
                  value={formData.resting_heart_rate}
                  onChange={handleChange}
                  className={`border-cyan-400 focus:border-blue-500 bg-gradient-to-r from-cyan-50 to-blue-50 ${getFieldValidation('resting_heart_rate', formData.resting_heart_rate) || ''}`}
                />
              </div>
              <div>
                <Label htmlFor="vo2_max" className="text-cyan-700 font-semibold">{t('assessment.fields.vo2Max')}</Label>
                <Input
                  id="vo2_max"
                  name="vo2_max"
                  type="number"
                  step="0.1"
                  value={formData.vo2_max}
                  onChange={handleChange}
                  className={`border-cyan-400 focus:border-blue-500 bg-gradient-to-r from-cyan-50 to-blue-50 ${getFieldValidation('vo2_max', formData.vo2_max) || ''}`}
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

// Training Program Component (simplified for space)
const TrainingProgram = ({ playerId, playerName }) => {
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent mb-4">
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

      <div className="grid gap-6">
        {programs.map((program) => (
          <Card key={program.id} className="bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200 fire-glow">
            <CardHeader>
              <CardTitle className="text-xl text-orange-800 flex items-center">
                <Flame className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-5 h-5`} />
                {program.program_type === "AI_Generated" ? "🤖 AI Smart Program" : "👑 Ronaldo Template"}
              </CardTitle>
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
                      <span>{assessment.position} • {t('common.age')} {assessment.age}</span>
                      {assessment.total_coins > 0 && (
                        <Badge className={`bg-yellow-100 text-yellow-800 ${direction === 'rtl' ? 'mr-2' : 'ml-2'}`}>
                          <Coins className="w-3 h-3 ml-1" />
                          {assessment.total_coins}
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
            <StandardsBodyMass />
          </TabsContent>

          <TabsContent value="assessment">
            <AssessmentForm onAssessmentCreated={handleAssessmentCreated} />
          </TabsContent>

          <TabsContent value="training">
            {selectedPlayer && (
              <TrainingProgram 
                playerId={selectedPlayer.id} 
                playerName={selectedPlayer.player_name} 
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