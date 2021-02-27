import React, { useEffect, useState } from 'react';
import { Col, Menu, Row, Button } from 'antd';
import Interweave from 'interweave';
import moment from 'moment';

import { AppstoreOutlined, MailOutlined, SettingOutlined, LeftOutlined } from '@ant-design/icons';
import { getContent } from './service';
import styles from './index.module.less';

const { SubMenu } = Menu;
const TestSecondMenu = () => {
  return (
    <Menu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} mode="inline">
      <SubMenu
        key="sub1"
        title={
          <span>
            <MailOutlined />
            <span>Navigation One</span>
          </span>
        }
      >
        <Menu.ItemGroup key="g1" title="Item 1">
          <Menu.Item key="1">Option 1</Menu.Item>
          <Menu.Item key="2">Option 2</Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup key="g2" title="Item 2">
          <Menu.Item key="3">Option 3</Menu.Item>
          <Menu.Item key="4">Option 4</Menu.Item>
        </Menu.ItemGroup>
      </SubMenu>
      <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Navigation Two">
        <Menu.Item key="5">Option 5</Menu.Item>
        <Menu.Item key="6">Option 6</Menu.Item>
        <SubMenu key="sub3" title="Submenu">
          <Menu.Item key="7">Option 7</Menu.Item>
          <Menu.Item key="8">Option 8</Menu.Item>
        </SubMenu>
      </SubMenu>
      <SubMenu
        key="sub4"
        title={
          <span>
            <SettingOutlined />
            <span>Navigation Three</span>
          </span>
        }
      >
        <Menu.Item key="9">Option 9</Menu.Item>
        <Menu.Item key="10">Option 10</Menu.Item>
        <Menu.Item key="11">Option 11</Menu.Item>
        <Menu.Item key="12">Option 12</Menu.Item>
      </SubMenu>
    </Menu>
  );
};

type PropsType = {
  visiable?: boolean;
  id?: string;
  hiddenHandler: () => void;
};
const ArticlePreview = ({ visiable = false, id, hiddenHandler }: PropsType) => {
  const [content, setContent] = useState<ContentType | null>(null);
  useEffect(() => {
    (async () => {
      if (visiable && id) {
        const res = await getContent(id);
        if (res.status === 'ok') {
          setContent(res.data);
        }
      }
    })();
  }, [visiable, id]);
  return (
    <div className={styles.articleCon} style={{ left: visiable ? '0' : '-100vw' }}>
      <div className={styles.header}>
        <Button
          type="primary"
          size="large"
          icon={<LeftOutlined />}
          onClick={hiddenHandler}
          className={styles.back}
        >
          返回
        </Button>
        网页头部
      </div>
      <div className={styles.body}>
        <Row gutter={30}>
          <Col flex="320px">
            <TestSecondMenu />
            <div className="left-bottom">{/* <QuickEntry settings={settings} column={2} /> */}</div>
          </Col>
          <Col flex="auto">
            <div className="topTitle">
              <span>XXX</span>
            </div>
            <div className="contentCon">
              <div className="content-title">{content ? content.title : ''}</div>
              <div className="content-time">{`时间： ${
                content ? moment(content.conDate).format('YYYY-MM-DD HH:mm') : ''
              }`}<span style={{marginLeft: 10}}>{` 来源：${content?.source}`}</span></div>
              <div className="content-mainCon">
                <Interweave content={content ? content.mainCon : ''} />
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles.footer}>网页页脚</div>
    </div>
  );
};

export default ArticlePreview;
