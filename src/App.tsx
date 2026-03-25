import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Terminal, Cpu, Radio, AlertTriangle } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden font-mono relative">
      {/* Static Noise Overlay */}
      <div className="fixed inset-0 bg-static opacity-20 pointer-events-none z-50 mix-blend-screen" />
      
      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-50" />

      {/* Header */}
      <header className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between mb-8 gap-6 border-b-4 border-[#00FFFF] pb-4 relative">
        <div className="flex items-center gap-4 screen-tear">
          <div className="w-16 h-16 bg-black border-glitch flex items-center justify-center">
            <Terminal className="text-[#FF00FF]" size={36} />
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-cyan-magenta glitch-text" data-text="SYS.PROTOCOL_SNAKE">
              SYS.PROTOCOL_SNAKE
            </h1>
            <p className="text-xl text-[#FF00FF] tracking-[0.2em] mt-1">STATUS: COMPROMISED</p>
          </div>
        </div>

        <div className="flex items-center gap-8 bg-black border-glitch-alt px-8 py-4">
          <div className="flex flex-col items-center">
            <span className="text-lg text-[#00FFFF] tracking-widest mb-1">DATA_FRAGMENTS</span>
            <span className="text-4xl font-black text-magenta-cyan">{score}</span>
          </div>
          <div className="w-1 h-12 bg-[#FF00FF]" />
          <div className="flex flex-col items-center">
            <span className="text-lg text-[#00FFFF] tracking-widest mb-1">MAX_CORRUPTION</span>
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-[#FF00FF] animate-pulse" />
              <span className="text-4xl font-black text-cyan-magenta">{highScore}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Left Sidebar - Info/Controls */}
        <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
          <div className="bg-black border-glitch p-6">
            <h3 className="text-2xl text-[#FF00FF] tracking-widest mb-4 flex items-center gap-2 border-b-2 border-[#00FFFF] pb-2">
              <Cpu size={24} className="text-[#00FFFF]" />
              INPUT_VECTORS
            </h3>
            <div className="space-y-4 text-xl">
              <div className="flex items-center justify-between">
                <span className="text-[#00FFFF]">NAVIGATE</span>
                <span className="px-2 py-1 bg-[#FF00FF] text-black font-bold">ARROWS</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#00FFFF]">HALT_SYS</span>
                <span className="px-2 py-1 bg-[#FF00FF] text-black font-bold">AUDIO_PAUSE</span>
              </div>
            </div>
          </div>

          <div className="bg-black border-glitch-alt p-6">
            <h3 className="text-2xl text-[#00FFFF] tracking-widest mb-4 flex items-center gap-2 border-b-2 border-[#FF00FF] pb-2">
              <Radio size={24} className="text-[#FF00FF]" />
              AUDIO_SUBSYSTEM
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-2 bg-[#00FFFF] text-black">
                <div className="w-8 h-8 bg-black flex items-center justify-center">
                  <Radio size={20} className="text-[#FF00FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xl font-bold truncate">STREAM_01.WAV</p>
                  <p className="text-sm truncate">CORRUPTED_SECTOR</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 border-2 border-[#FF00FF] text-[#00FFFF] opacity-50">
                <div className="w-8 h-8 bg-[#FF00FF] flex items-center justify-center">
                  <Radio size={20} className="text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xl font-bold truncate">STREAM_02.WAV</p>
                  <p className="text-sm truncate">UNREACHABLE</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Game */}
        <div className="lg:col-span-6 flex flex-col items-center order-1 lg:order-2">
          <div className="relative p-2 bg-black border-glitch screen-tear">
            <SnakeGame onScoreChange={handleScoreChange} isPaused={!isPlayingMusic} />
          </div>
          <p className="mt-6 text-2xl text-[#FF00FF] tracking-[0.5em] animate-pulse">
            &gt; INITIATE AUDIO TO COMMENCE &lt;
          </p>
        </div>

        {/* Right Sidebar - Music Player */}
        <div className="lg:col-span-3 order-3">
          <MusicPlayer onPlayPause={setIsPlayingMusic} />
        </div>
      </main>
    </div>
  );
}
