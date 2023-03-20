<template>
	<view class="w u-p-20">
		<view class="u-p-20 text-primary u-font-38 u-text-center u-font-bold">
			{{id ? '更新企业信息' : '新增企业信息'}}
		</view>
		<u--form
			labelPosition="left"
			:model="form" 
			ref="uForm"  
			labelWidth="80px"
			:labelStyle="{color: '#666'}"
			>
			<u-form-item prop="type" label="类型">
				<view @click="type_show = true">
					<u--input
						v-model="form.type"
						placeholder="类型"
						suffixIcon="arrow-down"
						suffixIconStyle="color: #909399"
						readonly
					></u--input>
				</view>
			</u-form-item> 
			<u-picker
				title="选择企业类型"
				:show="type_show" 
				:columns="menus.cpy_type_origin"
				closeOnClickOverlay 
				keyName="name"
				@close="type_show = false"
				@cancel="type_show = false"
				@confirm="type_confirm"
			></u-picker>
			<u-form-item prop="a1" label="企业名称">
				<u--input 
					v-model="form.a1"
					placeholder="企业名称"
				></u--input>
			</u-form-item> 
			<u-form-item prop="a2" label="经营状态" v-if="form.a2">
				<view>{{form.a2}}</view> 
			</u-form-item> 
			<u-form-item prop="a3" label="法定代表人" v-if="form.a3">
				<view>{{form.a3}}</view> 
			</u-form-item> 
			<u-form-item prop="a28" label="真实联系人" >
				<u--input 
					v-model="form.a28"
					placeholder="真实联系人"
				></u--input>
			</u-form-item> 
			<u-form-item prop="a4" label="注册资本" v-if="form.a4">
				<view>{{form.a4}}</view> 
			</u-form-item> 
			<u-form-item prop="a5" label="实缴资本" v-if="form.a5">
				<view>{{form.a5}}</view> 
			</u-form-item> 
			<u-form-item prop="a6" label="成立日期" v-if="form.a6">
				<view>{{form.a6}}</view>
				<!-- <view>
					<u--input
						:value="form.a6"
						placeholder="类型"
						suffixIcon="calendar"
						suffixIconStyle="color: #909399"
						readonly
					></u--input>
				</view> -->
			</u-form-item> 
			<u-form-item prop="a7" label="核准日期" v-if="form.a7">
				<view>{{form.a7}}</view>
			</u-form-item> 
			<u-form-item prop="a8" label="营业期限" v-if="form.a8">
				<view>{{form.a8}}</view>
			</u-form-item> 
			<u-form-item prop="a9" label="所属省份">
				<u--input 
					v-model="form.a9"
					placeholder="所属省份"
				></u--input>
			</u-form-item> 
			<u-form-item prop="a10" label="所属城市">
				<u--input 
					v-model="form.a10"
					placeholder="所属城市"
				></u--input>
			</u-form-item> 
			<u-form-item prop="a11" label="所属区县">
				<u--input 
					v-model="form.a11"
					placeholder="所属区县"
				></u--input>
			</u-form-item> 
			<u-form-item prop="a12" label="电话">
				<u--input 
					v-model="form.a12"
					placeholder="电话"
				></u--input>
			</u-form-item> 
			<u-form-item prop="a13" label="更多电话">
				<u--input 
					v-model="form.a13"
					placeholder="更多电话"
				></u--input>
			</u-form-item> 
			<u-form-item prop="a14" label="邮箱">
				<u--input 
					v-model="form.a14"
					placeholder="邮箱"
				></u--input>
			</u-form-item> 
			<u-form-item prop="a15" label="更多邮箱">
				<u--input 
					v-model="form.a15"
					placeholder="更多邮箱"
				></u--input>
			</u-form-item> 
			<u-form-item prop="a16" label="统一社会信用代码">
				<u--input 
					v-model="form.a16"
					placeholder="统一社会信用代码"
				></u--input>
			</u-form-item> 
			<u-form-item prop="a17" label="纳税人识别号">
				<u--input 
					v-model="form.a17"
					placeholder="纳税人识别号"
				></u--input>
			</u-form-item> 
			<u-form-item prop="a18" label="工商注册号">
				<u--input 
					v-model="form.a18"
					placeholder="工商注册号"
				></u--input>
			</u-form-item> 
			<u-form-item prop="a19" label="组织机构代码">
				<u--input 
					v-model="form.a19"
					placeholder="组织机构代码"
				></u--input>
			</u-form-item> 
			<u-form-item prop="a20" label="参保人数" v-if="form.a20">
				<view>{{form.a20}}</view>
			</u-form-item> 
			<u-form-item prop="a21" label="企业类型" v-if="form.a21">
				<view>{{form.a21}}</view>
			</u-form-item> 
			<u-form-item prop="a22" label="所属行业">
				<u--input 
					v-model="form.a22"
					placeholder="所属行业"
				></u--input>
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
			<u-form-item prop="a26" label="网址">
				<u--input 
					v-model="form.a26"
					placeholder="网址"
				></u--input>
			</u-form-item> 
			<u-form-item prop="a27" label="经营范围" v-if="form.a27">
				<view>{{form.a27}}</view>
			</u-form-item> 
		</u--form>
		
		<view class="u-m-t-40 u-m-b-40">
			<u-button type="primary" @click="submit">提交</u-button>
		</view>
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
	const id = ref('') 
	const cid = ref('') 
	const ctype = ref('1')
	const $api = inject('$api');
	// const detailData = reactive({list: {}})
	const apiFunc = computed(() => {
		if(ctype.value == '1') return 'company_detail'
		return 'login_company_detail'
	})
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
	const form = ref({
		type: '',
		a1: '',
		a2: '',
		a3: '',
		a4: '',
		a5: '',
		a6: '',
		a7: '',
		a8: '',
		a9: '',
		a10: '',
		a11: '',
		a12: '',
		a13: '',
		a14: '',
		a15: '',
		a16: '',
		a17: '',
		a18: '',
		a19: '',
		a10: '',
		a21: '',
		a22: '',
		a23: '',
		a24: '',
		a25: '',
		a26: '',
		a27: '',
		a28: '',
	})
	
	onLoad(async (options) => {
		if(options.hasOwnProperty('id')) {
			id.value = options.id
		}else if(options.hasOwnProperty('cid')) {
			cid.value = options.cid
		}
		if(options.hasOwnProperty('ctype')) {
			ctype.value = options.ctype
		}
		if(ctype.value == '1' && cid.value) {
			uni.showLoading()
			await joinlist()
		}
		if(id.value) {
			uni.showLoading()
			await getData()
		}else {
			uni.showToast({
				title: 'id有误'
			})
		}
		
	})
	
	async function joinlist(){
		const res = await $api.join_qingdan({params: {id: cid.value, jc: 1}})
		if(res.code == 1 ) {
			id.value = res.id
		}
	}
	async function getData() {
		const res = await $api[apiFunc.value]({params: {id: id.value}})
		if(res.code == 1 ) {
			form.value = res.list
		}
	}
	async function submit() {
		console.log(form.value)
		const res = await $api.company_update({
			params: {
				...form.value,
				id: id.value,
			}
		})
		if(res.code == 1) {
			uni.$emit('update',{ type: 'info', data: form.value, id: id.value })
			uni.showToast({
				title: res.msg
			})
			setTimeout(() => {
				uni.navigateBack()
			}, 1000)
		}
	}
	
	
</script>

<style lang="scss">

</style>
