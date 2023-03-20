<template>
	<view class="wrap" v-if="hide != 1">
		<!-- <view class="top"></view> -->
		<view class="content">
			<view class="title">欢迎登录</view>
			<u--form 
				labelPosition="top"
				:model="form" 
				ref="uForm" 
			>
				<u-form-item prop="login" >
					<u--input 
						v-model="form.login" 
						prefixIcon="account-fill"
						clearable
						prefixIconStyle="color: #999"
						:placeholder="`请输入${logintype == 1? '手机' :'账号/手机'}`" 
					/>
				</u-form-item>

				<template v-if="logintype == 2">
					<u-form-item prop="passwd" >
						<u-input 
							:password="passwordType"
							prefixIcon="lock-fill"
							clearable
							prefixIconStyle="color: #999"
							v-model="form.passwd" 
							placeholder="请输入密码"
						>
							<template slot="suffix">
								<u-icon 
									@click="passwordType = !passwordType"
									:name=" passwordType ? 'eye-off' : 'eye-fill'"
									:color=" passwordType ? '#ccc' : '#007aff'"
									></u-icon>	
							</template>
						</u-input>
					</u-form-item>
				</template>
			</u--form>
			<u-button type="primary" :ripple="true" @click="submit" :custom-style="inputStyle">
				{{ logintype == 2 ? '登录' : '获取短信验证码'}}</u-button>

			<!-- 
			<view class="alternative">
				<view class="password" @click="changeLoginType">{{ logintype == 1 ? '账号密码登录' : '手机验证码登录'}}</view>
				<view class="issue" @click="handleGoto({url:'/pages/index/login/register'})">注册账号</view>
			</view> 
			
			<view class=" u-m-t-40 u-flex u-flex-end">
				<view>
					<u--text type="warning" decoration="underline" text="忘记密码？" @click="handleGoto('/pages/index/login/resetPwd')"></u--text>
				</view>
				
				
			</view> -->
		</view> 
		<!-- <view class="u-p-l-10 u-p-r-10">
			<u-parse :content="denglu_info[logintype == 1? 'info1' : 'info2']"></u-parse>
		</view> -->
	</view>
</template>

<script setup>
	import {
		onLoad,
		onReady, 
		onShareTimeline,
		onShareAppMessage,
	} from "@dcloudio/uni-app";
	import {
		ref,
		reactive,
		computed
	} from 'vue'
	import {share} from '@/composition/share.js'
	import { inject } from 'vue'  
	import {
		baseStore,
		menusStore
	} from '@/stores/base';
	share()
	import {
		userStore
	} from '@/stores/user';
	const user = userStore()
	const logintype = ref(2)
	const form = reactive({
		login: '',
		passwd: ''
	})
	const denglu_info = reactive({})
	const passwordType = ref(true)
	const inputStyle = reactive({
		'borderRadius': '10rpx', 
		'backgroundColor': '#007aff',
		'marginTop': '40rpx'
	})
	const $api = inject('$api')
	const uForm = ref()
	const rules = computed(() => {
		if(logintype.value == 2) {
			return {
				login: [{
					required: true,
					message: '请输入账号/手机号',
					trigger: ['blur', 'change']
				}, ],
				passwd: [{
					required: true,
					message: '请输入密码',
					trigger: ['blur', 'change']
				}, ],
			}
		}
		else if(logintype.value == 1) {
			return {
				login: [{
						required: true,
						message: '请输入手机号',
						trigger: ['blur', 'change']
					},
					{
						validator: (rule, value, callback) => {
							console.log(uni.$u.test.mobile(value))
							return uni.$u.test.mobile(value)
						},
						message: '请输入正确的11位手机号',
						trigger: ['blur', 'change']
					},
				],
			}
		}
		return {}
	})
	const hide = ref(1)
	onLoad(async () => {
		const res = await user.getUserInfo()
		if(res.code == 1) {
			uni.reLaunch({
				url: '/pages/index/home'
			})
			
		}else {
			hide.value = 0
		}
	})
	onReady(() => {
		handleSetRules()
	})
	function submit() { 
		console.log(uForm.value)
		getLogin()
		// uForm.value.validate().then(valid => {
		// 	if (valid) {
		// 		// console.log('验证通过');
		// 		if (logintype.value == 1) {
		// 			// getCode()
		// 		} else {
		// 			getLogin()
		// 		}
		// 	} else {
		// 		// console.log('验证失败');
		// 	}
		// }).catch(errors => {
		// 	uni.$u.toast('校验失败')
		// });
	}
	function getCode() {
		uni.navigateTo({
			url: `/pages/index/login/code?login=${form.login}`
		})
	}
	async function exit() { 
		let res = await $api.logout() 
	}
	async function getLogin() {
		uni.showLoading({
			title: '登录信息验证中...'
		})
		// await uni.$u.sleep(1800)
		let res = await $api.zhushou_login({
			params: form
		})
		if(res.code == 1) {  
			// uni.setStorageSync('userid', '')
			// naviBack()
			uni.showLoading()
			await user.getUserInfo()
			uni.reLaunch({
				 url: '/pages/index/home'
			})
		}
		
	}
	function naviBack() { 
		let url = uni.getStorageSync('prePage')
		console.log(url)
		uni.redirectTo({
			url:'/pages/index/home',
			success() {
				uni.showToast({
					title: '登录成功',
					icon: 'none'
				})
			}
		})
		uni.removeStorageSync('prePage') 
	}
	function handleSetRules() { 
		// uForm.value.setRules(rules.value)
	}
	function changeLoginType() {
		logintype.value == 1 ? logintype.value = 2 : logintype.value = 1
		// $set(form, "login", "")
		form.login = ''
		uForm.value.clearValidate()
		handleSetRules()
	}
	
</script>

<style lang="scss" scoped>
	.u-border-bottom {
		border-bottom: 1rpx solid #e7e7e7;
	}

	.login-box {
		display: none;

		&.tel,
		&.pw {
			display: block;
		}
	}

	.inputRow {
		margin-bottom: 30rpx;
	}

	.wrap {
		font-size: 28rpx;

		.content {
			width: 600rpx;
			margin: 20rpx auto 0;

			.title {
				text-align: left;
				font-size: 50rpx;
				font-weight: 500;
				margin-bottom: 50rpx;
			}

			input {
				text-align: left;
				margin-bottom: 10rpx;
				padding-bottom: 6rpx;
			}

			.tips {
				color: #ffaa00;
				margin-bottom: 60rpx;
				margin-top: 8rpx;
			}

			.getCaptcha {
				background-color: rgb(253, 243, 208);
				color: $uni-color-warning;
				border: none;
				font-size: 30rpx;
				padding: 12rpx 0;

				&::after {
					border: none;
				}
			}

			.alternative {
				color: #666;
				display: flex;
				justify-content: space-between;
				margin-top: 30rpx;
			}
		}

		.buttom {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;

			.loginType {
				display: flex;
				padding: 350rpx 150rpx 150rpx 150rpx;
				justify-content: space-between;

				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					color: #666;
					font-size: 28rpx;
				}
			}

			.hint {
				// padding: 20rpx 40rpx;
				font-size: 28rpx;
				color: #333;

				.link {
					color: #007aff;
				}
			}
		}
	}
</style>
