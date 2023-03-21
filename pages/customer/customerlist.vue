<template>
	<view class="w">
		<navBar fixed bgColor="#fff" backBtn title="我的通讯录" ></navBar>
		<u-status-bar></u-status-bar>
		<!-- <view class="header u-flex u-flex-items-center u-flex-between u-p-l-20 u-p-r-20">
			<image 
				class="header-banner" 
				src="https://wx.rawmex.cn/Public/zhushou/zs1.png" 
				mode="heightFix"
			></image>
			<view> 
				<u-tag 
					type="primary" 
					plain 
					plainFill
					size="mini"
					icon="plus-circle"
					text="我要新加" 
					borderColor="transparent"
				></u-tag>
			</view>
		</view> -->
		
		<u-sticky zIndex="50" bgColor="#fff" :offsetTop="base.sys.safeAreaInsets.top + 44 ">
			<view class="header-sticky">
				<view class="search-w u-p-20 bg-white">
					<u-search 
						placeholder="输入搜索关键字" 
						v-model="params.terms" 
						shape="square"
						:showAction="false"
						bgColor="#f8f8f8"  
						@search="handleSearch"
					></u-search>
				</view> 
			</view>
		</u-sticky>
		<view
			class="list-item u-m-t-20 u-p-l-20 u-p-r-20"
			v-for="item in cpy_list"
			:key="item.id"
		>
			<customerListCard 
				:origin="item" 
				@detail="handledetail"
				@labelManger="labelManger"
				@addEventBtn="addEventBtn"
				@updateBtn="updateBtn"
			></customerListCard>
		</view>
		<template v-if="cpy_list.length == 0">
			<u-empty
				mode="data"
				:icon="base.empty"
			>
			</u-empty>
		</template>
		<template v-else>
			<u-loadmore
				:status="loadstatus"
			/>
		</template>
		<u-safe-bottom></u-safe-bottom>
		<menusBar ></menusBar>
	</view>
	<labelPopup
		:origin="mangerData"
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
		onReachBottom,
	} from "@dcloudio/uni-app";
	import {
		ref,
		reactive,
		computed
	} from 'vue'
	import {share} from '@/composition/share.js'
	const {setOnlineControl, onlineControl} = share() 
	import { inject } from 'vue' 
	// import menusBar from '@/components/menusBar/menusBa	r.vue'
	import {
		baseStore,
		menusStore
	} from '@/stores/base';
	const base = baseStore()
	const menus = menusStore()
	const $api = inject('$api');
	const params = reactive({
		p: 1,
		cate: 2,
		terms: ''
	}) 
	const cpy_list = ref([]);
	const mangerData = ref({})
	const mangerShow =  ref(false)
	const loadstatus = ref('loadmore') 
	onLoad(async (options) => { 
		init()
		uni.$on('update',function(data){
			console.log('监听到事件来自 update ，携带参数：' , data);
			const type = data.type;
			const update_id = data.id;
			const update_data = data.data;
			let index = cpy_list.value.findIndex(ele => ele.id == update_id);
			if(type == 'info') {
				let updated_data = {...cpy_list.value[index], ...update_data}
				cpy_list.value.splice(index, 1, updated_data)
			}
			else if(type == 'event') { 
				cpy_list.value[index].follow_up.unshift(update_data)
			}
			else if(type == 'remove') { 
				cpy_list.value.splice(index, 1)
			}
		}) 
	})
	onReachBottom( () => {
		getMoreData()
	}) 
	function handleSearch() {
		init()
	}
	function initParamas() {
		params.p = 1; 
		cpy_list.value = [];
		loadstatus.value = 'loadmore'
	}
	async function refreshList() {
		initParamas()
		init()
	}
	async function getMoreData() {
		if(loadstatus.value != 'loadmore') return
		params.p ++
		await getData()
	}
	async function getData() {
		if(loadstatus.value == 'loading') return
		loadstatus.value = 'loading'
		const res = await $api.company_list_login({ params })
		if(res.code == 1) {
			cpy_list.value = [
				...cpy_list.value, 
				...res.list.map(ele => {
					ele.joinstatus = 'error'
					return {...ele}
				})
			]
			if( params.p == res.pages ) {
				loadstatus.value = 'nomore'
			}else {
				loadstatus.value = 'loadmore'
			}
		}
	}
	 
	async function init() { 
		params.p = 1;
		cpy_list.value = [];
		loadstatus.value = 'loadmore'
		uni.showLoading()
		await getData()
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
	async function join2Btn({data}) {
		const {id} = data;
		let index = cpy_list.value.findIndex(ele => ele.id == id)
		if(cpy_list.value[index].join2status == 'loading') return
		cpy_list.value[index].join2status = 'loading'
		const res = await $api.join_customer({params: {id}})
		if(res.code == 1) { 
			cpy_list.value[index].join2status = 'success'
		}else {
			cpy_list.value[index].join2status = 'error'
		}
		
	}  
	 
	function handledetail({data}) {
		base.handleGoto({
			url: '/pages/customer/customer',
			params: {
				id: data.id, 
			}
		})
	}
	
	async function addTag({data, tag}) {
		// mangerData.push('新增标签11')
		let index = cpy_list.value.findIndex(ele => ele.id == data.id);
		if(index == -1) return
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
			cpy_list.value[index].tags.unshift(res.list)
		}
	}
	async function delTag({ data, tagId }) {
		console.log(data.id, tagId)
		let tagIndex = mangerData.value.tags.findIndex(ele => ele.id == tagId);
		let index = cpy_list.value.findIndex(ele => ele.id == data.id);
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
			cpy_list.value[index].tags.splice(tagIndex, 1)
		}
	}
	function popclose( ) { 
		mangerShow.value = false
		mangerData.value = {}
	}
	function labelManger({data}) {
		// console.log(data)
		mangerData.value = data;
		mangerShow.value = true
	}
	function addEventBtn({data}) {
		base.handleGoto({
			url: '/pages/customer/addevent',
			params: {
				id: data.id
			}
		})
	}
	function updateBtn({data}) {
		base.handleGoto({
			url: '/pages/cpy/cpy_edit', 
			params: {
				id: data.id, 
				ctype: '2',
			},
		})
	}
</script>
<style>
	page {
		background-color: #f8f8f8;
		min-height: 100vh;
	}
</style>
<style lang="scss" scoped>
	.w { 
		padding-bottom: 60px;
		padding-top: 44px;
	}
	.header-sticky {
		border-bottom: 1rpx solid #eee; 
	}
	.header {
		height: 50px;
	}
	.filter-w {
		height: 35px;
		.item {
			flex: 0 0 50%;
			height: 100%;
			position: relative;
			padding-left: 10px;
			&:first-child {
				padding-left: 0;
			}
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
			&:last-child::after {
				display: none;
			}
		}
	}
	.header-banner {
		height: 100%;
	}
	.list {
		min-height: 70vh;
		border-radius: 20px;
	}
	.search-left {
		flex: 0 0 60px;
		padding: 0 8px; 
		border-right: 1rpx solid #eee;
	}
	.tags {
		background-color: #ecf5ff;
		height: 22px;
		line-height: 22px;
		padding: 0 5px;
		border-radius: 3px;
		font-size: 12px;
		line-height: 12px;
		color: #3c9cff;
	}
</style>

