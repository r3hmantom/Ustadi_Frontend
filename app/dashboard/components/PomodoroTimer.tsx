import React, { useState, useEffect, useRef } from "react";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Timer, 
  Trophy, 
  PlayCircle, 
  PauseCircle, 
  RotateCcw,
  Volume2,
  VolumeX 
} from "lucide-react";
import { StaggerItem } from "@/components/ui/animated-elements";
import { PomodoroSettings } from "../types";

interface PomodoroTimerProps {
  initialSettings?: Partial<PomodoroSettings>;
}

export function PomodoroTimer({ initialSettings }: PomodoroTimerProps) {
  const [pomodoroMode, setPomodoroMode] = useState<"work" | "break">(
    initialSettings?.pomodoroMode || "work"
  );
  const [timerRunning, setTimerRunning] = useState(
    initialSettings?.timerRunning || false
  );
  const [timeLeft, setTimeLeft] = useState(
    initialSettings?.timeLeft || { minutes: 25, seconds: 0 }
  );
  const [muted, setMuted] = useState(
    initialSettings?.muted || false
  );
  const [completedSessions, setCompletedSessions] = useState(
    initialSettings?.completedSessions || 0
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
    audioRef.current.volume = 0.6;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (timerRunning) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          // If time is up
          if (prev.minutes === 0 && prev.seconds === 0) {
            // Play notification sound if not muted
            if (!muted && audioRef.current) {
              audioRef.current.play().catch(error => {
                console.error("Error playing audio:", error);
              });
            }
            
            // Switch modes
            if (pomodoroMode === "work") {
              setPomodoroMode("break");
              setCompletedSessions(prev => prev + 1);
              return { minutes: 5, seconds: 0 };  // Switch to break
            } else {
              setPomodoroMode("work");
              return { minutes: 25, seconds: 0 };  // Switch to work
            }
          }
          
          // Normal countdown
          if (prev.seconds === 0) {
            return { minutes: prev.minutes - 1, seconds: 59 };
          } else {
            return { ...prev, seconds: prev.seconds - 1 };
          }
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, pomodoroMode, muted]);

  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    if (pomodoroMode === "work") {
      setTimeLeft({ minutes: 25, seconds: 0 });
    } else {
      setTimeLeft({ minutes: 5, seconds: 0 });
    }
  };

  const switchMode = () => {
    setTimerRunning(false);
    if (pomodoroMode === "work") {
      setPomodoroMode("break");
      setTimeLeft({ minutes: 5, seconds: 0 });
    } else {
      setPomodoroMode("work");
      setTimeLeft({ minutes: 25, seconds: 0 });
    }
  };

  const formatTimeLeft = () => {
    return `${timeLeft.minutes.toString().padStart(2, '0')}:${timeLeft.seconds.toString().padStart(2, '0')}`;
  };

  return (
    <StaggerItem>
      <Card className={`${pomodoroMode === "work" ? "bg-red-100" : "bg-green-100"} overflow-hidden`}>
        <CardHeader className={`${pomodoroMode === "work" ? "bg-red-400" : "bg-green-400"} border-b-4 border-black`}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-black">
                <Timer size={20} /> Pomodoro Timer
              </CardTitle>
              <CardDescription className="text-black font-medium">
                {pomodoroMode === "work" ? "Work Session" : "Break Time"}
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setMuted(!muted)}
              className="h-8 w-8 p-0 rounded-full"
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col items-center">
          <div className="w-48 h-48 rounded-full border-8 border-black flex items-center justify-center mb-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-4xl font-black">{formatTimeLeft()}</span>
          </div>
          <div className="flex gap-3 mb-4">
            <Button
              variant={pomodoroMode === "work" ? "neuPrimary" : "neuSecondary"}
              onClick={toggleTimer}
              className="gap-2"
            >
              {timerRunning ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
              {timerRunning ? "Pause" : "Start"}
            </Button>
            <Button
              variant="neuSecondary"
              onClick={resetTimer}
              className="gap-2"
            >
              <RotateCcw size={18} />
              Reset
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={switchMode}
            className="font-bold"
          >
            Switch to {pomodoroMode === "work" ? "Break" : "Work"} Mode
          </Button>
          
          {/* Sessions counter */}
          <div className="mt-4 p-2 bg-white border-3 border-black rounded-lg w-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Trophy size={18} className="mr-2 text-yellow-500" />
            <span className="font-bold">Completed Sessions: {completedSessions}</span>
          </div>
        </CardContent>
      </Card>
    </StaggerItem>
  );
}