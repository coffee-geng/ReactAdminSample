import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd';
import { reqWeather } from '../../api'
import {formateDate} from '../../utils/dateUtils'
import weatherList from '../../config/weatherConfig'
import menuList from '../../config/menuConfig'
import LinkButton from '../../components/link-button/link-button'

import './header.less'

import {connect} from 'react-redux'
import {logout, setHeaderTitle} from '../../redux/actions'

class Header extends Component {

  static propTypes = {
    headerTitle: PropTypes.string,
    setHeaderTitle: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
  }

  state = {
    currentTime: formateDate( Date.now()),
    dayPictureUrl: '', //天气图片的url
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
      this.setState({dayPictureUrl: weatherItem.url, weather})
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
        this.props.logout()

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
    const {currentTime, dayPictureUrl, weather} = this.state
    const username = this.props.user.username
    // const title = this.getTitle()
    const title = this.props.headerTitle

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
            <img src={dayPictureUrl} alt="" />
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
    headerTitle: state.headerTitle,
    user: state.currentUser
  }
}

function mapDispatchToProps(dispatch){
  return {
    setHeaderTitle: (title)=>dispatch(setHeaderTitle(title)),
    logout:()=>dispatch(logout())
  }
}

export default connect(
    mapStateToProps, mapDispatchToProps
  )(withRouter(Header))
