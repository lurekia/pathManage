import request from '../config/axios';

// 获得图信息
export function getGraphInfo() {
    return request({
        url: '/graph/info',
        method: 'GET',
    });
}

// 最短距离路
export function getPathByDist(params) {
    return request({
        url: '/graph/path_dist',
        method: 'GET',
        params
    });
}

// 最小花费路
export function getPathByCost(params) {
    return request({
        url: '/graph/path_cost',
        method: 'GET',
        params
    });
}

// 最小优惠路
export function getPathByCostWithTicket(params) {
    return request({
        url: '/graph/path_multi_cost',
        method: 'GET',
        params
    });
}

// 前3小时间路
export function getPathByTime(params) {
    return request({
        url: '/graph/path_ktime',
        method: 'GET',
        params
    });
}
