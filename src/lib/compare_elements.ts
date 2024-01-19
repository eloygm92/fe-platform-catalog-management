export default function compare_elements(obj1, obj2) {
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
  } else if (typeof obj1 === 'object' && typeof obj2 === 'object') {
  } else return obj1 === obj2

  const entries1 = Object.entries(obj1)
  const entries2 = Object.entries(obj2)

  if (entries1.length !== entries2.length) return false

  for (const [key1, value1] of entries1) {
    if (!obj2.hasOwnProperty(key1)) return false
    if (!compare_elements(value1, obj2[key1])) return false
  }

  return true
}
