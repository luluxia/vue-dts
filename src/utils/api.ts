import axios from 'axios'

export async function test() {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('go')
      resolve('resolved')
    }, 1000)
  })
  return promise
}

export async function command(cmd: {}) {
  let data = cmd
  let res = await axios.post('/old/command.php', transRequest(data), {
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
  })
  res = res.data
  return new Promise((resolve, reject) => {
    resolve(res)
  })
}

function transRequest(data: {[key: string]: string}) {
  let str = ''
  for (let key in data) {
    str += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&'
  }
  return str
}