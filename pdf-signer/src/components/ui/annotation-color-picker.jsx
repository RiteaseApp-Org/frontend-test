"use client";

const DEFAULT_COLORS = [
  { name: "yellow", value: "#FFEB3B" },
  { name: "green", value: "#4CAF50" },
  { name: "blue", value: "#2196F3" },
  { name: "pink", value: "#E91E63" },
  { name: "orange", value: "#FF9800" },
];

export function AnnotationColorPicker({ 
  selectedColor, 
  onColorChange, 
  colors = DEFAULT_COLORS,
  showStrokeWidth = false,
  strokeWidth,
  onStrokeWidthChange,
  position = "right",
}) {
  const positionClasses = {
    right: "left-full ml-2",
    left: "right-full mr-2",
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
  };

  return (
    <div 
      className={`absolute ${positionClasses[position]} top-0 p-3 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[160px]`}
    >
      <div className="flex flex-col gap-3">
        {/* Color buttons */}
        <div className="flex gap-2 justify-center">
          {colors.map((color) => (
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

        {/* Optional stroke width slider */}
        {showStrokeWidth && (
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
              onChange={(e) => onStrokeWidthChange(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-xs text-gray-500 mt-1">
              {strokeWidth}px
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 