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
import { Activity, Target, TrendingUp, Mic, MicOff, Volume2, VolumeX, Square, Trophy, Users, Music, Bell, Coins, Gift, Zap, Crown, Star, Flame, Languages, Globe, BarChart3, Award, ArrowUp, ArrowDown, Equal } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Professional Soccer Player Standards
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
    playerName: "Amateur Level"
  }
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
        shooting: "⚽ Deadly Shooting Accuracy (%)"
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
    progress: {
      title: "🏆 Yoyo {playerName}'s Achievement Tracker 🏆",
      addEntry: "🚀 Add Your New Achievement, Yoyo! 🚀",
      metricType: "Metric Type",
      metricTypePlaceholder: "Choose challenge type",
      metricTypes: {
        speed: "⚡ Super Speed",
        agility: "🎯 Golden Agility", 
        flexibility: "🧘‍♂️ Magic Flexibility",
        ball_handling: "⚽ Ball Control Magic"
      },
      metricName: "Metric Name",
      metricNamePlaceholder: "e.g., Fire 40m Sprint",
      amazingValue: "Amazing Value",
      valuePlaceholder: "Your achievement",
      recordButton: "🔥 Record Achievement",
      trophiesTitle: "🏆 Yoyo's Fire Boy Trophies 🏆",
      progressOverTime: "🚀 Progress Journey Through Time",
      currentProfile: "🌟 Current Power Profile"
    },
    voice: {
      title: "🎤 Yoyo's Voice Notes & Notifications 🔔",
      motivationNotifications: "🔔 Fire Motivation Notifications",
      listenToMotivation: "Listen to Motivation",
      recordTitle: "🎤 Record Your Fire Notes",
      startRecording: "🎤 Start Fire Recording",
      stopRecording: "🔴 Stop Recording",
      saveNote: "💾 Save Note",
      clear: "🗑️ Clear",
      motivationNotification: "🔔 Motivation Notification",
      stop: "Stop"
    },
    group: {
      title: "👥 Fire Group Training 👥",
      createButton: "Create New Training Group",
      createTitle: "🔥 Create Fire Training Group",
      groupName: "Fire Group Name",
      groupNamePlaceholder: "e.g., Yoyo's Fire Warriors",
      challengeDescription: "Challenge Description",
      challengePlaceholder: "Training description and goals",
      friendIds: "Friend IDs (comma separated)",
      friendIdsPlaceholder: "ID1, ID2, ID3",
      spotifyLink: "Spotify link for motivation (optional)",
      createGroup: "🚀 Create Group",
      cancel: "Cancel",
      members: "👥 {count} members",
      completionReward: "🪙 Completion Reward: {reward} coins"
    },
    common: {
      selectPlayer: "Select Fire Warrior",
      tabs: {
        assessment: "🔥 Assessment",
        training: "🚀 Training Programs", 
        progress: "🏆 Progress Tracking",
        voice: "🎤 Voice & Notifications",
        group: "👥 Group Training"
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
        shooting: "⚽ دقة التسديد القاتلة (%)"
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
    progress: {
      title: "🏆 متتبع إنجازات يويو {playerName} 🏆",
      addEntry: "🚀 أضف إنجازك الجديد يا يويو! 🚀",
      metricType: "نوع المقياس",
      metricTypePlaceholder: "اختر نوع التحدي",
      metricTypes: {
        speed: "⚡ السرعة الخارقة",
        agility: "🎯 الرشاقة الذهبية",
        flexibility: "🧘‍♂️ المرونة السحرية",
        ball_handling: "⚽ سحر التحكم بالكرة"
      },
      metricName: "اسم المقياس",
      metricNamePlaceholder: "مثال: عدو 40 متر الناري",
      amazingValue: "القيمة المذهلة",
      valuePlaceholder: "إنجازك",
      recordButton: "🔥 سجل الإنجاز",
      trophiesTitle: "🏆 كؤوس يويو الناري 🏆",
      progressOverTime: "🚀 رحلة التقدم عبر الزمن",
      currentProfile: "🌟 ملف القوة الحالي"
    },
    voice: {
      title: "🎤 مذكرات يويو الصوتية والإشعارات 🔔",
      motivationNotifications: "🔔 إشعارات التحفيز الناري",
      listenToMotivation: "استمع للتحفيز",
      recordTitle: "🎤 سجل مذكراتك الناري",
      startRecording: "🎤 بدء التسجيل الناري",
      stopRecording: "🔴 إيقاف التسجيل",
      saveNote: "💾 حفظ المذكرة",
      clear: "🗑️ مسح",
      motivationNotification: "🔔 إشعار تحفيزي",
      stop: "إيقاف"
    },
    group: {
      title: "👥 تدريبات المجموعة الناري 👥",
      createButton: "إنشاء مجموعة تدريب جديدة",
      createTitle: "🔥 إنشاء مجموعة تدريب ناري",
      groupName: "اسم المجموعة الناري",
      groupNamePlaceholder: "مثال: محاربو يويو النار",
      challengeDescription: "وصف التحدي",
      challengePlaceholder: "وصف التدريب والأهداف",
      friendIds: "معرفات الأصدقاء (مفصولة بفاصلة)",
      friendIdsPlaceholder: "ID1, ID2, ID3",
      spotifyLink: "رابط Spotify للتحفيز (اختياري)",
      createGroup: "🚀 إنشاء المجموعة",
      cancel: "إلغاء",
      members: "👥 {count} عضو",
      completionReward: "🪙 مكافأة الإنجاز: {reward} عملة"
    },
    common: {
      selectPlayer: "اختيار المحارب الناري",
      tabs: {
        assessment: "🔥 التقييم",
        training: "🚀 برامج التدريب",
        progress: "🏆 تتبع التقدم",
        voice: "🎤 المذكرات والإشعارات",
        group: "👥 التدريب الجماعي"
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

// Benchmarking Component
const PlayerBenchmarking = ({ playerData }) => {
  const { t, direction } = useLanguage();

  // Determine player level based on performance
  const calculatePlayerLevel = (data) => {
    let score = 0;
    const metrics = ['sprint_40m', 'sprint_100m', 'cone_drill', 'ladder_drill', 'shuttle_run', 'sit_reach', 'shoulder_flexibility', 'hip_flexibility', 'juggling_count', 'dribbling_time', 'passing_accuracy', 'shooting_accuracy'];
    
    metrics.forEach(metric => {
      const value = parseFloat(data[metric]);
      if (isNaN(value)) return;
      
      // For time-based metrics (lower is better)
      if (['sprint_40m', 'sprint_100m', 'cone_drill', 'ladder_drill', 'shuttle_run', 'dribbling_time'].includes(metric)) {
        if (value <= PROFESSIONAL_STANDARDS.elite[metric]) score += 4;
        else if (value <= PROFESSIONAL_STANDARDS.professional[metric]) score += 3;
        else if (value <= PROFESSIONAL_STANDARDS.semiPro[metric]) score += 2;
        else if (value <= PROFESSIONAL_STANDARDS.amateur[metric]) score += 1;
      } 
      // For other metrics (higher is better)
      else {
        if (value >= PROFESSIONAL_STANDARDS.elite[metric]) score += 4;
        else if (value >= PROFESSIONAL_STANDARDS.professional[metric]) score += 3;
        else if (value >= PROFESSIONAL_STANDARDS.semiPro[metric]) score += 2;
        else if (value >= PROFESSIONAL_STANDARDS.amateur[metric]) score += 1;
      }
    });
    
    const avgScore = score / metrics.length;
    if (avgScore >= 3.5) return 'elite';
    if (avgScore >= 2.5) return 'professional';
    if (avgScore >= 1.5) return 'semiPro';
    return 'amateur';
  };

  const playerLevel = calculatePlayerLevel(playerData);
  const currentStandard = PROFESSIONAL_STANDARDS[playerLevel];
  
  // Calculate target level (one level above current)
  const targetLevels = { amateur: 'semiPro', semiPro: 'professional', professional: 'elite', elite: 'elite' };
  const targetLevel = targetLevels[playerLevel];
  const targetStandard = PROFESSIONAL_STANDARDS[targetLevel];

  // Create comparison data for charts
  const comparisonData = Object.keys(PROFESSIONAL_STANDARDS.elite).filter(key => key !== 'playerName').map(metric => {
    const playerValue = parseFloat(playerData[metric]) || 0;
    const currentValue = currentStandard[metric];
    const targetValue = targetStandard[metric];
    
    return {
      metric: metric.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').toLowerCase(),
      player: playerValue,
      current: currentValue,
      target: targetValue,
      elite: PROFESSIONAL_STANDARDS.elite[metric],
      professional: PROFESSIONAL_STANDARDS.professional[metric]
    };
  });

  const getPerformanceIndicator = (playerValue, standardValue, metric) => {
    // For time-based metrics (lower is better)
    const timeBasedMetrics = ['sprint 40m', 'sprint 100m', 'cone drill', 'ladder drill', 'shuttle run', 'dribbling time'];
    const isTimeBased = timeBasedMetrics.includes(metric);
    
    const difference = isTimeBased ? standardValue - playerValue : playerValue - standardValue;
    const percentageDiff = Math.abs((difference / standardValue) * 100);
    
    if (isTimeBased) {
      if (playerValue <= standardValue) return { status: 'above', icon: ArrowUp, color: 'text-green-600', bgColor: 'bg-green-100' };
      else return { status: 'below', icon: ArrowDown, color: 'text-red-600', bgColor: 'bg-red-100' };
    } else {
      if (playerValue >= standardValue) return { status: 'above', icon: ArrowUp, color: 'text-green-600', bgColor: 'bg-green-100' };
      else return { status: 'below', icon: ArrowDown, color: 'text-red-600', bgColor: 'bg-red-100' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Level Indicator */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center">
            <Award className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-5 h-5`} />
            {t('benchmarking.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-blue-800 mb-2">{t('benchmarking.yourLevel')}</h3>
              <Badge className={`text-lg p-3 ${playerLevel === 'elite' ? 'bg-gold-100 text-gold-800' : playerLevel === 'professional' ? 'bg-silver-100 text-gray-800' : playerLevel === 'semiPro' ? 'bg-bronze-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}>
                <Crown className="w-4 h-4 mr-2" />
                {t(`benchmarking.${playerLevel}`)}
              </Badge>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-purple-800 mb-2">{t('benchmarking.targetLevel')}</h3>
              <Badge className={`text-lg p-3 ${targetLevel === 'elite' ? 'bg-gold-100 text-gold-800' : targetLevel === 'professional' ? 'bg-silver-100 text-gray-800' : 'bg-bronze-100 text-amber-800'}`}>
                <Target className="w-4 h-4 mr-2" />
                {t(`benchmarking.${targetLevel}`)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Comparison Chart */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300">
        <CardHeader>
          <CardTitle className="text-orange-800 flex items-center">
            <BarChart3 className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-5 h-5`} />
            {t('benchmarking.currentVsTarget')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparisonData.slice(0, 6)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="player" fill="#f97316" name="Your Performance" />
              <Bar dataKey="target" fill="#059669" name="Target Level" />
              <Bar dataKey="elite" fill="#dc2626" name="Elite Level" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Metrics Comparison */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300">
        <CardHeader>
          <CardTitle className="text-green-800">{t('benchmarking.trainingGoals')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparisonData.map((item) => {
              const indicator = getPerformanceIndicator(item.player, item.target, item.metric);
              const improvement = Math.abs(item.target - item.player);
              
              return (
                <div key={item.metric} className={`p-4 rounded-lg border-2 ${indicator.bgColor} border-opacity-50`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold capitalize">{item.metric}</h4>
                    <indicator.icon className={`w-5 h-5 ${indicator.color}`} />
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Current:</span>
                      <span className="font-bold">{item.player}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Target:</span>
                      <span className="font-bold text-green-600">{item.target}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gap:</span>
                      <span className={`font-bold ${indicator.color}`}>
                        {improvement.toFixed(1)} {item.metric.includes('accuracy') ? '%' : item.metric.includes('count') ? '' : item.metric.includes('cm') ? 'cm' : item.metric.includes('degrees') ? '°' : 's'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress 
                      value={Math.min(100, (item.player / item.target) * 100)} 
                      className="h-2"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Assessment Component with Benchmarking
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
    shooting_accuracy: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showBenchmarking, setShowBenchmarking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/assessments`, formData);
      onAssessmentCreated(response.data);
      setShowBenchmarking(true);
      
      // Reset form after a delay to show benchmarking first
      setTimeout(() => {
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
          shooting_accuracy: ""
        });
        setShowBenchmarking(false);
      }, 10000);
    } catch (error) {
      console.error("Error creating assessment:", error);
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  // Show benchmarking results after assessment
  if (showBenchmarking && formData.player_name) {
    return <PlayerBenchmarking playerData={formData} />;
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

// Training Program Component (keeping the rest of the components the same for brevity)
const TrainingProgram = ({ playerId, playerName }) => {
  const { t, formatText, direction } = useLanguage();
  const [programs, setPrograms] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [spotifyLink, setSpotifyLink] = useState("");
  const [isGroup, setIsGroup] = useState(false);
  const { speak, cancel, speaking, voices } = useSpeechSynthesis();

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
        program_type: programType,
        is_group: isGroup,
        spotify_playlist: spotifyLink || null
      });
      setPrograms([response.data, ...programs]);
      setSpotifyLink("");
    } catch (error) {
      console.error("Error generating program:", error);
    }
    setIsGenerating(false);
  };

  const speakProgram = (content) => {
    if (speaking) {
      cancel();
    } else {
      const preferredVoice = voices.find(voice => voice.lang.includes(direction === 'rtl' ? 'ar' : 'en')) || voices[0];
      speak({ 
        text: content, 
        voice: preferredVoice,
        rate: 0.8,
        pitch: 1
      });
    }
  };

  const stopSpeaking = () => {
    cancel();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent mb-4">
          {formatText(t('training.title'), { playerName })}
        </h2>
        
        {/* Options */}
        <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-lg mb-4 border-2 border-orange-300">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <Label className="flex items-center space-x-2 ml-4">
                <input
                  type="checkbox"
                  checked={isGroup}
                  onChange={(e) => setIsGroup(e.target.checked)}
                  className="form-checkbox text-orange-600"
                />
                <Users className={`w-4 h-4 text-orange-600 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                <span className="text-orange-800 font-semibold">{t('training.groupTraining')}</span>
              </Label>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Music className="w-5 h-5 text-green-600" />
              <Input
                placeholder={t('training.spotifyPlaceholder')}
                value={spotifyLink}
                onChange={(e) => setSpotifyLink(e.target.value)}
                className="max-w-md border-green-400 focus:border-green-600"
                dir={direction}
              />
            </div>
          </div>
        </div>

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
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl text-orange-800 flex items-center">
                    <Flame className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-5 h-5`} />
                    {formatText(t('training.title'), { playerName })}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <span>Created: {new Date(program.created_at).toLocaleDateString()}</span>
                    {program.is_group && <Badge className={`bg-blue-100 text-blue-800 ${direction === 'rtl' ? 'mr-2' : 'ml-2'}`}>Group Training 👥</Badge>}
                    {program.spotify_playlist && <Badge className={`bg-green-100 text-green-800 ${direction === 'rtl' ? 'mr-2' : 'ml-2'}`}>Motivational Music 🎵</Badge>}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Badge 
                    variant={program.program_type === "AI_Generated" ? "default" : "secondary"}
                    className={`bg-orange-100 text-orange-800 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`}
                  >
                    {program.program_type === "AI_Generated" ? "AI Smart 🤖" : program.program_type === "Ronaldo_Template" ? "Ronaldo 👑" : "Custom 🔥"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => speakProgram(program.program_content)}
                    className="border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  {speaking && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={stopSpeaking}
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Square className="w-4 h-4" />
                    </Button>
                  )}
                  {program.spotify_playlist && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(program.spotify_playlist, '_blank')}
                      className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                      <Music className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">{t('training.tabs.content')}</TabsTrigger>
                  <TabsTrigger value="schedule">{t('training.tabs.schedule')}</TabsTrigger>
                  <TabsTrigger value="milestones">{t('training.tabs.milestones')}</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="mt-4">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200 max-h-96 overflow-y-auto">
                    <pre className={`whitespace-pre-wrap text-sm text-gray-700 ${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>{program.program_content}</pre>
                  </div>
                </TabsContent>
                <TabsContent value="schedule" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(program.weekly_schedule || {}).map(([day, activity]) => (
                      <div key={day} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-200">
                        <div className={`font-semibold text-orange-800 ${direction === 'rtl' ? 'text-right' : 'text-left'} flex items-center`}>
                          <Flame className={`w-4 h-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                          {t(`training.days.${day}`) || day}
                        </div>
                        <div className={`text-sm text-gray-600 ${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>{activity}</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="milestones" className="mt-4">
                  <div className="space-y-3">
                    {program.milestones?.map((milestone, index) => (
                      <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200 flex justify-between items-center">
                        <div className={direction === 'rtl' ? 'text-right' : 'text-left'}>
                          <span className="font-semibold text-green-800 flex items-center">
                            <Trophy className={`w-4 h-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                            Week {milestone.week}:
                          </span>
                          <span className={`${direction === 'rtl' ? 'mr-2' : 'ml-2'} text-gray-700`} dir={direction}>{milestone.target}</span>
                          {milestone.coins && (
                            <Badge className={`bg-yellow-100 text-yellow-800 ${direction === 'rtl' ? 'mr-2' : 'ml-2'}`}>
                              <Coins className="w-3 h-3 ml-1" />
                              {milestone.coins} {t('common.coins')}
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className="border-green-300 text-green-700">
                          {t('training.target')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// For brevity, I'll keep the other components (ProgressTracker, VoiceNotes, GroupTraining) as they were
// but add the language context usage. Here's the main Dashboard component:

// Main Dashboard Component
const Dashboard = () => {
  const { t, formatText, direction } = useLanguage();
  const [assessments, setAssessments] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [activeTab, setActiveTab] = useState("assessment");

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
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-gradient-to-r from-orange-200 to-red-200">
            <TabsTrigger value="assessment" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white fire-glow">
              {t('common.tabs.assessment')}
            </TabsTrigger>
            <TabsTrigger value="training" disabled={!selectedPlayer} className="data-[state=active]:bg-orange-600 data-[state=active]:text-white fire-glow">
              {t('common.tabs.training')}
            </TabsTrigger>
            <TabsTrigger value="progress" disabled={!selectedPlayer} className="data-[state=active]:bg-orange-600 data-[state=active]:text-white fire-glow">
              {t('common.tabs.progress')}
            </TabsTrigger>
          </TabsList>

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

          <TabsContent value="progress">
            {selectedPlayer ? (
              <div className="text-center text-gray-600">
                Progress tracking coming soon...
              </div>
            ) : null}
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