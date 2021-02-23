import request from 'umi-request';

export async function getConfigList() {
  return request(`/api/sysconfigs`);
}

export async function putConfig(params: { name: string; value: string }) {
  return request('/api/sysconfig', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

/**
 * 测试邮件发送功能
 * @param params
 */
export async function sendEmail(params: { mailTo: string; subject: string; text: string }) {
  return request('/api/mail/send', {
    method: 'POST',
    data: params,
  });
}

/**
 * 从旧数据库同步公共配置
 */
export async function syncCommonSettings() {
  return request('/api/databaseutil/commonSettings/sync', {
    method: 'POST',
    data: {},
  });
}

/**
 * 从旧数据库同步栏目数据
 */
export async function syncChannels() {
  return request('/api/databaseutil/channel/sync', {
    method: 'POST',
    data: {},
  });
}

/**
 * 从旧数据库同步文章数据
 */
export async function syncArticles() {
  return request('/api/databaseutil/article/sync', {
    method: 'POST',
    data: {},
  });
}

/**
 * 从旧数据库同步单位会员数据
 */
export async function syncMemberCompanys() {
  return request('/api/databaseutil/membercompany/sync', {
    method: 'POST',
    data: {},
  });
}
