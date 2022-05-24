import React, { Component } from 'react'
import { Card, Form, Input, Cascader, Upload, Button, Icon, message } from 'antd'
import LinkButton from '../../components/link-button/link-button'
import PicturesWall from './pictures-wall'
import RichTextBox from './rich-text-editor'

import { reqCategories, reqAddOrUpdateProduct } from '../../api'

const FormItem = Form.Item
const { TextArea } = Input

class ProductAddOrUpdate extends Component {

  state = {
    options: []
  }

  pictureWrapRef = React.createRef()
  richtextboxRef = React.createRef()

  /*
   异步获取一级/二级分类列表
  */
  getCategories = async (parentId) => {
    const result = await reqCategories(parentId)
    if (result.status === 0) {
      const categories = result.data
      if (parentId === '0') //获取一级分类
      {
        this.initOptions(categories)
      }
      else { //获取二级分类
        return categories
      }
    }
  }

  initOptions = async (categories) => {
    const options = categories.map(c => {
      return {
        value: c._id,
        label: c.name,
        isLeaf: false
      }
    })
    const { isUpdate, product } = this
    const { pCategoryId, categoryId } = product
    if (isUpdate && pCategoryId != '0') { //更新产品且其当前有二级分类
      const targetOption = options.find(opt => opt.value === pCategoryId)
      const subCategories = await this.getCategories(pCategoryId)
      if (subCategories && subCategories.length > 0) {
        const subOptions = subCategories.map(c => ({
          value: c._id,
          label: c.name,
          isLeaf: true
        }))
        targetOption.children = subOptions
      }
    }
    this.setState({ options })
  }

  submit = (e) => {
    e.preventDefault()

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const pictureWrap = this.pictureWrapRef.current
        const richtextbox = this.richtextboxRef.current
        //收集表单数据
        const {name, desc, price, categoryIds} = values
        let pCategoryId, categoryId
        if (categoryIds.length === 1){
          pCategoryId = '0'
          categoryId = categoryIds[0]
        }
        else{
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        const imgs = pictureWrap.getImgs()
        const detail = richtextbox.getHtmlDoc()

        const product = {name, desc, price, pCategoryId, categoryId, imgs, detail}
        if (this.isUpdate){ //更新操作才需要添加_id
          product._id = this.product._id
        }

        //通过调用接口函数请求去添加/更新
        const result = await reqAddOrUpdateProduct(product)
        if (result.status === 0){
          message.success(`${this.isUpdate ? '更新' : '添加'}产品成功`)
          this.props.history.goBack()
        }
        else{
          message.error(`${this.isUpdate ? '更新' : '添加'}产品失败`)
        }
      }
    })
  }

  validatePrice = (rule, value, callback) => {
    if (value * 1 > 0) {
      callback()
    }
    else {
      callback('商品价格必须大于0')
    }
  }

  loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    // 根据选中的分类，请求获取二级分类
    const subCategories = await this.getCategories(targetOption.value)
    targetOption.loading = false
    if (subCategories && subCategories.length > 0) { //有选中分类的子分类
      const subOptions = subCategories.map(c => ({ value: c._id, label: c.name, isLeaf: true }))
      targetOption.children = subOptions
    }
    else{
      targetOption.isLeaf = true
    }
    this.setState({ options: [...this.state.options] })
  };

  componentWillMount() {
    const myState = this.props.location.state || {}
    const { product } = myState
    this.isUpdate = !!product
    this.product = product || {}
  }

  componentDidMount() {
    this.getCategories('0')
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { isUpdate, product } = this
    const { pCategoryId, categoryId } = product
    const categoryIds = []
    if (isUpdate) {
      if (pCategoryId && pCategoryId !== '0') {
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
      else {
        categoryIds.push(categoryId)
      }
    }

    const title = (
      <span>
        <LinkButton onClick={this.props.history.goBack}>
          <Icon type='arrow-left' style={{ fontSize: 20 }} />
        </LinkButton>
        <span>添加商品</span>
      </span>
    )
    //指定FormItem布局的配置对象
    const formItemLayout = {
      labelCol: { span: 3 }, //左侧label的宽度
      wrapperCol: { span: 8 } //右侧控件的宽度
    }

    return (
      <Card title={title}>
        <Form {...formItemLayout} onSubmit={this.submit}>
          <FormItem label='商品名称'>
            {
              getFieldDecorator('name', {
                initialValue: product.name,
                rules: [
                  { required: true, message: '商品名称必须输入' }
                ]
              })(
                <Input placeholder='请输入商品名称' />
              )
            }
          </FormItem>
          <FormItem label='商品描述'>
            {
              getFieldDecorator('desc', {
                initialValue: product.desc
              })(
                <TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRows: 6 }} />
              )
            }
          </FormItem>
          <FormItem label='商品价格'>
            {
              getFieldDecorator('price', {
                initialValue: product.price,
                rules: [
                  { required: true, message: '商品价格必须输入' },
                  { validator: this.validatePrice }
                ]
              })(
                <Input type='number' placeholder='请输入商品价格' addonAfter='元' />
              )
            }
          </FormItem>
          <FormItem label='商品分类'>
            {
              getFieldDecorator('categoryIds', {
                initialValue: categoryIds,
                rules: [
                  { required: true, message: '商品分类必须输入' }
                ]
              })(
                <Cascader options={this.state.options} //需要显示的列表数据数组
                  loadData={this.loadData} //当选择某个列表项，加载这个列表项的下一级列表项
                  placeholder='请输入商品分类'
                />
              )
            }
          </FormItem>
          <FormItem label='商品图片'>
            <PicturesWall ref={this.pictureWrapRef} imgs={product.imgs}></PicturesWall>
          </FormItem>
          <FormItem label='商品详情' labelCol={{span: 3}} wrapperCol={{span:16}}>
            <RichTextBox ref={this.richtextboxRef} detail={product.detail}/>
          </FormItem>
          <FormItem>
            <Button type='primary' htmlType='submit'>提交</Button>
          </FormItem>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(ProductAddOrUpdate)