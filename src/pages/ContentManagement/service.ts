import request from 'umi-request';
import { TableListParams, QueryContentListParams } from './data.d';

export async function queryContentList(params: TableListParams) {
    const {
      pageSize = 10,
      current = 1,
      title='',
      // filter,
      sorter={'conDate': 'desc'}, // 默认以时间降序排序
      channelId
    } = params;
    
    // 排序参数
    const orderName = Object.keys(sorter).length ? Object.keys(sorter)[0] : "conDate";
    let orderValue = Object.keys(sorter).length ? sorter[Object.keys(sorter)[0]] : "desc";
    orderValue = orderValue === 'ascend' ? 'asc' : 'desc';

    const queryContentListParams: QueryContentListParams = {
      channelId,
      contentType: "content",
      length: pageSize,
      orderName,
      orderValue,
      search: title,
      start: (current - 1) * pageSize,
    }

  const res = await request('/api/getContentList', {
    method: 'POST',
    data: {
      // ...queryContentListParams,
      ...params,
    },
  });
  if (res.status === 'ok') {
    return {
      current: params.current,
      data: res.list,
      pageSize: params.pageSize,
      success: true,
      total: res.currentTotal
    }
  }
  return {
    current: 1,
    data: [],
    pageSize: params.pageSize,
    success: false,
    total: 0
  }
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
