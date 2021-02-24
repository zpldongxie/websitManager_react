/*
 * @description:
 * @author: zpl
 * @Date: 2021-02-02 11:46:49
 * @LastEditTime: 2021-02-21 09:01:34
 * @LastEditors: zpl
 */
import React from 'react';
import type { FC } from 'react';
import { Select } from 'antd';
import type { SelectValue } from 'antd/lib/select';

const { Option } = Select;

type PropsType = {
  defaultValue: number;
  handleChange: (value: SelectValue) => void;
};

const ShowStatus: FC<PropsType> = ({ defaultValue, handleChange }: PropsType) => {
  return (
    <Select
      defaultValue={defaultValue}
      style={{ width: '10em', textAlign: 'center' }}
      bordered={false}
      onChange={handleChange}
    >
      <Option value={0}>不显示</Option>
      <Option value={1}>全部显示</Option>
      <Option value={2}>仅主菜单显示</Option>
      <Option value={3}>仅侧边菜单显示</Option>
      <Option value={4}>单独显示</Option>
    </Select>
  );
};

export default ShowStatus;
