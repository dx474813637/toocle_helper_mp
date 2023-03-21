<template>
	<view class="card bg-white uni-shadow-base u-radius-6" @click="cardClick"> 
		<view class="card-header u-flex u-flex-between u-flex-items-center u-font-24 u-p-l-20 u-p-t-20 u-p-r-20 ">
			<view class=" ">{{origin.uptime}} 转为客户</view>
			<view>
				<u-tag 
					text="更新客户信息"  
					size="mini"
					type="primary" 
					icon="edit-pen"
					plain 
					plainFill  
					@click="updateBtn"
					borderColor="transparent" 
				></u-tag>
			</view>
		</view>
		<view class="card-main u-p-20">
			<view class="u-flex u-flex-items-start u-m-b-20">
				<view class="item">
					<u--image radius="5" src="https://wx.rawmex.cn/Public/zhushou/zs4.png" width="50px" height="50px" mode="scaleToFill" ></u--image>
				</view>
				<view class="item u-flex-1 u-p-l-20">
					<view class=" u-font-28 u-m-b-10 u-line-2">
						<text class="u-m-r-10 u-font-28 name-label" v-if="origin.a3">{{origin.a3}}</text>
						<text class="u-flex-1">{{origin.a1}}</text>
					</view>
					<view class="u-flex u-flex-items-start u-flex-wrap u-font-28 text-base" v-if="origin.a28">
						<view class="u-m-r-10">联系人：</view>
						<view class="u-m-r-10 ">{{origin.a28}}</view> 
						
						
					</view>
				</view>
			</view>
			
			
			<view class="u-flex u-flex-items-start u-flex-wrap u-font-28 " > 
				<view class="u-m-r-10 u-m-b-10 card-label"
					v-for="(item, index) in props.origin.tags"
					:key="item.id"
				>
					<u-tag 
						size="mini" 
						:text="item.info"  
						type="error" 
						plain 
						plainFill 
						borderColor="transparent"  
					></u-tag>
				</view>
				<view class=" u-m-b-10" @click.stop="handleManger"> 
					<u-button 
						type="error"
						size="mini" 
						text="标签" 
						icon="setting"  
						customStyle="height: 24px" 
					></u-button>  
				</view>
				
				
			</view>  
		</view>
		<view class="card-btns u-flex u-flex-items-center u-flex-between u-p-20 u-border-top">
			<view class="item u-flex-1 u-font-24">
			 	<view class="text-light u-line-1">
					<text>
						<template v-if="origin.follow_up && origin.follow_up[0]">
							{{$u.timeFrom(new Date(origin.follow_up[0].uptime).getTime())}}:
							{{origin.follow_up[0].info}}
						</template>
						<template v-else>近期无跟进</template>
					</text>
				</view> 
			</view>
			<view class="item" @click.stop="addEventBtn" >
				<u-button 
					size="small" 
					icon="file-text" 
					type="primary"  
					throttleTime="500"
					:customStyle="btnStyle"  
					text="跟进客户" 
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
	const base = baseStore()
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
	
	const emits = defineEmits([ 
		"detail", 
		"labelManger",
		"addEventBtn",
		"updateBtn"
	]);
	  
	function cardClick() { 
		emits("detail", {data: props.origin});
	}
	function ceshi() {
		console.log('ceshi')
	}
	function handleManger() { 
		emits('labelManger', {data: props.origin})
	}
	
	function addEventBtn() {
		emits("addEventBtn", {data: props.origin})
	}
	function updateBtn() {
		emits("updateBtn", {data: props.origin})
		
	}
</script>
 
<style lang="scss" scoped>
	.name-label {
		background-color: #e8f3ff;
		color: #007aff;
		padding: 2px 6px;
		border-radius: 3px;
	}
	.card {
		overflow: hidden;
	}
	.card-label {
		background-color: #eee;
		border-radius: 4px;
		color: #666;
	}
	.card-header {  
		// background-color: #e8f3ff;
		color: #999
	}
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
				padding-right: 0;
				justify-content: flex-end;
				&::after {
					display: none;
				}
			}
		}
	}
</style>