if(!localStorage.getItem('token')){
    location.href = './login.html'
}
const username = document.querySelector('.media .font-weight-bold')
const logout = document.querySelector('#logout')
// console.log(username)
username ? username.innerHTML = localStorage.getItem('userName') : ''
if(logout) {
    logout.addEventListener('click',function(){
        localStorage.removeItem('token')
        localStorage.removeItem('userName')
        location.href = './login.html'
    })
}