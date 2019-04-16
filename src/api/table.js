import request from '@/utils/request'

export function getList(parentid) {
  return request({
    url: '/taoapi/search?parentid=',
    method: 'get',
    params: { parentid }
  })
}

export function getTree(parentid) {
  return request({
    url: '/taoapi/redirect?',
    method: 'get',
    params: { parentid }
  })
}

export function creat(data) {
  return request({
    url: '/taoapi/oauth',
    method: 'post',
    data
  })
}

