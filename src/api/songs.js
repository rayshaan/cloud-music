import request from '../utils/request.js'

export function topSongs({type}) {
    return request({
      url: '/top/song',
      method: 'get',
      params:{
          type
      }
    });
  }
