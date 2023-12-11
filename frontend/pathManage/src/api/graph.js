import request from '../config/axios';

export function getGraphInfo() {
    return request({
        url: '/graph/info',
        method: 'GET',
    });
}

export function getPathByCost(params) {
    return request({
        url: '/graph/path_cost',
        method: 'GET',
        params
    });
}


