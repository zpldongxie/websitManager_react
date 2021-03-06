/* eslint-disable no-console */
import request from 'umi-request';
import type {
  PersonalUpsertParams,
  TableListParams,
  UpsertParams,
  AuditMemberParams,
} from './data.d';

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
    // eslint-disable-next-line array-callback-return
    result.data.list.map((item: { sendEmailStatus: string }) => {
      if (item.sendEmailStatus !== '发送失败' && item.sendEmailStatus !== '未发送') {
        // eslint-disable-next-line no-param-reassign
        item.sendEmailStatus = '发送成功';
      }
    });
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
 * 审核企业会员
 *
 * @export
 * @param {AuditMemberParams} params
 * @returns
 */
export async function auditCompanyMember(params: AuditMemberParams) {
  return request('/api/membercompany/audit', {
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
    // eslint-disable-next-line array-callback-return
    result.data.list.map((item: { sendEmailStatus: string }) => {
      if (item.sendEmailStatus !== '发送失败' && item.sendEmailStatus !== '未发送') {
        // eslint-disable-next-line no-param-reassign
        item.sendEmailStatus = '发送成功';
      }
    });
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
export async function upsertPersonalMember(params: PersonalUpsertParams) {
  return request('/api/memberindivic', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

/**
 * 审核个人会员
 *
 * @export
 * @param {AuditMemberParams} params
 * @returns
 */
export async function auditPersonalMember(params: AuditMemberParams) {
  return request('/api/memberindivic/audit', {
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

/**
 * 查询会员等级
 *
 * @export
 * @returns
 */
export async function queryMemberTypes() {
  const result = await request('/api/membertypes');

  if (result.status === 'ok') {
    return result.data;
  }
  return [];
}
/**
 * 查询会员等级ID
 *
 * @export
 * @returns
 */
export async function queryMemberTypeID(name: string) {
  const result = await request(`/api/membertype/byName/${name}`);

  if (result.status === 'ok') {
    return result.data;
  }
  return [];
}
