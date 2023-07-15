const form = document.querySelector('#form')
const modal = new bootstrap.Modal('#modal')

let studentId
// 渲染数据
async function render(){
    const {data} = await axios.get('/students')
    console.log(data)
    document.querySelector('.list').innerHTML = data.map(({age,area,city,createdAt,gender,group,hope_salary,id,name,province,salary,user_id,updatedAt}) => `
         <tr>
                      <td>${name}</td>
                      <td>${age}</td>
                      <td>${gender?'女':'男'}</td>
                      <td>第${group}组</td>
                      <td>${hope_salary}</td>
                      <td>${salary}</td>
                      <td>${province+city+area}</td>
                      <td>
                        <a href="javascript:;" class="text-success mr-3"><i class="bi bi-pen edit" data-id="${id}"></i></a>
                        <a href="javascript:;" class="text-danger"><i class="bi bi-trash delete" data-id="${id}"></i></a>
                      </td>
        </tr>
    `).join('')
    document.querySelector('.total').innerHTML = data.length
}
render()

// 删除和编辑事件
document.querySelector('.list').addEventListener('click',async function(e){
    if(e.target.classList.contains('delete')){
        const data = await axios.delete(`/students/${e.target.dataset.id}`)
        console.log(data)
        render()
    }
    if (e.target.classList.contains('edit')) {
        studentId = e.target.dataset.id
        const modal = new bootstrap.Modal('#modal')
        modal.show()
        document.querySelector('.modal-title').innerHTML = '修改学员'
        const { data } = await axios.get(`/students/${e.target.dataset.id}`)
        console.log(data)
        const keys = Object.keys(serialize(form, { hash: true, empty: true }))
        // console.log(keys)
        Object.keys(data).forEach(async item => {
            if (item === 'gender') {
                document.querySelectorAll('input[name=gender]')[data[item]].checked = true
                return
            }
            if (item === 'province') {
                // document.querySelectorAll('select[name=province] option').forEach(ele => {
                //     // console.log(ele)
                //     if(ele.value === data[item]){
                //         console.log(ele.value)
                //         console.log(data[item])
                //         ele.selected = true
                //     }
                // })
                document.querySelector('select[name=province]').value = data[item]
                return
            }
            if (item === 'city') {
                const { data: res } = await axios.get('/api/city', {
                    params: {
                        pname: data.province
                    }
                })
                // console.log(1111111)
                // console.log(res)
                let cityStr = res.map(item => `<option value="${item}">${item}</option>`).join('')
                document.querySelector('select[name=city]').innerHTML = `<option value="">--城市--</option>` + cityStr
                // document.querySelectorAll('select[name=city] option').forEach(ele => {
                //     // console.log(ele)
                //     if (ele.value === data[item]) {
                //         // console.log(ele.value)
                //         // console.log(data[item])
                //         ele.selected = true
                //     }
                // })
                document.querySelector('select[name=city]').value = data[item]
                return
            }
            if (item === 'area') {
                const { data: areaList } = await axios.get('/api/area', {
                    params: {

                        pname: data.province,
                        cname: data.city
                    }
                })
                // console.log(1111111)
                let areaStr = areaList.map(item => `<option value="${item}">${item}</option>`).join('')
                document.querySelector('select[name=area]').innerHTML = `<option value="">--区--</option>` + areaStr
                // document.querySelectorAll('select[name=area] option').forEach(ele => {
                //     // console.log(ele)
                //     if (ele.value === data[item]) {
                //         // console.log(ele.value)
                //         // console.log(data[item])
                //         ele.selected = true
                //     }
                // })
                document.querySelector('select[name=area]').value = data[item]
                return
            }
            // if (item === 'updatedAt' || item === 'createdAt' || item ==='id' || item === 'user_id'){
            //     return
            // }
            if (keys.some(keyItem => item === keyItem)) {
                // console.log(item)
                // console.log(`input[name=${item}]`)
                // console.log(document.querySelector(`input[name=${item}]`))
                document.querySelector(`input[name=${item}]`).value = data[item]
            }
        })
    }
})

// 添加按钮显示模态框
document.querySelector('#openModal').addEventListener('click',function(){
    modal.show()
    document.querySelector('.modal-title').innerHTML = '添加学员'
    form.reset()
})
// 点击确定按钮提交或修改数据
document.querySelector('#submit').addEventListener('click',async function(){
    const data =  serialize(form,{hash:true,empty:true})
    console.log(data)

    data.age = +data.age
    data.gender = +data.gender
    data.hope_salary = +data.hope_salary
    data.salary = +data.salary
    data.group = +data.group
    // 添加学生数据
    if (document.querySelector('.modal-title').innerHTML === '添加学员'){
       try {
           const res = await axios.post(`/students/`, data)
           console.log(res)
           render()
       } catch (error) {
        console.log(error)
       }finally{
           modal.hide()
       }
    }
    // 修改学生数据
    if (document.querySelector('.modal-title').innerHTML === '修改学员') {
        try {
            const res = await axios.put(`/students/${studentId}`, data)
            render()
            console.log(res)
        } catch (error) {
            console.log(error)
        }finally{
            // modal.hide()
            document.querySelector('.btn-close').click()
        }
    }
})
// 点击模态框取消按钮
document.querySelector('.btn-secondary').addEventListener('click',function(){
        const modal = new bootstrap.Modal('#modal')
        console.log(modal)
})
// 点击右上角x隐藏模态框
document.querySelector('.btn-close').addEventListener('click',function(){
    modal.hide()
})

// 获取省份
async function renderProvince(){
    const data = await axios.get('/api/province')
    console.log(data)
    document.querySelector('select[name=province]').innerHTML
    const provinceStr = data.data.map(item => `
        <option value="${item}">${item}</option>
    `).join('')
    document.querySelector('select[name=province]').innerHTML = `<option value="">--省份--</option>` + provinceStr
}
renderProvince()
// 给省份添加change事件,并渲染市
document.querySelector('select[name=province]').addEventListener('change',async function(e){
        const data = await axios.get('/api/city',{
            params : {
                pname : this.value
            }
        })
        // console.log(data)
        let cityStr = data.data.map(item => `<option value="${item}">${item}</option>`).join('')
        document.querySelector('select[name=city]').innerHTML = `<option value="">--城市--</option>` + cityStr
        document.querySelector('select[name=area]').innerHTML = `<option value="">--区--</option>`
})
// 给城市添加change事件渲染地区
document.querySelector('select[name=city]').addEventListener('change',async function(){
    const areaData = await axios.get('/api/area',{
        params : {
            pname: document.querySelector('select[name=province]').value,
            cname : this.value
        }
    })
    console.log(areaData)
    let areaStr = areaData.data.map(item => `<option value="${item}">${item}</option>`).join('')
    // console.log(areaStr)
    document.querySelector('select[name=area]').innerHTML = `<option value="">--区--</option>` + areaStr
})
// github