<template>
	<view class="w">
		<navBar fixed bgColor="#fff" backBtn title=""></navBar>
		<u-status-bar></u-status-bar>
		<view class="u-content">
			<u-parse :content="content"></u-parse>
		</view>
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
		if (options.hasOwnProperty('id')) {
			id.value = options.id
		}
		await getData()
	})

	async function getData() {
		const res = await $api.about({
			params: {
				id: id.value
			}
		})
		if (res.code == 1) {
			content.value = res.list.info
		}
	}
</script>

<style lang="scss">
	page { 
		min-height: 100vh;
	}
</style>
<style lang="scss" scoped>
	.w { 
		padding-bottom: 60px;
		padding-top: 44px;
	}

</style>

