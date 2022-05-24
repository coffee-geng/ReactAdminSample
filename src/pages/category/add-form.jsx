import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Input } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

/*
    添加分类的Form组件
*/
class AddForm extends Component {

    static propTypes = {
        setForm: PropTypes.func.isRequired,
        categories: PropTypes.array.isRequired, //一级分类的数组
        parentId: PropTypes.string.isRequired //父分类的ID
    }

    getCategoryNodes = (categories)=>{
        categories = categories || []
        return categories.map(c=>{
            return <Option key={c._id} value={c._id}>{c.name}</Option>
        })
    }

    componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const {categories, parentId} = this.props
        return (
            <Form>
                <FormItem>
                    {
                        getFieldDecorator('parentId', {
                            initialValue: parentId
                        })(
                            <Select>
                                <Option value={'0'}>一级分类</Option>
                                {
                                    this.getCategoryNodes(categories)
                                }
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem>
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: '',
                            rules:[
                                {required:true, message:'分类名称必须输入'}
                            ]
                        })(
                            <Input placeholder='请输入分类名称'></Input>
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(AddForm)
