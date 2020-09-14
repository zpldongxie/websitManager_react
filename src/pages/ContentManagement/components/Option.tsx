/** !
 * @description: 表格操作列
 * @author: zpl
 * @Date: 2020-09-12 17:13:00
 * @LastEditTime: 2020-09-12 17:31:45
 * @LastEditors: zpl
 */
import React from 'react';
import { Divider, Popconfirm, message } from 'antd';

import { remove } from '../service';

interface OptType {
  id: string;
  // eslint-disable-next-line react/no-unused-prop-types
  onSuccess?: () => void;
}

const EditOpt = ({ id }: OptType) => (
  <a
    onClick={() => {
      window.open(`/editArticle/edit?id=${id}`);
    }}
  >
    编辑
  </a>
);

const PubOpt = ({ id }: OptType) => (
  <a
    onClick={() => {
      // eslint-disable-next-line no-alert
      alert(id);
    }}
  >
    发布
  </a>
);

const UnPubOpt = ({ id }: OptType) => (
  <a
    onClick={() => {
      // eslint-disable-next-line no-alert
      alert(id);
    }}
  >
    撤稿
  </a>
);

const DelOpt = ({ id, onSuccess }: OptType) => (
  <Popconfirm
    title="确定要删除吗?"
    onConfirm={async () => {
      try {
        const result = await remove([id]);
        if (result.status === 'ok' && onSuccess) {
          onSuccess();
        } else {
          message.error('删除失败，请联系管理员或稍后重试。');
        }
      } catch (err) {
        message.error('删除失败，请联系管理员或稍后重试。');
      }
    }}
    okText="Yes"
    cancelText="No"
    placement="topLeft"
  >
    <a href="#">删除</a>
  </Popconfirm>
);

interface Props {
  id: string;
  pubStatus: string;
  onSuccess: () => void;
}

const Option: React.FC<Props> = (props) => {
  const { id, pubStatus, onSuccess } = props;
  if (pubStatus === '已发布') {
    return <UnPubOpt id={id} onSuccess={onSuccess} />;
  }
  return (
    <>
      <EditOpt id={id} />
      <Divider type="vertical" />
      <PubOpt id={id} onSuccess={onSuccess} />
      <Divider type="vertical" />
      <DelOpt id={id} onSuccess={onSuccess} />
    </>
  );
};

export default Option;
