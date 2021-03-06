import type { Effect, Reducer } from 'umi';
import { getChannelList, addFakeList, queryTrainingList, updateFakeList } from './service';

import type { TrainingDataType } from './data.d';

export type StateType = {
  filter: string;
  pageNum: number;
  pageSize: number;
  total: number;
  list: TrainingDataType[];
  channelList: { id: string; name: string }[];
  done: boolean;
};

export type ModelType = {
  namespace: string;
  state: StateType;
  effects: {
    getChannels: Effect;
    fetch: Effect;
    submit: Effect;
    pageChange: Effect;
    setDone: Effect;
  };
  reducers: {
    queryChannels: Reducer<StateType>;
    queryList: Reducer<StateType>;
    setDone: Reducer<StateType>;
  };
};

const Model: ModelType = {
  namespace: 'trainingManagement',

  state: {
    filter: '',
    pageNum: 1,
    pageSize: 20,
    total: 0,
    list: [],
    channelList: [],
    done: false,
  },

  effects: {
    *getChannels({ payload }, { call, put }) {
      const response = yield call(getChannelList, payload);
      if (response.status === 'ok') {
        yield put({
          type: 'queryChannels',
          payload: Array.isArray(response.data) ? response.data : [],
        });
      }
    },
    *fetch({ payload }, { call, put }) {
      const param = { ...payload, search: payload.filter };
      const response = yield call(queryTrainingList, param);
      yield put({
        type: 'queryList',
        payload: response.status === 'ok' ? { ...payload, ...response.data } : {},
      });
    },
    *submit({ payload }, { call, put }) {
      let callback = addFakeList;
      if (payload.id) {
        callback = updateFakeList;
      }
      yield call(callback, payload); // post
      // const response = yield call(queryTrainingList, payload);
      yield put({
        type: 'setDone',
        payload: true,
      });
      yield put({
        type: 'queryList',
        payload: {},
      });
    },
    pageChange({ payload }, { put }) {
      put({
        type: 'queryList',
        payload,
      });
    },
    setDone({ payload }, { put }) {
      put({
        type: 'setDone',
        payload,
      });
    },
  },

  reducers: {
    queryChannels(state: any, action) {
      return {
        ...state,
        channelList: action.payload,
      };
    },
    queryList(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    setDone(state: any, action) {
      return {
        ...state,
        done: action.payload,
      };
    },
  },
};

export default Model;
