import React from 'react';
import { Form, Input, Button,message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import "./index.less"

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span:8,
  },
};

const Demo = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log(values);
    message.success('保存成功');
  };

  const onReset = () => {
    form.resetFields();
    message.success('重置成功');
  };

  return (
    <PageContainer title={false}>
     
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish} style={{backgroundColor:"white",paddingTop:"30px",paddingBottom:"10px"}}>
      <Form.Item
        name="year"
        label="网站开始年份"
        rules={[
          {
            pattern:new RegExp(/^(1949|19[5-9]\d|20\d{2}|2100)$/),
            message:"年份错误"
          },
        ]}
      >
        <Input placeholder='请输入'></Input>
      </Form.Item>
      <Form.Item
        name="provincial"
        label="网站所属(省级)"
      >
        <Input placeholder='请输入'></Input>
      </Form.Item>
      <Form.Item
        name="city"
        label="网站所属(市级)"
      >
        <Input placeholder='请输入'></Input>
      </Form.Item>
      <Form.Item
        name="record"
        label="备案号"
      >
        <Input placeholder='请输入'></Input>
      </Form.Item>
      <Form.Item
        name="audit"
        label="其他审核信息"
      >
        <Input placeholder='请输入'></Input>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          保存
        </Button>
        <Button htmlType="button" onClick={onReset} style={{marginLeft:"20px"}}>
          重置
        </Button>
      </Form.Item>
    </Form>
    </PageContainer>
  );
};

export default Demo;
