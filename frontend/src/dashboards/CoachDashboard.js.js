// src/dashboards/CoachDashboard.js
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Users, Target, BarChart3, MessageSquare } from "lucide-react";

const mockTeams = [
  {
    id: 1,
    name: "U14 Elite Squad",
    players: [
      { id: "p1", name: "Player 1", position: "Forward", level: "Advanced" },
      { id: "p2", name: "Player 2", position: "Midfielder", level: "Developing" }
    ]
  },
  {
    id: 2,
    name: "U16 Development",
    players: [
      { id: "p3", name: "Player 3", position: "Defender", level: "Intermediate" }
    ]
  }
];

const CoachDashboard = ({ coach }) => {
  return (
    <div className="space-y-6">
      <Card className="professional-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Coach Portal – {coach?.full_name || "Coach"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-[--text-secondary]">
          <p>From here you will:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>View all teams you manage and their players</li>
            <li>Open player assessments and AI-generated programs</li>
            <li>Send notes/feedback to players and parents</li>
            <li>See AI recommendations on who needs extra focus</li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mockTeams.map((team) => (
          <Card key={team.id} className="professional-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[--primary-blue]" />
                  {team.name}
                </span>
                <span className="text-xs text-[--text-muted]">
                  {team.players.length} players
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {team.players.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between text-sm professional-card p-2"
                >
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-[--text-muted] text-xs">
                      {p.position} • {p.level}
                    </div>
                  </div>
                  <button className="btn-secondary text-xs flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    View Report
                  </button>
                </div>
              ))}
              <button className="btn-primary w-full mt-2 text-xs flex items-center justify-center gap-1">
                <MessageSquare className="w-3 h-3" />
                Send Group Message
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CoachDashboard;
