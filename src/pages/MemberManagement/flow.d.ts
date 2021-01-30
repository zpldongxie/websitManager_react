import React from 'react';

export default React.createContext({
  nodes: [
    {
      id: '0',
      label: '提出申请',
    },
    {
      id: '2',
      label: '初审通过',
    },
    {
      id: '3',
      label: '申请驳回',
    },
    {
      id: '4',
      label: '完善资料',
    },
    {
      id: '6',
      label: '正式会员',
    },
    {
      id: '7',
      label: '申请驳回',
    },
  ],
  edges: [
    {
      source: '0',
      target: '2',
    },
    {
      source: '0',
      target: '3',
    },
    {
      source: '2',
      target: '4',
    },
    {
      source: '4',
      target: '6',
    },
    {
      source: '4',
      target: '7',
    }
  ],
});