import 'whatwg-fetch';
import { message } from 'antd';
let baseUrl = '/api'
// node env
// if (process.env.NODE_ENV === 'production') {
//     baseUrl = 'http://localhost:5005/api'
// }
baseUrl = 'http://localhost:5005'

const requestApi = ({url, params = {}, methods = 'POST'}) => {
    let requestUrl =  baseUrl + url
    methods = methods.toUpperCase()
    const _url = methods !== 'GET' ? requestUrl : requestUrl+"?"+new URLSearchParams(params);
    const token = localStorage.getItem('token') || ''
    return fetch(_url, (methods !== 'GET' )?{
      method: methods,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: params? JSON.stringify(params) : null
    }:{
      method: methods,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then(res => {
        return res.json()
      })
      .then(res => {
        if(res.error){
          message.error(res.error);
        }else{
          return res;
        }
      }).catch(err => {
          console.log(err);
      })
}

export default requestApi;