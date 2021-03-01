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

const Contact = () => {
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
        name="consulting"
        label="咨询"
      >
        <Input placeholder='请输入'></Input>
      </Form.Item>
      <Form.Item
        name="fax"
        label="传真"
      >
        <Input placeholder='请输入'></Input>
      </Form.Item>
      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          {
            pattern: new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/),
            message: '邮箱格式有误',
          },
        ]}
      >
         <Input placeholder='请输入'></Input>
      </Form.Item>
      <Form.Item
        name="zipCode"
        label="邮编"
        rules={[
          {
            pattern: new RegExp(/^[0-9]\d{5}$/),
            message:'邮编格式有误'
          },
        ]}
      >
         <Input placeholder='请输入'></Input>
      </Form.Item>
      <Form.Item
        name="address"
        label="地址"
        rules={[
          {
           
          },
        ]}
      >
        <Input placeholder='请输入'></Input>
      </Form.Item>
      <Form.Item {...tailLayout} >
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

export default Contact;
