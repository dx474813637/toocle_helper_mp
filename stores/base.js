import {
	defineStore
} from 'pinia';

export const baseStore = defineStore('base', {
	state: () => {
		return { 
			configBaseURL: 'https://wx.rawmex.cn/Zhushou/',
			configHeader: {
				'content-type': 'application/x-www-form-urlencoded',
				'appid': 10002,
				'appsecret': 'd34cv+9aniPoY1kcGGJThS+QmuYoKgH0oZZb1CSWtNR1MWNXsWFiFr4',
			},
			share_other: ''
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
 