/* eslint-disable no-console */
import request from 'umi-request';

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