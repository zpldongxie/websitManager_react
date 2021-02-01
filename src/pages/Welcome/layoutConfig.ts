/*
 * @description: 页面布局配置
 * @author: zpl
 * @Date: 2021-01-24 17:11:19
 * @LastEditTime: 2021-01-25 09:46:12
 * @LastEditors: zpl
 */
import type { layoutConfigType } from './data';

const articleYear = [{ name: '2021年新增', number: 3 }, { name: '2020年新增', number: 77 }, { name: '2019年新增', number: 28 }, { name: '2018年新增', number: 26 }];
const memberNum = [{ name: '副理事长单位', number: '4' }, { name: '理事单位', number: '8' }, { name: '单位会员', number: '35' }, { name: '个人会员', number: '0' }];
const serviceNum = [{ name: '方案咨询', number: '0' }, { name: '方案论证', number: '0' }, { name: '方案设计', number: '0' }, { name: '安全评估', number: '0' }];
const todoList = [
  { tabName: '企业入会', dataRequestUrl: '', tabList: [{name:'陕西君宴亚联司法鉴定评估有限公司',status:'申请中'},{name:'西安云适配网络科技有限公司',status:'初审通过'}]},
  { tabName: '个人入会', dataRequestUrl: '', tabList: [{name:'刘安平',status:'申请中'}]},
  { tabName: '产商入驻', dataRequestUrl: '', tabList: [{name:'陕西君宴亚联司法鉴定评估有限公司',status:'申请中'}] },
  { tabName: '产品入驻', dataRequestUrl: '', tabList: [] },
];
const layoutConfig: layoutConfigType = {
  paddingX: 24,
  paddingY: 24,
  list: [
    {
      key: 1,
      title: '文章',
      type: 'group',
      children: {
        paddingX: 0,
        paddingY: 0,
        list: [{
          key: '1-0',
          type: 'Legend',
          height: '55px',
          className: 'boxBordered',
          span: 24,
          data: '文章'
        },
        {
          key: '1-1',
          type: 'Column',
          height: '300px',
          className: 'boxBordered paddingTop',
          span: 24
        }, {
          key: '1-2',
          type: 'Grid',
          reverse: false,
          height: '80px',
          data: articleYear,
          span: 24
        },
        ]
      },
    },
    {
      key: 2,
      title: '会员',
      type: 'group',
      children: {
        paddingX: 0,
        paddingY: 0,
        list: [{
          key: '2-0',
          type: 'Legend',
          height: '55px',
          className: 'boxBordered',
          span: 24,
          data: '会员'
        }, {
          key: '2-1',
          type: 'Grid',
          height: '80px',
          data: memberNum,
          className: 'boxBordered',
          span: 24
        },
        {
          key: '2-2',
          type: 'Line',
          height: '300px',
          className: 'paddingTop',
          span: 24
        },
        ]
      },
    },
    {
      key: 3,
      type: 'Tab',
      title: '待办事项',
      height: '260px',
      data: todoList
    },
    {
      key: 4,
      type: 'group',
      title: '培训报名审批',
      height: '255px',
      span: 6,
      children: {
        paddingX: 0,
        paddingY: 0,
        list: [{
          key: '4-0',
          type: 'Legend',
          height: '55px',
          className: 'boxBordered',
          span: 24,
          data: '培训报名审批'
        }, {
          key: '4-1',
          type: 'List',
          className: 'paddingZero',
          height: '205px',
          span: 24,
        },
        ]
      },
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
            type: 'Grid',
            reverse: true,
            className: 'paddingZero',
            height: '260px',
            data: serviceNum,
            span: 24
          }
        ],
      },
    },
  ],
};

export default layoutConfig;
