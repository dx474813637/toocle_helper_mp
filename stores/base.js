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
	},
});
 

export const menusStore = defineStore('menus', {
	state: () => {
		return {  
			menus: [], 
			currPage: {
				route: '/pages/index/index',
				options: {}
			},
			cpy_type: [[]]
		};
	},
	getters: {
		menusActive: (state) => state.menus.findIndex(ele => ele.route == state.currPage.route) ,
	}, 
	actions: {
		saveCurrPage(data) {
			this.currPage = data;
		},
		async getMenusData() {
			try {
				const res = await apis.memu() 
				if(res.code == 1) { 
					this.cpy_type = [res.type]
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
				}
			} catch (error) { 
				return error
			}
		}
	},
});