import React, { Component } from 'react'

import { Card, Table, Button, Modal, message } from 'antd'
import LinkButton from '../../components/link-button/link-button'
import AddForm from './add-form'
import { reqAddOrUpdateUser, reqAddUser, reqDeleteUser, reqUsers } from '../../api'
import { PAGE_SIZE } from '../../config/constant'
import { formateDate } from '../../utils/dateUtils'

export default class User extends Component {
  state = {
    users: [],
    roles:[],
    isShow: false, //是否显示添加或更改用户的确认框
    isLoading: false
  }

  addOrUpdateUser = () => {
    this.form.validateFields(async (err, values)=>{
      if (!err){
        const user = {
          username: values['username'],
          password: values['password'],
          phone: values['phone'],
          email: values['email'],
          role_id: values['role_id'],
          create_time: Date.now()
        }
        if (this.user){
          user._id = this.user._id
        }
        const result = await reqAddOrUpdateUser(user)
        this.form.resetFields()
        this.setState({isShow: false})
        if (result.status === 0){
          message.success('添加用户成功')
          this.getUsers()
        }
        else{
          message.error('添加用户失败')
        }
      }
    })
  }

  deleteUser = (user) => {
    Modal.confirm({
      title: `是否要删除名为${user.name}的用户`,
      onOk: async () => {
        const result = await reqDeleteUser(user)
        if (result.status === 0) {
          message.success('删除用户成功')
          this.getUsers()
        }
        else {
          message.error('删除用户失败')
        }
      }
    })
  }

  showUpdateUser = (user)=>{
    this.user = user
    this.setState({ isShow: true })
  }

  showAddUser = ()=>{
    this.user = null
    this.setState({ isShow: true })
  }

  getUsers = async () => {
    this.setState({ isLoading: true })
    const result = await reqUsers()
    this.setState({ isLoading: false })
    if (result.status === 0) {
      message.success('获取用户列表成功')
      this.initRoleNames(result.data.roles)
      this.setState({
        users: result.data.users,
        roles: result.data.roles
      })
    }
    else {
      message.error('获取用户列表失败')
    }
  }

  initColumns() {
    this.columns = [
      { title: '用户名', dataIndex: 'username' },
      { title: '邮箱', dataIndex: 'email' },
      { title: '电话', dataIndex: 'phone' },
      { title: '注册时间', dataIndex: 'create_time', render: formateDate },
      {
        title: '所属角色', dataIndex: 'role_id', render: (role_id) => {
          const myRole = this.roleNames[role_id] | {}
          return myRole.name
        }
      },
      {
        title: '操作', render: (user) => {
          return (<span>
            <LinkButton onClick={()=>this.showUpdateUser(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>)
        }
      }
    ]
  }

  initRoleNames(roles) {
    if (roles) {
      const roleNames = roles.reduce((prev, role) => {
        if (!prev.hasOwnProperty(role._id)) {
          prev[role._id] = role.name
        }
        return prev
      }, {})
      this.roleNames = roleNames || {}
    }
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getUsers()
  }

  render() {
    const { isShow, isLoading, users, roles } = this.state
    const user = this.user || {}
    const title = (
      <Button type='primary' onClick={this.showAddUser}>添加用户</Button>
    )
    return (
      <Card title={title}>
        <Table bordered rowKey='_id' loading={isLoading}
          dataSource={users} columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
        />
        <Modal title={user._id ? '修改用户' : '添加用户'} visible={isShow}
          onOk={this.addOrUpdateUser} onCancel={
            () => {
              this.user = null
              this.form.resetFields()
              this.setState({ isShow: false })
            }
            }>
          <AddForm setForm={form=>this.form = form} roles={roles} user={user}/>
        </Modal>
      </Card>
    )
  }
}
