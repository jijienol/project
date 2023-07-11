// 上面这个代码处理过度动画（默认加上不用管）
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.body.classList.add('sidenav-pinned')
    document.body.classList.add('ready')
  }, 200)
})
function getToast(msg){
   const toast = new bootstrap.Toast(document.querySelector('#myToast', {
      animation: true,
      autohide: true,
      delay: 3000
    }))
  document.querySelector('.toast-body').innerHTML = msg
      toast.show()
}
axios.defaults.baseURL = 'http://ajax-api.itheima.net'