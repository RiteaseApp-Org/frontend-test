"use client";

export default function StrokeWidthSlider({ strokeWidth, onWidthChange }) {
  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-32">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Thin</span>
          <span>Thick</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={strokeWidth}
          onChange={(e) => onWidthChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-center text-xs text-gray-500">
          {strokeWidth}px
        </div>
      </div>
    </div>
  );
} 