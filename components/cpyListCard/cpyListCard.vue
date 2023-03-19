<template>
	<view class="card bg-white uni-shadow-base u-radius-6 u-p-25"> 
		<view class="card-main" @click="cardClick">
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
						@click.stop="handleTagsCopy"
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
						@click.stop="handleTagsCopy"
					></u-tag>
				</view>
			</view>
			<view class="info u-flex u-flex-items-center u-flex-between u-font-24 u-p-b-20 u-border-bottom">
				<view class="item u-flex-1">
					<view>
						<view class="text-base u-font-26 u-line-1">
							<u--text size="13" :text="origin.a3" mode="name" format="encrypt"></u--text>
						</view>
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
			<view class="item" v-if="btns.edit">
				<u-button size="small" icon="info-circle" type="info" plain :customStyle="btnStyle" text="纠错完善"></u-button>
			</view>
			<view class="item" v-if="origin.a12 && btns.call">
				<u-button size="small" icon="phone-fill"  type="primary" :customStyle="btnStyle" @click.stop="takePhoneBtn" text="极速联系"></u-button>
			</view>
			<view class="item" v-if="btns.join_customer">
				<u-button size="small" icon="plus-circle"  type="warning" :customStyle="btnStyle" @click.stop="join2Btn" text="加入通讯录"></u-button>
			</view>
			<view class="item" v-if="btns.add">
				<u-button 
					size="small" 
					:icon="origin.joinstatus == 'success'? 'checkmark-circle' :'plus-circle'" 
					:type="origin.joinstatus == 'success'? 'success' :'error'"  
					throttleTime="500"
					:customStyle="btnStyle" 
					@click.stop="joinBtn"
					:loading="origin.joinstatus == 'loading'"
					:text="origin.joinstatus == 'success'? '加入成功' :'加入清单'"
					></u-button>
			</view>
			<view class="item" v-if="btns.remove">
				<u-button 
					size="small" 
					icon="trash" 
					type="error"  
					throttleTime="500"
					:customStyle="btnStyle" 
					@click.stop="deletBtn"
					:loading="origin.deletstatus == 'loading'"
					text="移出清单"
					></u-button>
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
import { join_customer } from '../../config/apis/interface/base';
	
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
	  btns: {
		  type: Object,
		  default: () => ({
			  edit: 0,
			  call: 0,
			  add: 0,
			  remove: 0,
			  join_customer: 0
		  })
	  }
	})
	
	
	const emits = defineEmits([
		"takePhoneBtn", 
		"joinBtn",
		"join2Btn",
		"detail",
		"deletBtn"
	]);
	
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
		//拨打
		emits("takePhoneBtn", {data: props.origin});
	}
	function joinBtn() {
		//加入清单
		if(props.origin.joinstatus != 'error') return
		emits("joinBtn", {data: props.origin});
	}
	function join2Btn() { 
		//加入通讯录
		if(props.origin.join2status != 'error') return
		emits("join2Btn", {data: props.origin});
	}
	function deletBtn() {
		// 移除清单 
		if(props.origin.deletstatus != 'error') return
		emits("deletBtn", {data: props.origin});
	}
	function cardClick() { 
		emits("detail", {data: props.origin});
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