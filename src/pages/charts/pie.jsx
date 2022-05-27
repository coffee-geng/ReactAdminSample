import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react'
import { Card, Button } from 'antd'

export default class Pie extends Component {

state = {
  adClicks: [335, 310, 234, 135, 1548]
}

getOption = () => {
  let ads = [
    {value:0, name:'直接访问'},
    {value:0, name:'邮件营销'},
    {value:0, name:'联盟广告'},
    {value:0, name:'视频广告'},
    {value:0, name:'搜索引擎'}
  ]
  const {adClicks} = this.state
  ads = ads.map((ad, idx)=>{
    return {value:adClicks[idx], name:ad.name}
  })

  return {
    title : {
      text: '某站点用户访问来源',
      subtext: '纯属虚构',
      x:'center'
    },
    tooltip : {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    },
    series : [
      {
        name: '访问来源',
        type: 'pie',
        radius : '55%',
        center: ['50%', '60%'],
        data:ads,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
}

getOption2 = () => {
  let ads = [
    {value:0, name:'直接访问'},
    {value:0, name:'邮件营销'},
    {value:0, name:'联盟广告'},
    {value:0, name:'视频广告'},
    {value:0, name:'搜索引擎'}
  ]
  const {adClicks} = this.state
  ads = ads.map((ad, idx)=>{
    return {value:adClicks[idx], name:ad.name}
  })

  return {
    backgroundColor: '#2c343c',

    title: {
      text: 'Customized Pie',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#ccc'
      }
    },

    tooltip : {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },

    visualMap: {
      show: false,
      min: 80,
      max: 600,
      inRange: {
        colorLightness: [0, 1]
      }
    },
    series : [
      {
        name:'访问来源',
        type:'pie',
        radius : '55%',
        center: ['50%', '50%'],
        data:ads.sort(function (a, b) { return a.value - b.value; }),
        roseType: 'radius',
        label: {
          normal: {
            textStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            }
          }
        },
        labelLine: {
          normal: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            },
            smooth: 0.2,
            length: 10,
            length2: 20
          }
        },
        itemStyle: {
          normal: {
            color: '#c23531',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },

        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      }
    ]
  };
}

  update = ()=>{
    this.setState(state=>({
      adClicks: state.adClicks.map(clicks=>clicks+10),
    }))
  }

  render() {
    const {sales, stocks} = this.state
console.log('render')
    return (
      <div>
        <Card>
          <Button type='primary' onClick={this.update}>更新</Button>
        </Card>
        <Card title='饼图一'>
          <ReactEcharts option={this.getOption()} style={{height: 300}}/>
        </Card>
        <Card title='饼图二'>
          <ReactEcharts option={this.getOption2()} style={{height: 300}}/>
        </Card>
      </div>
    )
  }
}
