import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

import { Menu, Icon } from 'antd';

import menuConfig from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils';

import logo from '../../assets/images/logo.png'
import './left-nav.less'

const SubMenu = Menu.SubMenu

class LeftNav extends Component {

  hasPrivilege(menuItem) {
    const currentUser = memoryUtils.user || {}
    const currentRole = currentUser.role
    if (!currentRole) {
      return false
    }
    else {
      if (currentUser.username === 'admin') {
        return true
      }
      else if (menuItem.isPublic) {
        return true
      }
      else if (currentRole.menus.indexOf(menuItem.key) !== -1) {
        return true
      }
      else if (menuItem.children) {
        const cItem = menuItem.children.find(c => currentRole.menus.indexOf(c.key) !== -1)
        return !!cItem
      }
      else {
        return false
      }
    }
  }

  getMenuNodes_map(menuList) {
    const path = this.props.location.pathname
    return menuList.map((item) => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      }
      else {
        //查找一个与当前请求路径匹配的子Item，如果存在，说明当前item需要被展开用于显示匹配的子Item，则当前这个Item的key就是OpenKey

        const cItem = item.children.find(cItm => path.indexOf(cItm.key) === 0)
        if (!!cItem) {
          this.openKey = item.key
        }

        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {
              this.getMenuNodes_map(item.children)
            }
          </SubMenu>
        )
      }
    })
  }

  getMenuNodes_reduce(menuList) {
    const path = this.props.location.pathname

    return menuList.reduce((pre, item) => {
      if (this.hasPrivilege(item))
      {
        if (!item.children) {
          pre.push(
            (
              <Menu.Item key={item.key}>
                <Link to={item.key}>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </Link>
              </Menu.Item>
            )
          )
        }
        else {
          //查找一个与当前请求路径匹配的子Item，如果存在，说明当前item需要被展开用于显示匹配的子Item，则当前这个Item的key就是OpenKey
          const cItem = item.children.find(cItm => path.indexOf(cItm.key) === 0)
          if (!!cItem) {
            this.openKey = item.key
          }

          pre.push(
            (
              <SubMenu
                key={item.key}
                title={
                  <span>
                    <Icon type={item.icon} />
                    <span>{item.title}</span>
                  </span>
                }
              >
                {
                  this.getMenuNodes_reduce(item.children)
                }
              </SubMenu>
            )
          )
        }
      }
      return pre
    }, [])
  }

  componentWillMount() {
    this.menuNodes = this.getMenuNodes_reduce(menuConfig)
  }

  render() {
    //得到当前请求的路由路径
    let path = this.props.location.pathname
    //将当前请求路径与菜单及其子菜单的key进行逐个匹配（是否startWith），如果有匹配项，则将其高亮，即将path设置为此菜单项的key
    let matchMenuItemKey = ''
    menuConfig.find(menuItm => {
      if (menuItm.children) {
        const result = menuItm.children.find(subMenuItm => {
          const b = path.indexOf(subMenuItm.key) === 0
          if (b) {
            matchMenuItemKey = subMenuItm.key
          }
          return b
        })
        return !!result
      }
      else {
        const b = path.indexOf(menuItm.key) === 0
        if (b) {
          matchMenuItemKey = menuItm.key
        }
        return b
      }
    })
    if (matchMenuItemKey) {
      path = matchMenuItemKey
    }
    const openKey = this.openKey
    return (
      <div>
        <Link to='/' className='left-nav'>
          <header className='left-nav-header'>
            <img src={logo} alt='logo' />
            <h1>硅谷后台</h1>
          </header>
        </Link>
        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
        >
          {
            this.menuNodes
          }
        </Menu>
      </div>
    )
  }
}

export default withRouter(LeftNav)
