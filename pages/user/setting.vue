<template>
	<view class="w">
		<navBar fixed bgColor="#fff" backBtn title="通用" ></navBar>
		<u-status-bar></u-status-bar>
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
				url: '/pages/user/info'
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
	.w { 
		padding-bottom: 60px;
		padding-top: 44px;
	}

</style>
