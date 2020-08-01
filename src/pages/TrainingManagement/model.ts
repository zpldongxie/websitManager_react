import { Effect, Reducer } from 'umi';
import { addFakeList, queryTrainingList, removeFakeList, updateFakeList } from './service';

import { TrainingDataType } from './data.d';

export interface StateType {
  filter: string;
  pageNum: number;
  pageSize: number;
  total: number;
  list: TrainingDataType[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    submit: Effect;
    pageChange: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    pageChange: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'trainingManagement',

  state: {
    filter: '',
    pageNum: 1,
    pageSize: 20,
    total: 0,
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const param = {...payload, search: payload.filter};
      const response = yield call(queryTrainingList, param);
      yield put({
        type: 'queryList',
        payload: response.status === 'ok' ? { ...payload, ...response} : {},
      });
    },
    *submit({ payload }, { call, put }) {
      
      let callback = addFakeList;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeFakeList : updateFakeList;
      }
      yield call(callback, payload); // post
      const response = yield call(queryTrainingList, payload);
      
      yield put({
        type: 'queryList',
        payload: response.status === 'ok' ? response.list : [],
      });
    },
    pageChange({ payload }, { put }) {
      put({
        type: 'pageChange',
        payload
      })
    }
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    pageChange(state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  },
};

export default Model;
