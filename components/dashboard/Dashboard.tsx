"use client";

import { useState,useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import Upscaler from "./Upscaler";
import ChatOutput from "./ChatOutput";

type UIMode = "chat" | "upscaler" | "downscaler";

type SessionHistory = {
  session_id: string;
  queries: string[];
};

const Dashboard = () => {
  const [uiMode, setUiMode] = useState<UIMode>("upscaler");
  const [history, setHistory] = useState<SessionHistory[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/userHistory');
      const data = await response.json();
      if (data.success) {
        setHistory(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const renderMainContent = () => {
    switch (uiMode) {
      case "upscaler":
        return <Upscaler />;
      case "chat":
        return <ChatOutput />;
      case "downscaler":
        return <div>Downscaler Component (Coming Soon)</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      {/* <div className="w-64 bg-zinc-900 text-white p-4 hidden md:block">
        <h3 className="font-semibold mb-4">History</h3>
        <div className="space-y-2">
          {history.map((session) => (
            session.queries.map((query) => (
              <div key={query} className="p-2 hover:bg-zinc-800 rounded">
                <p className="text-sm text-gray-400">{query}</p>
              </div>
            ))
          ))}
        </div>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mode Selector */}
        <div className="p-4 border-b">
          <Select onValueChange={(value: UIMode) => setUiMode(value)} defaultValue="upscaler">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upscaler">Upscaler</SelectItem>
              <SelectItem value="chat">Chat</SelectItem>
              <SelectItem value="downscaler">Downscaler</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-auto">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;