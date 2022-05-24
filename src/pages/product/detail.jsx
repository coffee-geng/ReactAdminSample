import React, { Component } from 'react'

import {Card, Icon, List} from 'antd'
import LinkButton from '../../components/link-button/link-button'

import { BASE_IMG_URL } from '../../config/constant'
import { reqCategoryById } from '../../api'

const ListItem = List.Item

export default class ProductDetail extends Component {

    state = {
        cName1:'', //一级分类名称
        cName2: '' //二级分类名称
    }

async componentDidMount(){
    const {pCategoryId, categoryId} = this.props.location.state.product
    if (pCategoryId === '0'){ //一级分类下的商品
         const result = await reqCategoryById(categoryId)
         this.setState({cName1: result.data.name})
    }
    else{ //二级分类下的商品
        const results = await Promise.all([reqCategoryById(pCategoryId), reqCategoryById(categoryId)])
        this.setState({cName1: results[0].data.name})
        this.setState({cName2: results[1].data.name})
    }
}

  render() {
    //读取携带过来的state数据
    let {product} = this.props.location.state
    const {cName1, cName2} = this.state

      const title = (
          <span>
              <LinkButton onClick={()=>this.props.history.goBack()}>
                <Icon type='arrow-left' style={{marginRight:15, fontSize:20}} />
              </LinkButton>
              <span>商品详情</span>
          </span>
      )
    return (
      <Card title={title} className='product-detail'>
          <List>
              <ListItem>
                  <span className='prop-label'>商品名称：</span>
                  <span>{product.name}</span>
              </ListItem>
              <ListItem>
                  <span className='prop-label'>商品描述：</span>
                  <span>{product.desc}</span>
              </ListItem>
              <ListItem>
                  <span className='prop-label'>商品价格：</span>
                  <span>{product.price}元</span>
              </ListItem>
              <ListItem>
                  <span className='prop-label'>所属分类：</span>
                  <span>{cName1} {cName2 ? '-->'+cName2 : ''}</span>
              </ListItem>
              <ListItem>
                  <span className='prop-label'>商品图片：</span>
                  <span>
                    {
                        product.imgs.map(img=>{
                            return <img key={img} className='product-img' src={BASE_IMG_URL + img} alt='img'></img>
                        })
                    }
                  </span>
              </ListItem>
              <ListItem>
                  <span className='prop-label'>商品详情：</span>
                  <span dangerouslySetInnerHTML={{__html:product.detail}}></span>
              </ListItem>
          </List>
          </Card>
    )
  }
}
