<template>
	<navBar fixed bgColor="#fff" backBtn title="用户信息" ></navBar>
	<u-status-bar></u-status-bar>
	<view class="w u-p-l-20 u-p-r-20"> 
		<u--form
			labelPosition="left"
			:model="form" 
			ref="uForm"  
			labelWidth="80px"
			:labelStyle="{color: '#666'}"
			>
			<u-form-item prop="psw" label="密码">
				<u--input
					v-model="form.psw"
					placeholder="密码为空不修改密码"
					type="password" 
					clearable
				></u--input>
			</u-form-item>  
			<u-form-item prop="phone" label="手机">
				<u--input
					v-model="form.phone"
					placeholder="手机" 
					clearable
				></u--input>
			</u-form-item>  
			<u-form-item prop="name" label="姓名">
				<u--input
					v-model="form.name"
					placeholder="姓名" 
					clearable
				></u--input>
			</u-form-item>  
			<u-form-item prop="tel" label="电话">
				<u--input
					v-model="form.tel"
					placeholder="电话" 
					clearable
				></u--input>
			</u-form-item>  
			<u-form-item prop="email" label="邮箱">
				<u--input
					v-model="form.email"
					placeholder="邮箱" 
					clearable
				></u--input>
			</u-form-item>  
		</u--form>
		<view class="u-m-t-40 u-m-b-40">
			<u-button type="primary" @click="submit">提交</u-button>
		</view>
	</view>
</template>

<script setup>
	import {
		onLoad,
		onShow, 
		onReachBottom,
	} from "@dcloudio/uni-app";
	import {
		ref,
		reactive,
		computed
	} from 'vue'
	import {share} from '@/composition/share.js'
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
	const $api = inject('$api');  
	
	const uForm = ref()
	const form = ref({
		psw: '', //密码为空不修改密码
		phone: '',
		name: '',
		tel: '',
		email: ''
	})
	
	onLoad(async (options) => {  
		uni.showLoading()
		await user.getUserInfo()
		form.value.phone = user.user_info.phone
		form.value.name = user.user_info.name
		form.value.tel = user.user_info.tel
		form.value.email = user.user_info.email
	})
	  
	async function submit() {
		console.log(form.value)
		const res = await $api.info_edit({
			params: {
				...form.value, 
			}
		})
		if(res.code == 1) { 
			uni.showToast({
				title: res.msg
			})
			user.getUserInfo()
			setTimeout(() => {
				uni.navigateBack()
			}, 1000)
		}
	}
	
	
</script>

<style lang="scss" scoped>
	.w { 
		padding-bottom: 60px;
		padding-top: 44px;
	}

</style>