/*
 * @description: 欢迎页
 * @author: zpl
 * @Date: 2021-01-24 16:58:42
 * @LastEditTime: 2021-01-25 09:50:51
 * @LastEditors: zpl
 */
import React from 'react';
import type { FC } from 'react';
import { Col, Row, Tabs } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import LineChart from './components/LineChart';
import ColumnChart from './components/ColumnChart';
import UserInfo from './components/UserInfo';
import TabContent from './components/TabContent';

import layoutConfig from './layoutConfig';
import type { layoutConfigType, LayoutItemType } from './data';
import styles from './index.module.less';

const { TabPane } = Tabs;
/**
 * 根据type调用对应组件进行渲染
 *
 * @param {LayoutItemType} item
 * @return {*}
 */
const renderComp = (item: LayoutItemType) => {
  const { type, title, data, dataRequest, reverse } = item;

  switch (type) {
    case 'Line':
      return <LineChart title={title} data={data} dataRequest={dataRequest} />;
    case 'Column':
      return <ColumnChart />;
    case 'Legend':
      return <h3>{data}</h3>
    case 'Tab':
      return <Tabs defaultActiveKey="1">
        {data.map((ele: { tabName: string; tabList: any; dataRequestUrl: { method: "get" | "post"; url: string; payload: string | Record<string, string>; } | undefined; }, i: number) => {
          // eslint-disable-next-line react/no-array-index-key
          return <TabPane tab={ele.tabName} key={i + 1}>
            <TabContent data={ele.tabList} dataRequest={ele.dataRequestUrl} />
          </TabPane>
        })}
      </Tabs>
    case 'List':
      return <TabContent />
    case 'Grid':
      return <div className={reverse ? `${styles.collectData} ${styles.reverseData}` : `${styles.collectData} ${styles.normalData}`}>
        {data.map((ele: { name: string; number: string; }, key: any) => {
          return <div data-index={key}>
            {reverse ? <span>{ele.number}</span> : <p>{ele.name}</p>}
            {reverse ? <p>{ele.name}</p> : <span>{ele.number}</span>}
          </div>
        })}
      </div>
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
        <div style={style} className={item.className}>{renderComp(item)}</div>
      </Col >
    );
  });
};

const Welcome: FC = () => {
  const { paddingX } = layoutConfig;
  return (
    <PageHeaderWrapper className={styles.contentListWrapper} title={false}>
      <UserInfo />
      <Row gutter={paddingX}>{renderList(layoutConfig)}</Row>
    </PageHeaderWrapper>
  );
};

export default Welcome;
