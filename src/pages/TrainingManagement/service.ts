import request from 'umi-request';
import type { TrainingDataType, QueryListDataType, TableListParams } from './data.d';

type ParamsType = {
  count?: number;
} & Partial<TrainingDataType>;

export async function getChannelList(filter: string) {
  return request(`/api/channels/${filter}`);
}

export async function queryTrainingList(params: QueryListDataType) {
  return request('/api/getTrainingList', {
    method: 'POST',
    data: { ...params, current: params.pageNum },
  });
}

/**
 * 按条件查询列表，支持分页和过滤
 *
 * @export
 * @param {TableListParams} [params]
 * @returns
 */
export async function queryList(params?: TableListParams) {
  const result = await request('/api/getTrainingList', {
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
 * @param {{ ids: string[] }} ids
 * @returns
 */
export async function removeFakeList(ids: string[]) {
  return request('/api/trainings', {
    method: 'DELETE',
    data: { ids },
  });
}

export async function addFakeList(params: TableListParams) {
  const result = await request('/api/training', {
    method: 'PUT',
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

export async function updateFakeList(params: ParamsType) {
  return request('/api/training', {
    method: 'PUT',
    data: params,
  });
}
