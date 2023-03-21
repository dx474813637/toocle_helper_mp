import {
	defineComponent,
	ref,
	reactive,
	inject
} from 'vue'
import {
	onLoad,
	onShareAppMessage,
	onShareTimeline
} from '@dcloudio/uni-app'
export function share() {
	const $http = inject('$http')
	const onlineControl = reactive({
		share_img: '',
		share_title: '',
		title: '',
		path: '',
		query: '',
	})
	const customShareParams = reactive({})
	const pages = getCurrentPages()
	const curPage = pages[pages.length == 1? 0: pages.length - 1]
	// console.log(curPage)
	onLoad((options) => {
		
		if (options && options.poster) {
			$http.setToken({
				poster: options.poster
			})
		}
	})  
	onShareTimeline(() => { 
		return {
			title: onlineControl.share_title,
			query: getQuery(),
		}
	})
	onShareAppMessage(res => {  
		if (res.target && res.target.id && res.target.id.includes('diy_')) {

		} else {
			return {
				title: onlineControl.share_title,
				path: onlineControl.path ? onlineControl.path : getPath(),
				imageUrl: onlineControl.share_img
			};
		}
	})

	function setOnlineControl(res) {
		console.log(res)
		onlineControl.share_img = res.share_img
		if (res.share_title) onlineControl.share_title = res.share_title
		if (res.title) onlineControl.title = res.title
		if (res.share_path) onlineControl.path = res.share_path
		if (res.share_query) onlineControl.query = res.share_query
		if (res.title) {
			uni.setNavigationBarTitle({
				title: res.title
			})
		}
	}

	function getQuery() {
		let getApiParams = onlineControl.query
		let apiParams = {}
		if (getApiParams) {
			getApiParams.split('&').forEach(ele => {
				apiParams[ele.split('=')[0]] = ele.split('=')[1]
			})
		}
		let options = {
			route: '/'+curPage.route,
			...curPage.options,
			...customShareParams,
			poster: uni.getStorageSync('poster'),
			// project: current_project,
			...apiParams,
		}
		let query = ''
		query += Object.keys(options).map(ele => {
			return `${ele}=${options[ele]}`
		}).join('&')
		console.log(query)
		return query
	}

	function getPath() {

		let basePath = curPage.route
		let options = {
			route: '/'+curPage.route,
			...curPage.options,
			...customShareParams,
			poster: uni.getStorageSync('poster'),
			// project: current_project,
		}
		let query = `/${basePath}?`
		query += Object.keys(options).map(ele => {
			return `${ele}=${options[ele]}`
		}).join('&')
		console.log(query)
		return query
	}

	return {
		onlineControl,
		customShareParams,
		setOnlineControl
	}
}
