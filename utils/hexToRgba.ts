// Utility function to convert hex to rgba
export const hexToRgba = (hex: string, alpha: number): string => {
  // Remove the '#' if it exists
  hex = hex.replace("#", "");

  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Return the rgba string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
