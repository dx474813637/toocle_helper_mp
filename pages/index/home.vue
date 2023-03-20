<template>
	<view class="w"> 
		<image 
			class="header-banner" 
			src="https://wx.rawmex.cn/Public/zhushou/zs3.png" 
			mode="widthFix"
		></image> 
		
		<u-sticky zIndex="50" >
			<view class="u-p-l-30 u-p-r-30 u-p-b-10  " :style="{background: base.themeColor}">
				<view class="u-radius-6 bg-white u-flex u-flex-items-center" style="height: 45px;">
					<view class="search-icon u-p-l-10">
						<u-icon name="search" size="26"></u-icon>
					</view>
					<view class="search-left u-flex u-flex-items-center u-flex-center" @click="search_type_show = true"> 
						<u--input 
							suffixIcon="arrow-down" 
							readonly
							v-model="search_type_text"
							suffixIconStyle="font-size: 16px"
							border="none"
						></u--input>
					</view>
					<view class="u-flex-1">
						<template v-if="search_type_key == 'type'">
							<view class="u-p-l-30 u-p-r-30" @click="type_show = true" >
								<u--input
									suffixIcon="arrow-down" 
									readonly
									placeholder="请下拉选择类型" 
									v-model="type_text"
									suffixIconStyle="font-size: 16px"
									border="none"
								></u--input>
							</view>
						</template>
						<template v-else>
							<u-search
								searchIcon=""
								placeholder="输入搜索关键字" 
								v-model="keyword" 
								shape="square"
								:showAction="false"
								bgColor="#fff" 
								searchIconColor="#6f6f6f"
								searchIconSize="32" 
								@search="handleSearch"
							></u-search> 
						</template>
						
					</view>
				</view>
				
			</view>
		</u-sticky>
		<u-picker 
			title="选择搜索类型"
			:show="search_type_show" 
			:columns="search_type_list"
			closeOnClickOverlay
			keyName="name"
			@close="search_type_show = false"
			@cancel="search_type_show = false"
			@confirm="search_type_confirm"
		></u-picker>
		<u-picker 
			title="选择类型"
			:show="type_show" 
			:columns="menus.cpy_type_origin"
			closeOnClickOverlay 
			@close="type_show = false"
			@cancel="type_show = false"
			@confirm="type_confirm"
		></u-picker>
		<view class="u-m-t-40" v-if="search_list.length > 0">
			<view class="u-p-l-30 u-flex u-flex-items-center text-white">
				<i class="custom-icon-scoretop custom-icon text-white u-font-38"></i>
				<view class="u-p-l-12">同事都在搜</view>
			</view>
			<view class="u-m-t-20 u-m-b-20 u-m-l-25">
				<u-tabs 
					lineWidth="0"
					lineHeight="0"
					:list="search_list" 
					@click="tabsClick"
					keyName="terms"
					activeStyle="color: #fff;font-size: 12px"
					inactiveStyle="color: #fff;font-size: 12px"
					:itemStyle="{
						background: 'rgba(255,255,255, .2)', 
						borderRadius: '13px',
						padding: '0 12px',
						lineHeight: '25px',
						height: '25px',
						marginRight: '15rpx',
						fontSize: '12px',
						minWidth: '4em'
					}"
				></u-tabs>
			</view>
		</view>
		<view class=" bg-white u-m-t-40 u-p-t-30 u-p-b-20 list u-radius-15">
			<u-sticky zIndex="50" offsetTop="50">
				<view class="bg-white" >
					<u-tabs
						:current="tabs_current"
						:list="cpy_tabs_list" 
						:activeStyle="{
							color: base.themeColor,
							fontSize: '16px',
							fontWeight: 'bold'
						}"
						:lineColor="baseStore.themeColor"
						@click="cpytabsClick"
						keyName="name" 
					></u-tabs>
				</view>
				
			</u-sticky>
			<view 
				class="list-item u-m-t-20 u-p-l-20 u-p-r-20"
				v-for="item in cpy_list"
				:key="item.id"
			>
				<cpyListCard 
					:origin="item"
					:btns="{
						edit: 1,
						call: 1,
						add: 1,
						remove: 0,
						join_customer: 0
					}"
					@updateBtn="updateBtn"
					@takePhoneBtn="takePhoneBtn"
					@joinBtn="joinBtn"
					@detail="handledetail"
				></cpyListCard>
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
		</view>
		
		<menusBar ></menusBar>
	</view>
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
	import {
		userStore
	} from '@/stores/user';
	const base = baseStore()
	const user = userStore()
	const menus = menusStore()
	const keyword = ref('')
	const tabs_current = ref(0)
	const loadstatus = ref('loadmore')
	const curP = ref(1)
	const $api = inject('$api');
	const search_list = ref([])
	const cpy_list = ref([])
	// 搜索类型 配置
	const search_type_show = ref(false)
	const search_type_current = ref(0)
	const search_type_key = computed(() => search_type_list.value[0][search_type_current.value].key)
	const search_type_text = computed(() => search_type_list.value[0][search_type_current.value].name)
	const search_type_list = ref([
		[
			{
				name: '客户',
				key: 'terms'
			},
			{
				name: '类别',
				key: 'type'
			},
			{
				name: '地区',
				key: 'area'
			},
		]
	])
	//企业类别picker 配置
	const type_show = ref(false)
	const type_current = ref(-1) 
	const type_text = computed(() => type_current.value == -1 ? '' : menus.cpy_type_origin[0][type_current.value])
	 
	const cpy_tabs_list = ref([
		{
			name: '最近更新',
			apiFunc: 'company_list',
			disabled: false
		},
		{
			name: '最新完善',
			apiFunc: 'company_lista',
			disabled: false
		}
	])
	const list_api = computed(() => cpy_tabs_list.value[tabs_current.value].apiFunc)
	share()
	onLoad(async (option) => { 
		// if(user.user.login == 0) {
		// 	uni.redirectTo({
		// 		url: '/pages/index/index'
		// 	})
		// 	return
		// }
		uni.showLoading()
		await getHome()
		await refreshList()
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
			// else if(type == 'event') { 
			// 	cpy_list.value[index].follow_up.unshift(update_data)
			// }
		})
	}); 
	onReachBottom( () => {
		getMoreData()
	})
	
	function handleSearch() {
		base.handleGoto({
			url: '/pages/search/search',
			params: {
				[`${search_type_key.value}`]: keyword.value
			}
		})
	}
	
	function search_type_confirm(e) { 
		search_type_current.value = e.indexs[0]
		search_type_show.value = false
	}
	function type_confirm(e) {  
		type_current.value = e.indexs[0]
		type_show.value = false
		base.handleGoto({
			url: '/pages/search/search',
			params: {
				[`${search_type_key.value}`]: e.value[0]
			}
		})
	}
	function initParamas() {
		curP.value = 1;
		cpy_list.value = [];
		loadstatus.value = 'loadmore'
	}
	async function refreshList() {
		initParamas()
		uni.showLoading() 
		await getHomeList()
	}
	async function getMoreData() {
		if(loadstatus.value != 'loadmore') return
		curP.value ++
		await getHomeList()
	}
	async function getHome() {
		const res = await $api.home() ;
		if(res.code == 1) {
			search_list.value = res.list
		}
	}
	async function getHomeList() {
		if(loadstatus.value == 'loading') return
		loadstatus.value = 'loading'
		const res = await $api[list_api.value]({params: {p: curP.value}}) ;
		if(res.code == 1) {
			cpy_list.value = [...cpy_list.value, ...res.list.map(ele => {
				ele.joinstatus = 'error'
				return {...ele}
			})]
			if( curP.value == res.pages ) {
				loadstatus.value = 'nomore'
			}else {
				loadstatus.value = 'loadmore'
			}
		}
	}
	function tabsClick(data) {
		base.handleGoto({
			url: '/pages/search/search',
			params: {
				terms: data.terms
			}
		})
	}
	function cpytabsClick(data) {
		console.log(data)
		tabs_current.value = data.index
		uni.showLoading()
		refreshList()
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
	async function joinBtn({data}) {
		const {id} = data;
		let index = cpy_list.value.findIndex(ele => ele.id == id)
		if(cpy_list.value[index].joinstatus == 'loading') return
		cpy_list.value[index].joinstatus = 'loading'
		const res = await $api.join_qingdan({params: {id}})
		if(res.code == 1) { 
			cpy_list.value[index].joinstatus = 'success'
		}else {
			cpy_list.value[index].joinstatus = 'error'
		}
	}
	
	function handledetail({data}) {
		base.handleGoto({
			url: '/pages/cpy/cpy',
			params: {
				id: data.id,
				ctype: '1'
			}
		})
	}
	function updateBtn({data}) {
		base.handleGoto({
			url: '/pages/cpy/cpy_edit',
			params: {
				cid: data.id,
				ctype: '1'
			}
		})
	}
</script>

<style lang="scss">
	page {
		min-height: 100vh;
		// background: linear-gradient(to bottom, #4aa3ff, #6bb3ff);
		background: #4aa3ff;
	}
</style>
<style lang="scss" scoped>
	.w { 
		padding-bottom: 60px;
	}
	.header-banner {
		width: 100vw;
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
</style>
