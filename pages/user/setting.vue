<template>
	<view>
		<u-cell-group>
			
			<view v-for="(item, index) in list" :key="index">
				<view class="bg-white" v-if="item.type == 'cell'">
					<u-cell
						:icon="item.icon" 
						:title="item.title" 
						:isLink="true" 
						:iconStyle="{color: '#999'}"
						:url="item.url"
						arrow-direction="right"
					></u-cell>
				</view>
				
				<view class="u-p-20 u-font-28 text-light" v-if="item.type == 'label'">
					{{item.title}}
				</view>
				
			</view>
		
		
		</u-cell-group>
		<view class="u-p-20 u-m-t-40">
			<u-button type="error" @click="handleLogout">安全登出</u-button>
		</view>
		
	</view>
</template>


<script setup>
	import {
		onLoad
	} from "@dcloudio/uni-app";
	import {
		ref,
		reactive,
		computed
	} from 'vue' 
	import { inject } from 'vue' 
	// import menusBar from '@/components/menusBar/menusBa	r.vue'
	import {
		baseStore,
		menusStore
	} from '@/stores/base';
	import {
		userStore 
	} from '@/stores/user';
	const base = baseStore()
	const menus = menusStore()
	const user = userStore()
	
	onLoad(async () => {
		await user.getUserInfo()
	})
	const list = reactive([
			{
				title: '用户管理',
				type: 'label'
			},
			{
				title: '用户信息',
				icon: 'account',
				type: 'cell',
				url: '/pages/my/user/info'
			},
			{
				title: '地址管理',
				icon: 'map',
				type: 'cell',
				url: '/pages/my/address/address'
			},
			{
				title: '我的分享码',
				icon: 'share-square',
				type: 'cell',
				url: '/pages/my/myEwm/myEwm'
			},
			// {
			// 	title: '订阅管理',
			// 	type: 'label'
			// },
			// {
			// 	title: '订阅设置',
			// 	icon: 'bookmark',
			// 	type: 'cell',
			// 	url: '/pages/my/user/subscribe_set'
			// },
			// {
			// 	title: '订阅列表',
			// 	icon: 'bell',
			// 	type: 'cell',
			// 	url: '/pages/my/user/subscribe_list'
			// },
			{
				title: '账号管理',
				type: 'label'
			},
			// {
			// 	title: '登录历史记录',
			// 	icon: 'clock',
			// 	type: 'cell',
			// 	url: '/pages/my/account/log'
			// },
			{
				title: '修改密码',
				icon: 'lock',
				type: 'cell',
				url: '/pages/my/account/login_psw_update'
			},
			{
				title: '短信重设密码',
				icon: 'email',
				type: 'cell',
				url: '/pages/my/account/login_psw_reset'
			},
			// {
			// 	title: '绑定账号',
			// 	icon: 'man-add',
			// 	type: 'cell',
			// 	url: '/pages/my/account/bind_account'
			// },
			{
				title: '修改绑定手机',
				icon: 'phone',
				type: 'cell',
				url: '/pages/my/account/change_phone'
			},
			{
				title: '手机解绑',
				icon: 'minus-circle',
				type: 'cell',
				url: '/pages/my/account/remove_phone'
			},
		])  
	async function handleLogout() {
		user.logout()
	}
			 
</script>
<style lang="scss">
	page {
		background-color: $page-bg2;
		min-height: 100vh;
	}
</style>
<style lang="scss" scoped>

</style>
