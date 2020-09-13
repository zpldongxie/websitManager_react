import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { Route } from '@/models/connect';
import { TreeNodeType } from './data';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * 转换栏目接口返回数据为组件需要的树型数据结构
 *
 * * @param {{
 *     id: number,
 *     name: string,
 *     parentId?: number
 *   }[]} list 原始数据
 * @param {TreeNodeType[]} channels 目标数据
 * @param {(number | null)} parentId 支持递归需要知道挂载到哪个父id上
 */
export const convertChannelsToTree = (
  list: {
    id: number;
    name: string;
    parentId?: number;
  }[],
  channels: TreeNodeType[],
  parentId: number | null,
) => {
  for (let i = list.length - 1; i >= 0; i -= 1) {
    const channel = list[i];
    if (channel.parentId === parentId) {
      channels.push({
        value: channel.id,
        label: channel.name,
        children: [],
      });
      list.splice(i, 1);
    }
  }
  if (list.length) {
    channels.forEach((channel: TreeNodeType) => {
      convertChannelsToTree(list, channel.children!, channel.value as number);
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
