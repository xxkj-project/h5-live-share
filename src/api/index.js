/*
 * @Author: wangshengxian
 * @Date: 2020-08-19 09:46:43
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-13 01:20:45
 * @Desc: 请求 - api
 */

import request from '@/utils/request'

export function getShareData({ id }) {
  return request({
    url: `/api/share/baseInfo/${id}`,
    method: 'get',
    data: {}
  })
}

/**
 * 验证票据是否有效
 * @param {code} 门票票据
 */
export function checkTicketAging({ code }) {
  return request({
    url: `/concert/ticket/${code}`,
    method: 'get',
    data: {}
  })
}
