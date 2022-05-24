import React, { Component } from 'react'

import { Card, Select, Input, Button, Icon, Table, message } from 'antd'
import LinkButton from '../../components/link-button/link-button'
import { reqProducts, reqSearchProducts, reqUpdateProductStatus } from '../../api'
import { PAGE_SIZE } from '../../config/constant'

const Option = Select.Option

export default class ProductList extends Component {

    state = {
        products: [], //商品的集合
        total: 0, //商品的总数量
        isLoading: false,
        searchName: '', //搜索的关键字内容
        searchType: 'productName', //根据商品名称还是商品描述搜索
    }

    initColumn = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => {
                    return '￥' + price
                }
            },
            {
                title: '状态',
                width: 100,
                render: (product) => {
                    return (
                        <span>
                            <Button type='primary' onClick={()=>{this.updateProductStatus(product._id, product.status === 1 ? 2 : 1)}}>{product.status === 1 ? '下架' : '上架'}</Button>
                            <span>{product.status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                width: 100,
                render: (product) => {
                    return (
                        <span>
                            <LinkButton onClick={()=>this.props.history.push('/product/detail', {product})}>详情</LinkButton>
                            <LinkButton onClick={()=> {this.props.history.push('/product/addupdate', {product})}}>修改</LinkButton>
                        </span>
                    )
                }
            }
        ]
    }

    getProducts = async (pageNum) => {
        this.pageNum = pageNum
        this.setState({ isLoading: true })
        const {searchName, searchType} = this.state
        let result
        // 如果关键字有值，则进行搜索分页
        if (searchName){
            result = await reqSearchProducts({pageNum, pageSize:PAGE_SIZE, searchName, searchType})
        }
        else{
            result = await reqProducts(pageNum, PAGE_SIZE)
        }
        this.setState({ isLoading: false })
        if (result.status === 0) {
            const { total, list } = result.data
            this.setState({
                products: list,
                total
            })
        }
    }

    updateProductStatus = async (productId, newStatus)=>{
        const result = await reqUpdateProductStatus(productId, newStatus)
        if (result.status === 0){
            message.success('更新状态成功')
            this.getProducts(this.pageNum)
        }
    }

    componentWillMount() {
        this.initColumn()
    }

    componentDidMount() {
        this.getProducts(1)
    }

    render() {
        const { products, total, isLoading, searchType, searchName } = this.state

        const title = (
            <span>
                <Select value={searchType} style={{ width: 150 }}
                    onChange={(value) => this.setState({ searchType: value })}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder='关键字' style={{ width: '150px', margin: '0 15px' }} value={searchName}
                    onChange={ e=> this.setState({ searchName: e.target.value })} />
                <Button type='primary' onClick={()=>{this.getProducts(1)}}>搜索</Button>
            </span>
        )
        const extra = (
            <Button onClick={()=> {this.props.history.push('/product/addupdate')}}>
                <Icon type='plus' />
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    dataSource={products}
                    columns={this.columns}
                    bordered
                    rowKey='_id'
                    loading={isLoading}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        current: this.pageNum,
                        showQuickJumper: true,
                        total,
                        onChange: (page, pageSize) => {
                            this.getProducts(page)
                        }
                    }}
                ></Table>
            </Card>
        )
    }
}
