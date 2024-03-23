import requestApi from "./request";
export function registerUser(params){
  return requestApi({
    url: '/user/auth/register',
    params
  })
}

export function loginUser(params){
  return requestApi({
    url: '/user/auth/login',
    params
  })
}

export function logout(){
  return requestApi({
    url: '/user/auth/logout'
  })
}