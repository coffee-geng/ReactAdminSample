import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Select, Form } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class AddForm extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired,
    roles: PropTypes.array.isRequired,
    user: PropTypes.object
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

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 8 }
    }
    const { getFieldDecorator } = this.props.form
    let { roles, user } = this.props
    roles = roles || []
    return (
      <Form>
        <FormItem label='用户名' {...formItemLayout}>
          {
            getFieldDecorator('username', {
              initialValue: user.username,
              rules: [
                { required: true, whitespace: true, message: '用户名必须输入' },
                { min: 4, message: '用户名至少4位' },
                { max: 12, message: '用户名最多12位' },
                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' }
              ]
            })(
              <Input placeholder='请输入用户名'></Input>
            )
          }
        </FormItem>
        {
          user._id ? null : (
            <FormItem label='密码' {...formItemLayout}>
              {
                getFieldDecorator('password', {
                  initialValue: '',
                  rules: [
                    { validator: this.validatePwd }
                  ]
                })(
                  <Input type='password' placeholder='请输入密码'></Input>
                )
              }
            </FormItem>
          )
        }
        <FormItem label='手机号' {...formItemLayout}>
          {
            getFieldDecorator('phone', {
              initialValue: user.phone,
              rules: [
                { pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '手机号码必须合法' }
              ]
            })(
              <Input placeholder='请输入手机号'></Input>
            )
          }
        </FormItem>
        <FormItem label='邮箱' {...formItemLayout}>
          {
            getFieldDecorator('email', {
              initialValue: user.email,
              rules: [
                { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '邮箱地址必须合法' }
              ]
            })(
              <Input placeholder='请输入邮箱地址'></Input>
            )
          }
        </FormItem>
        <FormItem label='角色' {...formItemLayout}>
          {
            getFieldDecorator('role_id', {
              initialValue: user.role_id,
              rules: [
                { required: true, message: '必须为用户选择一个角色' },
              ]
            })(
              <Select placeholder='请选择角色'>
                {
                  roles.map((role) => {
                    return <Option value={role._id} key={role._id}>{role.name}</Option>
                  })
                }
              </Select>
            )
          }
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(AddForm)
