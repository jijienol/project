if (!localStorage.getItem('token')) {
    location.href = './login.html'
}

window.addEventListener('DOMContentLoaded', async function () {
    const res = await axios.get('/dashboard')
    console.log(res)
    for (let key in res.data.overview) {
        window.document.querySelector(`span[name = ${key}]`).innerHTML = res.data.overview[key]
    }
    const {data : {year}} = res
    const {data : {salaryData}} = res
    console.log(year);
    console.log(salaryData);
    // console.log(year)
    (function renderAllStudentsSalary() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.querySelector('#line'));
        // 指定图表的配置项和数据
        let option = {
            grid:{
                left : '3%',
                right : '3%',
                top : '20%',
                bottom : '3%',
                containLabel: true
            },
            title: {
                text: '2023年全学科薪资走势',
                textStyle: {
                    fontSize: 16
                },
                left: 20,
                top: 6
            },
            xAxis: {
                type: 'category',
                data: year.map(item => item.month),
                axisLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#ccc',
                    }
                },
                axisLabel: {
                    color: '#3c3c3c'
                }
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                }
            },
            series: [
                {
                    data: year.map(item => item.salary),
                    type: 'line',
                    smooth: true,
                    lineStyle: {
                        width: 8,
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 0,
                            colorStops: [{
                                offset: 0, color: '#5cadfe' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#6d81fd' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        },
                    },
                    symbolSize: 12,
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#91c9fe' // 0% 处的颜色
                            }, {
                                offset: .8, color: 'white' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        }
                    }
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    })();
    (function(){
        // let one =  salaryData.map(item => { 1, 1 })
        let one = salaryData.map(function ({ label, b_count }) {
            return { label, b_count }
        })
        console.log(one)
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.querySelector('#salary'));

        // 指定图表的配置项和数据
        let option = {
            title: {
                text: '班级薪资分布',
                top:10,
                left:10,
                fontStyle: {
                    fontSize: 14
                },
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                bottom: '5%',
                left: 'center'
            },
            series: [
                {
                    name: '班级薪资分布',
                    type: 'pie',
                    radius: ['40%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: false,
                            fontSize: 40,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    color: ['#faa22d', '#5b97fd', '#4bbcf9', '#3ed39b'],

                    data: salaryData.map(({label,b_count,g_count}) =>({value:b_count+g_count,name:label})
)

                    // data: [
                    //     { value: 1048, name: 'Search Engine' },
                    //     { value: 735, name: 'Direct' },
                    //     { value: 580, name: 'Email' },
                    //     { value: 484, name: 'Union Ads' },
                    // ]
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    })();
})