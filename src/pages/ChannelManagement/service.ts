/* eslint-disable no-console */
import request from 'umi-request';
import type { ChannelType } from '@/utils/data';

/**
 * 查询所有栏目信息
 *
 * @export
 * @return {*}
 */
export async function queryAll(filter?: Record<string, any[]>) {
  let url = '/api/channels';
  console.log(filter);

  if (filter && filter.showStatus) {
    url = `/api/channels/show/${filter.showStatus}`;
  }
  const result = await request(url);

  if (result.status === 'ok') {
    return {
      data: result.data,
      success: true,
    };
  }
  return {
    data: [],
    success: false,
  };
}

/**
 * 查询所有栏目类型信息
 *
 * @export
 * @return {*}
 */
export async function queryAllTypes() {
  const result = await request('/api/channeltypes');

  if (result.status === 'ok') {
    return result.data;
  }
  return [];
}

/**
 * 移动栏目
 *
 * @export
 * @param {string} id 被移动栏目id
 * @param {string} afterId 移动后跟在哪个栏目后面
 * @return {*}
 */
export async function moveChannel(
  id: string,
  afterId: string,
  sorterMode: '前后排序' | '层级嵌套',
) {
  let newSorterMode = '';
  if(sorterMode === '前后排序'){
    newSorterMode = '排序模式'
  }else{
    newSorterMode = '嵌套模式'

  }
  const result = await request('/api/channel/move', {
    method: 'POST',
    data: {
      id,
      afterId,
      sorterMode:newSorterMode,
    },
  });
  return result;
}

export async function getById(id: number) {
  const result = await request(`/api/article/${id}`);
  return result;
}

/**
 * 新增或修改
 *
 * @export
 * @param {ChannelType} params
 * @returns
 */
export async function upsert(params: ChannelType) {
  console.log('id=======', params.id);

  return request('/api/channel', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

/**
 * 设置显示状态
 *
 * @export
 * @param {string} id
 * @param {number} showStatus
 */
export async function setShowStatus(id: string, showStatus: number) {
  const result = await request(`/api/channel/showStatus`, {
    method: 'PUT',
    data: { id, showStatus },
  });
  return result;
}

/**
 * 删除
 *
 * @export
 * @param {string[]} ids
 * @returns
 */
export async function remove(ids: string[]) {
  return request('/api/channels', {
    method: 'DELETE',
    data: {
      ids,
    },
  });
}
