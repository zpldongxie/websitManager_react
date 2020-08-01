import request from 'umi-request';
import { TrainingDataType, QueryListDataType } from './data.d';

interface ParamsType extends Partial<TrainingDataType> {
  count?: number;
}

export async function queryTrainingList(params: QueryListDataType) {
  return request('/api/getTrainingList', {
    method: 'POST',
    data: {...params, current: params.pageNum},
  });
}

export async function removeFakeList(params: ParamsType) {
  return request('/api/training', {
    method: 'DELETE',
    data: params,
  })
}

export async function addFakeList(params: ParamsType) {
  return request('/api/training', {
    method: 'PUT',
    data: params,
  });
}

export async function updateFakeList(params: ParamsType) {
  return request('/api/training', {
    method: 'PUT',
    data: params,
  });
}
