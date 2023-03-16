export default function wx_permission (fullPath) {
	let arr = fullPath.split('?')
	let url = arr[0]
	let params = {};
	arr[1] && arr[1].split('&').forEach(ele => {
		params[ele.split('=')[0]] = ele.split('=')[1]
	})
	let flag = true
	// 充值 + 同名转账
	if(url == '/pages/my/money/sino_cz') {
		if(params.hasOwnProperty('cz') && params.cz == '1') {
			flag = false
		}
		// if(params.hasOwnProperty('cz') && params.cz == '2') {
		// 	flag = false
		// }
	}
	// 同名账户转账记录
	// if(url == '/pages/my/money/sino_cz_list') {
	// 	if(params.hasOwnProperty('tabs_current') && params.tabs_current == '3') {
	// 		flag = false
	// 	} 
	// }
	
	if(!flag) {
		uni.showToast({
			title: '此功能请前往电脑端操作',
			icon:'none'
		})
	}
	return flag
}