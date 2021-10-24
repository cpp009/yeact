


var nextGreaterElement = function(nums1, nums2) {

  let ret = new Array(nums1.length)
for (let i = 0; i < nums1.length; i++) {
    let idx = nums2.indexOf(nums1[i])
    let found = null
    for (let j = idx + 1; j < nums2.length; j++) {
      if (nums2[j] > nums1[i]) {
        found = nums2[j]
        break
      }
    }
    ret[i] = found === null ? -1 : found
  }
  
  return ret
};


var nextGreaterElement1 = function(nums1, nums2) {

  let ret = new Array(nums1.length)
  let m = {}

  for (let i = 0; i < nums2.length; i++) {
    m[nums2[i]] = i
  }
  console.log(m)

  for (let i = 0; i < nums1.length; i++) {
    let idx = m[nums1[i] + '']
    let s = []
    for (let j = nums2.length - 1; j >= idx; j--) {
      while(s.length !== 0 && s[s.length - 1] < nums2[j]) {
        s.pop()
      }
      ret[i] = s.length === 0 ? -1 : s[s.length - 1]
      s.push(nums2[j])
    }
  }
  return ret
}

var nextGreaterElement2 = function(nums1, nums2) {

  const ret = []
  const m =  new Map()
  const s = []
  for (let i = nums2.length - 1; i >= 0; i--) {
    while(s.length && s[s.length - 1] < nums2[i]) {
      s.pop()
    }
    ret[i] = s.length ? s[s.length - 1] : -1
    s.push(nums2[i])
  }

  ret.forEach((val, idx) => m.set(nums2[idx], val))
  return  nums1.map(val => m.get(val))
}


var nextGreaterElement2 = function(nums1, nums2) {
  const s = []
  const m = new Map() 
  nums2.forEach(val => {
    while(s.length && val > s[s.length - 1]) {
      m.set(s.pop(), val)
    }
    s.push(val)
  })
  s.forEach(val => m.set(val, -1))
  return nums1.map(val => m.get(val))
}


const ret = nextGreaterElement2([4,1,2], [1,3,4,2])
console.log(ret)
