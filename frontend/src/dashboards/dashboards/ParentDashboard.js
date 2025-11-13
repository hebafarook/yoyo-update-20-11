// src/dashboards/ParentDashboard.js
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Users, Calendar, MessageSquare, TrendingUp } from "lucide-react";

const mockChildren = [
  {
    id: "c1",
    name: "Player 1",
    age: 14,
    team: "U14 Elite Squad",
    position: "Forward",
    nextSession: "Tue 6:30 PM",
    coachNotes: "Focus on first touch and decision speed in final third.",
    progress: "Improved sprint time by 0.15s"
  }
];

const ParentDashboard = ({ parent }) => {
  return (
    <div className="space-y-6">
      <Card className="professional-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Parent Portal – {parent?.full_name || "Parent"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-[--text-secondary]">
          <p>Here you can:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>View each child’s training schedule</li>
            <li>See progress since last assessment</li>
            <li>Read coach notes and AI recommendations</li>
            <li>Message the coach with questions</li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mockChildren.map((child) => (
          <Card key={child.id} className="professional-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{child.name}</span>
                <span className="text-xs text-[--text-muted]">
                  {child.age} yrs • {child.position}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[--primary-blue]" />
                <span>
                  Next Session: <strong>{child.nextSession}</strong> ({child.team})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span>{child.progress}</span>
              </div>
              <div className="text-xs text-[--text-secondary] border-t pt-2">
                <strong>Coach Notes:</strong> {child.coachNotes}
              </div>
              <button className="btn-secondary w-full mt-2 text-xs flex items-center justify-center gap-1">
                <MessageSquare className="w-3 h-3" />
                Message Coach
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ParentDashboard;
