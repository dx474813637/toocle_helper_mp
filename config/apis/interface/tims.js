const http = uni.$u.http

// tims_news_list 未读消息列表
export const timsNewsList = (data) => http.get('tims_news_list', data)
// tims_send 发送消息 参数login body
export const timsSend = (data, config={}) => http.post('tims_send', data, config)
// tims_news 未读消息 参数login 进聊天界面的未读消息
export const timsNews = (data) => http.get('tims_news', data)
// tims_news_history 历史消息 参数login  历史消息
export const timsNewsHistory = (data) => http.get('tims_news_history', data)
// tims_login_detail 聊天框首页（历史消息）接口 
// 参数login（对方账号，必须） 
// offset1（时间戳，空就是最新聊天记录，默认返回第一页聊天记录，默认10条。）
export const timsLoginDetail = (data) => http.get('tims_login_detail', data)

// （弃）tims_news_history2 历史消息2 参数login 昨天之前的历史消息