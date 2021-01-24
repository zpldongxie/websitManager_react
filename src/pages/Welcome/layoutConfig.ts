/*
 * @description: 页面布局配置
 * @author: zpl
 * @Date: 2021-01-24 17:11:19
 * @LastEditTime: 2021-01-24 20:51:47
 * @LastEditors: zpl
 */
import type { layoutConfigType } from './data';

const layoutConfig: layoutConfigType = {
  paddingX: 10,
  paddingY: 10,
  list: [
    {
      key: 1,
      type: 'Line',
      title: 'test',
      span: 24, // 默认值为12
      height: '200px', // 默认值为200px
    },
    {
      key: 2,
      type: 'Line',
      title: 'test',
      height: '400px',
    },
    {
      key: 3,
      type: 'group',
      children: [
        {
          key: '3-1',
          type: 'Line',
          height: '195px',
        },
        {
          key: '3-2',
          type: 'Line',
          height: '195px',
        },
        {
          key: '3-3',
          type: 'Line',
          height: '195px',
        },
        {
          key: '3-4',
          type: 'Line',
          height: '195px',
        },
      ],
    },
  ],
};

export default layoutConfig;
