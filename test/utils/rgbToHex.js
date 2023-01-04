function componentToHex (c) {
  const hex = parseInt(c).toString(16)
  return hex.length == 1 ? "0" + hex : hex
}

function getHex (obj) {
  return "#" + componentToHex(obj.r) + componentToHex(obj.g) + componentToHex(obj.b);
}

function getRGB (str) {
  var match = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
  return match ? {
    r: match[1],
    g: match[2],
    b: match[3]
  } : {};
}

function rgbToHex (str) {
  const rgbObj = getRGB(str)
  return getHex(rgbObj)
}

function hexToRgb (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const rgbObj = result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
  if (!rgbObj) return rgbObj
  return `rgb(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b})`
}

// console.log(rgbToHex('rgb(51, 0, 255)'))
// console.log(hexToRgb('#33ccff'))

module.exports = {
  rgbToHex,
  hexToRgb
}
