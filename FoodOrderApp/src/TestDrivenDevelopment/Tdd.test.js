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

const isPalindrome = require("./Tdd");

test(" abc -> false ", () => {
  const result = isPalindrome("abc");
  expect(result).toBe(false);
});

test(" aba -> true ", () => {
  const result = isPalindrome("aba");
  expect(result).toBe(true);
});

test(" no input -> null ", () => {
  const result = isPalindrome();
  expect(result).toBeNull();
  const result2 = isPalindrome("");
  expect(result).toBeNull();
});


test(" null -> null ", () => {
  const result = isPalindrome(null);
  expect(result).toBeNull();
});

test(" single letter -> true ", () => {
  const result = isPalindrome("a");
  expect(result).toBe(true);
});

test(" 121 letter -> true ", () => {
  const result = isPalindrome(121);
  expect(result).toBe(true);
});

test(" -121 letter -> true ", () => {
  const result = isPalindrome(-121);
  expect(result).toBe(false);
});

test(" dnskndkjansdknaskjdnaksndadas letter -> false ", () => {
  const result = isPalindrome("asnkfnsdknfkdsnfkjsdnfkjadfkjadnfksndkfjndkdskfnask");
  expect(result).toBe(false);
});

test(" `.  aba.    ` -> true ", () => {
  const result = isPalindrome("     aba     ");
  expect(result).toBe(true);
});


