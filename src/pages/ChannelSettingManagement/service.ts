/* eslint-disable no-plusplus */
/* eslint-disable no-console */
import request from 'umi-request';

import { convertChannelSetting } from '@/utils/utils';
import type { ChannelSettingType, ChannelSettingTypes } from '@/utils/data';
/**
 * 查询全站配置信息
 *
 * @export
 * @return {*}
 */
export async function queryAllSetting() {
  const url = '/api/getChannelSettingList';
  const result = await request(url, {
    method: 'POST',
    data: {
      ChannelId: null,
      pageSize: -1,
    },
  });
  if (result.status === 'ok') {
    return {
      data: result.data,
      success: true,
    };
  }
  return {
    data: [],
    success: false,
  };
}
/**
 * 查询所有栏目信息
 *
 * @export
 * @return {*}
 */
export async function queryAll(filter?: Record<string, any[]>) {
  let url = '/api/channels';


  if (filter && filter.showStatus) {
    url = `/api/channels/show/${filter.showStatus}`;
  }
  const result = await request(url);
  if (result.status === 'ok') {
    for (let i: number = 0; i < result.data.length; i++) {
      convertChannelSetting(result.data[i]);
    }
    return {
      data: result.data,
      success: true,
    };
  }
  return {
    data: [],
    success: false,
  };
}

/**
 * 查询所有栏目类型信息
 *
 * @export
 * @return {*}
 */
export async function queryAllTypes() {
  const result = await request('/api/channeltypes');

  if (result.status === 'ok') {
    return result.data;
  }
  return [];
}

/**
 * 设置栏目配置继承状态
 *
 * @export
 * @return {*}
 */
export async function updateSettingExtend(channelId: string,status: boolean) {
  const url = '/api/channel/settingExtend';
  const result = await request(url, {
    method: 'PUT',
    data: {
      id: channelId,
      settingExtend: status,
    },
  });
  if (result.status === 'ok') {
    
    return {
      data: result.data,
      success: true,
    };
  }
  return {
    data: [],
    success: false,
  };
}

/**
 * 更新栏目配置数据
 *
 * @export
 * @return {*}
 */
export async function updateChannelSetting(values: ChannelSettingType) {
  const url = '/api/channelsetting';
  const result = await request(url, {
    method: 'PUT',
    data: values,
  });
  if (result.status === 'ok') {
    
    return {
      data: result.data,
      success: true,
    };
  }
  return {
    data: [],
    success: false,
  };
}


/**
 * 更新栏目配置数据
 *
 * @export
 * @return {*}
 */
export async function updateChannelSettings(values: ChannelSettingTypes) {
  const url = '/api/channelsetting/updateMany';
  const result = await request(url, {
    method: 'PUT',
    data: values,
  });
  if (result.status === 'ok') {
    return {
      data: result.data,
      success: true,
    };
  }
  return {
    data: [],
    success: false,
  };
}

/**
 * 删除栏目配置数据
 *
 * @export
 * @return {*}
 */
export async function deleteChannelSetting(idArray: string[]) {
  const url = '/api/channelsettings';
  const result = await request(url, {
    method: 'DELETE',
    data: {
      ids: idArray
    },
  });
  if (result.status === 'ok') {
    
    return {
      data: result.data,
      success: true,
    };
  }
  return {
    data: [],
    success: false,
  };
}