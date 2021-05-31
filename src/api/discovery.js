import request from '../utils/request.js'
import axios from 'axios'
// 轮播图
export function banner() {
    return request({
      url: '/banner',
      method: 'get'
    }); 
  }
export function songlist({ limit = 10 } = {}) {
    return request({
      url: '/personalized',
      method: 'get',
      params: {
        limit
      }
    });
  }
  export function newsong() {
    return request({
      url: '/personalized/newsong',
      method: 'get'
    });
  }
  export function mv() {
    return request({
      url: '/personalized/mv',
      method: 'get'
    });
  }
  export function songUrl({ id }) {
    return request({
      url: '/song/url',
      method: 'get',
      params: {
        id
      }
    });
  }
  export function songDetail({ ids }) {
    return request({
      url: '/song/detail',
      method: 'get',
      params: {
        type:'detail',
        ids
      }
    });
  } 
  export function Lyric({ id }) {
    return request({
      url: '/lyric',
      method: 'get',
      params: {
        id
      }
    });
  }
  export function hotSearch() {
    return request({
      url: '/search/hot',
      method: 'get'
    }); 
  }