import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Button, Divider, Form, Input, InputNumber, Space } from 'antd'

import styles from './index.module.less';

const layout = {
  labelCol: { flex: '8em' },
  wrapperCol: { flex: '25em' },
};

const UploadConfiguration = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onFill = () => {
    form.setFieldsValue({
    });
  };

  return (
    <PageContainer title={false}>
      <div className={styles.con}>
        <Form
          {...layout}
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Divider>通用设置</Divider>
          <Form.Item
            label="文件保存位置"
            name="upload_path"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="访问域名/IP"
            name="base_url"
          >
            <Input />
          </Form.Item>
          <Divider>图片上传</Divider>
          <Form.Item
            label="格式限制"
            name="image_ext"
            rules={[{ required: true, message: '请设置图片文件格式限制!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="大小限制"
            name="image_size"
            rules={[{ required: true, message: '请设置图片文件大小限制!' }]}
          >
            <InputNumber step={100} min={0} /><span> KB</span>
          </Form.Item>
          <Divider>视频上传</Divider>
          <Form.Item
            label="格式限制"
            name="vido_ext"
            rules={[{ required: true, message: '请设置视频文件格式限制!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="大小限制"
            name="video_size"
            rules={[{ required: true, message: '请设置视频文件大小限制!' }]}
          >
            <InputNumber step={100} min={0} /><span> KB</span>
          </Form.Item>
          <Divider>音频上传</Divider>
          <Form.Item
            label="格式限制"
            name="audio_ext"
            rules={[{ required: true, message: '请设置音频文件格式限制!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="大小限制"
            name="zudio_size"
            rules={[{ required: true, message: '请设置音频文件大小限制!' }]}
          >
            <InputNumber step={100} min={0} /><span> KB</span>
          </Form.Item>
          <Divider>其他上传</Divider>
          <Form.Item
            label="格式限制"
            name="other_ext"
            rules={[{ required: true, message: '请设置其他文件格式限制!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="大小限制"
            name="other_size"
            rules={[{ required: true, message: '请设置其他文件大小限制!' }]}
          >
            <InputNumber step={100} min={0} /><span> KB</span>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }} className={styles.subCon}>
            <Space>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button htmlType="button" onClick={onFill}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </PageContainer>
  )
}

export default UploadConfiguration
