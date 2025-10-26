import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  TrendingUp, TrendingDown, Minus, Target, Calendar, 
  Award, BarChart3, Trophy, Activity, Trash2, Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const BenchmarkHistory = () => {
  const { getBenchmarks, getPlayerProgress, deleteBenchmark, isAuthenticated } = useAuth();
  const [benchmarks, setBenchmarks] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerProgress, setPlayerProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadBenchmarks();
    }
  }, [isAuthenticated]);

  const loadBenchmarks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getBenchmarks();
      if (result.success) {
        setBenchmarks(result.benchmarks);
        
        // Group benchmarks by player
        const players = [...new Set(result.benchmarks.map(b => b.player_name))];
        if (players.length > 0 && !selectedPlayer) {
          setSelectedPlayer(players[0]);
          loadPlayerProgress(players[0]);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load benchmarks');
      console.error('Error loading benchmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPlayerProgress = async (playerName) => {
    try {
      const result = await getPlayerProgress(playerName);
      if (result.success) {
        setPlayerProgress(result.progress);
      }
    } catch (err) {
      console.error('Error loading player progress:', err);
    }
  };

  const handlePlayerChange = (playerName) => {
    setSelectedPlayer(playerName);
    loadPlayerProgress(playerName);
  };

  const handleDeleteBenchmark = async (benchmarkId, isBaseline) => {
    if (isBaseline) {
      alert('Cannot delete baseline benchmark!');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this benchmark?')) {
      return;
    }

    try {
      const result = await deleteBenchmark(benchmarkId);
      if (result.success) {
        alert('Benchmark deleted successfully!');
        loadBenchmarks();
      } else {
        alert('Failed to delete benchmark: ' + result.error);
      }
    } catch (err) {
      alert('Failed to delete benchmark. Please try again.');
      console.error('Error deleting benchmark:', err);
    }
  };

  const getImprovementIcon = (value) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getImprovementColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-400';
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">Login Required</h3>
          <p className="text-gray-600">Please login to view your assessment benchmarks and progress tracking.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Activity className="w-16 h-16 mx-auto mb-4 text-blue-600 animate-pulse" />
          <p className="text-gray-600">Loading benchmarks...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={loadBenchmarks} className="mt-4">Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  if (benchmarks.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">No Benchmarks Yet</h3>
          <p className="text-gray-600">Complete an assessment and save it as a benchmark to start tracking your progress!</p>
        </CardContent>
      </Card>
    );
  }

  // Get unique players
  const players = [...new Set(benchmarks.map(b => b.player_name))];
  
  // Filter benchmarks for selected player
  const playerBenchmarks = benchmarks.filter(b => b.player_name === selectedPlayer);
  const baselineBenchmark = playerBenchmarks.find(b => b.is_baseline);

  return (
    <div className="space-y-6">
      {/* Player Selection */}
      {players.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Player</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {players.map(player => (
                <Button
                  key={player}
                  variant={selectedPlayer === player ? "default" : "outline"}
                  onClick={() => handlePlayerChange(player)}
                >
                  {player}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Overview */}
      {playerProgress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Progress Overview - {selectedPlayer}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Total Benchmarks</div>
                <div className="text-2xl font-bold text-blue-700">{playerProgress.total_benchmarks}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Baseline Score</div>
                <div className="text-2xl font-bold text-green-700">{playerProgress.baseline_score}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Latest Score</div>
                <div className="text-2xl font-bold text-purple-700">{playerProgress.latest_score}</div>
              </div>
              <div className={`p-4 rounded-lg ${playerProgress.overall_improvement >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                <div className="text-sm text-gray-600 mb-1">Overall Improvement</div>
                <div className={`text-2xl font-bold flex items-center gap-2 ${playerProgress.overall_improvement >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {getImprovementIcon(playerProgress.overall_improvement)}
                  {playerProgress.overall_improvement.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Progress Timeline */}
            <div>
              <h4 className="font-semibold mb-3">Progress Timeline</h4>
              <div className="space-y-2">
                {playerProgress.improvement_timeline.map((point, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-32 text-sm text-gray-600">
                      {new Date(point.date).toLocaleDateString()}
                    </div>
                    <div className="flex-1">
                      <Progress 
                        value={point.overall_score} 
                        className="h-4"
                      />
                    </div>
                    <div className="w-20 text-right">
                      <Badge variant={point.benchmark_type === 'baseline' ? 'default' : 'secondary'}>
                        {point.overall_score}
                      </Badge>
                    </div>
                    {point.benchmark_type === 'baseline' && (
                      <Badge className="bg-amber-100 text-amber-800">Baseline</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Baseline Benchmark */}
      {baselineBenchmark && (
        <Card className="border-2 border-amber-300 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              Baseline Benchmark
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Date</div>
                <div className="font-semibold">{new Date(baselineBenchmark.benchmark_date).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Overall Score</div>
                <div className="font-semibold text-2xl">{baselineBenchmark.overall_score}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Age / Position</div>
                <div className="font-semibold">{baselineBenchmark.age} / {baselineBenchmark.position}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Level</div>
                <Badge className="bg-amber-600">{baselineBenchmark.performance_level}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Benchmarks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            All Benchmarks ({playerBenchmarks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {playerBenchmarks.map((benchmark) => (
              <Card key={benchmark.id} className={benchmark.is_baseline ? 'border-amber-300' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold">
                          {new Date(benchmark.benchmark_date).toLocaleDateString()}
                        </span>
                        {benchmark.is_baseline && (
                          <Badge className="bg-amber-100 text-amber-800">Baseline</Badge>
                        )}
                        <Badge variant="secondary">{benchmark.benchmark_type}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                        <div>
                          <div className="text-xs text-gray-500">Overall</div>
                          <div className="font-bold text-lg">{benchmark.overall_score}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">VO2 Max</div>
                          <div className="font-semibold">{benchmark.vo2_max}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Sprint 30m</div>
                          <div className="font-semibold">{benchmark.sprint_30m}s</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Yo-Yo Test</div>
                          <div className="font-semibold">{benchmark.yo_yo_test}m</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Level</div>
                          <Badge>{benchmark.performance_level}</Badge>
                        </div>
                      </div>

                      {/* Improvement from Baseline */}
                      {!benchmark.is_baseline && benchmark.improvement_from_baseline && (
                        <div className="border-t pt-3 mt-3">
                          <div className="text-sm font-semibold mb-2">Improvement from Baseline</div>
                          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              {getImprovementIcon(benchmark.improvement_from_baseline.overall_score)}
                              <span className={getImprovementColor(benchmark.improvement_from_baseline.overall_score)}>
                                Overall: {benchmark.improvement_from_baseline.overall_score}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {getImprovementIcon(benchmark.improvement_from_baseline.vo2_max)}
                              <span className={getImprovementColor(benchmark.improvement_from_baseline.vo2_max)}>
                                VO2: {benchmark.improvement_from_baseline.vo2_max}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {getImprovementIcon(benchmark.improvement_from_baseline.sprint_30m)}
                              <span className={getImprovementColor(benchmark.improvement_from_baseline.sprint_30m)}>
                                Sprint: {benchmark.improvement_from_baseline.sprint_30m}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {getImprovementIcon(benchmark.improvement_from_baseline.yo_yo_test)}
                              <span className={getImprovementColor(benchmark.improvement_from_baseline.yo_yo_test)}>
                                Yo-Yo: {benchmark.improvement_from_baseline.yo_yo_test}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {getImprovementIcon(benchmark.improvement_from_baseline.ball_control)}
                              <span className={getImprovementColor(benchmark.improvement_from_baseline.ball_control)}>
                                Ball: {benchmark.improvement_from_baseline.ball_control}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {getImprovementIcon(benchmark.improvement_from_baseline.passing_accuracy)}
                              <span className={getImprovementColor(benchmark.improvement_from_baseline.passing_accuracy)}>
                                Pass: {benchmark.improvement_from_baseline.passing_accuracy}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {benchmark.notes && (
                        <div className="text-sm text-gray-600 mt-2 italic">{benchmark.notes}</div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      {!benchmark.is_baseline && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBenchmark(benchmark.id, benchmark.is_baseline)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BenchmarkHistory;
