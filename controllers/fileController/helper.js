function generateSixDigitCode() {
  let randomCode = Math.floor(Math.random() * 1000000);
  let sixDigitCode = randomCode.toString().padStart(6, "0");
  return sixDigitCode;
}

module.exports = {
  generateSixDigitCode,
};