

function test(arr = []) {

  for (let i = 0; i < arr.length; i++) {
    let min = arr[i]
    let greaterArr = []
    for (let j = i + 1; j < arr.length; j++) {
      if (min < arr[j]) {
        greaterArr.push(arr[j])
      }
    }

    for (let i = 0; i < greaterArr.length; i++) {
      let max = arr[i]
      for (let j = i + 1; j < greaterArr.length; j++) {
        if (max > greaterArr[j] && min < greaterArr[j]) {
          return true
        }
      }
    }
  }
  return false
}

const ret = test([1, 3, 4, 5, -1, 7])
console.log(ret)