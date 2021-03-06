import request from 'umi-request';
import type { TableListParams, TableListItem } from './data.d';

/**
 * 按条件查询列表，支持分页和过滤
 *
 * @export
 * @param {TableListParams} [params]
 * @returns
 */
export async function queryList(params?: TableListParams) {
  const result = await request('/api/getTrainingRegList', {
    method: 'POST',
    data: { ...params },
  });

  if (result.status === 'ok') {
    return {
      data: result.data.list,
      total: result.data.total,
      success: true,
      pageSize: params?.pageSize,
      current: params?.currentPage,
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
 * 删除多个
 *
 * @export
 * @param {{ ids: string[] }} params
 * @returns
 */
export async function removeTrainingReg(params: { ids: string[] }) {
  return request('/api/trainingregs', {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}

/**
 * 新增或修改
 *
 * @export
 * @param {TableListItem} params
 * @returns
 */
export async function putTrainingReg(params: TableListItem) {
  return request('/api/trainingreg', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

/**
 * 获取活动列表
 *
 * @export
 * @returns
 */
export async function getTrainings() {
  const result = await request('/api/trainings');
  if (result.status === 'ok') {
    return result.data;
  }
  return [];
}

/**
 * 设置审核状态
 *
 * @export
 * @param {({ids: (string | undefined)[]; passed: boolean;})} params
 * @return {*}
 */
export async function setPassed(params: { ids: (string | undefined)[]; passed: boolean }) {
  return request('/api/trainingreg/setPassed', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
