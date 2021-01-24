/*
 * @description: 拆线图
 * @author: zpl
 * @Date: 2021-01-24 18:21:05
 * @LastEditTime: 2021-01-24 20:58:46
 * @LastEditors: zpl
 */
import React, { useEffect, useState } from 'react';
import { Line } from '@ant-design/charts';
import request from 'umi-request';

import type { LineChartSettings } from '../data';

const defaultSettings: LineChartSettings = {
  data: [
    { Date: '2010-01', scales: 1998 },
    { Date: '2010-02', scales: 1850 },
    { Date: '2010-03', scales: 1720 },
    { Date: '2010-04', scales: 1818 },
    { Date: '2010-05', scales: 1920 },
    { Date: '2010-06', scales: 1802 },
    { Date: '2010-07', scales: 1945 },
    { Date: '2010-08', scales: 1856 },
    { Date: '2010-09', scales: 2107 },
    { Date: '2010-10', scales: 2140 },
    { Date: '2010-11', scales: 2311 },
  ],
  padding: 'auto',
  xField: 'Date',
  yField: 'scales',
  annotations: [
    {
      type: 'regionFilter',
      start: ['min', 'median'],
      end: ['max', '0'],
      color: '#F4664A',
    },
    {
      type: 'text',
      position: ['min', 'median'],
      content: '中位数',
      offsetY: -4,
      style: { textBaseline: 'bottom' },
    },
    {
      type: 'line',
      start: ['min', 'median'],
      end: ['max', 'median'],
      style: {
        stroke: '#F4664A',
        lineDash: [2, 2],
      },
    },
  ],
};

type PropsType = {
  title?: string;
  data?: any;
  dataRequest?: {
    method: 'post' | 'get';
    url: string;
    payload: string | Record<string, string>;
  };
};

const LineChart: React.FC<PropsType> = ({ data, dataRequest }) => {
  const [currentData, setCurrentData] = useState([]);

  useEffect(() => {
    (async () => {
      let newData = [];
      if (data) {
        newData = data;
      } else if (dataRequest) {
        const { method, url, payload } = dataRequest;
        newData = await request(url, {
          method,
          data: payload,
        });
      } else {
        newData = defaultSettings.data;
      }
      setCurrentData(newData);
    })();
  }, [data, dataRequest]);

  const config = { ...defaultSettings, data: currentData };
  return <Line {...config} />;
};

export default LineChart;
