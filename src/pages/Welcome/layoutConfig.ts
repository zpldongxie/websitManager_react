/*
 * @description: 页面布局配置
 * @author: zpl
 * @Date: 2021-01-24 17:11:19
 * @LastEditTime: 2021-01-25 09:46:12
 * @LastEditors: zpl
 */
import type { layoutConfigType } from './data';

const layoutConfig: layoutConfigType = {
  paddingX: 24,
  paddingY: 24,
  list: [
    {
      key: 1,
      type: 'Line',
      title: 'test',
      height: '472px',
    },
    {
      key: 2,
      type: 'Line',
      title: 'test',
      height: '472px',
    },
    {
      key: 3,
      type: 'Line',
      title: 'test',
      height: '264px',
    },
    {
      key: 4,
      type: 'Line',
      title: 'test',
      height: '264px',
      span: 6,
    },
    {
      key: 5,
      type: 'group',
      span: 6,
      children: {
        paddingX: 0,
        paddingY: 0,
        list: [
          {
            key: '5-1',
            type: 'Line',
            height: '132px',
          },
          {
            key: '5-2',
            type: 'Line',
            height: '132px',
          },
          {
            key: '5-3',
            type: 'Line',
            height: '132px',
          },
          {
            key: '5-4',
            type: 'Line',
            height: '132px',
          },
        ],
      },
    },
  ],
};

export default layoutConfig;
