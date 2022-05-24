import ajax from './ajax'
import jspon from 'jsonp'
import { message } from 'antd'
const BASE_URL = ''
const MY_API_KEY = '0fbd7063e6cc6c6ce358a512e0cb4ac9'

export const reqLogin = (username, password) => ajax(BASE_URL + '/login', { username, password }, 'POST')

export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=${MY_API_KEY}&city=${city}&extensions=base`
        jspon(url, {timeout:6000}, (err, data) => {
            if (!err && data.status == 1) {
                const { adcode, weather } = data.lives[0]
                resolve({adcode, weather})
            }
            else {
                message.error('获取天气信息失败！')
            }
        })
    })
}

// 获取一级/二级分类的列表
export const reqCategories = (parentId)=> ajax(BASE_URL + '/manage/category/list', {parentId})

// 添加或更新分类
export const reqAddOrUpdateCategory = (categoryId, categoryName, parentId)=> ajax(BASE_URL + '/manage/category/' + (categoryId === '0' ? 'add' : 'update'), { categoryId, categoryName, parentId }, 'POST')

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize)=> ajax(BASE_URL + '/manage/product/list', {pageNum, pageSize})

// 搜索商品分页列表 （根据商品名称/商品描述）searchType：搜索的名称，productName / productDesc
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType})=>ajax(BASE_URL + '/manage/product/search', 
{
    pageNum, 
    pageSize, 
    [searchType]:searchName
})

export const reqCategoryById = (categoryId)=> ajax(BASE_URL + '/manage/category/info', {categoryId})

//商品上架/下架
export const reqUpdateProductStatus = (productId, status)=>ajax(BASE_URL + '/manage/product/updateStatus', {productId, status}, 'POST')

//删除指定名称的图片
export const reqDeleteImg = (name)=>ajax(BASE_URL + '/manage/img/delete', {name}, 'POST')

export const reqAddOrUpdateProduct = (product)=> ajax(BASE_URL + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

export const reqRoles = ()=>ajax(BASE_URL + '/manage/role/list')

export const reqAddRole = (roleName)=>ajax(BASE_URL + '/manage/role/add', {roleName}, 'POST')

export const reqUpdateRole = (role)=>ajax(BASE_URL + '/manage/role/update', role, 'POST')

export const reqUsers = ()=> ajax(BASE_URL + '/manage/user/list')

export const reqDeleteUser = (userId)=> ajax(BASE_URL + '/manage/user/delete', {userId}, 'POST')

export const reqAddOrUpdateUser = (user) => ajax(BASE_URL + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')