<script setup>
	import routingIntercept from '@/config/permission/index.js' 
	import {inject, nextTick} from 'vue'
	import {
		baseStore
	} from '@/stores/base';
	import {
		userStore
	} from '@/stores/user';
	import {
		onLaunch,
		onShow,
		onHide,
	} from "@dcloudio/uni-app";
	const $ws = inject('$ws')
	
	const base = baseStore() 
	const user = userStore() 
	onLaunch(() => {
		if (uni.canIUse('getUpdateManager')) {
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				if (res.hasUpdate) {
					updateManager.onUpdateReady(function() {
						uni.showModal({
							title: '更新提示',
							content: '新版本已经准备好，是否重启应用？',
							success: function(res) {
								console.log('success====', res);
								// res: {errMsg: "showModal: ok", cancel: false, confirm: true}
								if (res.confirm) {
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									updateManager.applyUpdate();
								}
							}
						});
					});
					updateManager.onUpdateFailed(function() {
						// 新的版本下载失败
						uni.showModal({
							title: '已经有新版本了哟~',
							content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
						});
					});
				}
			});
		}
		
		routingIntercept($ws)
		
	});
	onShow(async (options) => {
		console.log('opt.query', options.query)  
		if(options.query?.share_other) { 
			base.saveShareInfo(options.query.share_other) 
		} 
		if(uni.getStorageSync('WebSocketInfo')) $ws.init()
		console.log(user.user.login)
		// if(user.user.login == 0) { 
		// 	uni.redirectTo({
		// 		url: '/pages/index/index'
		// 	})
		// }
	});
	onHide((options) => {
		// console.log('App Hide')
		// uni.closeSocket()
		if(uni.getStorageSync('WebSocketInfo')) $ws.completeClose()
	}); 
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-plus/index.scss";
	@import '@/common/ext.scss';
	@import '@/common/iconfont.css';
</style>