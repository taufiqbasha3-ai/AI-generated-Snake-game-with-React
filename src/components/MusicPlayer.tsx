import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Activity } from 'lucide-react';
import { DUMMY_TRACKS } from '../constants';

interface MusicPlayerProps {
  onPlayPause: (isPlaying: boolean) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ onPlayPause }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      onPlayPause(!isPlaying);
    }
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
    onPlayPause(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
    onPlayPause(true);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    }
  }, [currentTrackIndex, isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  return (
    <div className="w-full max-w-md bg-black border-glitch p-6">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
      />

      <div className="flex items-center gap-6 mb-8 border-b-2 border-[#FF00FF] pb-6">
        <div className="relative w-24 h-24 flex-shrink-0 border-2 border-[#00FFFF]">
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className={`w-full h-full object-cover grayscale contrast-200 ${isPlaying ? 'screen-tear' : ''}`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#00FFFF] mix-blend-multiply opacity-50" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-3xl font-bold text-magenta-cyan truncate mb-2">
            {currentTrack.title}
          </h3>
          <p className="text-[#00FFFF] text-xl truncate">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="h-4 w-full bg-black border-2 border-[#00FFFF] mb-2 relative overflow-hidden">
          <div 
            className="h-full bg-[#FF00FF]"
            style={{ width: `${progress}%` }}
          />
          {/* Glitchy progress artifact */}
          <div className="absolute top-0 bottom-0 w-2 bg-white animate-pulse" style={{ left: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-lg text-[#00FFFF]">
          <span>{Math.floor(audioRef.current?.currentTime || 0)}S</span>
          <span>{Math.floor(audioRef.current?.duration || 0)}S</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-8">
        <button 
          onClick={skipBackward}
          className="p-3 bg-black border-2 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black transition-none active:translate-y-1"
        >
          <SkipBack size={32} />
        </button>
        
        <button 
          onClick={togglePlay}
          className="p-4 bg-[#FF00FF] border-2 border-[#00FFFF] text-black hover:bg-black hover:text-[#FF00FF] transition-none active:translate-y-1"
        >
          {isPlaying ? <Pause size={40} /> : <Play size={40} className="ml-2" />}
        </button>

        <button 
          onClick={skipForward}
          className="p-3 bg-black border-2 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black transition-none active:translate-y-1"
        >
          <SkipForward size={32} />
        </button>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3 text-[#FF00FF] border-t-2 border-[#00FFFF] pt-4">
        <Activity size={24} className={isPlaying ? 'animate-pulse' : 'opacity-50'} />
        <span className="text-xl tracking-widest">
          {isPlaying ? 'TRANSMITTING...' : 'SIGNAL_LOST'}
        </span>
      </div>
    </div>
  );
};
