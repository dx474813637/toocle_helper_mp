import {
	defineStore
} from 'pinia';
import apis from '@/config/apis/index';
export const baseStore = defineStore('base', {
	state: () => {
		return {
			configBaseURL: 'https://wx.rawmex.cn/Zhushou/',
			configHeader: {
				'content-type': 'application/x-www-form-urlencoded',
				'appid': 10002,
				'appsecret': 'd34cv+9aniPoY1kcGGJThS+QmuYoKgH0oZZb1CSWtNR1MWNXsWFiFr4',
			},
			share_other: '',
			themeColor: '#4aa3ff',
			empty: 'https://wx.rawmex.cn/Public/memu/data1.png',
		};
	},
	getters: {
		// doubleCount: (state) => state.counter * 2,
	},
	// 也可以这样定义
	// state: () => ({ count: 0 })
	actions: {
		saveShareInfo(data) {
			this.share_other = data;
		}, 
		handleGoto(data) {
			uni.$u.route(data)
		},
	},
});
 

export const menusStore = defineStore('menus', {
	state: () => {
		return {  
			menus: [], 
			menus_wd: [],
			menus_wd_broker: {},
			new_memu: [],
			news: 0,
			currPage: {
				route: '/pages/index/index',
				options: {}
			},
			cpy_type_origin: [[]],
			cpy_type: [[]]
		};
	},
	getters: {
		menusActive: (state) => state.menus.findIndex(ele => ele.route == state.currPage.route) ,
	}, 
	actions: {
		saveCurPage(data) {
			console.log('saveCurPage', data)
			this.currPage = data;
		},
		async getMenusData() {
			try {
				const res = await apis.memu() 
				if(res.code == 1) { 
					//获取搜索类型数据
					this.cpy_type_origin = [res.type]
					this.cpy_type =[ [{name: '全部', value: ''}, ...res.type.map(ele => {
						return {
							name: ele,
							value: ele
						}
					})] ]
					
					//获取底部导航菜单
					this.menus = res.list.map((ele, index) => {
						let paramsStr = ele.url.split('?')[1] || ''
						let paramsObj = {}
						paramsStr && paramsStr.split('&').forEach(item => {
							paramsObj[item.split('=')[0]] = item.split('=')[1]
						})
						 
						return {
							...ele,
							route: ele.url.split('?')[0],
							options: paramsObj
						}
					})  
					
					//获取个人中心基础菜单
					this.menus_wd = res.new_memu_wd
					//获取个人中心broker菜单
					this.menus_wd_broker = res.broker_memu
					
					this.new_memu = res.new_memu 
					this.news = res.news
				}
			} catch (error) { 
				return error
			}
		}
	},
});