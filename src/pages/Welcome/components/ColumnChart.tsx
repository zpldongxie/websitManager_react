import React from 'react';
import { Column } from '@ant-design/charts';

const ColumnChart: React.FC = () => {
  const data = [
    {
      type: '2月',
      sales: 17,
    },
    {
      type: '3月',
      sales: 6,
    },
    {
      type: '4月',
      sales: 2,
    },
    {
      type: '5月',
      sales: 1,
    },
    {
      type: '6月',
      sales: 2,
    },
    {
      type: '7月',
      sales: 2,
    },
    {
      type: '8月',
      sales: 3,
    },
    {
      type: '9月',
      sales: 4,
    },
    {
      type: '10月',
      sales: 35,
    },
    {
      type: '11月',
      sales: 2,
    },
    {
      type: '12月',
      sales: 4,
    },
    {
      type: '1月',
      sales: 3,
    },
  ];
  const config = {
    // eslint-disable-next-line object-shorthand
    data: data,
    xField: 'type',
    yField: 'sales',
    meta: {
      type: { alias: '月份' },
      sales: { alias: '发表文章数' },
    },
  };
  return <Column {...config} />;
};
export default ColumnChart;