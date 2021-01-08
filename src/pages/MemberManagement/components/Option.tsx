/** !
 * @description: 表格操作列
 * @author: zpl
 * @Date: 2020-09-12 17:13:00
 * @LastEditTime: 2020-09-12 17:31:45
 * @LastEditors: zpl
 */
import React from 'react';
import { Divider, Popconfirm, message } from 'antd';

import { removeCompanyMember, getCompanyMemberById,removePersonalMember } from '../service';

type OptType = {
  id: string;
  type?: string;
  refreshHandler: () => void;
  editHandler: () => void;
}

const EditOpt = ({ id, editHandler }: OptType) => (
  <a onClick={() => {
    editHandler();
  }}>
    编辑
  </a>
);

const PubOpt = ({ id, refreshHandler }: OptType) => (
  <a
    onClick={async () => {
      try {
        // const result = await upsertCompanyMember();
        // if (result.status === 'ok') {
        //   message.info('审核成功');
        //   refreshHandler();
        // } else {
        //   message.error('审核失败，请联系管理员或稍后重试。');
        // }
      } catch (err) {
        message.error('审核失败，请联系管理员或稍后重试。');
      }
    }}
  >
    审核
  </a>
);
const ActiveOpt = ({ id, refreshHandler }: OptType) => (
  <a
    onClick={async () => {
      try {
        // const result = await upsertCompanyMember();
        // if (result.status === 'ok') {
        //   message.info('启用成功');
        //   refreshHandler();
        // } else {
        //   message.error('启用失败，请联系管理员或稍后重试。');
        // }
      } catch (err) {
        message.error('启用失败，请联系管理员或稍后重试。');
      }
    }}
  >
    启用
  </a>
);

const DisableOpt = ({ id, refreshHandler }: OptType) => (
  <Popconfirm
    title="禁用之后，数据不可恢复，确定要删除吗?"
    onConfirm={async () => {
      try {
        // const result = await removeCompanyMember([id]);
        // if (result.status === 'ok') {
        //   message.info('禁用成功');
        //   refreshHandler();
        // } else {
        //   message.error('禁用失败，请联系管理员或稍后重试。');
        // }
      } catch (err) {
        message.error('禁用失败，请联系管理员或稍后重试。');
      }
    }}
    okText="Yes"
    cancelText="No"
    placement="topLeft"
  >
    <a href="#">禁用</a>
  </Popconfirm>
);

const DelOpt = ({ id, type, refreshHandler }: OptType) => (
  <Popconfirm
    title="删除之后，数据不可恢复，确定要删除吗?"
    onConfirm={async () => {
      try {
        const result = type ? await removePersonalMember([id]): await removeCompanyMember([id]);
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
  id: string;
  type?: string;
  status: string;
  refreshHandler: () => void;
  editHandler: () => void;
}

const Option: React.FC<Props> = (props) => {
  const { id, status, type, refreshHandler, editHandler } = props;
  switch (status) {
    case '正式会员':
      return (
        <>
          <EditOpt id={id} type={type} refreshHandler={refreshHandler} editHandler={editHandler} />
          <Divider type="vertical" />
          <DisableOpt id={id} refreshHandler={refreshHandler} editHandler={editHandler} />
          <Divider type="vertical" />
          <DelOpt id={id} type={type} refreshHandler={refreshHandler} editHandler={editHandler} />
        </>
      );
      break;
    case '禁用':
      return (
        <>
          <EditOpt id={id} refreshHandler={refreshHandler} editHandler={editHandler} />
          <Divider type="vertical" />
          <ActiveOpt id={id} type={type} refreshHandler={refreshHandler} editHandler={editHandler} />
          <Divider type="vertical" />
          <DelOpt id={id} type={type} refreshHandler={refreshHandler} editHandler={editHandler} />
        </>
      );
      break;
    default:
      return (
        <>
          <EditOpt id={id} refreshHandler={refreshHandler} editHandler={editHandler} />
          <Divider type="vertical" />
          <PubOpt id={id} type={type} refreshHandler={refreshHandler} editHandler={editHandler} />
          <Divider type="vertical" />
          <DelOpt id={id} type={type} refreshHandler={refreshHandler} editHandler={editHandler} />
        </>
      );
  }
};

export default Option;
