if(!localStorage.getItem('token')){
    location.href = './login.html'
}

window.addEventListener('DOMContentLoaded',async function(){
    const res = await axios.get('/dashboard')
    console.log(res)
})