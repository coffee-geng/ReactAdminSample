import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Form, Input, Icon, Button, message } from 'antd'

import {reqLogin} from '../../api'
import storageUtils from '../../utils/storageUtils'

import './login.less'
import logo from '../../assets/images/logo.png'
import { Redirect } from 'react-router-dom'
import { loginAsync } from '../../redux/actions'

const FormItem = Form.Item

class Login extends Component {

    handleSubmit = (event)=>{
        event.preventDefault()
        const form = this.props.form

        form.validateFields(async (err, values)=>{
            if (!err){
                const {username, password} = values
                this.props.loginAsync(username, password)                
            }
        })
    }

    validatePwd = (rule, value, callback)=>{
        if (!value){
            callback('密码必须输入')
        }
        else if (value.length < 4){
            callback('密码长度不能小于4')
        }
        else if (value.length > 12){
            callback('密码长度不能大于12')
        }
        else if (!/^[a-zA-Z0-9_]+$/.test(value)){
            callback('密码必须是英文、数字或下划线组成')
        }
        else{
            callback()
        }
    }

    componentDidUpdate(){
        const user = this.props.user
        if (user && user._id){
            message.success('登录成功')
        }
    }

  render() {
    //如果用户已经登录，自动跳转到管理页面
    const user = this.props.user
    if (user && user._id){
        return <Redirect to='/' />
    }

      const form = this.props.form
      const {getFieldDecorator} = form
    return (
      <div className='login'>
          <header className='login-header'>
            <img src={logo} alt='logo' />
            <h1>React项目：后台管理系统</h1>
          </header>
          <section className='login-content'>
              <div className={user.errorMsg ? 'error-message show' : 'error-message'}>{user.errorMsg}</div>
              <h2>用户登陆</h2>
              <Form className='login-form' onSubmit={this.handleSubmit}>
                  <FormItem>
                      {
                          getFieldDecorator('username', {
                              rules: [
                                  {required: true, whitespace: true, message: '用户名必须输入'},
                                  { min: 4, message: '用户名至少4位' },
                                  { max: 12, message: '用户名最多12位' },
                                  {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成'}
                              ]
                          })(<Input prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                          type='text' placeholder='用户名' />)
                      }
                  </FormItem>
                  <FormItem>
                      {
                          getFieldDecorator('password', {
                              rules: [
                                  {
                                      validator: this.validatePwd
                                  }
                              ]
                          })(<Input prefix={<Icon type='lock' style={{color: 'rgba(0,0,0,.25)'}} />} 
                          type='password' placeholder='密码' />)
                      }
                  </FormItem>
                  <FormItem>
                      <Button type='primary' htmlType='submit' className='login-form-button'>Log in</Button>
                  </FormItem>
              </Form>
          </section>
      </div>
    )
  }
}

const WrapLogin = Form.create()(Login)
export default connect(
    state=>({user: state.currentUser}),
    {loginAsync}
)(WrapLogin)
