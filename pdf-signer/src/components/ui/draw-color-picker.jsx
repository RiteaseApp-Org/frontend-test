"use client";

const DRAW_COLORS = [
  { name: "black", value: "#000000" },
  { name: "red", value: "#FF0000" },
  { name: "blue", value: "#0000FF" },
  { name: "green", value: "#00FF00" },
  { name: "purple", value: "#800080" },
];

export default function DrawColorPicker({ selectedColor, onColorChange, strokeWidth, onWidthChange }) {
  return (
    <div className="absolute top-0 left-full ml-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="flex flex-col gap-3">
        {/* Color buttons */}
        <div className="flex gap-2">
          {DRAW_COLORS.map((color) => (
            <button
              key={color.name}
              className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${
                selectedColor === color.value ? "ring-2 ring-offset-2 ring-black" : ""
              }`}
              style={{ backgroundColor: color.value }}
              onClick={() => onColorChange(color.value)}
              title={color.name}
            />
          ))}
        </div>

        {/* Stroke width slider */}
        <div className="w-full">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
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
          <div className="text-center text-xs text-gray-500 mt-1">
            {strokeWidth}px
          </div>
        </div>
      </div>
    </div>
  );
} 