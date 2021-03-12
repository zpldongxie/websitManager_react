import { Form, Input, Button,Upload, message } from 'antd';
import React from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less'

function getBase64(img: Blob, callback: { (imageUrl: any): void; (arg0: string | ArrayBuffer | null): any; }) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file: { type: string; size: number; }) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('你只能上传JPG/PNG 格式!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('大小不能超过2MB!');
  }
  return isJpgOrPng && isLt2M;
}

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
    span: 8,
  },
};

class Demo extends React.Component {
  state = {
    loading: false,
    imageUrl:'',
    str:''
  };

  handleChange = (info: { file: { status: string; originFileObj: Blob; }; }) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl: any) =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  formRef = React.createRef();

  onFinish = (values: any) => {
    console.log(values);
    message.success('保存成功');
  };
  onReset = () => {
    this.formRef.current.resetFields();
    this.setState({
      imageUrl:''
    }),
    message.success('重置成功');
  };
 

  render() {
    const { loading, imageUrl } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>上传图片</div>
      </div>
    );
    return (
      <PageContainer title={false} className='base'>
      <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish} style={{backgroundColor:"white",paddingTop:"30px",paddingBottom:"10px"}}>
        <Form.Item
        name="designation"
        label="网站名称"
        rules={[
          {
            required: true,
            message:"请输入网站名称"
          },
        ]}
      >
        <Input placeholder="请输入" defaultValue={this.state.str}></Input>
      </Form.Item>
      <Form.Item
         name="logo"
         label="网站LOGO">
        <Upload
        name="logo"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action=""
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
        </Form.Item>
      <Form.Item
        name="domain"
        label="网站域名"
        rules={[
          {
            pattern: new RegExp(
              "^((25[0-5]|2[0-4]\\d|[1]{1}\\d{1}\\d{1}|[1-9]{1}\\d{1}|\\d{1})($|(?!\\.$)\\.)){4}$"
            ),
            message: '域名格式有误',
          },
        ]}
      >
        <Input placeholder='请输入'></Input>
      </Form.Item>
      <Form.Item
        name="keywords"
        label="关键词"
        rules={[
          {
            required: true,
            message:'请输入关键词'
          },
        ]}
      >
        <Input placeholder='请输入'></Input>
      </Form.Item>
      <Form.Item
        name="describe"
        label="描述"
      >
        <Input placeholder='请输入'></Input>
      </Form.Item>
      
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          <Button htmlType="button" onClick={this.onReset} style={{marginLeft:"20px"}}>
            重置
          </Button>
        </Form.Item>
      </Form>
      </PageContainer>
    );
  }
}

export default Demo;
