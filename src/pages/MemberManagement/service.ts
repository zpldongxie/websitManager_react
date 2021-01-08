/* eslint-disable no-console */
import request from 'umi-request';
import type { TableListParams, UpsertParams } from './data.d';

/**
 * 按条件查询企业会员列表
 *
 * @export
 * @param {TableListParams} [params]
 * @return {*}
 */
export async function queryCompanyMemberList(params?: TableListParams) {
  const result = await request('/api/getMemberCompanyList', {
    method: 'POST',
    data: { ...params },
  });
  if (result.status === 'ok') {
    console.log("inin-------list.total",result.data.total);
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
 * 查询所有企业会员
 *
 * @export
 * @returns
 */
export async function queryCompanyMembers() {
  const result = await request('/api/membercompanys');

  if (result.status === 'ok') {
    return result.data;
  }
  return [];
}
/**
 * 根据ID查询企业会员
 *
 * @export
 * @returns
 */
export async function getCompanyMemberById(id: string) {
  const result = await request(`/api/membercompany/${id}`);
  return result;
}

/**
 * 新增或修改企业会员
 *
 * @export
 * @param {UpsertParams} params
 * @returns
 */
export async function upsertCompanyMember(params: UpsertParams) {
  return request('/api/membercompany', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

/**
 * 删除企业会员
 *
 * @export
 * @param {string[]} ids
 * @returns
 */
export async function removeCompanyMember(ids: string[]) {
  return request('/api/membercompanys', {
    method: 'DELETE',
    data: {
      ids,
    },
  });
}

/**
 * 按条件查询个人会员列表
 *
 * @export
 * @param {TableListParams} [params]
 * @return {*}
 */
export async function queryPersonalMemberList(params?: TableListParams) {
  const result = await request('/api/getMemberIndivicList', {
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
 * 查询所有个人会员
 *
 * @export
 * @returns
 */
export async function queryPersonalMembers() {
  const result = await request('/api/memberindivics');

  if (result.status === 'ok') {
    return result.data;
  }
  return [];
}
/**
 * 根据ID查询个人会员
 *
 * @export
 * @returns
 */
export async function getPersonalMemberById(id: string) {
  const result = await request(`/api/memberindivic/${id}`);
  return result;
}

/**
 * 新增或修改个人会员
 *
 * @export
 * @param {UpsertParams} params
 * @returns
 */
export async function upsertPersonalMember(params: UpsertParams) {
  return request('/api/memberindivic', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

/**
 * 删除企业会员
 *
 * @export
 * @param {string[]} ids
 * @returns
 */
export async function removePersonalMember(ids: string[]) {
  return request('/api/memberindivics', {
    method: 'DELETE',
    data: {
      ids,
    },
  });
}