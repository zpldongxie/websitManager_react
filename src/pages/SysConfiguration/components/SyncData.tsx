/*
 * @description: 数据同步
 * @author: zpl
 * @Date: 2021-02-18 15:56:33
 * @LastEditTime: 2021-02-18 17:57:27
 * @LastEditors: zpl
 */
import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Alert, Button, Card, Col, Input, message, Modal, Row } from 'antd';

import { putConfig, syncChannels, syncChannelSettings, syncArticles } from '../service';
import styles from '../index.module.less';
import { ExclamationCircleOutlined } from '@ant-design/icons';

type PropsType = {
  defaultValues: any;
};

const SyncData: FC<PropsType> = ({ defaultValues }) => {
  const [currentValues, setCurrentValues] = useState<any>({});

  useEffect(() => {
    setCurrentValues(defaultValues);
  }, [defaultValues]);

  /**
   * 更新配置，提交到数据库
   *
   * @param {string} name
   * @param {string} value
   */
  const updateConfig = async (name: string, value: string) => {
    console.log('---------', name, value);

    // if (currentValues[name] !== value) {
    const res = await putConfig({ name, value });
    if (res.status === 'ok') {
      message.success('配置修改成功');
      setCurrentValues({ ...currentValues, [name]: value });
    } else message.error(res.msg);
    // }
  };

  /**
   * 从旧数据库同步栏目数据
   *
   * @param {string} name
   * @param {string} value
   */
  const doSyncChannels = async () => {
    Modal.confirm({
      title: '请再次确认',
      icon: <ExclamationCircleOutlined />,
      content: '请再次确认是否要清空栏目信息并从指定环境重新同步数据？',
      onOk() {
        (async () => {
          const res = await syncChannels();
          console.log(res);

          if (res.status === 'ok') {
            message.success('栏目信息同步成功');
          } else message.error(res.message);
        })();
      },
      onCancel() {},
    });
  };

  /**
   * 从旧数据库同步栏目配置数据
   *
   * @param {string} name
   * @param {string} value
   */
  const doSyncChannelSettings = async () => {
    Modal.confirm({
      title: '请再次确认',
      icon: <ExclamationCircleOutlined />,
      content: '请再次确认是否要清空栏目配置信息并从指定环境重新同步数据？',
      onOk() {
        (async () => {
          const res = await syncChannelSettings();
          if (res.status === 'ok') {
            message.success('栏目配置信息同步成功');
          } else message.error(res.message);
        })();
      },
      onCancel() {},
    });
  };

  /**
   * 从旧数据库同步文章数据
   *
   * @param {string} name
   * @param {string} value
   */
  const doSyncArticles = async () => {
    Modal.confirm({
      title: '请再次确认',
      icon: <ExclamationCircleOutlined />,
      content: '请再次确认是否要清空文章信息并从指定环境重新同步数据？',
      onOk() {
        (async () => {
          const res = await syncArticles();
          if (res.status === 'ok') {
            message.success('文章信息同步成功');
          } else message.error(res.message);
        })();
      },
      onCancel() {},
    });
  };

  return (
    <div className={styles.con}>
      <Card
        title="同步设置"
        headStyle={{ borderBottom: 'none' }}
        bodyStyle={{ paddingLeft: '2rem' }}
        style={{ marginBottom: '0.6rem' }}
      >
        <Row>
          <Col flex="8em" className={styles.labelCol}>
            <span>同步数据源</span>
          </Col>
          <Col className={styles.valueCol}>
            <Input
              name="oldManager"
              value={currentValues.oldManager}
              onChange={(e) => {
                setCurrentValues({ ...currentValues, oldManager: e.target.value });
              }}
              onPressEnter={(e) => {
                updateConfig('oldManager', (e.target as HTMLInputElement).value);
              }}
              onBlur={(e) => {
                updateConfig('oldManager', e.target.value);
              }}
            />
          </Col>
        </Row>
      </Card>
      <Card>
        <Alert
          message="警告"
          description="数据同步操作会大批量修改数据，甚至清空数据库，请谨慎操作。"
          type="warning"
          showIcon
        />
        <Row gutter={40} justify="center" style={{ margin: '3rem 0' }}>
          <Col>
            <Button danger shape="round" size="large" onClick={doSyncChannels}>
              同步栏目数据
            </Button>
          </Col>
          <Col>
            <Button danger shape="round" size="large" onClick={doSyncChannelSettings}>
              同步栏目配置数据
            </Button>
          </Col>
          <Col>
            <Button danger shape="round" size="large" onClick={doSyncArticles}>
              同步文章数据
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default SyncData;
