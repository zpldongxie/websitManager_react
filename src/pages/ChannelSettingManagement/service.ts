/* eslint-disable no-console */
import request from 'umi-request';
import type { TableListItem, TableListParams } from './data';

/**
 * 按条件查询列表
 *
 * @export
 * @param {TableListParams} [params]
 * @return {*}
 */
export async function queryList(params?: TableListParams) {
  const result = await request('/api/getServiceRequestList', {
    method: 'POST',
    data: { ...params },
  });

  if (result.status === 'ok') {
    return {
      data: result.data.list,
      total: result.data.total,
      success: true,
      pageSize: params?.pageSize,
      current: params?.current,
    };
  }
  return {
    data: [],
    total: 0,
    success: false,
    pageSize: 0,
    current: 1,
  };
}

export async function getById(id: number) {
  const result = await request(`/api/article/${id}`);
  return result;
}

/**
 * 新增或修改
 *
 * @export
 * @param {UpsertParams} params
 * @returns
 */
export async function upsert(params: TableListItem) {
  return request('/api/servicerequest', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

/**
 * 删除
 *
 * @export
 * @param {string[]} ids
 * @returns
 */
export async function remove(ids: string[]) {
  return request('/api/servicerequests', {
    method: 'DELETE',
    data: {
      ids,
    },
  });
}
