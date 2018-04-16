// export default async(url = '', params = {}, data = {}, method = 'get', timeout = 10000) => {
//   method = method.toLowerCase() // 统一转化为小写
// }
import axios from 'axios'

export const userLogin = (data) => {
  // console.log(data)
  const { userId, password } = data
  axios.post('/user', {
    userId,
    password
  })
    .then(response => {
      console.log('success')
      return response
    })
    .catch(error => {
      console.log('fail')
      return {
        status: 3,
        statusInfo: {
          message: error
        }
      }
    })
}
export const getUserInfo = (userId) => {
  axios.get('/user/' + userId)
    .then((response) => {
      return response
    })
    .catch((error) => {
      return {
        status: 3,
        statusInfo: {
          message: error
        }
      }
    })
}
