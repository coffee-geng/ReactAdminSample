const menuList = [
    {
        title: '首页',
        icon:'/home',
        key:'/home',
        isPublic: true
    },
    {
        title: '商品',
        icon:'appstore',
        key:'/products',
        children:[
            {
                title: '品类管理',
                icon:'bars',
                key:'/category'
            },
            {
                title: '商品管理',
                icon:'tool',
                key:'/product'
            }
        ]
    },
    {
        title: '用户管理',
        icon:'user',
        key:'/user'
    },
    {
        title: '角色管理',
        icon:'safety',
        key:'/role'
    },
    {
        title: '图形图表',
        icon:'area-chart',
        key:'/charts',
        children:[
            {
                title: '柱形图',
                key: '/charts/bar',
                icon: 'bar-chart'
              },
              {
                title: '折线图',
                key: '/charts/line',
                icon: 'line-chart'
              },
              {
                title: '饼图',
                key: '/charts/pie',
                icon: 'pie-chart'
              }
        ]
    }
]

export default menuList