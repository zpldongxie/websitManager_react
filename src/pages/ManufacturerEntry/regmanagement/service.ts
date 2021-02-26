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
    const data = result.data.list.filter(
      (item: { type: string; status: string }) =>
        item.type === '厂商' &&
        (item.status === '申请中' || item.status === '初审通过' || item.status === '申请驳回'),
    );
    // eslint-disable-next-line array-callback-return
    data.map((item: { sendEmailStatus: string }) => {
      if (item.sendEmailStatus !== '发送失败' && item.sendEmailStatus !== '未发送') {
        // eslint-disable-next-line no-param-reassign
        item.sendEmailStatus = '发送成功';
      }
    });
    return {
      data,
      total: data.length,
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

/**
 * 删除一个或多个
 *
 * @export
 * @param {{ ids: string[] }} ids
 * @returns
 */
export async function removeFakeList(ids: string[]) {
  return request('/api/entrys', {
    method: 'DELETE',
    data: { ids },
  });
}

/**
 * 审核
 *
 */
export async function upEntryAudit(params: any) {
  return request('/api/entry/audit', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
