/*
 * @description: 欢迎页
 * @author: zpl
 * @Date: 2021-01-24 16:58:42
 * @LastEditTime: 2021-01-25 09:50:51
 * @LastEditors: zpl
 */
import React from 'react';
import type { FC } from 'react';
import { Col, Row } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import LineChart from './components/LineChart';

import layoutConfig from './layoutConfig';
import type { layoutConfigType, LayoutItemType } from './data';
import styles from './index.module.less';

/**
 * 根据type调用对应组件进行渲染
 *
 * @param {LayoutItemType} item
 * @return {*}
 */
const renderComp = (item: LayoutItemType) => {
  const { type, title, data, dataRequest } = item;

  switch (type) {
    case 'Line':
      return <LineChart title={title} data={data} dataRequest={dataRequest} />;
    default:
      return <></>;
  }
};

// item默认属性
const defaultItemSettings: LayoutItemType = {
  key: '',
  type: 'test',
  span: 12,
};

const defaultColStyle: React.CSSProperties = {
  height: '200px',
  border: 'solid #aaa 1px',
  padding: '10px',
  backgroundColor: '#fff',
};

/**
 * 递归渲染布局，支持分组
 *
 * @param {LayoutItemType[]} list
 * @return {*}
 */
const renderList = (setting: layoutConfigType | undefined) => {
  const { list = [], paddingY = 10 } = setting || {};
  if (!list.length) {
    return <></>;
  }
  return list.map((item) => {
    const { height = defaultColStyle.height, span = defaultItemSettings.span } = item;
    const settings = { ...defaultItemSettings, span };
    const style = { ...defaultColStyle, height };
    if (item.type === 'group') {
      return (
        <Col
          key={settings.key}
          span={settings.span}
          flex={settings.flex}
          style={{ margin: `${paddingY / 2}px 0` }}
        >
          <Row gutter={item.children?.paddingX}>{renderList(item.children)}</Row>
        </Col>
      );
    }
    return (
      <Col
        key={settings.key}
        span={settings.span}
        flex={settings.flex}
        style={{ margin: `${paddingY / 2}px 0` }}
      >
        <div style={style}>{renderComp(item)}</div>
      </Col>
    );
  });
};

const Welcome: FC = () => {
  const { paddingX } = layoutConfig;
  return (
    <PageHeaderWrapper className={styles.contentListWrapper} title={false}>
      <Row gutter={paddingX}>{renderList(layoutConfig)}</Row>
    </PageHeaderWrapper>
  );
};

export default Welcome;
