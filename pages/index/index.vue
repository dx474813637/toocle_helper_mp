<template>
	<view>
		{{menusstore.dx}}
		<menusBar ></menusBar>
	</view>
</template>

<script setup>
	import {
		onLoad,
		onShow,
		onShareTimeline,
		onShareAppMessage
	} from "@dcloudio/uni-app";
	import {share} from '@/composition/share.js'
	import { inject } from 'vue' 
	// import menusBar from '@/components/menusBar/menusBar.vue'
	import {
		menusStore
	} from '@/stores/base';
	const menusstore = menusStore()
	
	const $api = inject('$api');
	 
	  
	onLoad(async (option) => { 
		await $api.home() 
	}); 
	share()
  
</script>

<style lang="scss">
	page {
		min-height: 100vh;
		background: linear-gradient(to bottom, #4aa3ff, #6bb3ff);
	}
</style>
<style lang="scss" scoped>
</style>
