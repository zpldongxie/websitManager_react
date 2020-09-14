import React from 'react';
import { Result, Button } from 'antd';

interface SuccessProps {
  /**
   * 预览
   *
   * @memberof SuccessProps
   */
  previewHandler: () => void;
}

const Success: React.FC<SuccessProps> = (props) => {
  const { previewHandler } = props;

  return (
    <Result
    status="success"
    title="操作成功!"
    subTitle="操作成功，你可以继续进行以下操作。"
    extra={[
      <Button type="primary" key="console">
        预览效果
      </Button>,
      <Button key="buy">继续编辑</Button>,
      <Button
        onClick={() => {
          window.open('', '_self', '');
          window.close();
        }}
      >关闭页面</Button>,
    ]}
  />
  );
};

export default Success;