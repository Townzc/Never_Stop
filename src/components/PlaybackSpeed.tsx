'use client';

import { useStore } from '@/lib/store';

const speeds = [0.75, 0.9, 1.0, 1.1];

export default function PlaybackSpeed() {
  const { playbackSpeed, setPlaybackSpeed } = useStore();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">语速:</span>
      <div className="flex gap-1">
        {speeds.map((speed) => (
          <button
            key={speed}
            onClick={() => setPlaybackSpeed(speed)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[36px] min-w-[48px] ${
              playbackSpeed === speed
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {speed}x
          </button>
        ))}
      </div>
    </div>
  );
}
