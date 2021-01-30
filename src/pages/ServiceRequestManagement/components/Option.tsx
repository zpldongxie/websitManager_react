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
import type { ServiceStatus } from '../data';

type OptType = {
  id: string;
  refreshHandler: () => void;
};

const EditOpt = ({ editHandler = () => {} }: { editHandler: () => void }) => (
  <a onClick={editHandler}>编辑</a>
);

const AuditOpt = ({ auditHandler }: { auditHandler: () => void }) => (
  <a onClick={auditHandler}>审核</a>
);

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

type Props = {
  id?: string;
  status: ServiceStatus;
  refreshHandler: () => void;
  editHandler: () => void;
  auditHandler: () => void;
};

const Option: React.FC<Props> = (props) => {
  const { id = '', status, refreshHandler, editHandler, auditHandler } = props;
  switch (status) {
    case '申请中':
    case '接受申请':
    case '服务中':
      return (
        <>
          <EditOpt editHandler={editHandler} />
          <Divider type="vertical" />
          <AuditOpt auditHandler={auditHandler} />
          <Divider type="vertical" />
          <DelOpt id={id} refreshHandler={refreshHandler} />
        </>
      );
    case '拒绝申请':
    case '服务完成':
      return (
        <>
          <EditOpt editHandler={editHandler} />
          <Divider type="vertical" />
          <DelOpt id={id} refreshHandler={refreshHandler} />
        </>
      );
    default:
      return <></>;
  }
};

export default Option;
