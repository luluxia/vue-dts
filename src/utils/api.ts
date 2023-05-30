import axios from 'axios'

export async function get(url: string) {
  let res = await axios.get(`/old/${url}?is_new=1`)
  res = res.data
  return new Promise((resolve, reject) => {
    resolve(res)
  })
}

export async function post(url: string, cmd: {}) {
  let data = cmd
  let res = await axios.post(`/old/${url}?is_new=1`, transRequest(data), {
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
  })
  res = res.data
  return new Promise((resolve, reject) => {
    resolve(res)
  })
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