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
export async function submitEmail(params: { mailTo: string; subject: string; text: string }) {
  return request('/api/mail/send', {
    method: 'POST',
    data: params,
  });
}
