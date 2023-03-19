<template>
	<view>
		
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
	const cid = ref('')
	const ctype = ref('1')
	const $api = inject('$api');
	const detailData = reactive({list: {}})
	const apiFunc = computed(() => {
		if(ctype.value == '1') return 'company_detail'
		return 'login_company_detail'
	})
	
	onLoad(async (options) => {
		if(options.hasOwnProperty('cid')) {
			cid.value = options.cid
		}
		if(options.hasOwnProperty('ctype')) {
			ctype.value = options.ctype
		}
		
		await getData()
	})
	
	
	async function getData() {
		const res = await $api[apiFunc.value]({params: {id: cid.value}})
		if(res.code == 1 ) {
			detailData = res
		}
	}
	
	
	
</script>

<style lang="scss">

</style>
