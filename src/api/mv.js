import request from '../utils/request.js'

export function mvUrl({id}) {
    return request({
      url: '/mv/url',
      method: 'get',
      params:{
          id
      }
    });
  }
   //mv热门评论
   export function mvHotComments({id,offset}) {
    return request({
      url: '/comment/mv',
      method: 'get',
      params:{
        id,
        limit:10,
        offset
      }
    });
  }
  // mv所有评论
  export function mvComments({id,offset}) {
    return request({
      url: '/comment/mv',
      method: 'get',
      params:{
        id,
        limit:10,
        offset
      }
    });
  }
  // mv详情
  export function mvDetail({mvid}) {
    return request({
      url: '/mv/detail',
      method: 'get',
      params:{
        mvid
      }
    });
  }
  // 歌手信息
  export function artistInfo({artistId}) {
    return request({
      url: '/artists',
      method: 'get',
      params:{
        id:artistId
      }
    });
  }