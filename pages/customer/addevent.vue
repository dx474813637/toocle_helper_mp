<template>
	<view class="w u-p-20">
		<view class="u-p-20 bg-white">
			<u--form
				labelPosition="left"
				:model="form"
				:rules="rules"
				ref="uForm"  
				>
				<u-form-item prop="info" required labelWidth="0">   
					<u--textarea 
					v-model="form.info" 
					placeholder="请输入客户跟进记录"  
					border="none" 
					autoHeight
					></u--textarea>
				</u-form-item> 
				<u-line width="100%" margin="0 0 20px 0"></u-line>
				<u-form-item >
					<view>
						<u-upload
							:fileList="fileList1"
							@afterRead="afterRead"
							@delete="deletePic"
							name="1"
							:maxCount="1"
							:maxSize="2048000"
							multiple
							@oversize="handleoversize"
						></u-upload>
						<view class="u-info u-font-28">建议上传2M以内的图片</view>
					</view>
				</u-form-item>
				<u-line width="100%" margin="20px 0 0 0"></u-line>
				<u-form-item prop="riqi" label="跟进提醒" labelWidth="80px" required>
					<view class="u-flex u-flex-items-center u-flex-between u-font-28" @click="dateshow = true">
						<view class="text-primary" v-if="form.riqi">{{$u.timeFormat(form.riqi, 'yyyy年mm月dd日')}}</view>
						<view class="text-light" v-else>选择下次跟进时间</view>
						<u-icon name="arrow-right" color="#bbb"></u-icon>
					</view>
				</u-form-item>
			</u--form>
		</view>
		<u-datetime-picker
			:show="dateshow"
			:minDate="new Date().getTime()"
			v-model="form.riqi"
			mode="date"
			closeOnClickOverlay
			@confirm="confirmDate"
			@cancel="dateshow = false"
			@close="dateshow = false"
		></u-datetime-picker>
		<view class="u-p-20 u-m-t-30 u-m-b-30">
			<u-button type="primary" @click="handleConfirm">提交</u-button>
		</view>
	</view>
</template>

<script setup>
	import {
		onLoad,
		onShow,
		onShareTimeline,
		onShareAppMessage,
		onReady,
	} from "@dcloudio/uni-app";
	import {
		ref,
		reactive,
		computed
	} from 'vue' 
	import { inject } from 'vue'  
	import {
		baseStore,
		menusStore
	} from '@/stores/base'; 
	const base = baseStore()
	const menus = menusStore()
	const $api = inject('$api');
	const dateshow = ref(false)
	const id = ref('');
	const uForm = ref()
	const form = reactive({
		id: '',
		cate: '1',
		info: '',
		riqi: '',
		img: ''
	})
	const fileList1 = ref([])
	const rules = reactive({
		info: {
			type: 'string',
			required: true,
			message: '内容不能为空',
			trigger: ['blur', 'change']
		},
		riqi: { 
			type: 'number',
			required: true,
			message: '请选择跟进日期提醒',
			trigger: ['blur', 'change']
		},
	})
	onLoad(async (options) => {
		if(options.hasOwnProperty('id')) {
			id.value = options.id
		} 
		 
	}) 
	onReady(() => {
		uForm.value.setRules(rules)
	})
	function deletePic(event) {
		fileList1.value.splice(event.index, 1)
		form.img = ''
		 
	}
	function handleoversize() {
		uni.showToast({
			title: '建议上传2M以内的图片',
			icon: 'none'
		})
	}
	async function afterRead(event) {
		// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
		let lists = [].concat(event.file)
		let fileListLen = fileList1.value.length
		lists.map((item) => {
			fileList1.value.push({
				...item,
				status: 'uploading',
				message: '上传中'
			})
		})
		for (let i = 0; i < lists.length; i++) {
			const result = await uploadFilePromise(lists[i].url)
			console.log(result)
			form.img = result.list
			let item = fileList1.value[fileListLen]
			fileList1.value.splice(fileListLen, 1, Object.assign(item, {
				status: 'success',
				message: '',
				url: result.list
			}))
			fileListLen++
		}
	}
	function uploadFilePromise(url) {
		return new Promise((resolve, reject) => {
			let a = uni.uploadFile({
				url: `${base.configBaseURL}upimg`, 
				filePath: url,
				name: 'file',
				header: {
					...base.configHeader,
					userid: uni.getStorageSync('userid'),
				},
				success: (res) => {
					resolve(JSON.parse(res.data))
				}
			});
		})
	}
	async function handleConfirm() {
		console.log(form)
		uForm.value.validate().then(async res => { 
			const list = await $api.add_company_tag({
				params: {
					...form, 
					img: fileList1.value.map(ele => ele.url).join(','),
				}
			})
			if(list.code == 1) { 
				form.info = ''
				fileList1.value = []
				uni.showToast({
					title: list.msg
				})
				setTimeout(() => {
					uni.navigateBack()
				}, 2000)
			}
		}).catch(errors => {
			console.log(errors)
			uni.$u.toast('请检查表单')
		})
		
	}
	function confirmDate(e) {
		form.riqi = e.value
		dateshow.value = false
	}
</script>
<style>
	page {
		background-color: #f8f8f8;
		min-height: 100vh;
	}
</style>
<style scoped lang="scss">

</style>
