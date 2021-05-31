import request from '../utils/request.js'

export function allMvs({ area, order, type, offset }) {
    return request({
      url: '/mv/all',
      method: 'get',
      params: {
        limit: 12,
        area,
        order,
        type,
        offset
      }
    });
  }