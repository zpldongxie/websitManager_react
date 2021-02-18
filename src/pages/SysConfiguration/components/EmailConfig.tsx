/*
 * @description: 邮件配置
 * @author: zpl
 * @Date: 2021-02-18 14:07:21
 * @LastEditTime: 2021-02-18 17:56:17
 * @LastEditors: zpl
 */
import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Button, Card, Col, Form, Input, message, Row } from 'antd';

import { putConfig, sendEmail } from '../service';
import { mailConfig } from '../defaultConfigInfo.json';

import type { CardProps } from 'antd/lib/card';
import styles from '../index.module.less';

const { TextArea } = Input;

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

const EmailConfig: FC<PropsType> = ({ defaultValues }) => {
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
   * 重置邮件配置
   *
   */
  const resetConfig = () => {
    const mailData = {};
    mailConfig.forEach((conf: { descStr: string; name: string; value: string }) => {
      mailData[conf.name] = conf.value;
      updateConfig(conf.name, conf.value);
    });
    setCurrentValues({ ...currentValues, ...mailData });
  };

  /**
   * 测试邮件发送功能
   * @param values
   */
  const onFinish = async (values: any) => {
    if (values.mailTo) {
      const res = await sendEmail(values);
      if (res.status === 'ok') {
        message.success('发送成功');
      } else message.error(res.msg);
    }
  };

  return (
    <div className={styles.con}>
      <CustomCard
        title="发件人账号管理"
        extra={
          <Button
            type="primary"
            ghost
            onClick={() => {
              resetConfig();
            }}
          >
            恢复默认设置
          </Button>
        }
      >
        <Row>
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
        <Row>
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
        <Row>
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
        <p
          className="ant-card-head ant-card-head-title"
          style={{ marginTop: 21, borderBottom: 'none' }}
        >
          发件服务器
        </p>
        <Row>
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
        <Row>
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
      </CustomCard>
      <CustomCard title="测试邮件发送功能">
        <Form name="email" initialValues={{ remember: true }} onFinish={onFinish} colon={false}>
          <Form.Item
            label="测试邮箱地址"
            name="mailTo"
            rules={[{ type: 'email', required: true, message: '请输入正确有效的邮箱' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="标题"
            name="subject"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="正文" name="text" rules={[{ required: true, message: '请输入内容' }]}>
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 128 }}>
              发送
            </Button>
          </Form.Item>
        </Form>
      </CustomCard>
    </div>
  );
};

export default EmailConfig;
