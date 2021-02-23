/* eslint-disable no-console */
import request from 'umi-request';
import type { TableListParams } from './data';

/**
 * 按条件查询列表
 *
 * @export
 * @param {TableListParams} [params]
 * @return {*}
 */
export async function queryList(params?: TableListParams) {
  const result = await request('/api/getEntryList', {
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

/**
 * 导航
 *
 * @export
 * @returns
 */
export async function getNavList() {
  const result = await request('/api/channels');

  if (result.status === 'ok') {
    return result.data;
  }
  return [];
}

/**
 * 新增或修改
 *
 * @export
 * @param {TableListParams} params
 * @returns
 */
export async function upEntry(params: TableListParams) {
  return request('/api/entry', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
