import request from 'umi-request';
import type { TrainingDataType, QueryListDataType } from './data.d';

type ParamsType = {
  count?: number;
} & Partial<TrainingDataType>;

export async function getChannelList(filter: string) {
  return request(`/api/channels/${filter}`);
}

export async function queryTrainingList(params: QueryListDataType) {
  return request('/api/getTrainingList', {
    method: 'POST',
    data: { ...params, current: params.pageNum },
  });
}

export async function removeFakeList(params: ParamsType) {
  return request('/api/trainings', {
    method: 'DELETE',
    data: { ids: [params.id] },
  });
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
