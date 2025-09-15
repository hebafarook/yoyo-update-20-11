import React, { useState, useEffect } from "react";
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Activity, Target, TrendingUp, Mic, MicOff, Volume2, VolumeX, Square } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Assessment Component
const AssessmentForm = ({ onAssessmentCreated }) => {
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
        shooting_accuracy: ""
      });
    } catch (error) {
      console.error("خطأ في إنشاء التقييم:", error);
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-50 to-blue-50 border-emerald-200">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-emerald-800">تقييم اللاعب</CardTitle>
        <CardDescription className="text-emerald-600">إكمال تقييم الأداء التفصيلي</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="player_name" className="text-emerald-700 font-semibold">اسم اللاعب</Label>
              <Input
                id="player_name"
                name="player_name"
                value={formData.player_name}
                onChange={handleChange}
                required
                className="border-emerald-300 focus:border-emerald-500"
                dir="rtl"
              />
            </div>
            <div>
              <Label htmlFor="age" className="text-emerald-700 font-semibold">العمر</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                required
                className="border-emerald-300 focus:border-emerald-500"
              />
            </div>
            <div>
              <Label htmlFor="position" className="text-emerald-700 font-semibold">المركز</Label>
              <Select onValueChange={(value) => setFormData({...formData, position: value})}>
                <SelectTrigger className="border-emerald-300 focus:border-emerald-500">
                  <SelectValue placeholder="اختر المركز" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="goalkeeper">حارس مرمى</SelectItem>
                  <SelectItem value="defender">مدافع</SelectItem>
                  <SelectItem value="midfielder">لاعب وسط</SelectItem>
                  <SelectItem value="forward">مهاجم</SelectItem>
                  <SelectItem value="striker">مهاجم صريح</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Speed Metrics */}
          <div className="bg-white rounded-lg p-6 border border-emerald-200">
            <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center">
              <Activity className="ml-2" />
              مقاييس السرعة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sprint_40m" className="text-emerald-700">عدو 40 متر (ثانية)</Label>
                <Input
                  id="sprint_40m"
                  name="sprint_40m"
                  type="number"
                  step="0.01"
                  value={formData.sprint_40m}
                  onChange={handleChange}
                  required
                  className="border-emerald-300 focus:border-emerald-500"
                />
              </div>
              <div>
                <Label htmlFor="sprint_100m" className="text-emerald-700">عدو 100 متر (ثانية)</Label>
                <Input
                  id="sprint_100m"
                  name="sprint_100m"
                  type="number"
                  step="0.01"
                  value={formData.sprint_100m}
                  onChange={handleChange}
                  required
                  className="border-emerald-300 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Agility Metrics */}
          <div className="bg-white rounded-lg p-6 border border-emerald-200">
            <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center">
              <Target className="ml-2" />
              مقاييس الرشاقة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cone_drill" className="text-emerald-700">تدريب المخاريط (ثانية)</Label>
                <Input
                  id="cone_drill"
                  name="cone_drill"
                  type="number"
                  step="0.01"
                  value={formData.cone_drill}
                  onChange={handleChange}
                  required
                  className="border-emerald-300 focus:border-emerald-500"
                />
              </div>
              <div>
                <Label htmlFor="ladder_drill" className="text-emerald-700">تدريب السلم (ثانية)</Label>
                <Input
                  id="ladder_drill"
                  name="ladder_drill"
                  type="number"
                  step="0.01"
                  value={formData.ladder_drill}
                  onChange={handleChange}
                  required
                  className="border-emerald-300 focus:border-emerald-500"
                />
              </div>
              <div>
                <Label htmlFor="shuttle_run" className="text-emerald-700">الجري المكوكي (ثانية)</Label>
                <Input
                  id="shuttle_run"
                  name="shuttle_run"
                  type="number"
                  step="0.01"
                  value={formData.shuttle_run}
                  onChange={handleChange}
                  required
                  className="border-emerald-300 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Flexibility Metrics */}
          <div className="bg-white rounded-lg p-6 border border-emerald-200">
            <h3 className="text-xl font-bold text-emerald-800 mb-4">مقاييس المرونة</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="sit_reach" className="text-emerald-700">الجلوس والوصول (سم)</Label>
                <Input
                  id="sit_reach"
                  name="sit_reach"
                  type="number"
                  step="0.1"
                  value={formData.sit_reach}
                  onChange={handleChange}
                  required
                  className="border-emerald-300 focus:border-emerald-500"
                />
              </div>
              <div>
                <Label htmlFor="shoulder_flexibility" className="text-emerald-700">مرونة الكتف (درجة)</Label>
                <Input
                  id="shoulder_flexibility"
                  name="shoulder_flexibility"
                  type="number"
                  value={formData.shoulder_flexibility}
                  onChange={handleChange}
                  required
                  className="border-emerald-300 focus:border-emerald-500"
                />
              </div>
              <div>
                <Label htmlFor="hip_flexibility" className="text-emerald-700">مرونة الورك (درجة)</Label>
                <Input
                  id="hip_flexibility"  
                  name="hip_flexibility"
                  type="number"
                  value={formData.hip_flexibility}
                  onChange={handleChange}
                  required
                  className="border-emerald-300 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Ball Handling Metrics */}
          <div className="bg-white rounded-lg p-6 border border-emerald-200">
            <h3 className="text-xl font-bold text-emerald-800 mb-4">مقاييس التحكم بالكرة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="juggling_count" className="text-emerald-700">عدد الشقلبات</Label>
                <Input
                  id="juggling_count"
                  name="juggling_count"
                  type="number"
                  value={formData.juggling_count}
                  onChange={handleChange}
                  required
                  className="border-emerald-300 focus:border-emerald-500"
                />
              </div>
              <div>
                <Label htmlFor="dribbling_time" className="text-emerald-700">وقت المراوغة (ثانية)</Label>
                <Input
                  id="dribbling_time"
                  name="dribbling_time"
                  type="number"
                  step="0.01"
                  value={formData.dribbling_time}
                  onChange={handleChange}
                  required
                  className="border-emerald-300 focus:border-emerald-500"
                />
              </div>
              <div>
                <Label htmlFor="passing_accuracy" className="text-emerald-700">دقة التمرير (%)</Label>
                <Input
                  id="passing_accuracy"
                  name="passing_accuracy"
                  type="number"
                  step="0.1"
                  value={formData.passing_accuracy}
                  onChange={handleChange}
                  required
                  className="border-emerald-300 focus:border-emerald-500"
                />
              </div>
              <div>
                <Label htmlFor="shooting_accuracy" className="text-emerald-700">دقة التسديد (%)</Label>
                <Input
                  id="shooting_accuracy"
                  name="shooting_accuracy"
                  type="number"
                  step="0.1"
                  value={formData.shooting_accuracy}
                  onChange={handleChange}
                  required
                  className="border-emerald-300 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            {isLoading ? "جاري إنشاء التقييم..." : "إنشاء التقييم"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// Training Program Component
const TrainingProgram = ({ playerId, playerName }) => {
  const [programs, setPrograms] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { speak, cancel, speaking, voices } = useSpeechSynthesis();

  useEffect(() => {
    fetchPrograms();
  }, [playerId]);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${API}/training-programs/${playerId}`);
      setPrograms(response.data);
    } catch (error) {
      console.error("خطأ في جلب البرامج:", error);
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
      console.error("خطأ في إنشاء البرنامج:", error);
    }
    setIsGenerating(false);
  };

  const speakProgram = (content) => {
    if (speaking) {
      cancel();
    } else {
      // Get Arabic voice if available, otherwise use first available voice
      const arabicVoice = voices.find(voice => voice.lang.includes('ar')) || voices[0];
      speak({ 
        text: content, 
        voice: arabicVoice,
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
        <h2 className="text-3xl font-bold text-emerald-800 mb-4">برامج التدريب للاعب {playerName}</h2>
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => generateProgram("AI_Generated")}
            disabled={isGenerating}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 ml-4"
          >
            {isGenerating ? "جاري الإنشاء..." : "برنامج ذكي مُنشأ بالذكاء الاصطناعي"}
          </Button>
          <Button
            onClick={() => generateProgram("Ronaldo_Template")}
            disabled={isGenerating}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            {isGenerating ? "جاري الإنشاء..." : "قالب رونالدو"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {programs.map((program) => (
          <Card key={program.id} className="bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl text-emerald-800">
                    برنامج {program.program_type === "AI_Generated" ? "الذكاء الاصطناعي" : program.program_type === "Ronaldo_Template" ? "رونالدو" : "مخصص"}
                  </CardTitle>
                  <CardDescription>
                    تم إنشاؤه: {new Date(program.created_at).toLocaleDateString('ar-SA')}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Badge 
                    variant={program.program_type === "AI_Generated" ? "default" : "secondary"}
                    className="bg-emerald-100 text-emerald-800 ml-2"
                  >
                    {program.program_type === "AI_Generated" ? "ذكاء اصطناعي" : program.program_type === "Ronaldo_Template" ? "رونالدو" : "مخصص"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => speakProgram(program.program_content)}
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
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
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">محتوى البرنامج</TabsTrigger>
                  <TabsTrigger value="schedule">الجدول الأسبوعي</TabsTrigger>
                  <TabsTrigger value="milestones">المعالم المرحلية</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="mt-4">
                  <div className="bg-white p-4 rounded-lg border border-emerald-200 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 text-right" dir="rtl">{program.program_content}</pre>
                  </div>
                </TabsContent>
                <TabsContent value="schedule" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(program.weekly_schedule || {}).map(([day, activity]) => {
                      const arabicDays = {
                        'Monday': 'الإثنين',
                        'Tuesday': 'الثلاثاء', 
                        'Wednesday': 'الأربعاء',
                        'Thursday': 'الخميس',
                        'Friday': 'الجمعة',
                        'Saturday': 'السبت',
                        'Sunday': 'الأحد'
                      };
                      return (
                        <div key={day} className="bg-white p-3 rounded-lg border border-emerald-200">
                          <div className="font-semibold text-emerald-800 text-right">{arabicDays[day] || day}</div>
                          <div className="text-sm text-gray-600 text-right" dir="rtl">{activity}</div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
                <TabsContent value="milestones" className="mt-4">
                  <div className="space-y-3">
                    {program.milestones?.map((milestone, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-emerald-200 flex justify-between items-center">
                        <div className="text-right">
                          <span className="font-semibold text-emerald-800">الأسبوع {milestone.week}:</span>
                          <span className="mr-2 text-gray-700" dir="rtl">{milestone.target}</span>
                        </div>
                        <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                          هدف
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

// Progress Tracker Component
const ProgressTracker = ({ playerId, playerName }) => {
  const [progressData, setProgressData] = useState([]);
  const [newEntry, setNewEntry] = useState({
    metric_type: "",
    metric_name: "",
    value: ""
  });

  useEffect(() => {
    fetchProgress();
  }, [playerId]);

  const fetchProgress = async () => {
    try {
      const response = await axios.get(`${API}/progress/${playerId}`);
      setProgressData(response.data);
    } catch (error) {
      console.error("خطأ في جلب التقدم:", error);
    }
  };

  const addProgress = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/progress`, {
        player_id: playerId,
        ...newEntry
      });
      setNewEntry({ metric_type: "", metric_name: "", value: "" });
      fetchProgress();
    } catch (error) {
      console.error("خطأ في إضافة التقدم:", error);
    }
  };

  // Process data for charts
  const chartData = progressData.reduce((acc, entry) => {
    const date = new Date(entry.date).toLocaleDateString('ar-SA');
    const existingDate = acc.find(item => item.date === date);
    if (existingDate) {
      existingDate[entry.metric_name] = entry.value;
    } else {
      acc.push({
        date,
        [entry.metric_name]: entry.value
      });
    }
    return acc;
  }, []).reverse();

  // Radar chart data
  const latestData = progressData.reduce((acc, entry) => {
    acc[entry.metric_name] = entry.value;
    return acc;
  }, {});

  const radarData = Object.entries(latestData).map(([metric, value]) => ({
    metric,
    value,
    fullMark: 100
  }));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-emerald-800 mb-4">تتبع التقدم للاعب {playerName}</h2>
      </div>

      {/* Add Progress Entry */}
      <Card className="bg-gradient-to-br from-emerald-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-emerald-800">إضافة إدخال التقدم</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addProgress} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label className="text-emerald-700">نوع المقياس</Label>
              <Select onValueChange={(value) => setNewEntry({...newEntry, metric_type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="speed">السرعة</SelectItem>
                  <SelectItem value="agility">الرشاقة</SelectItem>
                  <SelectItem value="flexibility">المرونة</SelectItem>
                  <SelectItem value="ball_handling">التحكم بالكرة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-emerald-700">اسم المقياس</Label>
              <Input
                placeholder="مثال: عدو 40 متر"
                value={newEntry.metric_name}
                onChange={(e) => setNewEntry({...newEntry, metric_name: e.target.value})}
                required
                dir="rtl"
              />
            </div>
            <div>
              <Label className="text-emerald-700">القيمة</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="القيمة"
                value={newEntry.value}
                onChange={(e) => setNewEntry({...newEntry, value: e.target.value})}
                required
              />
            </div>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              إضافة الإدخال
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-emerald-800 flex items-center">
              <TrendingUp className="ml-2" />
              التقدم عبر الوقت
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(latestData).map((metric, index) => (
                  <Line
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    stroke={`hsl(${index * 60}, 70%, 50%)`}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-emerald-800">ملف الأداء الحالي</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis />
                <Radar
                  name="الأداء"
                  dataKey="value"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Voice Notes Component
const VoiceNotes = ({ playerId, playerName }) => {
  const [notes, setNotes] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const { speak, cancel, speaking, voices } = useSpeechSynthesis();

  useEffect(() => {
    fetchNotes();
  }, [playerId]);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API}/voice-notes/${playerId}`);
      setNotes(response.data);
    } catch (error) {
      console.error("خطأ في جلب الملاحظات:", error);
    }
  };

  const saveNote = async () => {
    if (!transcript) return;
    
    try {
      await axios.post(`${API}/voice-notes`, {
        player_id: playerId,
        note_text: transcript
      });
      resetTranscript();
      fetchNotes();
    } catch (error) {
      console.error("خطأ في حفظ الملاحظة:", error);
    }
  };

  const speakNote = (text) => {
    if (speaking) {
      cancel();
    } else {
      // Get Arabic voice if available
      const arabicVoice = voices.find(voice => voice.lang.includes('ar')) || voices[0];
      speak({ 
        text: text, 
        voice: arabicVoice,
        rate: 0.8,
        pitch: 1
      });
    }
  };

  const stopSpeaking = () => {
    cancel();
  };

  if (!browserSupportsSpeechRecognition) {
    return <div className="text-center text-red-600">المتصفح لا يدعم التعرف على الكلام.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-emerald-800 mb-4">الملاحظات الصوتية للاعب {playerName}</h2>
      </div>

      {/* Voice Input */}
      <Card className="bg-gradient-to-br from-emerald-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-emerald-800">تسجيل ملاحظات التدريب</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setIsListening(!isListening)}
              className={`${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'} transition-colors ml-4`}
            >
              {isListening ? <MicOff className="ml-2" /> : <Mic className="ml-2" />}
              {isListening ? 'إيقاف التسجيل' : 'بدء التسجيل'}
            </Button>
            <Button
              onClick={saveNote}
              disabled={!transcript}
              className="bg-blue-600 hover:bg-blue-700"
            >
              حفظ الملاحظة
            </Button>
            <Button
              onClick={resetTranscript}
              variant="outline"
              className="border-gray-300"
            >
              مسح
            </Button>
            {speaking && (
              <Button
                onClick={stopSpeaking}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <Square className="w-4 h-4 ml-2" />
                إيقاف
              </Button>
            )}
          </div>
          
          {transcript && (
            <div className="bg-white p-4 rounded-lg border border-emerald-200">
              <p className="text-gray-700 text-right" dir="rtl">{transcript}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.id} className="bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-gray-700 mb-2 text-right" dir="rtl">{note.note_text}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(note.created_at).toLocaleString('ar-SA')}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => speakNote(note.note_text)}
                  className="mr-4"
                >
                  {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
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
      console.error("خطأ في جلب التقييمات:", error);
    }
  };

  const handleAssessmentCreated = (assessment) => {
    setAssessments([assessment, ...assessments]);
    setSelectedPlayer(assessment);
    setActiveTab("training");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-blue-50 to-white" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">⚽ متتبع التدريب الاحترافي لكرة القدم</h1>
          <p className="text-emerald-600 text-lg">مولد برامج التدريب الاحترافية لكرة القدم مع رؤى مدعومة بالذكاء الاصطناعي</p>
        </div>

        {/* Player Selection */}
        {assessments.length > 0 && (
          <Card className="mb-8 bg-white border-emerald-200">
            <CardHeader>
              <CardTitle className="text-emerald-800">اختيار اللاعب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {assessments.map((assessment) => (
                  <Button
                    key={assessment.id}
                    variant={selectedPlayer?.id === assessment.id ? "default" : "outline"}
                    onClick={() => setSelectedPlayer(assessment)}
                    className={`p-4 h-auto flex flex-col items-end text-right ${
                      selectedPlayer?.id === assessment.id 
                        ? 'bg-emerald-600 hover:bg-emerald-700' 
                        : 'border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="font-semibold">{assessment.player_name}</span>
                    <span className="text-sm opacity-75">{assessment.position} • عمر {assessment.age}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="assessment" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">التقييم</TabsTrigger>
            <TabsTrigger value="training" disabled={!selectedPlayer} className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">برامج التدريب</TabsTrigger>
            <TabsTrigger value="progress" disabled={!selectedPlayer} className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">تتبع التقدم</TabsTrigger>
            <TabsTrigger value="voice" disabled={!selectedPlayer} className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">الملاحظات الصوتية</TabsTrigger>
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
            {selectedPlayer && (
              <ProgressTracker 
                playerId={selectedPlayer.id} 
                playerName={selectedPlayer.player_name} 
              />
            )}
          </TabsContent>

          <TabsContent value="voice">
            {selectedPlayer && (
              <VoiceNotes 
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
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;