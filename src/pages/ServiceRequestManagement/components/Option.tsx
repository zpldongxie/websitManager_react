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
  id: number;
  refreshHandler: () => void;
}

const EditOpt = ({ id }: { id: number }) => (
  <a
    onClick={() => {
      window.open(`/editArticle/edit?id=${id}`);
    }}
  >
    编辑
  </a>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ApplyOpt = ({ id, refreshHandler }: OptType) => <a href="#">审核</a>;

const DelOpt = ({ id, refreshHandler }: OptType) => (
  <Popconfirm
    title="删除后数据将不可恢复，是否确定?"
    onConfirm={async () => {
      try {
        const result = await remove([id]);
        if (result.status === 'ok') {
          message.info('删除成功');
          refreshHandler();
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
  id?: number;
  status: '申请中' | '接受申请' | '拒绝申请' | '服务中' | '服务完成';
  refreshHandler: () => void;
}

const Option: React.FC<Props> = (props) => {
  const { id = -1, status, refreshHandler } = props;
  switch (status) {
    case '申请中':
    case '接受申请':
    case '服务中':
      return (
        <>
          <ApplyOpt id={id} refreshHandler={refreshHandler} />
          <Divider type="vertical" />
          <EditOpt id={id} />
          <Divider type="vertical" />
          <DelOpt id={id} refreshHandler={refreshHandler} />
        </>
      );
    case '拒绝申请':
    case '服务完成':
      return (
        <>
          <EditOpt id={id} />
          <Divider type="vertical" />
          <DelOpt id={id} refreshHandler={refreshHandler} />
        </>
      );
    default:
      return <></>;
  }
};

export default Option;
