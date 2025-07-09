
//export const API_URL = "https://stablevotingapi2.herokuapp.com";
//export const API_URL = "http://localhost:8000"
export const API_URL = "https://stablevoting-backend.onrender.com";
//export const API_URL = "https://stablevoting-api-dev.herokuapp.com"

export const URL = "https://stablevoting.org";
//export const URL = "https://dev.stablevoting.org";
//export const URL = "http://localhost:3000"

export const isValidEmail = (em) => {
  // don't remember from where I copied this code, but this works.
  let re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(em);
};

export const rankLabels = {
  1: "1st Place",
  2: "2nd Place",
  3: "3rd Place",
  4: "4th Place",
  5: "5th Place",
  6: "6th Place",
  7: "7th Place",
  8: "8th Place",
  9: "9th Place",
  10: "10th Place",
  11: "11th Place",
  12: "12th Place",
  13: "13th Place",
  14: "14th Place",
  15: "15th Place",
  16: "16th Place",
  17: "17th Place",
  18: "18th Place",
  19: "19th Place",
  20: "20th Place",
  21: "21st Place",
  22: "22nd Place",
  23: "23rd Place",
  24: "24th Place",
  25: "25th Place",
};

export const shortRankLabels = {
  1: "1st",
  2: "2nd",
  3: "3rd",
  4: "4th",
  5: "5th",
  6: "6th",
  7: "7th",
  8: "8th",
  9: "9th",
  10: "10th",
  11: "11th",
  12: "12th",
  13: "13th",
  14: "14th",
  15: "15th",
  16: "16th",
  17: "17th",
  18: "18th",
  19: "19th",
  20: "20th",
  21: "21st",
  22: "22nd",
  23: "23rd",
  24: "24th",
  25: "25th",
};

export const hexToRgb = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const rgb = {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
  return rgb.r.toString() + "," + rgb.g.toString() + "," + rgb.b.toString();
};

export const COLORS = {
  primary: "#1080c3",
  secondary: "#FFD22E", //"#C29E23", //"#C29806", //"#c2bd23",
  third: "#C25023", //"#c22329",
  grey: "#e0e0e0",
  lightgrey: "#f5f5f5",
  darkgrey: "#A9A9A9",
};
//"#FFD22E",
export const COLORS_RGB = {
  primary: hexToRgb(COLORS.primary),
  secondary: hexToRgb(COLORS.secondary),
  third: hexToRgb(COLORS.third),
  grey: hexToRgb(COLORS.grey),
  lightgrey: hexToRgb(COLORS.lightgrey),
  darkgrey: hexToRgb(COLORS.darkgrey),
};
