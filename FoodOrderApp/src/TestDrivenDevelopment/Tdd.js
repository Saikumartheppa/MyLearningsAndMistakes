// abc -> false
// aba - false
// "" - null
// no input -> null
// null -> null
// single letter is always true
// 121 -> true
// -121 -> false
// "  aba  " -> true
// length > 10 return null

const isPalindrome = (str) => {
  if (!str) return null;
  if (str.length === 1) return true;
  if (typeof str === "string" && str.length >= 10) {
    return false;
  }
  if (typeof str === "number" && str.toString().length >= 10) {
    return false;
  }

  const reverse = str.toString().trim().split("").reverse().join("")

  

  return reverse === str.toString().trim()


};

console.log("reverse", isPalindrome("   aba  "))
module.exports = isPalindrome;
