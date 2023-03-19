<template>
	<view>
		<u-popup
			 :show="props.show" 
			 :safeAreaInsetBottom="false" 
			 mode="center" 
			 customStyle="transform: translateY(-150px); width: 80vw" 
			 closeOnClickOverlay 
			 @close="close" 
			 @open="open"
			 round="10" >
			 <view class="u-p-30">
				<view class="u-text-center text-base u-p-20 u-m-b-20">{{props.origin.name}}的标签管理</view>
				
				<view class="u-flex u-flex-items-center u-m-b-20">
					<view class="u-flex-1">
						<u--input 
							placeholder="输入新增标签" 
							clearable 
							v-model="newtag" 
							></u--input>
					</view>
					<view class="u-m-l-20">
						<u-button
							type="error"
							size="small"
							text="确认新增"
							@click="addTagsClick"
						></u-button>
					</view>
				</view>
				
				<view class="tags-w u-flex u-flex-items-start u-flex-wrap u-font-28 u-m-b-40"> 
					<view class="u-m-r-10 u-m-b-10"
						v-for="(item, index) in props.origin.tags"
						:key="index"
					>
						<u-tag 
							closable
							:name="index" 
							size="mini" 
							:text="item"  
							type="primary" 
							plain 
							plainFill 
							borderColor="transparent"  
							@click="deletTagsClick"
						></u-tag>
					</view> 
				</view>
				
				<view class="u-p-t-20 u-p-b-20">
					<u-button type="primary" @click="close">关 闭</u-button> 
				</view>
			 </view>
		</u-popup>
	</view>
</template>

<script setup>
	import { 
		ref,
		toRefs,
		inject,
		computed,
		onMounted,
		reactive
	} from 'vue'
	import {
		menusStore,
		baseStore
	} from '@/stores/base';
	import { storeToRefs } from 'pinia'  
	
	const btnStyle = reactive({
		borderRadius: '5px',
		padding: '0 10px',
		height: '25px',
		lineHeight: '25px'
	})
	const props = defineProps({
	  origin: {
	    type: Object,
	    default: () => {
			return {}
		},
	  }, 
	  show: {
		  type: Boolean,
		  default: false
	  }
	})
	const newtag = ref('')
	
	const emits = defineEmits([ 
		"delTag", 
		"addTag", 
		"popclose", 
	]);
	
	
	function open() {
		console.log(props.origin)
	}
	function close() {
		emits('popclose')
	}
	function deletTagsClick(e) {
		console.log(e)
		emits('delTag', {data: props.origin.tags[e]})
	}
	function addTagsClick() { 
		emits('addTag', {data: newtag.value})
		
	}
	
</script>

<style lang="scss">

</style>