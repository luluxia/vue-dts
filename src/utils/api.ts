export async function test() {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('go')
      resolve('resolved')
    }, 1000)
  })
  return promise
}