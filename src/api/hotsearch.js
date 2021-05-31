import request from '../utils/request.js'

export function hotSearch() {
    return request({
      url: '/search/hot',
      method: 'get'
    }); 
  }