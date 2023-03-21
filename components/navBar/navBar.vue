<template>
	<view class="w">
		<u-navbar
		ref="navbar"
			:fixed="fixed"
			:bgColor="bgColor || base.themeColor" 
		>
			<template #left>
				<view class="u-flex u-flex-items-center" :style="{color: bgColor? base.themeColor : '#fff'}">
					<view class="btn u-m-r-20" @click="handleBack" v-if="backBtn">
						<i class="custom-icon custom-icon-back" :style="{color: bgColor? base.themeColor : '#fff'}"  ></i>
					</view> 
					<view @click="base.handleGoto({url: '/pages/index/home', type: 'reLaunch'})" class="btn u-m-l-20">
						<i class="custom-icon custom-icon-zhuye2" :style="{color: bgColor? base.themeColor : '#fff'}"  ></i>
					</view> 
					<view  class="btn u-m-l-20 online-icon u-flex u-flex-items-center" @click="showNotify">
						<view class="dot-w">
							<i class="custom-icon custom-icon-friend" :style="{color: bgColor? base.themeColor : '#fff'}"  ></i>
							<view class="dot"></view>
						</view>
						
						<view class="u-font-26 u-m-l-10 online-icon-text" :style="{
							color: bgColor? '#fff' : '#fff',
							backgroundColor: bgColor? '#16bd23' : '#007aff'
						}">{{base.online.count}}</view>
					</view> 
				</view>
				
			</template>
			<template #center>
				<slot>
					<text class="u-line-1" :style="[titleStyle]">
						{{title}}
					</text>
				</slot>
			</template>
		</u-navbar> 
	</view>
</template>

<script setup> 
	import {
		ref,
		reactive,
		computed,
		onMounted,
		watch
	} from 'vue'  
	import { 
		onReady
	} from "@dcloudio/uni-app"; 
	import {
		baseStore,
		menusStore
	} from '@/stores/base'; 
	import {
		userStore
	} from '@/stores/user';
	
	const user = userStore()
	const base = baseStore()
	const props = defineProps({ 
		fixed: {
		  type: Boolean,
		  default: false
		},
		backBtn: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			default: '',
		},
		bgColor: {
			type: String,
			default: '',
		}
	})
	const sys = ref({})
	const msg = ref({})
	const show = ref(true) 
	onMounted(() => {
		sys.value = uni.getSystemInfoSync()
		// msg.value = base.msg[0] || {}
		// console.log('onMounted', base.msg[0])
		  
	})  
	const emits = defineEmits([ 
		"backEvent",  
	]);
	function handleBack() {
		// $emits('backEvent')
		uni.navigateBack()
	}
	
	// watch(
	//   () => msg,
	//   (item) => {
	// 	console.log(item)
		
	//     
	function showNotify() {
		msgRef.value.show({
			top: base.sys.safeAreaInsets.top + 44,
			// type: 'error',
			color: base.themeColor,
			bgColor: '#fff',
			message:  'showNotify',
			duration: 1000 * 3,
			fontSize: 16,
			safeAreaInsetTop:true
		}) 
	}
	
	defineExpose({
		sys
	})
	
	
	
	
	
</script>
<style >
	:deep(.w .u-fixed) {
		z-index: 11110!important;
	}
</style>
<style lang="scss" scoped>
	.dot-w {
		position: relative;
		.dot {
			position: absolute;
			right: 0px;
			bottom: 0px;
			border-radius: 20px;
			width: 6px;
			height: 6px;
			background-color: #1cfa2b;
		}
	}
	.online-icon-text {
		padding: 0 5px;
		border-radius: 25px;
	}
</style>
