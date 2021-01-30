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

const defaultData = [
  { year: "2017", value: 2, category: "副理事长单位" },
  { year: "2017", value: 4, category: "理事单位" },
  { year: "2017", value: 8, category: "单位会员" },
  { year: "2017", value: 0, category: "个人会员" },
  { year: "2018", value: 2, category: "副理事长单位" },
  { year: "2018", value: 5, category: "理事单位" },
  { year: "2018", value: 12, category: "单位会员" },
  { year: "2018", value: 0, category: "个人会员" },
  { year: "2019", value: 4, category: "副理事长单位" },
  { year: "2019", value: 8, category: "理事单位" },
  { year: "2019", value: 27, category: "单位会员" },
  { year: "2019", value: 0, category: "个人会员" },
  { year: "2020", value: 4, category: "副理事长单位" },
  { year: "2020", value: 8, category: "理事单位" },
  { year: "2020", value: 35, category: "单位会员" },
  { year: "2020", value: 0, category: "个人会员" },
  { year: "2021", value: 4, category: "副理事长单位" },
  { year: "2021", value: 8, category: "理事单位" },
  { year: "2021", value: 35, category: "单位会员" },
  { year: "2021", value: 0, category: "个人会员" },
];
const defaultSettings: LineChartSettings = {
  // eslint-disable-next-line object-shorthand
  data: defaultData,
  xField: 'year',
  yField: 'value',
  seriesField: 'category',
  legend: { position: 'top-right' },
  yAxis: {
    label: {
      formatter: function formatter(v: string) {
        // eslint-disable-next-line func-names
        return ''.concat(v).replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
          return ''.concat(s, ',');
        });
      },
    },
  },
  color: ['#1979C9', '#D62A0D', '#FAA219', '#52C41A'],
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
