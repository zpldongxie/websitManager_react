/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import type { Route } from '@/models/connect';
import type { ChannelType, TreeNodeType, ChannelSettingList, ChannelSettingType, SiteSettingList } from './data';
import _ from 'lodash';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * 转换栏目接口返回数据为组件需要的树型数据结构
 *
 * @param {ChannelType[]} list 原始数据
 * @param {TreeNodeType[]} channels 目标数据
 * @param {(number | null)} parentId 支持递归需要知道挂载到哪个父id上
 */
export const convertChannelsToTree = (
  list: ChannelType[],
  channels: TreeNodeType[],
  parentId: string | null,
) => {
  for (let i = list.length - 1; i >= 0; i -= 1) {
    const channel = list[i];
    if (channel.parentId === parentId) {
      channels.push({
        value: channel.id,
        label: channel.name,
        key: channel.id!,
        title: channel.name,
        ...channel,
      });
      list.splice(i, 1);
    }
  }
  if (list.length) {
    channels.forEach((channel: TreeNodeType) => {
      channel.children = [];
      convertChannelsToTree(list, channel.children, channel.value as string);
      if (!channel.children.length) {
        channel.children = undefined;
      }
    });
  }
};

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends Route>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(
    ({ routes, path = '/', target = '_self' }) =>
      (path && target !== '_blank' && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach((route) => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

/**
 * 转换接口返回数据为栏目配置组件需要的数据结构
 *
 * @param {ChannelSettingType} channel 原始数据
 */
export const convertSettingData = (
  setting: ChannelSettingType,
  data: ChannelSettingList[],
  disable?: boolean,
) => {
  let index: number = 0;
  switch (setting.type) {
    case "pic":
      index = 0;
      break;
    case "url":
      index = 1;
      break;
    case "desc":
      index = 2;
      break;
    case "video":
      index = 3;
      break;
    default:
      break;
  }
  const dataList = data[index].list;
  const groupName = setting.group === "" ? '未分组' : setting.group;
  let newGroup: boolean = true;
  if (disable) {
    setting.disabled = true;
  }
  setting.key = setting.id;
  for (let k = 0; k < dataList.length; k++) {
    if (dataList[k].groupName === groupName) {
      newGroup = false;
      dataList[k].dataResource.push(setting);
    }
  }
  if (newGroup) {
    dataList.unshift({
      groupName,
      groupEdit: false,
      dataResource: [setting]
    });
  }
};

/**
 * 转换全站配置接口返回数据为栏目配置组件需要的数据结构
 *
 * @param {SiteSettingList} channel 原始数据
 */
export const convertSiteSetting = (
  site: SiteSettingList,
) => {
  const resourceData: ChannelSettingList[] = [{
    type: 'pic',
    tabName: '图片',
    list: []
  }, {
    type: 'url',
    tabName: '链接',
    list: []
  }, {
    type: 'desc',
    tabName: '文本',
    list: []
  }, {
    type: 'video',
    tabName: '视频',
    list: []
  }];
  const channelSetting = site.list;
  for (let j: number = 0; j < channelSetting!.length; j++) {
    const setting = channelSetting![j];
    convertSettingData(setting, resourceData, true);
  }
  site.ChannelSettingList = resourceData;
};
/**
 * 转换栏目接口返回数据为栏目配置组件需要的数据结构
 *
 * @param {ChannelType} channel 原始数据
 */
export const convertChannelSetting = (
  channel: ChannelType,
) => {
  const channelSetting = channel.ChannelSettings;
  const resourceData: ChannelSettingList[] = [{
    type: 'pic',
    tabName: '图片',
    list: []
  }, {
    type: 'url',
    tabName: '链接',
    list: []
  }, {
    type: 'desc',
    tabName: '文本',
    list: []
  }, {
    type: 'video',
    tabName: '视频',
    list: []
  }];
  for (let j: number = 0; j < channelSetting!.length; j++) {
    const setting = channelSetting![j];
    convertSettingData(setting, resourceData);
  }
  channel.ChannelSettingList = resourceData;
};

/**
 * 
 * @param tree 
 * @param key 
 * @param value 
 * @param childrenKey 
 */
export const findItemFromTree = (tree: any[], key: string, value: any, childrenKey: string = 'children') => {
  let current: any = null;
  tree.find((item: any) => {
    if (item[key] === value) {
      current = item;
      return true;
    }
    if (item[childrenKey] && Array.isArray(item[childrenKey])) {
      const child = findItemFromTree(item[childrenKey], key, value, childrenKey);
      if (child) {
        current = child;
        return true;
      }
    }
    return false;
  });
  return current;
}
