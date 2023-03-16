<template>
	<view class="u-p-20">
		
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
	
	const $api = inject('$api');
	
	
	  
	onLoad(async (option) => { 
		await $api.home()
		await $api.memu()
	}); 
	share()
  
</script>

<style>
</style>
