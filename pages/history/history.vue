<template>
	<view class="w">
		<view class="header u-flex u-flex-items-center u-flex-between u-p-l-20 u-p-r-20">
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
		</view>
		<u-sticky zIndex="50" bgColor="#fff">
			<view class="header-sticky u-flex u-flex-items-center u-flex-between u-p-l-20 u-p-r-20"> 
				<view class="item u-flex u-flex-items-center">
					<u-icon name="order" color="#f90" size="20" ></u-icon>
					<view class="text-primary u-font-32 u-m-l-15">我的拨打记录</view>
				</view>
				<view class="item u-flex u-flex-items-center"> 
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
	const $api = inject('$api');
	const params = reactive({
		p: 1,
		cate: 1, 
	}) 
	const cpy_list = ref([])
	const loadstatus = ref('loadmore') 
	onLoad(async (options) => { 
		init()
	})
	onReachBottom( () => {
		getMoreData()
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
			cpy_list.value = [...cpy_list.value, ...res.list.map(ele => {
				ele.joinstatus = 'error'
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
		params.p = 1;
		cpy_list.value = [];
		loadstatus.value = 'loadmore'
		uni.showLoading()
		await getData()
	}
	function takePhoneBtn({data}) {
		const {a12} = data;
		uni.makePhoneCall({
			phoneNumber: `${a12}`,
			async success(e) {
				console.log(e)
				const res = await $api.join_call({
					params: {
						cate: 2,
						id: data.id
					}
				})
			},
			fail(e) {
				console.log(e)
			}, 
		});
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
				cid: data.id,
				ctype: '2'
			}
		})
	}
</script>

<style lang="scss" scoped>
	.w { 
		padding-bottom: 60px;
	}
	.header-sticky {
		border-bottom: 1rpx solid #eee;
		height: 35px;
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

