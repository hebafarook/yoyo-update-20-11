// src/dashboards/PlayerDashboard.js
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Target, TrendingUp, Zap, Trophy } from "lucide-react";
import AssessmentForm from "../App"; // <-- we'll NOT use this directly here, see note below

// NOTE:
// For now, the actual player tools (Assessment, Training, Progress)
// still live in MainDashboard tabs in App.js.
// This PlayerDashboard is a wrapper so later we can route directly here
// if you want a totally separate "player.yoyo" portal.
// For now we’ll just show a summary & hints.

const PlayerDashboard = ({ player }) => {
  return (
    <div className="space-y-6">
      <Card className="professional-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Player Portal – {player?.player_name || "Your Profile"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-[--text-secondary]">
          <p>
            This is your **player view**. Here you’ll see:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Latest assessment and strengths/weaknesses</li>
            <li>Your active training program and phase (Foundation / Build / Peak)</li>
            <li>Progress toward next level and next retest date</li>
            <li>Trophies and achievements unlocked</li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="professional-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[--primary-blue]">
              <TrendingUp className="w-4 h-4" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[--text-secondary]">
            Track your improvements by comparing current assessment to your baseline.
          </CardContent>
        </Card>

        <Card className="professional-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[--primary-blue]">
              <Zap className="w-4 h-4" />
              Today’s Focus
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[--text-secondary]">
            Follow the daily focus from your training plan (speed, technical, tactical, recovery).
          </CardContent>
        </Card>

        <Card className="professional-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[--secondary-gold]">
              <Trophy className="w-4 h-4" />
              Next Trophy
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[--text-secondary]">
            Reach the next performance tier to unlock a new badge and report summary.
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayerDashboard;
