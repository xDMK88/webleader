export function visitChildren (arr, callback) {
  for (const value of arr) {
    callback(value)
    if (value.children) {
      visitChildren(value.children, callback)
    }
  }
}

export function recursiveRemove (arr, uid) {
  return arr.filter(item => {
    if ('children' in item) {
      item.children = recursiveRemove(item.children, uid)
    }
    return item.uid !== uid
  })
}
