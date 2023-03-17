<template>
	<view class="card bg-white uni-shadow-base u-radius-6 u-p-25">
		<view class="card-main">
			<view class="cpy-name u-m-b-20 u-flex u-flex-items-center">
				<view class="u-m-r-10" v-if="origin.type">
					<u-tag size="mini" :text="origin.type" type="warning" plain plainFill borderColor="transparent"></u-tag>
				</view>
				<view class="u-line-1 u-font-bold u-font-32 text-dark u-flex-1">
					{{origin.a1}}
				</view>
			</view>
			<view class="tags u-flex u-flex-items-start u-flex-wrap u-m-b-10">
				
				<view class="u-m-r-10 u-m-b-10" v-if="origin.a12">
					<u-tag 
						icon="phone" 
						size="mini" 
						:text="origin.a12" 
						:name="origin.a12" 
						type="primary" 
						plain 
						plainFill 
						borderColor="transparent" 
						@click="handleTagsCopy"
					></u-tag>
				</view>
				<view class="u-m-r-10 u-m-b-10" v-if="$u.test.email(origin.a14)">
					<u-tag 
						icon="email" 
						size="mini" 
						:text="origin.a14" 
						:name="origin.a14" 
						type="primary" 
						plain 
						plainFill 
						borderColor="transparent" 
						@click="handleTagsCopy"
					></u-tag>
				</view>
			</view>
			<view class="info u-flex u-flex-items-center u-flex-between u-font-24 u-p-b-20 u-border-bottom">
				<view class="item u-flex-1">
					<view>
						<view class="text-base u-font-26 u-line-1">{{origin.a3}}</view>
						<view class="text-light">法定代表人</view>
					</view>
				</view>
				<view class="item u-flex-1">
					<view>
						<view class="text-base u-font-26 u-line-1">{{origin.a6}}</view>
						<view class="text-light">成立日期</view>
					</view>
				</view>
				<view class="item u-flex-1">
					<view>
						<view class="text-base u-font-26 u-line-1">{{origin.a4}}</view>
						<view class="text-light">注册资本</view>
					</view>
				</view>
			</view>
		</view>
		<view class="card-btns u-flex u-flex-items-center u-flex-between u-p-t-20">
			<view class="item">
				<u-button size="small" icon="info-circle" type="info" plain :customStyle="btnStyle">纠错完善</u-button>
			</view>
			<view class="item">
				<u-button size="small" icon="plus-circle" type="error" :customStyle="btnStyle">加入清单</u-button>
			</view>
			<view class="item">
				<u-button size="small" icon="phone-fill"  type="primary" :customStyle="btnStyle" @click="takePhoneBtn">极速联系</u-button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { 
		ref,
		toRefs,
		inject,
		computed,
		onMounted,
		reactive
	} from 'vue'
	import {
		menusStore,
		baseStore
	} from '@/stores/base';
	import { storeToRefs } from 'pinia' 
	
	const btnStyle = reactive({
		borderRadius: '5px',
		padding: '0 10px',
		height: '25px',
		lineHeight: '25px'
	})
	const props = defineProps({
	  origin: {
	    type: Object,
	    default: () => {
			return {}
		},
	  },
	})
	
	
	const emits = defineEmits(["takePhoneBtn"]);
	
	function handleTagsCopy(name) { 
		uni.setClipboardData({
			data: `${name}`,
			success: function () {
				uni.showToast({
					icon: 'none',
					title: '复制成功'
				});
			}
		});
	}
	function takePhoneBtn() {
		emits("takePhoneBtn", {data: props.origin});
	}
	
</script>
 
<style lang="scss" scoped>
	.info {
		border-color: #eee!important;
		.item {
			padding: 0 5px;
			position: relative;
			min-width: 25%;
			display: flex;
			justify-content: center;
			&::after {
				content: '';
				position: absolute;
				right: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 1px;
				height: 15px;
				background-color: #eee;
			}
			&:first-child {
				padding-left: 0;
				justify-content: flex-start;
			}
			&:last-child {
				padding-rihgt: 0;
				justify-content: flex-end;
				&::after {
					display: none;
				}
			}
		}
	}
</style>