"use client";

const HIGHLIGHT_COLORS = [
  { name: "yellow", value: "rgba(255, 255, 0, 0.3)" },
  { name: "green", value: "rgba(0, 255, 0, 0.3)" },
  { name: "blue", value: "rgba(0, 255, 255, 0.3)" },
  { name: "pink", value: "rgba(255, 192, 203, 0.3)" },
  { name: "orange", value: "rgba(255, 165, 0, 0.3)" },
];

export function ColorPicker({ selectedColor, onColorChange }) {
  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="flex gap-2">
        {HIGHLIGHT_COLORS.map((color) => (
          <button
            key={color.name}
            className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
              selectedColor === color.value ? "ring-2 ring-offset-2 ring-black" : ""
            }`}
            style={{ backgroundColor: color.value }}
            onClick={() => onColorChange(color.value)}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
} 