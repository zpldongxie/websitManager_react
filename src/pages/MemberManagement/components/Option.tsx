/** !
 * @description: 表格操作列
 * @author: zpl
 * @Date: 2020-09-12 17:13:00
 * @LastEditTime: 2020-09-12 17:31:45
 * @LastEditors: zpl
 */
import React from 'react';
import { Divider, Popconfirm, message } from 'antd';
import type { MemberStatus } from '../data';
import { removeCompanyMember, removePersonalMember, auditCompanyMember, auditPersonalMember } from '../service';

type OptType = {
  id?: string;
  type?: string;
  status?: MemberStatus;
  refreshHandler?: () => void;
  editHandler?: () => void;
  auditHandler?: () => void;
  checkHandler?: () => void;
}

const EditOpt = ({ editHandler }: OptType) => (
  <a onClick={() => {
    if (editHandler) {
      editHandler();
    }
  }}>
    编辑
  </a>
);

const PubOpt = ({ auditHandler }: OptType) => (
  <a
    onClick={() => {
      if (auditHandler) {
        auditHandler();
      }
    }}
  >
    审核
  </a>
);
const CheckOpt = ({ checkHandler }: OptType) => (
  <a
    onClick={() => {
      if (checkHandler) {
        checkHandler();
      }
    }}
  >
    查看
  </a >
);

const DisableOpt = ({ id, type, status, refreshHandler }: OptType) => (
  <Popconfirm
    title="确认要禁用吗?"
    onConfirm={async () => {
      if (id && status && refreshHandler) {
        // eslint-disable-next-line no-param-reassign
        status = '禁用';
        try {
          const result = type ? await auditPersonalMember({ id, status }) : await auditCompanyMember({ id, status });;
          if (result.status === 'ok') {
            message.info('禁用成功');
            refreshHandler();
          } else if (result.message.indexOf('邮件') > -1) {
            refreshHandler();
            message.warn('禁用成功，邮件发送失败，请检查邮箱地址是否有效');
          } else {
            message.error('禁用失败，请联系管理员或稍后重试。');
          }
        } catch (err) {
          message.error('禁用失败，请联系管理员或稍后重试。');
        }
      }

    }}
    okText="Yes"
    cancelText="No"
    placement="topLeft"
  >
    <a href="#">禁用</a>
  </Popconfirm>
);
const EnableOpt = ({ id, type, status, refreshHandler }: OptType) => (
  <Popconfirm
    title="确认要启用吗?"
    onConfirm={async () => {
      if (id && status && refreshHandler) {
        // eslint-disable-next-line no-param-reassign
        status = '正式会员';
        try {
          const result = type ? await auditPersonalMember({ id, status }) : await auditCompanyMember({ id, status });;
          if (result.status === 'ok') {
            message.info('启用成功');
            refreshHandler();
          } else if (result.message.indexOf('邮件') > -1) {
            refreshHandler();
            message.warn('启用成功，邮件发送失败，请检查邮箱地址是否有效');
          } else {
            message.error('启用失败，请联系管理员或稍后重试。');
          }
        } catch (err) {
          message.error('启用失败，请联系管理员或稍后重试。');
        }
      }

    }}
    okText="Yes"
    cancelText="No"
    placement="topLeft"
  >
    <a href="#">启用</a>
  </Popconfirm>
);
const DelOpt = ({ id, type, refreshHandler }: OptType) => (
  <Popconfirm
    title="删除之后，数据不可恢复，确定要删除吗?"
    onConfirm={async () => {
      try {
        if (id && refreshHandler) {
          const result = type ? await removePersonalMember([id]) : await removeCompanyMember([id]);
          if (result.status === 'ok' && refreshHandler) {
            message.info('删除成功');
            refreshHandler();
          } else {
            message.error('删除失败，请联系管理员或稍后重试。');
          }
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
  status: MemberStatus;
  refreshHandler: () => void;
  editHandler: () => void;
  auditHandler: () => void;
  checkHandler: () => void;
}

const Option: React.FC<Props> = (props) => {
  const { id, status, type, refreshHandler, editHandler, auditHandler, checkHandler } = props;
  switch (status) {
    case '正式会员':
      return (
        <>
          <EditOpt id={id} type={type} editHandler={editHandler} />
          <Divider type="vertical" />
          <DisableOpt id={id} type={type} status={status} refreshHandler={refreshHandler} />
          <Divider type="vertical" />
          <DelOpt id={id} type={type} refreshHandler={refreshHandler} />
        </>
      );
      break;
    case '禁用':
      return (
        <>
          <CheckOpt id={id} checkHandler={checkHandler} />
          <Divider type="vertical" />
          <EnableOpt id={id} type={type} status={status} refreshHandler={refreshHandler} />
          <Divider type="vertical" />
          <DelOpt id={id} type={type} refreshHandler={refreshHandler} editHandler={editHandler} />
        </>
      );
      break;
    case '申请驳回':
      return (
        <>
          <EditOpt id={id} editHandler={editHandler} />
          <Divider type="vertical" />
          <DelOpt id={id} type={type} refreshHandler={refreshHandler} editHandler={editHandler} />
        </>
      );
      break;
    default:
      return (
        <>
          <EditOpt id={id} editHandler={editHandler} />
          <Divider type="vertical" />
          <PubOpt id={id} type={type} status={status} auditHandler={auditHandler} />
          <Divider type="vertical" />
          <DelOpt id={id} type={type} refreshHandler={refreshHandler} />
        </>
      );
  }
};

export default Option;
