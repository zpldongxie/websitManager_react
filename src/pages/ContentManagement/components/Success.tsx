import React from 'react';
import { Result, Button } from 'antd';

interface SuccessProps {
  /**
   * 根据不同的文章发布状态，显示不同的按钮
   *
   * @memberof SuccessProps
   */
  pubStatus: '草稿' | '已发布' | '已删除';
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
  /**
   * 发布方法
   *
   * @memberof SuccessProps
   */
  pubHandler: () => void;
  /**
   * 撤稿方法
   *
   * @memberof SuccessProps
   */
  unPubHandler: () => void;
}

const Success: React.FC<SuccessProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { pubStatus, previewHandler, backToEditHandler, pubHandler, unPubHandler } = props;

  return (
    <Result
      status="success"
      title="操作成功!"
      subTitle="操作成功，你可以继续进行以下操作。"
      extra={
        pubStatus === '草稿'
          ? [
              <Button type="primary" key="preview" onClick={previewHandler}>
                预览效果
              </Button>,
              <Button key="edit" onClick={backToEditHandler}>
                继续编辑
              </Button>,
              <Button key="pub" onClick={pubHandler}>
                立即发布
              </Button>,
              <Button
                key="close"
                onClick={() => {
                  window.close();
                }}
              >
                关闭页面
              </Button>,
            ]
          : [
              <Button type="primary" key="preview" onClick={previewHandler}>
                预览效果
              </Button>,
              <Button key="pub" onClick={unPubHandler}>
                撤稿
              </Button>,
              <Button
                key="close"
                onClick={() => {
                  window.close();
                }}
              >
                关闭页面
              </Button>,
            ]
      }
    />
  );
};

export default Success;
