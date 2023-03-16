import { current_project } from '@/utils/isProject.js'
export default {
	data() {
		return {
			onlineControl: {
				share_img: '',
				share_title: '',
				title: '',
				path: '',
				query: '',
			},
			customShareParams: {}
		}
	},
	async onLoad(options) {
			// console.log(options)
		if(options && options.poster) {
			this.$http.setToken({
				poster: options.poster
			})
		}
	},
	onShareTimeline(){
		return{
			title: this.onlineControl.share_title,
			query: this.getQuery(),
			// imageUrl: this.onlineControl.share_img
		}
	},
	onShareAppMessage(res) {
		if(res.target && res.target.id && res.target.id.includes('diy_')) {
			
		}else {
			return {
				title: this.onlineControl.share_title,
				path: this.onlineControl.path ? this.onlineControl.path :this.getPath(),
				imageUrl: this.onlineControl.share_img
			};
		}
		
	},
	methods: {
		setOnlineControl(res) {
			this.onlineControl.share_img = res.share_img
			if(res.share_title) this.onlineControl.share_title = res.share_title
			if(res.title) this.onlineControl.title = res.title
			if(res.share_path) this.onlineControl.path = res.share_path
			if(res.share_query) this.onlineControl.query = res.share_query
			if(res.title) {
				uni.setNavigationBarTitle({
					title: res.title 
				})
			}
		},
		getQuery() {
			let getApiParams = this.onlineControl.query
			let apiParams = {}
			if(getApiParams) {
				getApiParams.split('&').forEach(ele => {
					apiParams[ele.split('=')[0]] = ele.split('=')[1]
				})
			}
			let options = {
				...this.$scope.options,
				...this.customShareParams,
				poster: uni.getStorageSync('poster'),
				project: current_project,
				...apiParams,
			}
			let query = ''
			query += Object.keys(options).map(ele => {
				return `${ele}=${options[ele]}`
			}).join('&')
			console.log(query)
			return query
		},
		getPath() {
			
			let basePath = this.$scope.route
			let options = {
				...this.$scope.options,
				...this.customShareParams,
				poster: uni.getStorageSync('poster'),
				project: current_project,
			}
			let query = `/${basePath}?`
			query += Object.keys(options).map(ele => {
				return `${ele}=${options[ele]}`
			}).join('&')
			console.log(query)
			return query
		},
		// getShareTitle() {
		// 	let title = uni.getStorageSync('home').title || '旺铺'
		// 	return `${title} - ${this.onlineControl.pageName}`
		// }
	}
}
