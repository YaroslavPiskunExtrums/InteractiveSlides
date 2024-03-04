// export default function(hex: string, percent: number) {
//   // strip the leading # if it's there
//   hex = hex.replace(/^\s*#|\s*$/g, '');
//
//   // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
//   if(hex.length == 3){
//     hex = hex.replace(/(.)/g, '$1$1');
//   }
//
//   let r = parseInt(hex.substring(0, 2), 16),
//     g = parseInt(hex.substring(2, 2), 16),
//     b = parseInt(hex.substring(4, 2), 16);
//
//   r = r ? r : 0;
//   g = g ? g : 0;
//   b = b ? b : 0;
//
//   console.log("RGB", r, g, b)
//
//   return '#' +
//     ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substring(1) +
//     ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substring(1) +
//     ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substring(1);
// }

export default function(hex: string, brightness: number) {
  hex = hex.replaceAll('#', '');

  // Convert the hex color string to RGB.
  const rgb = hexToRgb(hex);

  // Calculate the new RGB components based on the brightness value.
  const newRgb = rgb.map(function(component: number) {
    return Math.round(component * brightness);
  });

  // Return the new color in RGB format.
  return 'rgb(' + newRgb.join(',') + ')';
}
function hexToRgb(hexColor:string) {
  // Split the hex color string into its red, green, and blue components.
  let rgb : any  = hexColor.match(/../g);

  // Convert each component from hexadecimal to decimal.
  rgb = rgb.map(function(component: string) {
    return parseInt(component, 16);
  });

  // Return the RGB components in an array.
  return rgb;
}