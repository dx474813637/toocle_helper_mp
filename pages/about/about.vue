<template>
	<view class="u-content">
		<u-parse :content="content"></u-parse>
	</view>
</template>

<script setup>
	import {
		onLoad
	} from "@dcloudio/uni-app";
	import {
		ref,
		reactive,
		computed,
		inject
	} from 'vue'  
	 const id = ref('26')
	 const content = ref('')
	 const $api = inject('$api')
	 
	 onLoad(async (options) => {
		 if(options.hasOwnProperty('id')) {
		 	id.value = options.id
		 }
		 await getData()
	 })
	 
	 async function getData() {
		 const res = await $api.about({params: {
			 id: id.value
		 }})
		 if(res.code == 1) {
			 content.value = res.list.info
		 }
	 }
</script>

<style lang="scss">

</style>
