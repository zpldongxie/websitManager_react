import request from 'umi-request';

export async function getConfigList() {
  return request(`/api/sysconfigs`);
}

export async function putConfig(params: {name: string; value: string}) {
  return request('/api/sysconfig', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}