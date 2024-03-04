export default function(hex, brightness) {
  hex = hex.replaceAll('#', '');

  // Convert the hex color string to RGB.
  const rgb = hexToRgb(hex);

  // Calculate the new RGB components based on the brightness value.
  const newRgb = rgb.map(function(component) {
    return Math.round(component * brightness);
  });

  // Return the new color in RGB format.
  return 'rgb(' + newRgb.join(',') + ')';
}
function hexToRgb(hexColor) {
  // Split the hex color string into its red, green, and blue components.
  let rgb   = hexColor.match(/../g);

  // Convert each component from hexadecimal to decimal.
  rgb = rgb.map(function(component) {
    return parseInt(component, 16);
  });

  // Return the RGB components in an array.
  return rgb;
}