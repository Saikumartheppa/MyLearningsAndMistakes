import { sum } from "../components/Sum";

// test -> it takes two arguemnts 1) string name of the test and 2) the callback function

test("should the sum is correct", ()=> {
    // Assertion
    expect(sum(1,1)).toBe(2)
})