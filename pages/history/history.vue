<template>
	<view class="w">
		<navBar fixed bgColor="#fff" :title="onlineControl.title" ></navBar><u-notify ref="notify"></u-notify>
		
		<u-status-bar></u-status-bar>
		<view class="header bg-white u-flex u-flex-items-center u-flex-between u-p-l-20 u-p-r-20">
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
					icon="file-text"
					text="我的通讯录" 
					borderColor="transparent"
					@click="base.handleGoto('/pages/customer/customerlist')"
				></u-tag>
			</view>
		</view>
		<u-sticky zIndex="50" bgColor="#fff" :offsetTop="base.sys.safeAreaInsets.top + 44 ">
			<view class="header-sticky "> 
				<!-- <view class="u-flex u-flex-items-center u-flex-between u-p-l-20 u-p-r-20">
					<view class="item u-flex u-flex-items-center">
						<u-icon name="order" color="#f90" size="20" ></u-icon>
						<view class="text-primary u-font-32 u-m-l-15">我的拨打记录</view>
					</view>
				</view> --> 
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
			<cpyListCard 
				:origin="item"
				:btns="{
					edit: 1,
					call: 0,
					add: 0,
					remove: 0,
					join_customer: 1
				}"
				@updateBtn="updateBtn"
				@takePhoneBtn="takePhoneBtn"
				@join2Btn="join2Btn" 
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
		<menusBar ></menusBar>
	</view> 
</template>

<script setup>
	import {
		onLoad,
		onShow, 
		onReachBottom, 
		onReady
	} from "@dcloudio/uni-app";
	import {
		ref,
		reactive,
		computed,
		watch,
		watchEffect
	} from 'vue' 
	import { inject } from 'vue' 
	// import menusBar from '@/components/menusBar/menusBa	r.vue'
	import {
		baseStore,
		menusStore
	} from '@/stores/base';
	import {share} from '@/composition/share.js'
	const {setOnlineControl, onlineControl} = share() 
	import {baseNotify} from '@/composition/notify.js'
	const notify = ref()
	baseNotify(notify)
	const base = baseStore()
	const menus = menusStore()
	const $api = inject('$api');
	const params = reactive({
		p: 1,
		cate: 1, 
		terms: '',
	})  
	const cpy_list = ref([])
	const loadstatus = ref('loadmore')  
	onLoad(async (options) => { 
		init()
		onlineControl.title="我的拨打记录"
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
	})
	onReachBottom( () => {
		getMoreData()
	})
	onReady(() => {
		
	})
	
	function submitPop() {
		params.area = popInput.value
		showInputPop.value = false
		init()
	}
	function initParamas() {
		params.p = 1;  
		cpy_list.value = [];
		loadstatus.value = 'loadmore'
	}
	async function refreshList() {
		// initParamas()
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
			cpy_list.value = [...cpy_list.value, ...res.list.map(ele => {
				ele.join2status = 'error'
				return {...ele}
			})]
			if( params.p == res.pages ) {
				loadstatus.value = 'nomore'
			}else {
				loadstatus.value = 'loadmore'
			}
		}
	}
	 
	async function init() { 
		initParamas()
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
		console.log(id)
		let index = cpy_list.value.findIndex(ele => ele.id == id)
		if(cpy_list.value[index].join2status == 'loading') return
		cpy_list.value[index].join2status = 'loading'
		const res = await $api.join_customer({params: {id}})
		if(res.code == 1) {
			cpy_list.value.splice(index, 1) 
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
		}else {
			cpy_list.value[index].deletstatus = 'error'
		}
		// if(res.code == 1) { 
		// 	cpy_list.value[index].join2status = 'success'
		// }else {
		// 	cpy_list.value[index].join2status = 'error'
		// }
		
	}  
	
	function clearAllBtn() {
		uni.showModal({
			title: '提示',
			content: '是否清空我的拨打清单',
			success: async function (e) {
				if (e.confirm) {
					const res = await $api.clear_qingdan()
					if(res.code == 1) {
						
						uni.showToast({
							title: res.msg,
							icon: 'success'
						})
						initParamas()
					}
				} else if (e.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	}
	
	function handledetail({data}) {
		base.handleGoto({
			url: '/pages/cpy/cpy',
			params: {
				id: data.id,
				ctype: '2'
			}
		})
	}
	function updateBtn({data}) {
		base.handleGoto({
			url: '/pages/cpy/cpy_edit',
			params: {
				id: data.id,
				ctype: '2'
			}
		})
	}
	async function handleSearch() {
		init()
	}
</script>
<style>
	page{
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
		height: 45px;
		image {
			height: 35px;
		}
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

