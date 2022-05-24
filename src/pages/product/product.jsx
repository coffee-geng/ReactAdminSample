import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import ProductList from './list'
import ProductAddOrUpdate from './add-update'
import ProductDetail from './detail'

import './product.less'

export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/product' component={ProductList} />
        <Route path='/product/addupdate' component={ProductAddOrUpdate} />
        <Route path='/product/detail' component={ProductDetail} />
        <Redirect to='/product' />
      </Switch>
    )
  }
}
