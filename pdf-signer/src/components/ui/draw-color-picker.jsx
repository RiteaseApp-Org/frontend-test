"use client";

const DRAW_COLORS = [
  { name: "black", value: "#000000" },
  { name: "red", value: "#FF0000" },
  { name: "blue", value: "#0000FF" },
  { name: "green", value: "#00FF00" },
  { name: "purple", value: "#800080" },
];

export default function DrawColorPicker({ selectedColor, onColorChange }) {
  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="flex gap-2">
        {DRAW_COLORS.map((color) => (
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