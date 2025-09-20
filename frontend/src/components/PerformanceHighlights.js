import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  TrendingUp, TrendingDown, BarChart3, Target, 
  Award, Clock, Zap, Activity, Calendar,
  PlayCircle, ExternalLink
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const PerformanceHighlights = ({ playerData }) => {
  const [highlights, setHighlights] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [radarData, setRadarData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('4weeks');

  useEffect(() => {
    if (playerData) {
      generateHighlights();
      generatePerformanceData();
      generateRadarData();
    }
  }, [playerData, selectedPeriod]);

  const generateHighlights = () => {
    if (!playerData) return;

    const highlights = [
      {
        id: 1,
        title: "Speed Breakthrough",
        category: "physical",
        improvement: "+0.3s",
        metric: "30m Sprint",
        description: "Significant improvement in acceleration and top speed",
        date: "2024-01-15",
        impact: "high",
        trend: "up",
        icon: Zap,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200"
      },
      {
        id: 2,
        title: "Technical Consistency",
        category: "technical",
        improvement: "+15%",
        metric: "Ball Control",
        description: "Remarkable progress in close ball control under pressure",
        date: "2024-01-20",
        impact: "high",
        trend: "up",
        icon: Target,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200"
      },
      {
        id: 3,
        title: "Tactical Intelligence",
        category: "tactical",
        improvement: "+2 points",
        metric: "Game Intelligence",
        description: "Enhanced decision making in complex game situations",
        date: "2024-01-18",
        impact: "medium",
        trend: "up",
        icon: BarChart3,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
      },
      {
        id: 4,
        title: "Endurance Milestone",
        category: "physical",
        improvement: "+200m",
        metric: "Yo-Yo Test",
        description: "Crossed elite youth threshold for cardiovascular endurance",
        date: "2024-01-22",
        impact: "high",
        trend: "up",
        icon: Activity,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200"
      }
    ];

    setHighlights(highlights);
  };

  const generatePerformanceData = () => {
    // Generate sample performance tracking data
    const data = [
      { week: 'Week 1', speed: 4.5, technical: 75, tactical: 65, physical: 70 },
      { week: 'Week 2', speed: 4.4, technical: 78, tactical: 68, physical: 72 },
      { week: 'Week 3', speed: 4.3, technical: 82, tactical: 72, physical: 75 },
      { week: 'Week 4', speed: 4.2, technical: 85, tactical: 75, physical: 78 },
    ];
    
    setPerformanceData(data);
  };

  const generateRadarData = () => {
    if (!playerData) return;

    const data = [
      {
        category: 'Speed',
        current: calculatePercentile(playerData.sprint_30m, 'sprint_30m'),
        target: 90,
        elite: 95
      },
      {
        category: 'Technical',
        current: (playerData.ball_control * 20) || 60,
        target: 85,
        elite: 95
      },
      {
        category: 'Tactical',
        current: (playerData.game_intelligence * 20) || 65,
        target: 80,
        elite: 90
      },
      {
        category: 'Physical',
        current: calculatePercentile(playerData.yo_yo_test, 'yo_yo_test'),
        target: 85,
        elite: 95
      },
      {
        category: 'Mental',
        current: (playerData.mental_toughness * 20) || 70,
        target: 90,
        elite: 95
      }
    ];

    setRadarData(data);
  };

  const calculatePercentile = (value, metric) => {
    // Simple percentile calculation based on youth standards
    const benchmarks = {
      sprint_30m: { excellent: 4.0, good: 4.3, average: 4.6, poor: 5.0 },
      yo_yo_test: { excellent: 2000, good: 1600, average: 1200, poor: 800 }
    };

    const bench = benchmarks[metric];
    if (!bench || !value) return 50;

    if (value <= bench.excellent) return 95;
    if (value <= bench.good) return 80;
    if (value <= bench.average) return 60;
    return 30;
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 
      <TrendingUp className="w-4 h-4 text-green-600" /> : 
      <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const getImpactBadge = (impact) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[impact] || colors.medium;
  };

  if (!playerData) {
    return (
      <Card className="professional-card text-center p-12">
        <CardContent>
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-[--text-muted]" />
          <h3 className="text-2xl font-semibold mb-2">Performance Analytics</h3>
          <p className="text-[--text-muted]">Complete an assessment to view detailed performance highlights and analytics.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[--text-navy]">Performance Highlights</h2>
          <p className="text-[--text-gray]">Key improvements and achievements tracking</p>
        </div>
        <select 
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="input-field w-auto"
        >
          <option value="1week">Last Week</option>
          <option value="4weeks">Last 4 Weeks</option>
          <option value="3months">Last 3 Months</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {highlights.map((highlight) => {
          const IconComponent = highlight.icon;
          return (
            <Card key={highlight.id} className={`professional-card ${highlight.bgColor} ${highlight.borderColor} border-2`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${highlight.bgColor} flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 ${highlight.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{highlight.title}</h3>
                      <p className="text-sm text-[--text-gray]">{highlight.metric}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(highlight.trend)}
                    <Badge className={getImpactBadge(highlight.impact)}>
                      {highlight.impact.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[--text-navy]">{highlight.improvement}</span>
                    <span className="text-sm text-[--text-gray]">
                      {new Date(highlight.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[--text-gray]">{highlight.description}</p>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    View Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Trends Chart */}
      <Card className="professional-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="technical" stroke="#3B82F6" strokeWidth={2} name="Technical %" />
                <Line type="monotone" dataKey="tactical" stroke="#10B981" strokeWidth={2} name="Tactical %" />
                <Line type="monotone" dataKey="physical" stroke="#F59E0B" strokeWidth={2} name="Physical %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Radar */}
      <Card className="professional-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Current vs Target Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Current"
                  dataKey="current"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Target"
                  dataKey="target"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Radar
                  name="Elite Level"
                  dataKey="elite"
                  stroke="#F59E0B"
                  fill="none"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Summary */}
      <Card className="professional-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <Trophy className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
              <div className="text-2xl font-bold text-yellow-800">3</div>
              <div className="text-sm text-yellow-700">New Records</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Target className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-800">87%</div>
              <div className="text-sm text-blue-700">Goal Achievement</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <Calendar className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-800">28</div>
              <div className="text-sm text-green-700">Training Days</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* External Links */}
      <Card className="professional-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Video Analysis & References
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <PlayCircle className="w-4 h-4 mr-2" />
              Training Session Highlights - Week 4
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <PlayCircle className="w-4 h-4 mr-2" />
              Technical Skills Progress Analysis
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <PlayCircle className="w-4 h-4 mr-2" />
              Tactical Decision Making Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceHighlights;