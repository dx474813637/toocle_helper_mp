
const http = uni.$u.http

// login_cancel 
export const login_cancel = (data) => http.get('login_cancel', data) 
// memu 
export const memu = (data) => http.get('memu', data) 

// zhushou_login 登录接口 login passwd
// 测试账号100 密码123456
export const zhushou_login = (data) => http.get('zhushou_login', data) 
// logout 用户退出
export const logout = (data) => http.get('logout', data) 


// upimg 上传图片
export const upimg = (data) => http.get('upimg', data) 

// home 首页同事在搜内容
export const home = (data) => http.get('home', data) 
// company_list 首页的企业列表 参数p
export const company_list = (data) => http.get('company_list', data) 
// company_lista  最新完善 参数p
export const company_lista = (data) => http.get('company_lista', data) 

// company_list_login 列表 参数p cate=0 清单 1拨打 2客户
export const company_list_login = (data) => http.get('company_list_login', data) 
// join_qingdan 加入清单 参数id 企业列表里的id
export const join_qingdan = (data) => http.get('join_qingdan', data) 
// exit_qingdan 退出清单 参数id 清单的id
export const exit_qingdan = (data) => http.get('exit_qingdan', data) 
// clear_qingdan 清空清单
export const clear_qingdan = (data) => http.get('clear_qingdan', data) 
// join_call 加入拨打记录 参数 cate =1,2  id：cate=1时，企业列表的id cate=2时 清单列表的清单id
export const join_call = (data) => http.get('join_call', data) 
// join_customer 加入客户 参数id 只能从清单列表或拨打列表来，这两个id都一样的。
export const join_customer = (data) => http.get('join_customer', data) 
// exit_customer 退出客户 参数id
export const exit_customer = (data) => http.get('exit_customer', data) 

// search_company 搜索企业 p 关键字terms 类别type 地区area（省市区单个都可以，但不能一起）
export const search_company = (data) => http.get('search_company', data) 
// search_company_login 搜索清单 拨打 客户 参数跟搜索企业一致 多一个参数cate = 0清单 1拨打 2客户
export const search_company_login = (data) => http.get('search_company_login', data) 

// company_detail 企业详情 参数id
export const company_detail = (data) => http.get('company_detail', data) 
// login_company_detail 用户企业详情 参数id 清单/拨打/客户 列表里的id
export const login_company_detail = (data) => http.get('login_company_detail', data) 
// company_update 添加或更新企业信息，修改多一个参数id，这个id是清单/拨打/客户 列表里的id。
// type=>类别 a1=>企业名称 a2=>经营状态 a3=>法定代表人 a4=>注册资本 a5=>实缴资本 a6=>成立日期 a7=>核准日期 
// a8=>营业期限 a9=>所属省份 a10=>所属城市 a11=>所属区县 a12=>电话 a13=>更多电话 a14=>邮箱 a15=>更多邮箱 
// a16=>统一社会信用代码 a17=>纳税人识别号 a18=>工商注册号 a19=>组织机构代码 a20=>参保人数 a21=>企业类型 
// a22=>所属行业 a23=>曾用名 a24=>注册地址 a25=>最新年报地址 a26=>网址 a27=>经营范围
export const company_update = (data) => http.get('company_update', data) 

// add_company_tag 企业备注 参数info 备注内容 id是清单/拨打/客户 列表里的id。
// 新增企业跟进/标签 
// cate 1跟进 2标签 必填
// info 内容 必填
// riqi 跟进日期 跟进时必填
// img 标签时不传或空，跟进时不是必填
export const add_company_tag = (data) => http.get('add_company_tag', data) 

