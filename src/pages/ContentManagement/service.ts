import request from 'umi-request';
import { TableListParams, UpsertParams } from './data.d';

/**
 * 按条件查询文章列表
 *
 * @export
 * @param {TableListParams} [params]
 * @return {*}
 */
export async function queryList(params?: TableListParams) {
  const result = await request('/api/getArticleList', {
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
 * 查询所有栏目
 *
 * @export
 * @returns
 */
export async function queryChannels() {
  const result = await request('/api/channels');

  if (result.status === 'ok') {
    return result.data;
  }
  return [];
}

export async function getById(id: string) {
  const result = await request(`/api/article/${id}`);
  return result;
}

/**
 * 新增或修改文章
 *
 * @export
 * @param {UpsertParams} params
 * @returns
 */
export async function upsert(params: UpsertParams) {
  return request('/api/article', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

/**
 * 删除文章
 *
 * @export
 * @param {string[]} ids
 * @returns
 */
export async function remove(ids: string[]) {
  return request('/api/articles', {
    method: 'DELETE',
    data: {
      ids,
    },
  });
}
