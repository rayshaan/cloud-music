import request from '../utils/request.js'

// 精品歌单
export function highquality({ cat }) {
    return request({
      url: '/top/playlist/highquality',
      method: 'get',
      params: {
        limit: 1,
        cat
      }
    });
  }
  // 精选歌单
  export function topList({ cat, offset }) {
    return request({
      url: '/top/playlist',
      method: 'get',
      params: {
        limit: 10,
        offset,
        cat
      }
    });
  }
  