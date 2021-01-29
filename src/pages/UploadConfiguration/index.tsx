import React, { useEffect, useState, useContext } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Row, Col, Input, InputNumber, Tooltip, message, Button, Tabs } from 'antd';

import { ExclamationCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { getConfigList, putConfig } from './service';
import DefaultContext from './defaultContext';
import styles from './index.module.less';

const { TabPane } = Tabs;

const UploadConfiguration = () => {
  const [defaultValues, setDefaultValues] = useState<any>({});
  const [currentValues, setCurrentValues] = useState<any>({});

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
  }, []);

  /**
   * 更新配置，提交到数据库
   *
   * @param {string} name
   * @param {string} value
   */
  const updateConfig = async (name: string, value: string) => {
    if (defaultValues[name] !== value) {
      const res = await putConfig({ name, value });
      if (res.status === 'ok') {
        message.success('配置修改成功');
        setDefaultValues({ ...defaultValues, [name]: currentValues.base_url });
      } else message.error(res.msg);
    }
  };

  /**
   * 重置指定类型配置
   *
   * @param {string} val 配置前缀，如image\video等
   */
  const resetConfig = (val: string) => {
    const confData = {};
    context.resetConfig
      .filter((conf) => conf.name.startsWith(val))
      .forEach((conf) => {
        confData[conf.name] = conf.value;
        updateConfig(conf.name, conf.value);
      });
    setCurrentValues({ ...currentValues, ...confData });
  };

  /**
   * 重置邮件配置
   */
  const mailConfig = () => {
    const mailData = {};
    context.mailConfig.forEach((conf) => {
      mailData[conf.name] = conf.value;
      updateConfig(conf.name, conf.value);
    });
    setCurrentValues({ ...currentValues, ...mailData });
  };
  const text = (
    <div>
      <div>访问资源的根路径。</div>
      <div>例如：http://www.snains.cn/upload</div>
    </div>
  );
  return (
    <PageContainer title={false}>
      <Tabs className={styles.tabstyle}>
        <TabPane tab="上传配置" key="1">
          <div className={styles.con}>
            <div className={styles.itembg}>
              <p>
                资源根路径
                <Tooltip placement="topLeft" title={text} overlayStyle={{ maxWidth: 300 }}>
                  <QuestionCircleOutlined style={{ marginLeft: 10 }} />
                </Tooltip>
                <Button
                  type="primary"
                  ghost
                  onClick={() => {
                    resetConfig('base');
                  }}
                  className={styles.btnstyle}
                >
                  恢复默认设置
                </Button>
              </p>
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
            </div>

            <div className={styles.itembg}>
              <p>
                图片上传
                <Button
                  type="primary"
                  ghost
                  onClick={() => {
                    resetConfig('image');
                  }}
                  className={styles.btnstyle}
                >
                  恢复默认设置
                </Button>
              </p>
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
              <Row className={styles.secondRow}>
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
            </div>

            <div className={styles.itembg}>
              <p>
                视频上传
                <Button
                  type="primary"
                  ghost
                  onClick={() => {
                    resetConfig('video');
                  }}
                  className={styles.btnstyle}
                >
                  恢复默认设置
                </Button>
              </p>
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
              <Row className={styles.secondRow}>
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
            </div>

            <div className={styles.itembg}>
              <p>
                音频上传
                <Button
                  type="primary"
                  ghost
                  onClick={() => {
                    resetConfig('audio');
                  }}
                  className={styles.btnstyle}
                >
                  恢复默认设置
                </Button>
              </p>
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
              <Row className={styles.secondRow}>
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
            </div>

            <div className={styles.itembg}>
              <p>
                其他上传
                <Button
                  type="primary"
                  ghost
                  onClick={() => {
                    resetConfig('other');
                  }}
                  className={styles.btnstyle}
                >
                  恢复默认设置
                </Button>
              </p>
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
              <Row className={styles.secondRow}>
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
            </div>
          </div>
        </TabPane>
        <TabPane tab="邮件配置" key="2">
          <div className={styles.con}>
            <div className={styles.itembg}>
              <p>
                发件人账号管理
                <Button type="primary" ghost onClick={mailConfig} className={styles.btnstyle}>
                  恢复默认设置
                </Button>
              </p>
              <Row className={styles.secondRow}>
                <Col flex="9em" className={styles.labelCol}>
                  <span>邮箱地址</span>
                </Col>
                <Col className={styles.valueCol}>
                  <Input
                    name="from"
                    value={currentValues.from}
                    onChange={(e) => {
                      setCurrentValues({ ...currentValues, from: e.target.value });
                    }}
                    onPressEnter={(e) => {
                      updateConfig('from', (e.target as HTMLInputElement).value);
                    }}
                    onBlur={(e) => {
                      updateConfig('from', e.target.value);
                    }}
                  />
                </Col>
              </Row>
              <Row className={styles.secondRow}>
                <Col flex="9em" className={styles.labelCol}>
                  <span>用户名</span>
                </Col>
                <Col className={styles.valueCol}>
                  <Input
                    name="user"
                    value={currentValues.user}
                    onChange={(e) => {
                      setCurrentValues({ ...currentValues, user: e.target.value });
                    }}
                    onPressEnter={(e) => {
                      updateConfig('user', (e.target as HTMLInputElement).value);
                    }}
                    onBlur={(e) => {
                      updateConfig('user', e.target.value);
                    }}
                  />
                </Col>
              </Row>
              <Row className={styles.secondRow}>
                <Col flex="9em" className={styles.labelCol}>
                  <span>密码</span>
                </Col>
                <Col className={styles.valueCol}>
                  <Input
                    name="pass"
                    value={currentValues.pass}
                    onChange={(e) => {
                      setCurrentValues({ ...currentValues, pass: e.target.value });
                    }}
                    onPressEnter={(e) => {
                      updateConfig('pass', (e.target as HTMLInputElement).value);
                    }}
                    onBlur={(e) => {
                      updateConfig('pass', e.target.value);
                    }}
                  />
                </Col>
              </Row>
              <p style={{ marginTop: 21 }}>发件服务器</p>
              <Row className={styles.secondRow}>
                <Col flex="9em" className={styles.labelCol}>
                  <span>SMTP服务器</span>
                </Col>
                <Col className={styles.valueCol}>
                  <Input
                    name="host"
                    value={currentValues.host}
                    onChange={(e) => {
                      setCurrentValues({ ...currentValues, host: e.target.value });
                    }}
                    onPressEnter={(e) => {
                      updateConfig('host', (e.target as HTMLInputElement).value);
                    }}
                    onBlur={(e) => {
                      updateConfig('host', e.target.value);
                    }}
                  />
                </Col>
              </Row>
              <Row className={styles.secondRow}>
                <Col flex="9em" className={styles.labelCol}>
                  <span>端口号</span>
                </Col>
                <Col className={styles.valueCol}>
                  <Input
                    name="port"
                    value={currentValues.port}
                    onChange={(e) => {
                      setCurrentValues({ ...currentValues, port: e.target.value });
                    }}
                    onPressEnter={(e) => {
                      updateConfig('port', (e.target as HTMLInputElement).value);
                    }}
                    onBlur={(e) => {
                      updateConfig('port', e.target.value);
                    }}
                  />
                </Col>
              </Row>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default UploadConfiguration;
