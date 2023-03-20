<template>
	<view class="w"> 
		<view class="u-p-20 u-flex u-flex-items-center u-flex-end" :style="{backgroundColor: base.themeColor}">
			<view class="u-flex u-flex-items-center text-white u-font-28" 
				@click="base.handleGoto({
					url: '/pages/cpy/cpy',
					params: {
						id: id,
						ctype: '2'
					}
				})">
				<view class="u-p-r-20">客户详情</view>
				<u-icon name="arrow-right" color="#fff"></u-icon>
			</view>
		</view>
		<view class="u-flex u-flex-column u-flex-items-center u-p-20 u-border-bottom bg-white" v-if="detailData.list">
			<view class="u-font-bold u-font-40 text-base u-m-b-30">{{detailData.list.a3}}</view>
			<view class=" u-font-32 text-base u-m-b-20" v-if="detailData.list.a28">真实联系人：{{detailData.list.a28}}</view>
			<view class=" u-font-28 text-light u-m-b-20" v-if="detailData.list.a1">{{detailData.list.a1}}</view>
			<view class="u-flex u-flex-items-start u-flex-center u-flex-wrap u-font-28 u-p-30"  >
				<template v-if="detailData.tag.length > 0">
					<view class="u-m-r-10 u-m-b-10 card-label"
						v-for="(item, index) in detailData.tag"
						:key="item.id"
					>
						<u-tag  
							:text="item.info"  
							type="primary" 
							plain 
							plainFill 
							borderColor="transparent"  
						></u-tag>
					</view>
				</template>
				
				<view class=" u-m-b-10" @click.stop="labelManger"> 
					<u-button 
						type="primary"
						size="small" 
						text="标签" 
						icon="setting"  
						customStyle="height: 28px" 
					></u-button>  
				</view>
				
				
			</view>  
			
		</view>
		
		<view class="u-flex u-flex-items-center u-p-20 bg-white">
			<view class="item u-m-r-30 u-flex-1">
				<u-tag
					icon="trash"
					text="移除客户"  
					type="error" 
					size="large"
					plain 
					plainFill 
					borderColor="transparent"  
				></u-tag>
			</view>
			<view class="item " style="flex: 0 0 60%">
				<u-tag
					icon="phone"
					text="打电话"  
					type="warning" 
					size="large"
					plain 
					plainFill 
					borderColor="transparent"  
				></u-tag>
			</view>
		</view>
		
		<view class="list">
			<!-- <view class="list-title u-p-20">跟进</view> -->
			<view class="u-p-20">
				<view class="bg-white u-radius-10  u-p-25">
					<view class="u-flex u-flex-items-center u-flex-between u-m-b-30">
						<view class="item u-flex u-flex-items-center">
							<u-icon name="list-dot" size="20" :color="base.themeColor"></u-icon>
							<view class="u-font-32 u-m-l-20">跟进{{detailData.follow_num}}条</view>
						</view>
						<view class="item u-flex u-flex-items-center">
							<u-button
								text="添加跟进"
								type="primary"
								size="small" 
								plain
								@click="base.handleGoto({
									url: '/pages/customer/addevent',
									params: {
										id: id
									}
								})"
							></u-button>
						</view>
					</view> 
					<view class="u-p-b-40" >
						<template v-if="detailData.follow_num== 0">
							<u-empty
								mode="data"
								:icon="base.empty"
							>
							</u-empty>
						</template>
						<template v-else-if="detailData.hasOwnProperty('follow_up')">
							<u-steps :current="detailData.follow_up.length - 1" direction="column" dot>
								<u-steps-item 
									:title="item.info"  
									v-for="(item) in detailData.follow_up"
									:key="item.id"
								>
									<template #desc>
										<view class="u-font-28 text-light">
											<view class="u-m-b-10 text-light2">提醒日期：{{item.riqi}}</view>
											<view class="u-m-b-10">记录时间：{{item.uptime}}</view>
										</view>
									</template>
								</u-steps-item> 
							</u-steps>
						</template>
						
					</view>
				</view>
			</view>
		</view>
	</view>
	<labelPopup
		:origin="dataObj"
		:show="mangerShow"
		@addTag="addTag"
		@delTag="delTag"
		@popclose="popclose"
	></labelPopup>
</template>

<script setup>
	import {
		onLoad,
		onShow,
		onShareTimeline,
		onShareAppMessage,
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
	const base = baseStore()
	const menus = menusStore()
	const id = ref('')
	const $api = inject('$api');
	const detailData = ref({}) 
	  
	 const mangerShow =  ref(false)
	const dataObj = computed(() => ({...detailData.value.list, tags: detailData.value.tag}))
	onLoad(async (options) => {
		if(options.hasOwnProperty('id')) {
			id.value = options.id
		}
		
		if(id.value) {
			uni.showLoading()
			await getData()
		}
		
	})
	uni.$on('update',function(data){
		console.log('监听到事件来自 update ，携带参数：' , data); 
		if(data.type == 'event') {
			detailData.value = {}
			getData()
		}
	})
	
	async function getData() {
		const res = await $api.login_company_detail({params: {id: id.value}})
		if(res.code == 1 ) {
			detailData.value = res
		}
	}
	function labelManger({data}) { 
		mangerShow.value = true
	}
	function popclose( ) { 
		mangerShow.value = false 
	}
	async function addTag({data, tag}) {
		// mangerData.push('新增标签11')  
		if(detailData.value.tag.some(ele => ele.info == tag) ) {
			uni.showToast({
				title: '该标签已存在',
				icon: 'none'
			})
			return
		}
		uni.showLoading()
		const res = await $api.add_company_tag({
			params: {
				id: data.id,
				cate: '2',
				info: tag,
			}
		})
		if(res.code == 1) {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
			detailData.value.tag.unshift(res.list)
		}
	}
	async function delTag({ data, tagId }) { 
		let tagIndex = detailData.value.tag.findIndex(ele => ele.id == tagId);
		// let index = cpy_list.value.findIndex(ele => ele.id == data.id);
		if(tagIndex == -1) return
		uni.showLoading()
		const res = await $api.del_tags({
			params: {
				id: tagId,
			}
		})
		if(res.code == 1) {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
			detailData.value.tag.splice(tagIndex, 1)
		}
	}
	
	function takePhoneBtn({data}) {
		const {tel} = data;
		const arr = tel.split(',')
		if(arr.length > 0) {
			uni.showActionSheet({
				itemList: arr,
				success: function (res) {
					console.log(arr[res.tapIndex]);
					uni.makePhoneCall({
						phoneNumber: `${arr[res.tapIndex]}`,
						async success(e) {
							console.log(e)
							const r = await $api.join_call({
								params: {
									cate: 1,
									id: data.id
								}
							})
						},
						fail(e) {
							console.log(e)
						}, 
					});
				},
				fail: function (res) {
					console.log(res.errMsg);
				}
			});
		}
		
		
	}
	
</script>
<style>
	page {
		min-height: 100vh;
		background-color: #f8f8f8;
	}
	:deep(.u-text:last-child .u-text__value) {
		margin-bottom: 5px;
	}
	:deep(.u-text:first-child .u-text__value) {
		font-size: 16px!important;
		padding: 5px 10px;
		background-color: #f8f8f8;
		margin-bottom: 5px;
		margin-top: 5px;
		border-radius: 5px;
		color: #666;
	}
</style>
<style lang="scss">

</style>
