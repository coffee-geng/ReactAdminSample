import React, { Component } from 'react'

import { Card, Table, Button, Modal, message } from 'antd'
import { formateDate } from '../../utils/dateUtils'
import { PAGE_SIZE } from '../../config/constant'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import AddForm from './add-form'
import AuthForm from './auth-form'
import storageUtils from '../../utils/storageUtils'

export default class Role extends Component {

  state = {
    roles: [], //所有角色的列表
    selectedRole: {}, //选中的角色
    isShowAddForm: false,
    isShowAuthForm: false
  }

  authFormRef = React.createRef()

  getRoles = async () => {
    const result = await reqRoles()
    if (result.status === 0) {
      this.setState({ roles: result.data })
    }
  }

  initColumns = () => {
    this.columns = [
      { title: '角色名称', dataIndex: 'name' },
      { title: '创建时间', dataIndex: 'create_time', render: (createdTime) => { return formateDate(createdTime) } },
      { title: '授权时间', dataIndex: 'auth_time', render: (authTime) => { return formateDate(authTime) } },
      { title: '授权人', dataIndex: 'auth_name' }
    ]
  }

  onSelectRow = (role, index) => {
    return {
      onClick: event => { //点击行
        console.log('点击行', role.name)
        this.setState({ selectedRole: role })
      }
    }
  }

  showAddRole = () => {
    this.setState({ isShowAddForm: true })
  }

  showUpdateRole = () => {
    this.setState({ isShowAuthForm: true })
  }

  addRole = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({ isShowAddForm: false })

        const result = await reqAddRole(values['name'])
        this.form.resetFields()

        if (result.status === 0) {
          message.success('添加角色成功')
          const role = result.data
          this.setState((state) => {
            return { roles: [...state.roles, role] }
          })
        }
        else {
          message.error('添加角色失败')
        }
      }
    })
  }

  updateRole = async ()=>{
    const menus = this.authFormRef.current.getMenus()
    const {selectedRole} = this.state
    selectedRole.menus = menus
    selectedRole.auth_time = Date.now()
    selectedRole.auth_name = memoryUtils.user.username
    const result = await reqUpdateRole(selectedRole)
    if (result.status === 0){
      //如果是对当前用户所属权限进行设置，则需强制退出登录
      if (selectedRole._id === memoryUtils.user.role_id){
        message.success('当前登录用户的角色权限被修改了，系统将强制退出登录！')
        memoryUtils.user = null
        storageUtils.removeUser()
        this.props.history.replace('/login')
      }
      else{
      message.success('更新角色权限成功')
      }
    }
    else{
      message.error('更新角色权限失败')
    }

    this.setState({isShowAuthForm: false})
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getRoles()
  }

  render() {
    const { roles, selectedRole, isShowAddForm, isShowAuthForm } = this.state

    const title = (
      <span>
        <Button type='primary' onClick={this.showAddRole}>创建角色</Button>&nbsp;&nbsp;
        <Button type='primary' disabled={!selectedRole._id} onClick={this.showUpdateRole}>设置角色权限</Button>
      </span>
    )

    return (
      <Card title={title}>
        <Table bordered type='radio'
          dataSource={roles} columns={this.columns}
          rowSelection={{ 
            type: 'radio', 
            selectedRowKeys: [selectedRole._id],
            onSelect: (role)=>{
              this.setState({selectedRole: role})
            }
           }}
          pagination={{ defaultPageSize: PAGE_SIZE }}
          rowKey='_id'
          onRow={this.onSelectRow}
        />
        <Modal title='添加角色' visible={isShowAddForm}
          onOk={this.addRole} onCancel={() => {
            this.form.resetFields()
            this.setState({ isShowAddForm: false, isShowAuthForm: false })
          }}>
          <AddForm setForm={form => this.form = form} />
        </Modal>
        <Modal title='设置角色权限' visible={isShowAuthForm}
          onOk={this.updateRole} onCancel={() => { this.setState({ isShowAuthForm: false }) }}>
          <AuthForm role={selectedRole} ref={this.authFormRef}/>
        </Modal>
      </Card>
    )
  }
}
