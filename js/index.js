if (!localStorage.getItem('token')) {
    location.href = './login.html'
}

window.addEventListener('DOMContentLoaded', async function () {
    const res = await axios.get('/dashboard')
    console.log(res)
    for (let key in res.data.overview) {
        window.document.querySelector(`span[name = ${key}]`).innerHTML = res.data.overview[key]
    }
    const { data: { year } } = res
    const { data: { salaryData } } = res
    console.log(year);
    console.log(salaryData);
    // console.log(year)
    (function renderAllStudentsSalary() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.querySelector('#line'));
        // 指定图表的配置项和数据
        let option = {
            grid: {
                left: '3%',
                right: '3%',
                top: '20%',
                bottom: '3%',
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
    (function renderClassSalary() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.querySelector('#salary'));

        // 指定图表的配置项和数据
        let option = {
            title: {
                text: '班级薪资分布',
                top: 10,
                left: 10,
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

                    data: salaryData.map(({ label, b_count, g_count }) => ({ value: b_count + g_count, name: label })
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
    console.log(res.data.groupData)
    renderGroupSalary(res.data.groupData['1'])
    this.document.querySelector('#btns').addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON') {
            document.querySelector('.btn-blue').classList.remove('btn-blue')
            e.target.classList.add('btn-blue')
            renderGroupSalary(res.data.groupData[e.target.innerHTML])
        }

    });
    // 男女薪资分布
    (function(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.querySelector('#gender'));
        // 指定图表的配置项和数据
        let option = {
            title: [{
                text: '男女薪资分布',
                left: 10,
                top: 10
            }, {
                text: '男',
                textStyle: {
                    fontSize: 14
                },
                left: 'center',
                top: '45%'
            }, {
                text: '女',
                textStyle: {
                    fontSize: 14
                },
                left: 'center',
                bottom: '5%'
            }],
            tooltip: {
                trigger: 'item'
            },
            color: ['#faa22d', '#5b97fd', '#4bbcf9', '#3ed39b'],
            series: [
                {
                    name: '男生薪资分布',
                    type: 'pie',
                    center: ['50%', '25%'],
                    radius: ['15%', '23%'],
                    // data: [
                    //     { value: 1048, name: 'Search Engine' },
                    //     { value: 735, name: 'Direct' },
                    //     { value: 580, name: 'Email' },
                    //     { value: 484, name: 'Union Ads' },
                    // ],
                    data : salaryData.map(item => ({value:item.b_count,name:item.label}))
                },
                {
                    name: '女生薪资分布',
                    type: 'pie',
                    radius: ['15%', '23%'],
                    center: ['50%', '70%'],
                    // data: [
                    //     { value: 1048, name: 'Search Engine' },
                    //     { value: 735, name: 'Direct' },
                    //     { value: 580, name: 'Email' },
                    //     { value: 484, name: 'Union Ads' },
                    // ],
                    data: salaryData.map(item => ({ value: item.g_count, name: item.label }))
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    })()

    // 籍贯处理
    initMapChart(res.data.provinceData)

})

function renderGroupSalary(groupData) {
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.querySelector('#lines'));
    // 指定图表的配置项和数据
    let option = {
        grid: {
            left: '3%',
            right: '3%',
            top: '20%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            // data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月'],
            data : groupData.map(item => item.name),
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
        color: [{
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0, color: '#45d49f' // 0% 处的颜色
            }, {
                offset: 1, color: '#d0f4e6' // 100% 处的颜色
            }],
            global: false // 缺省为 false
        }, {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: '#58a1ee' // 0% 处的颜色
                }, {
                    offset: 1, color: '#d7e8fa' // 100% 处的颜色
                }],
                global: false // 缺省为 false
            }],
        tooltip:{},
        series: [
            {
                name: '期望薪资',
                type: 'bar',
                data: groupData.map(item => item.hope_salary),
            },
            {
                name: '实际薪资',
                type: 'bar',
                data: groupData.map(item => item.salary),

            },
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

// 籍贯渲染
const initMapChart = (provinceData) => {
    const myEchart = echarts.init(document.querySelector('#map'))
    const dataList = [
        { name: '南海诸岛', value: 0 },
        { name: '北京', value: 0 },
        { name: '天津', value: 0 },
        { name: '上海', value: 0 },
        { name: '重庆', value: 0 },
        { name: '河北', value: 0 },
        { name: '河南', value: 0 },
        { name: '云南', value: 0 },
        { name: '辽宁', value: 0 },
        { name: '黑龙江', value: 0 },
        { name: '湖南', value: 0 },
        { name: '安徽', value: 0 },
        { name: '山东', value: 0 },
        { name: '新疆', value: 0 },
        { name: '江苏', value: 0 },
        { name: '浙江', value: 0 },
        { name: '江西', value: 0 },
        { name: '湖北', value: 0 },
        { name: '广西', value: 0 },
        { name: '甘肃', value: 0 },
        { name: '山西', value: 0 },
        { name: '内蒙古', value: 0 },
        { name: '陕西', value: 0 },
        { name: '吉林', value: 0 },
        { name: '福建', value: 0 },
        { name: '贵州', value: 0 },
        { name: '广东', value: 0 },
        { name: '青海', value: 0 },
        { name: '西藏', value: 0 },
        { name: '四川', value: 0 },
        { name: '宁夏', value: 0 },
        { name: '海南', value: 0 },
        { name: '台湾', value: 0 },
        { name: '香港', value: 0 },
        { name: '澳门', value: 0 },
    ]
    dataList.forEach(item => {
        let data = provinceData.find(el => el.name.includes(item.name))
        console.log(data)
        if (data) {
            item.value = data.value
        }
    })
    let option = {
        title: {
            text: '籍贯分布',
            top: 10,
            left: 10,
            textStyle: {
                fontSize: 16,
            },
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} 位学员',
            borderColor: 'transparent',
            backgroundColor: 'rgba(0,0,0,0.5)',
            textStyle: {
                color: '#fff',
            },
        },
        visualMap: {
            min: 0,
            max: 6,
            left: 'left',
            bottom: '20',
            text: ['6', '0'],
            inRange: {
                color: ['#ffffff', '#0075F0'],
            },
            show: true,
            left: 40,
        },
        geo: {
            map: 'china',
            roam: false,
            zoom: 1.0,
            label: {
                normal: {
                    show: true,
                    fontSize: '10',
                    color: 'rgba(0,0,0,0.7)',
                },
            },
            itemStyle: {
                normal: {
                    borderColor: 'rgba(0, 0, 0, 0.2)',
                    color: '#e0ffff',
                },
                emphasis: {
                    areaColor: '#34D39A',
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 20,
                    borderWidth: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
            },
        },
        series: [
            {
                name: '籍贯分布',
                type: 'map',
                geoIndex: 0,
                data: dataList,
            },
        ],
    }
    myEchart.setOption(option)
}
