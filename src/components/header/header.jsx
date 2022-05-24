import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd';
import { reqWeather } from '../../api'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import weatherList from '../../config/weatherConfig'
import menuList from '../../config/menuConfig'
import LinkButton from '../../components/link-button/link-button'

import './header.less'
import storageUtils from '../../utils/storageUtils';

class Header extends Component {

  state = {
    currentTime: formateDate( Date.now()),
    daayPictureUrl: '', //天气图片的url
    weather: '' //天气的文本
  }

  getTime = ()=>{
    this.intervalId = setInterval(()=>{
      this.setState({currentTime: formateDate(Date.now())})
    }, 1000)
  }

  getWeather = async ()=>{
    const { adcode, weather } = await reqWeather('北京')
    const weatherItem = weatherList.find(itm=>itm.name === weather)
    if(!!weatherItem)
    {
      this.setState({daayPictureUrl: weatherItem.url, weather})
    }
  }

  getTitle = ()=>{
    const path = this.props.location.pathname
    let title
    menuList.forEach(item =>{
      if (path.indexOf(item.key) === 0){
        title = item.title
      }
      else if (item.children){
        const cItem = item.children.find(cItem=>path.indexOf(cItem.key) === 0)
        if (cItem){
          title = cItem.title
        }
      }
    })
    return title
  }

  logout = ()=>{
    Modal.confirm({
      title: '确定退出吗？',
      content:'确定退出吗？',
      onOk:()=>{
        memoryUtils.user = {}
        storageUtils.removeUser()

        this.props.history.replace('/login')
      }
    })
  }

  componentDidMount(){
    this.getTime()
    this.getWeather()
  }

  componentWillUnmount(){
    clearInterval(this.intervalId)
  }

  render() {
    const {currentTime, daayPictureUrl, weather} = this.state
    const username = memoryUtils.user.username
    const title = this.getTitle()

    return (
      <div className='header'>
        <div className='header-top'>
          <span>{username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>
            {title}
          </div>
          <div className='header-bottom-right'>
            <span>{currentTime}</span>
            <img src={daayPictureUrl} alt="" />
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
