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
				></u-tag>
			</view>
		</view>
		<u-sticky zIndex="50" bgColor="#fff">
			<view class="header-sticky">
				<view class="search-w u-p-l-20 u-p-r-20">
					<u-search 
						placeholder="输入搜索关键字" 
						v-model="params.terms" 
						shape="square"
						:showAction="false"
						bgColor="#f8f8f8"  
						@search="handleSearch"
					></u-search>
				</view>
				<view class="filter-w u-flex u-flex-items-center u-flex-between u-p-l-20 u-p-r-20">
					<view class="item u-flex u-flex-items-center u-flex-between u-font-28 text-base"> 
						<view class="u-flex-1 tags u-flex u-flex-items-center u-flex-between" @click="showInputPop = true"> 
							<view>地区：{{area_text}}</view> 
							<i class="custom-icon-jianpan_jianpan custom-icon u-m-r-8"></i>
							<!-- <u-tag :text="`地区：${area_text}`" type="primary" plain plainFill size="mini" borderColor="transparent" @click="showModifyArea = true" ></u-tag> -->
						</view> 
						<view class="u-p-l-20 u-p-r-30" @click="showModifyArea = true">
							<u-icon name="map-fill" size="17" color="#2f89ff"></u-icon>
						</view>
						
					</view>
					<view class="item u-flex u-flex-items-center u-flex-between u-font-28 text-base" @click="type_show = true"> 
						<view class="u-flex-1">
							<u-tag :text="`类型：${type_text}`" type="primary" plain plainFill size="mini" borderColor="transparent" @click="type_show = true" ></u-tag>
						</view> 
						<view class="u-p-l-20 u-p-r-20">
							<u-icon name="arrow-down" size="14" color="#007aff"></u-icon>
						</view>
						
					</view>
				</view>
			</view>
		</u-sticky>
		<CwiycCitypicker 
			:show="showModifyArea" 
			@confirmArea="confirmArea" 
			@close="showModifyArea = false"
			:closeOnClickOverlay="true"
		 />
		<u-popup 
			 :show="showInputPop" 
			 :safeAreaInsetBottom="false" 
			 mode="center" 
			 customStyle="transform: translateY(-150px); width: 80vw" 
			 closeOnClickOverlay 
			 @close="showInputPop = false" 
			 round="10" >
			 <view class="u-p-40">
				<u--input placeholder="输入地址" clearable v-model="popInput" ></u--input>
				<view class="u-p-t-20 u-p-b-20">
					<u-button type="primary" size="small" @click="submitPop">完成</u-button> 
				</view>
			 </view>
		</u-popup>
		<u-picker 
			title="选择类型"
			:show="type_show" 
			:columns="menus.cpy_type"
			closeOnClickOverlay 
			keyName="name"
			@close="type_show = false"
			@cancel="type_show = false"
			@confirm="type_confirm"
		></u-picker>
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
	share()
	const base = baseStore()
	const menus = menusStore()
	const $api = inject('$api');
	const params = reactive({
		p: 1,
		terms: '',
		type: '',
		area: ''
	}) 
	const cpy_list = ref([])
	const loadstatus = ref('loadmore')
	const showInputPop = ref(false)
	const popInput = ref('')
	const showModifyArea = ref(false)
	const area_text = computed(() => {
		if(!params.area) return '全部'
		return params.area
	})
	function confirmArea(e) {
		console.log(e)//打印出选择结果
		if(e[0] == '全部') params.area = ''
		else if(e[1] == '全部') params.area = e[0]
		else if(e[2] == '全部') params.area = e[1]
		else params.area = e[2]
		showModifyArea.value = false
		handleSearch()
	}
	//企业类别picker 配置
	const type_show = ref(false)
	const type_current = computed(() => menus.cpy_type[0].findIndex(ele => ele.value == params.type))
	const type_text = computed(() => menus.cpy_type[0][type_current.value]?.name)  
	function type_confirm(e) {  
		console.log(e)
		params.type = menus.cpy_type[0][e.indexs[0]].value
	 	// type_current.value = e.indexs[0]
	 	type_show.value = false 
		handleSearch()
	}
	onLoad(async (options) => {
		if(options.hasOwnProperty('terms')) {
			params.terms = options.terms
		}
		if(options.hasOwnProperty('type')) {
			params.type = options.type
			
		}
		if(options.hasOwnProperty('area')) {
			params.area = options.area
		}
		handleSearch()
	})
	onReachBottom( () => {
		getMoreData()
	})
	function submitPop() {
		params.area = popInput.value
		showInputPop.value = false
		handleSearch()
	}
	function initParamas() {
		params.p = 1;
		params.terms = '';
		params.type = '';
		params.area = '';
		cpy_list.value = [];
		loadstatus.value = 'loadmore'
	}
	async function refreshList() {
		initParamas()
		handleSearch()
	}
	async function getMoreData() {
		if(loadstatus.value != 'loadmore') return
		params.p ++
		await getData()
	}
	async function getData() {
		if(loadstatus.value == 'loading') return
		loadstatus.value = 'loading'
		const res = await $api.search_company({ params })
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
	 
	async function handleSearch() { 
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
						cate: 1,
						id: data.id
					}
				})
			},
			fail(e) {
				console.log(e)
			}, 
		});
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
			cpy_list.value[index].joinstatus = 'done'
		}
	}
	
	function handledetail({data}) {
		base.handleGoto({
			url: '/pages/cpy/cpy',
			params: {
				cid: data.id,
				ctype: '1'
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

