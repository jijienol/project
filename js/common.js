// 上面这个代码处理过度动画（默认加上不用管）
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.body.classList.add('sidenav-pinned')
    document.body.classList.add('ready')
  }, 200)
})

axios.defaults.baseURL = 'http://ajax-api.itheima.net'

// toast轻提示
function getToast(msg){
   const toast = new bootstrap.Toast(document.querySelector('#myToast', {
      animation: true,
      autohide: true,
      delay: 3000
    }))
  document.querySelector('.toast-body').innerHTML = msg
      toast.show()
}
// 正则验证用户名和密码
 function verify(ele, reg, msg) {
      const result = reg.test(ele.value)
      const toast = new bootstrap.Toast(document.querySelector('#myToast', {
        animation: true,
        autohide: true,
        delay: 3000
      }))
      if(!result){
        document.querySelector('.toast-body').innerHTML = msg
        toast.show()
      }
      return result
    }
// 显示用户名和退出登录功能
const username = document.querySelector('.media .font-weight-bold')
const logout = document.querySelector('#logout')
// console.log(username)
username ? username.innerHTML = localStorage.getItem('userName') : ''
if (logout) {
  logout.addEventListener('click', function () {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    location.href = './login.html'
  })
}

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = localStorage.getItem('token')
  if(token){
    config.headers.Authorization = token
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response.data;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  if(error.response.status === 401){
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    location.href = './login.html'
  }
  return Promise.reject(error);
});