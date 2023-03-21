<template>
	<view class="w u-p-l-20 u-p-r-20">
		<navBar fixed bgColor="#fff" backBtn :title="onlineControl.title" ></navBar>
		<u-status-bar></u-status-bar>
		<view class="u-radius-10 bg-white u-p-30">
			<u--form
				labelPosition="left"
				:model="form" 
				ref="uForm"  
				labelWidth="80px"
				:labelStyle="{color: '#666'}"
				> 
				<u-form-item prop="a1" label="企业名称" v-if="form.a1">
					<view>{{form.a1}}</view> 
				</u-form-item> 
				<u-form-item prop="type" label="类型" v-if="form.type">
					<view>{{form.type}}</view> 
				</u-form-item> 
				<u-form-item prop="a2" label="经营状态" v-if="form.a2">
					<view>{{form.a2}}</view> 
				</u-form-item> 
				<u-form-item prop="a3" label="法定代表人" v-if="form.a3">
					<view>{{form.a3}}</view> 
				</u-form-item> 
				<u-form-item prop="a28" label="真实联系人" v-if="form.a28">
					<view>{{form.a28}}</view> 
				</u-form-item> 
				<u-form-item prop="a4" label="注册资本" v-if="form.a4">
					<view>{{form.a4}}</view> 
				</u-form-item> 
				<u-form-item prop="a5" label="实缴资本" v-if="form.a5">
					<view>{{form.a5}}</view> 
				</u-form-item> 
				<u-form-item prop="a6" label="成立日期" v-if="form.a6">
					<view>{{form.a6}}</view> 
				</u-form-item> 
				<u-form-item prop="a7" label="核准日期" v-if="form.a7">
					<view>{{form.a7}}</view>
				</u-form-item> 
				<u-form-item prop="a8" label="营业期限" v-if="form.a8">
					<view>{{form.a8}}</view>
				</u-form-item>  
				<u-form-item prop="a9" label="所属省份" v-if="form.a9">
					<view>{{form.a9}}</view> 
				</u-form-item> 
				<u-form-item prop="a10" label="所属城市" v-if="form.a10">
					<view>{{form.a10}}</view> 
				</u-form-item> 
				<u-form-item prop="a11" label="所属区县" v-if="form.a11">
					<view>{{form.a11}}</view> 
				</u-form-item> 
				<u-form-item prop="a12" label="电话" v-if="form.a12">
					<view>{{form.a12}}</view> 
				</u-form-item> 
				<u-form-item prop="a13" label="更多电话" v-if="form.a13">
					<view>{{form.a13}}</view> 
				</u-form-item> 
				<u-form-item prop="a14" label="邮箱" v-if="form.a14">
					<view>{{form.a14}}</view> 
				</u-form-item> 
				<u-form-item prop="a15" label="更多邮箱" v-if="form.a15">
					<view>{{form.a15}}</view> 
				</u-form-item>  
				<u-form-item prop="a16" label="统一社会信用代码" v-if="form.a16">
					<view>{{form.a16}}</view> 
				</u-form-item>  
				<u-form-item prop="a17" label="纳税人识别号" v-if="form.a17">
					<view>{{form.a17}}</view> 
				</u-form-item>  
				<u-form-item prop="a18" label="工商注册号" v-if="form.a18">
					<view>{{form.a18}}</view> 
				</u-form-item>  
				<u-form-item prop="a19" label="组织机构代码" v-if="form.a19">
					<view>{{form.a19}}</view> 
				</u-form-item>   
				<u-form-item prop="a20" label="参保人数" v-if="form.a20">
					<view>{{form.a20}}</view>
				</u-form-item> 
				<u-form-item prop="a21" label="企业类型" v-if="form.a21">
					<view>{{form.a21}}</view>
				</u-form-item> 
				<u-form-item prop="a22" label="所属行业" v-if="form.a22">
					<view>{{form.a22}}</view> 
				</u-form-item>  
				<u-form-item prop="a23" label="曾用名" v-if="form.a23">
					<view>{{form.a23}}</view>
				</u-form-item> 
				<u-form-item prop="a24" label="注册地址" v-if="form.a24">
					<view>{{form.a24}}</view>
				</u-form-item> 
				<u-form-item prop="a25" label="最新年报地址" v-if="form.a25">
					<view>{{form.a25}}</view>
				</u-form-item> 
				<u-form-item prop="a26" label="网址" v-if="form.a26">
					<view>{{form.a26}}</view> 
				</u-form-item> 
				<u-form-item prop="a27" label="经营范围" v-if="form.a27">
					<view>{{form.a27}}</view>
				</u-form-item> 
			</u--form>
			
		</view>
		
		<!-- <view class="u-m-t-40 u-m-b-40">
			<u-button type="primary" @click="submit">提交</u-button>
		</view> -->
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
	const {setOnlineControl, onlineControl} = share() 
	import { inject } from 'vue' 
	// import menusBar from '@/components/menusBar/menusBa	r.vue'
	import {
		baseStore,
		menusStore
	} from '@/stores/base';
	const base = baseStore()
	const menus = menusStore()
	const id = ref('')  
	const ctype = ref('1')
	const $api = inject('$api');
	// const detailData = reactive({list: {}})
	const apiFunc = computed(() => {
		if(ctype.value == '1') return 'company_detail'
		return 'login_company_detail'
	})
	share()
	//企业类别picker 配置
	const type_show = ref(false)
	// const type_current = computed(() => menus.cpy_type_origin[0].findIndex(ele => ele.value == form.value.type))
	// const type_text = computed(() => menus.cpy_type_origin[0][type_current.value]?.name)  
	function type_confirm(e) {  
		console.log(e)
		form.value.type = e.value[0]
	 	// type_current.value = e.indexs[0]
	 	type_show.value = false  
	}
	
	const uForm = ref()
	const form = ref({})
	
	onLoad(async (options) => {
		if(options.hasOwnProperty('id')) {
			id.value = options.id
		} 
		if(options.hasOwnProperty('ctype')) {
			ctype.value = options.ctype
		}  
		uni.showLoading()
		await getData() 
		
	})
	 
	async function getData() {
		const res = await $api[apiFunc.value]({params: {id: id.value}})
		if(res.code == 1 ) {
			setOnlineControl(res)
			form.value = res.list
		}
	} 
	
</script>
<style>
	page {
		min-height: 100vh;
		background-color: #f8f8f8;
	}
</style>
<style lang="scss" scoped>
	.w { 
		padding-bottom: 60px;
		padding-top: 60px;
	}

</style>
