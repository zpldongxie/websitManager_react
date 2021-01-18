import React, { useEffect, useState, useContext } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Row, Col, Divider, Input, InputNumber, Tooltip, message, Button } from 'antd'

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getConfigList, putConfig } from './service';
import DefaultContext from './defaultContext';
import styles from './index.module.less';

const UploadConfiguration = () => {
  const [defaultValues, setDefaultValues] = useState<any>({});
  const [currentValues, setCurrentValues] = useState<any>({})
  const context = useContext(DefaultContext);
  useEffect(() => {
    (async () => {
      const res = await getConfigList();
      if (res.status === 'ok') {
        const confData = {};
        res.data.forEach((conf: ConfigType) => {
          confData[conf.name] = conf.value;
        });
        setDefaultValues(confData);
        setCurrentValues(confData);
      }
    })();
  }, [])
  const updateConfig = async (name: string, value: string) => {
    if (defaultValues[name] !== value) {
      const res = await putConfig({ name, value });
      if (res.status === 'ok') {
        message.success('配置修改成功');
        setDefaultValues({ ...defaultValues, [name]: currentValues.base_url })
      }
      else message.error(res.msg);
    }
  }

  const resetConfig = () => {
    const confData = {};
    context.forEach((conf: ConfigType) => {
      confData[conf.name] = conf.value;
      updateConfig(conf.name, conf.value);
    });
    setCurrentValues(confData);
  }
  return (
    <PageContainer title={false}>
      <div className={styles.con}>
        <Button type="primary" shape="round" size='large' onClick={resetConfig} >重置</Button>
        <Divider>通用设置</Divider>
        <Row>
          <Col flex='8em' className={styles.labelCol}><span>访问域名/IP：</span></Col>
          <Col className={styles.valueCol}>
            <Input name="base_url" value={currentValues.base_url}
              onChange={
                (e) => {
                  setCurrentValues({ ...currentValues, 'base_url': e.target.value });
                }
              }
              onPressEnter={(e) => { updateConfig('base_url', (e.target as HTMLInputElement).value); }}
              onBlur={(e) => { updateConfig('base_url', e.target.value); }}
            />
          </Col>
        </Row>

        <Divider>图片上传</Divider>
        <Row>
          <Col flex='8em' className={styles.labelCol}><span>格式限制：</span></Col>
          <Col className={styles.valueCol}>
            <Input name="image_ext" value={currentValues.image_ext}
              onChange={
                (e) => {
                  setCurrentValues({ ...currentValues, 'image_ext': e.target.value });
                }
              }
              onPressEnter={(e) => { updateConfig('image_ext', (e.target as HTMLInputElement).value); }}
              onBlur={(e) => { updateConfig('image_ext', e.target.value); }}
            />
            <Tooltip title="请设置图片文件格式限制!">
              <ExclamationCircleOutlined style={{ color: "red" }} />
            </Tooltip>
          </Col>
        </Row>
        <Row className={styles.secondRow}>
          <Col flex='8em' className={styles.labelCol}><span>大小限制：</span></Col>
          <Col className={styles.valueCol}>
            <InputNumber name="image_size" value={currentValues.image_size}
              onChange={
                (value) => {
                  setCurrentValues({ ...currentValues, 'image_size': value });
                }
              }
              onPressEnter={(e) => { updateConfig('image_size', (e.target as HTMLInputElement).value); }}
              onBlur={(e) => { updateConfig('image_size', e.target.value); }}
            />
            <Tooltip title="请设置图片文件大小限制!">
              <ExclamationCircleOutlined style={{ color: "red" }} />
            </Tooltip>
            <span className={styles.sizeAfter}>KB</span>
          </Col>
        </Row>
        <Divider>视频上传</Divider>
        <Row>
          <Col flex='8em' className={styles.labelCol}><span>格式限制：</span></Col>
          <Col className={styles.valueCol}>
            <Input name="video_ext" value={currentValues.video_ext}
              onChange={
                (e) => {
                  setCurrentValues({ ...currentValues, 'video_ext': e.target.value });
                }
              }
              onPressEnter={(e) => { updateConfig('video_ext', (e.target as HTMLInputElement).value); }}
              onBlur={(e) => { updateConfig('video_ext', e.target.value); }}
            />
            <Tooltip title="请设置视频文件格式限制!">
              <ExclamationCircleOutlined style={{ color: "red" }} />
            </Tooltip>
          </Col>
        </Row>
        <Row className={styles.secondRow}>
          <Col flex='8em' className={styles.labelCol}><span>大小限制：</span></Col>
          <Col className={styles.valueCol}>
            <InputNumber name="video_size" value={currentValues.video_size}
              onChange={
                (value) => {
                  setCurrentValues({ ...currentValues, 'video_size': value });
                }
              }
              onPressEnter={(e) => { updateConfig('video_size', (e.target as HTMLInputElement).value); }}
              onBlur={(e) => { updateConfig('video_size', e.target.value); }}
            />
            <Tooltip title="请设置视频文件大小限制!">
              <ExclamationCircleOutlined style={{ color: "red" }} />
            </Tooltip>
            <span className={styles.sizeAfter}>KB</span>
          </Col>
        </Row>
        <Divider>音频上传</Divider>
        <Row>
          <Col flex='8em' className={styles.labelCol}><span>格式限制：</span></Col>
          <Col className={styles.valueCol}>
            <Input name="audio_ext" value={currentValues.audio_ext}
              onChange={
                (e) => {
                  setCurrentValues({ ...currentValues, 'audio_ext': e.target.value });
                }
              }
              onPressEnter={(e) => { updateConfig('audio_ext', (e.target as HTMLInputElement).value); }}
              onBlur={(e) => { updateConfig('audio_ext', e.target.value); }}
            />
            <Tooltip title="请设置音频文件格式限制!">
              <ExclamationCircleOutlined style={{ color: "red" }} />
            </Tooltip>
          </Col>
        </Row>
        <Row className={styles.secondRow}>
          <Col flex='8em' className={styles.labelCol}><span>大小限制：</span></Col>
          <Col className={styles.valueCol}>
            <InputNumber name="audio_size" value={currentValues.audio_size}
              onChange={
                (value) => {
                  setCurrentValues({ ...currentValues, 'audio_size': value });
                }
              }
              onPressEnter={(e) => { updateConfig('audio_size', (e.target as HTMLInputElement).value); }}
              onBlur={(e) => { updateConfig('audio_size', e.target.value); }}
            />
            <Tooltip title="请设置音频文件大小限制!">
              <ExclamationCircleOutlined style={{ color: "red" }} />
            </Tooltip>
            <span className={styles.sizeAfter}>KB</span>
          </Col>
        </Row>
        <Divider>其他上传</Divider>
        <Row>
          <Col flex='8em' className={styles.labelCol}><span>格式限制：</span></Col>
          <Col className={styles.valueCol}>
            <Input name="other_ext" value={currentValues.other_ext}
              onChange={
                (e) => {
                  setCurrentValues({ ...currentValues, 'other_ext': e.target.value });
                }
              }
              onPressEnter={(e) => { updateConfig('other_ext', (e.target as HTMLInputElement).value); }}
              onBlur={(e) => { updateConfig('other_ext', e.target.value); }}
            />
            <Tooltip title="请设置其他文件格式限制!">
              <ExclamationCircleOutlined style={{ color: "red" }} />
            </Tooltip>
          </Col>
        </Row>
        <Row className={styles.secondRow}>
          <Col flex='8em' className={styles.labelCol}><span>大小限制：</span></Col>
          <Col className={styles.valueCol}>
            <InputNumber name="other_size" value={currentValues.other_size}
              onChange={
                (value) => {
                  setCurrentValues({ ...currentValues, 'other_size': value });
                }
              }
              onPressEnter={(e) => { updateConfig('other_size', (e.target as HTMLInputElement).value); }}
              onBlur={(e) => { updateConfig('other_size', e.target.value); }}
            />
            <Tooltip title="请设置其他文件大小限制!">
              <ExclamationCircleOutlined style={{ color: "red" }} />
            </Tooltip>
            <span className={styles.sizeAfter}>KB</span>
          </Col>
        </Row>
      </div>
    </PageContainer>
  )
}

export default UploadConfiguration
