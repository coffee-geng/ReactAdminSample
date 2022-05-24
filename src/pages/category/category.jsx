import React, { Component } from 'react'
import { Card, Table, Button, Icon, message, Modal } from 'antd'
import LinkButton from '../../components/link-button/link-button'
import { reqCategories, reqAddOrUpdateCategory } from '../../api';
import AddForm from './add-form';
import UpdateForm from './update-form';
import { PAGE_SIZE } from '../../config/constant';

export default class Category extends Component {

  state = {
    categories: [], //一级分类列表
    subCategories: [], //二级分类列表
    isLoading: false,
    parentId: '0', //当前需要显示的分类列表的parentId
    parentName: '',
    showStatus: 0, //标识添加/更新的确认框是否显示，0：都不显示，1：显示添加，2：显示更新
    currentPage: 1 //当前页数
  }

  initColumn() {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        width: '300px',
        render: (category) => {
          return (
            <span>
              <LinkButton onClick={() => { this.showUpdate(category) }}>修改分类</LinkButton>
              {
                this.state.parentId === '0' ? <LinkButton onClick={() => { this.showSubCategories(category) }}>查看子分类</LinkButton> : null
              }
            </span>
          )
        }
      }
    ];
  }

  /*
    异步获取一级/二级分类列表显示
    parentId：如果没有参数指定，则根据状态中的parentId请求。如果有参数，则根据指定参数请求
  */
  getCategories = (parentId) => {
    return new Promise(async (resolve, reject)=>{
      this.setState({ isLoading: true })
      parentId = parentId || this.state.parentId
      const result = await reqCategories(parentId)
      this.setState({ isLoading: false })
      if (result.status === 0) {
        const categories = result.data
        if (parentId === '0') {
          this.setState({ categories }, ()=>{
            resolve(categories)
          })
        }
        else {
          this.setState({ subCategories: categories }, ()=>{
            resolve(categories)
          })
        }
      }
      else {
        message.error('获取分类列表失败')
      }
    })
  }

  showSubCategories = (category) => {
    this.setState({ parentId: category._id, parentName: category.name }, () => {
      this.getCategories()
    })
  }

  showCategories = () => {
    this.setState({ parentId: '0', parentName: '', subCategories: [] })
  }

  /*
   响应点击取消，隐藏确认框
   */
  handleCancel = () => {
    this.form.resetFields() //清除输入数据
    //隐藏确认框
    this.setState({ showStatus: 0 })
  }

  addCategory = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({ showStatus: 0 })

        const { parentId, categoryName } = this.form.getFieldsValue()

        this.form.resetFields()

        const result = await reqAddOrUpdateCategory('0', categoryName, parentId)
        if (result.status === 0) {
          //添加的分类就是当前分类列表下的分类
          if (parentId == this.state.parentId) {
            this.getCategories().then(categories=>{
              const newCategory = result.data
              let curIndex = categories.map(itm=>itm._id).indexOf(newCategory._id)
              if (curIndex !== -1){
                curIndex = curIndex + 1 //元素索引从0开始转为从1开始，因为每页的记录数是从1开始计数的
                const curPageIndex = curIndex % PAGE_SIZE !== 0 ? (Math.floor(curIndex / PAGE_SIZE) + 1) : (curIndex / PAGE_SIZE)
                this.setState({currentPage: curPageIndex})
              }
            })
          }
          else if (parentId === '0') { //在二级分类列表下添加一级分类项，重现获取一级分类列表，但不需要显示一级分类列表
            this.getCategories(parentId)
          }
        }
      }
    })

  }

  updateCategory = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({ showStatus: 0 })

        const categoryId = this.currentCategory._id
        const categoryName = values['categoryName']
        const { parentId } = this.state

        this.form.resetFields() //清除输入数据

        const result = await reqAddOrUpdateCategory(categoryId, categoryName, parentId)
        if (result.status === 0) {
          this.getCategories()
        }
      }
    })
  }

  /*
   显示添加的确认框
   */
  showAdd = () => {
    this.setState({ showStatus: 1 })
  }

  /*
   显示更新的确认框
   */
  showUpdate = (category) => {
    //保存当前操作的分类对象
    this.currentCategory = category

    this.setState({ showStatus: 2 })
  }

  componentWillMount() {
    this.initColumn()
  }

  componentDidMount() {
    this.getCategories()
  }

  render() {
    const title = this.state.parentId === '0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCategories}>一级分类列表</LinkButton>
        <Icon type='arrow-right' style={{ marginRight: '5px' }}></Icon>
        <span>{this.state.parentName}</span>
      </span>
    )
    const extra = (
      <Button type='primary' onClick={this.showAdd}>
        <Icon type='plus' />
        添加
      </Button>
    )

    // 读取状态数据
    const { categories, subCategories, parentId, isLoading, showStatus } = this.state
    const currentCategory = this.currentCategory || {} //如果没有指定当前正在操作的category对象，则指定一个对对象

    return (
      <Card title={title} extra={extra}>
        <Table dataSource={parentId === '0' ? categories : subCategories} columns={this.columns}
          bordered={true}
          rowKey='_id'
          pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true, 
            current: this.state.currentPage,
            onChange: (page, pageSize)=>{
              this.setState({currentPage: page})
            } 
          }}
          loading={isLoading} />;

        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm categories={categories} parentId={parentId}
            setForm={(form) => this.form = form} />
        </Modal>
        <Modal
          title="更新分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm categoryName={currentCategory.name}
            setForm={(form) => this.form = form} />
        </Modal>
      </Card>
    )
  }
}
