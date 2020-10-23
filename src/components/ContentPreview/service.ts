import request from 'umi-request';

/**
 * 以ip查询单个文章
 *
 * @export
 * @param {string} id
 * @returns
 */
export async function getContent(id: string) {
  return request(`/api/article/${id}`);
}