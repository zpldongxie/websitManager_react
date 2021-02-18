/*
 * @description: 上传配置
 * @author: zpl
 * @Date: 2021-02-18 11:48:59
 * @LastEditTime: 2021-02-18 16:12:20
 * @LastEditors: zpl
 */
import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Button, Col, Card, Input, InputNumber, message, Row, Tooltip } from 'antd';
import { ExclamationCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import { putConfig } from '../service';
import { uploadConfig } from '../defaultConfigInfo.json';

import type { CardProps } from 'antd/lib/card';
import styles from '../index.module.less';

const text = (
  <div>
    <div>访问资源的根路径。</div>
    <div>例如：http://www.snains.cn/upload</div>
  </div>
);

const CustomCard = ({ title, extra, children }: CardProps) => (
  <Card
    title={title}
    extra={extra}
    headStyle={{ borderBottom: 'none' }}
    bodyStyle={{ paddingLeft: '2rem' }}
    style={{ marginBottom: '0.6rem' }}
  >
    {children}
  </Card>
);

type PropsType = {
  defaultValues: any;
};

const UploadConfig: FC<PropsType> = ({ defaultValues }) => {
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
    // if (currentValues[name] !== value) {
    const res = await putConfig({ name, value });
    if (res.status === 'ok') {
      message.success('配置修改成功');
      setCurrentValues({ ...currentValues, [name]: value });
    } else message.error(res.msg);
    // }
  };

  /**
   * 重置指定类型配置
   *
   * @param {string} val 配置前缀，如image\video等
   */
  const resetConfig = (val: string) => {
    const confData = {};
    uploadConfig
      .filter((conf: { descStr: string; name: string; value: string }) => conf.name.startsWith(val))
      .forEach((conf: { descStr: string; name: string; value: string }) => {
        confData[conf.name] = conf.value;
        updateConfig(conf.name, conf.value);
      });
    setCurrentValues({ ...currentValues, ...confData });
  };

  return (
    <div className={styles.con}>
      <CustomCard
        title={
          <>
            资源根路径
            <Tooltip placement="topLeft" title={text} overlayStyle={{ maxWidth: 300 }}>
              <QuestionCircleOutlined style={{ marginLeft: 10 }} />
            </Tooltip>
          </>
        }
        extra={
          <Button
            type="primary"
            ghost
            onClick={() => {
              resetConfig('base');
            }}
          >
            恢复默认设置
          </Button>
        }
      >
        <Row>
          <Col flex="8em" className={styles.labelCol}>
            <span>访问域名/IP</span>
          </Col>
          <Col className={styles.valueCol}>
            <Input
              name="base_url"
              value={currentValues.base_url}
              onChange={(e) => {
                setCurrentValues({ ...currentValues, base_url: e.target.value });
              }}
              onPressEnter={(e) => {
                updateConfig('base_url', (e.target as HTMLInputElement).value);
              }}
              onBlur={(e) => {
                updateConfig('base_url', e.target.value);
              }}
            />
          </Col>
        </Row>
      </CustomCard>

      <CustomCard
        title="图片上传"
        extra={
          <Button
            type="primary"
            ghost
            onClick={() => {
              resetConfig('image');
            }}
          >
            恢复默认设置
          </Button>
        }
      >
        <Row>
          <Col flex="8em" className={styles.labelCol}>
            <span>格式限制</span>
          </Col>
          <Col className={styles.valueCol}>
            <Input
              name="image_ext"
              value={currentValues.image_ext}
              onChange={(e) => {
                setCurrentValues({ ...currentValues, image_ext: e.target.value });
              }}
              onPressEnter={(e) => {
                updateConfig('image_ext', (e.target as HTMLInputElement).value);
              }}
              onBlur={(e) => {
                updateConfig('image_ext', e.target.value);
              }}
            />
            <Tooltip title="请设置图片文件格式限制!">
              <ExclamationCircleOutlined style={{ color: 'red' }} />
            </Tooltip>
          </Col>
        </Row>
        <Row>
          <Col flex="8em" className={styles.labelCol}>
            <span>大小限制</span>
          </Col>
          <Col className={styles.valueCol}>
            <InputNumber
              name="image_size"
              value={currentValues.image_size}
              onChange={(value) => {
                setCurrentValues({ ...currentValues, image_size: value });
              }}
              onPressEnter={(e) => {
                updateConfig('image_size', (e.target as HTMLInputElement).value);
              }}
              onBlur={(e) => {
                updateConfig('image_size', e.target.value);
              }}
            />
            <Tooltip title="请设置图片文件大小限制!">
              <ExclamationCircleOutlined style={{ color: 'red' }} />
            </Tooltip>
            <span className={styles.sizeAfter}>KB</span>
          </Col>
        </Row>
      </CustomCard>

      <CustomCard
        title="视频上传"
        extra={
          <Button
            type="primary"
            ghost
            onClick={() => {
              resetConfig('video');
            }}
          >
            恢复默认设置
          </Button>
        }
      >
        <Row>
          <Col flex="8em" className={styles.labelCol}>
            <span>格式限制</span>
          </Col>
          <Col className={styles.valueCol}>
            <Input
              name="video_ext"
              value={currentValues.video_ext}
              onChange={(e) => {
                setCurrentValues({ ...currentValues, video_ext: e.target.value });
              }}
              onPressEnter={(e) => {
                updateConfig('video_ext', (e.target as HTMLInputElement).value);
              }}
              onBlur={(e) => {
                updateConfig('video_ext', e.target.value);
              }}
            />
            <Tooltip title="请设置视频文件格式限制!">
              <ExclamationCircleOutlined style={{ color: 'red' }} />
            </Tooltip>
          </Col>
        </Row>
        <Row>
          <Col flex="8em" className={styles.labelCol}>
            <span>大小限制</span>
          </Col>
          <Col className={styles.valueCol}>
            <InputNumber
              name="video_size"
              value={currentValues.video_size}
              onChange={(value) => {
                setCurrentValues({ ...currentValues, video_size: value });
              }}
              onPressEnter={(e) => {
                updateConfig('video_size', (e.target as HTMLInputElement).value);
              }}
              onBlur={(e) => {
                updateConfig('video_size', e.target.value);
              }}
            />
            <Tooltip title="请设置视频文件大小限制!">
              <ExclamationCircleOutlined style={{ color: 'red' }} />
            </Tooltip>
            <span className={styles.sizeAfter}>KB</span>
          </Col>
        </Row>
      </CustomCard>

      <CustomCard
        title="音频上传"
        extra={
          <Button
            type="primary"
            ghost
            onClick={() => {
              resetConfig('audio');
            }}
          >
            恢复默认设置
          </Button>
        }
      >
        <Row>
          <Col flex="8em" className={styles.labelCol}>
            <span>格式限制</span>
          </Col>
          <Col className={styles.valueCol}>
            <Input
              name="audio_ext"
              value={currentValues.audio_ext}
              onChange={(e) => {
                setCurrentValues({ ...currentValues, audio_ext: e.target.value });
              }}
              onPressEnter={(e) => {
                updateConfig('audio_ext', (e.target as HTMLInputElement).value);
              }}
              onBlur={(e) => {
                updateConfig('audio_ext', e.target.value);
              }}
            />
            <Tooltip title="请设置音频文件格式限制!">
              <ExclamationCircleOutlined style={{ color: 'red' }} />
            </Tooltip>
          </Col>
        </Row>
        <Row>
          <Col flex="8em" className={styles.labelCol}>
            <span>大小限制</span>
          </Col>
          <Col className={styles.valueCol}>
            <InputNumber
              name="audio_size"
              value={currentValues.audio_size}
              onChange={(value) => {
                setCurrentValues({ ...currentValues, audio_size: value });
              }}
              onPressEnter={(e) => {
                updateConfig('audio_size', (e.target as HTMLInputElement).value);
              }}
              onBlur={(e) => {
                updateConfig('audio_size', e.target.value);
              }}
            />
            <Tooltip title="请设置音频文件大小限制!">
              <ExclamationCircleOutlined style={{ color: 'red' }} />
            </Tooltip>
            <span className={styles.sizeAfter}>KB</span>
          </Col>
        </Row>
      </CustomCard>

      <CustomCard
        title="其他上传"
        extra={
          <Button
            type="primary"
            ghost
            onClick={() => {
              resetConfig('other');
            }}
          >
            恢复默认设置
          </Button>
        }
      >
        <Row>
          <Col flex="8em" className={styles.labelCol}>
            <span>格式限制</span>
          </Col>
          <Col className={styles.valueCol}>
            <Input
              name="other_ext"
              value={currentValues.other_ext}
              onChange={(e) => {
                setCurrentValues({ ...currentValues, other_ext: e.target.value });
              }}
              onPressEnter={(e) => {
                updateConfig('other_ext', (e.target as HTMLInputElement).value);
              }}
              onBlur={(e) => {
                updateConfig('other_ext', e.target.value);
              }}
            />
            <Tooltip title="请设置其他文件格式限制!">
              <ExclamationCircleOutlined style={{ color: 'red' }} />
            </Tooltip>
          </Col>
        </Row>
        <Row>
          <Col flex="8em" className={styles.labelCol}>
            <span>大小限制</span>
          </Col>
          <Col className={styles.valueCol}>
            <InputNumber
              name="other_size"
              value={currentValues.other_size}
              onChange={(value) => {
                setCurrentValues({ ...currentValues, other_size: value });
              }}
              onPressEnter={(e) => {
                updateConfig('other_size', (e.target as HTMLInputElement).value);
              }}
              onBlur={(e) => {
                updateConfig('other_size', e.target.value);
              }}
            />
            <Tooltip title="请设置其他文件大小限制!">
              <ExclamationCircleOutlined style={{ color: 'red' }} />
            </Tooltip>
            <span className={styles.sizeAfter}>KB</span>
          </Col>
        </Row>
      </CustomCard>
    </div>
  );
};

export default UploadConfig;
