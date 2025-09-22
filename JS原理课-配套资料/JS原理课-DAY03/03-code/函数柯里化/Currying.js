// function sum(a) {
//     return function (b) {
//         return function (c) {
//             return a + b + c
//         }
//     }
// }

// sum(1)(2)(3)

// let nums = []
// function sum(...args) {
//     nums.push(...args)
//     if (nums.length >= 5) {
//         const res = nums.slice(0, 5).reduce((p, v) => p + v, 0)
//         nums = []
//         return res
//     } else {
//         return sum
//     }
// }

// function sumMaker(length) {
//     let nums = []
//     function sum(...args) {
//         nums.push(...args)
//         if (nums.length >= length) {
//             const res = nums.slice(0, length).reduce((p, v) => p + v, 0)
//             nums = []
//             return res
//         } else {
//             return sum
//         }
//     }
//     return sum
// }

// const typeOfTest = function (type) {
//     function isUndefined(thing) {
//         return typeof thing === type
//     }
//     return isUndefined
// }
const typeOfTest =type => thing => typeof thing === type
const isUndefined = typeOfTest('string')

console.log(isUndefined('123'));
