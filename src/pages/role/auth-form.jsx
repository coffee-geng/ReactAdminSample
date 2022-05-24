import React, { Component } from 'react'
import {Form, Input, Tree} from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'

const FormItem = Form.Item
const TreeNode = Tree.TreeNode

export default class AuthForm extends Component {

    static propTypes = {
        role: PropTypes.object
    }

    constructor(props){
        super(props)

        const {menus} = props.role
        this.state = {
            checkedKeys: menus
        }
    }

    getTreeNodes(menuList){
        return menuList.reduce((prev, menuItem)=>{
            prev.push(<TreeNode title={menuItem.title} key={menuItem.key}>
                {
                    menuItem.children && menuItem.children.length > 0 ? this.getTreeNodes(menuItem.children) : null
                }
            </TreeNode>)
            return prev
        }, [])
    }

    getMenus = ()=>{
        return this.state.checkedKeys
    }

    onChecked = (checkedKeys)=>{
        this.setState({checkedKeys})
    }

    componentWillMount(){
        this.treeNodes = this.getTreeNodes(menuList)
    }

    componentWillReceiveProps(nextProps){
        const {role} = nextProps
        this.state.checkedKeys = role.menus
    }

    render() {
        const {role} = this.props
        const {menus} = role
        const {checkedKeys} = this.state

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 }
        }

        return (
            <div>
                <FormItem label='角色名称' {...formItemLayout}>
                    <Input value={role.name} disabled></Input>
                </FormItem>
                <Tree checkable={true} defaultExpandAll={true} checkedKeys={checkedKeys}
                    onCheck={this.onChecked}>
                    <TreeNode title='平台权限' key='all'>
                        {
                            this.treeNodes
                        }
                    </TreeNode>
                </Tree>
            </div>
        )
    }
}
