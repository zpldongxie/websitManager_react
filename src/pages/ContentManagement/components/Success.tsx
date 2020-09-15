import React from 'react';
import { Result, Button } from 'antd';

interface SuccessProps {
  /**
   * 预览方法
   *
   * @memberof SuccessProps
   */
  previewHandler: () => void;
  /**
   * 继续编辑方法
   *
   * @memberof SuccessProps
   */
  backToEditHandler: () => void;
}

const Success: React.FC<SuccessProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { previewHandler, backToEditHandler } = props;

  return (
    <Result
      status="success"
      title="操作成功!"
      subTitle="操作成功，你可以继续进行以下操作。"
      extra={[
        <Button type="primary" key="preview">
          预览效果
        </Button>,
        <Button 
          key="edit"
          onClick={backToEditHandler}
        >继续编辑</Button>,
        <Button
          key="close"
          onClick={() => {
            window.open('', '_self', '');
            window.close();
          }}
        >
          关闭页面
        </Button>,
      ]}
    />
  );
};

export default Success;
