import request from 'umi-request';
import { TableListParams, TableListItem } from './data.d';

export async function queryList(params?: TableListParams) {
  const result = await request('/api/getTrainingRegList', {
    method: 'POST',
    data: {...params},
  });

  if(result.status === 'ok') {
    return {
      data: result.list,
      total: result.total,
      success: true,
      pageSize: params?.pageSize,
      current: params?.currentPage,
    }
  }
  return {
    data: [],
    total: 0,
    success: false,
    pageSize: 0,
    current: 1,
  }
}

export async function removeTrainingReg(params: { ids: string[] }) {
  return request('/api/trainingRegs', {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}

export async function putTrainingReg(params: TableListItem) {
  return request('/api/trainingReg', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function getTrainings (){
  return request('/api/trainings')
}
