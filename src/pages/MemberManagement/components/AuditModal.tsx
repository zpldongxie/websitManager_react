import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Col, Divider, Input, message, Row, Steps } from 'antd';
import type { AuditMemberParams, MemberStatus } from '../data';

const { Step } = Steps;
type OperationModalProps = {
  type?: string;
  visible: boolean;
  current?: AuditMemberParams;
  onSubmit?: (values: AuditMemberParams) => void;
  onCancel: () => void;
};
/**
 * 根据流程状态获取提示信息和可操作按钮
 *
 * @param {(MemberStatus | undefined)} status
 * @return {*}
 */
const getOpt = (
  status: MemberStatus | undefined,
): {
  desc: string;
  btns: {
    key: MemberStatus;
    text: string;
  }[];
} => {
  switch (status) {
    case '申请中':
      return {
        desc: '同意或驳回，如果驳回，需填写驳回原因。',
        btns: [
          {
            key: '申请驳回',
            text: '驳回申请',
          },
          {
            key: '初审通过',
            text: '同意申请',
          },
        ],
      };
    case '初审通过':
      return {
        desc: '线下审核后，同意入会或驳回，如果驳回，需填写驳回原因。',
        btns: [
          {
            key: '申请驳回',
            text: '驳回申请',
          },
          {
            key: '正式会员',
            text: '同意入会',
          },
        ],
      };
    case '申请驳回':
      return {
        desc: '申请已驳回。若仍需入会，请相关人员重新申请。',
        btns: [],
      };
    case '正式会员':
      return {
        desc: '该申请单位或申请人已成功加入协会，成为本协会正式会员。',
        btns: [],
      };
    default:
      return {
        desc: '无信息',
        btns: [],
      };
  }
};

/**
 * 渲染步骤条
 *
 * @param {(MemberStatus | undefined)} status
 * @return {*}
 */
const getStepList = (status: MemberStatus | undefined) => {
  if (status === '申请驳回') {
    return [
      <Step title="申请中" status="finish"></Step>,
      <Step title="申请驳回" status="error"></Step>,
    ];
  }
  const list = ['申请中', '初审通过', '正式会员'];
  const index = list.indexOf(status || '');
  return list.map((item, i) => {
    let s: 'wait' | 'process' | 'finish' | 'error' | undefined = 'wait';
    if (i < index) {
      s = 'finish';
    } else if (i === index) {
      s = 'process';
    }
    return <Step title={item} status={s} style={{ flex: '0' }}></Step>;
  });
};

const AuditModal: FC<OperationModalProps> = (props) => {
  const { visible, current, onCancel, onSubmit } = props;
  const { status } = current || {};
  const [desc, setDesc] = useState('');
  const [rejectDesc, setRejectDesc] = useState('');
  const [statusNew, setStatusNew] = useState<MemberStatus>(status);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectDescDisable, setRejectDescDisable] = useState(false);
  const [btns, setBtns] = useState<{ key: MemberStatus | '确认驳回'; text: string }[]>([]);

  useEffect(() => {
    const opt = statusNew ? getOpt(statusNew) : getOpt(status);
    setDesc(opt.desc);
    setBtns(opt.btns);
  }, [status, statusNew]);

  useEffect(() => {
    // 当驳回原因输入框出现时，申请驳回按钮改为确认驳回
    const rejectBtn = btns.find((btn) => btn.text === '驳回申请');
    if (rejectBtn) {
      if (showRejectReason) {
        const reRejestBtn: {
          key: MemberStatus | '确认驳回';
          text: string;
        } = {
          key: '确认驳回',
          text: '确认驳回',
        };
        const newBtns = [reRejestBtn].concat(...btns.filter((btn) => btn.text !== '驳回申请'));
        setBtns(newBtns);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRejectReason]);

  const onClick = async (s: MemberStatus | '确认驳回') => {
    if (current) {
      // 驳回申请操作需要多确认一次
      if (s === '申请驳回') {
        message.info('请输入驳回原因');
        setShowRejectReason(true);
        return;
      }
      const newStatus = s === '确认驳回' ? '申请驳回' : s;
      if (newStatus === '申请驳回' && rejectDesc === '') {
        message.warn('请输入驳回原因');
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      newStatus === '申请驳回' ? setRejectDescDisable(true) : '';
      setStatusNew(newStatus);
      onSubmit?.({ ...current, status: newStatus, rejectDesc });
    }
  };

  const getModalContent = () => {
    return (
      <>
        <Steps progressDot style={{ margin: '0 auto' }}>
          {statusNew ? getStepList(statusNew) : getStepList(status)}
        </Steps>
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 1rem 1rem',
          }}
        >
          {desc}
        </div>
        <div
          style={{
            textAlign: 'center',
            padding: '0 3rem',
          }}
        >
          <Input.TextArea
            hidden={!showRejectReason}
            value={rejectDesc}
            disabled={rejectDescDisable}
            allowClear
            onChange={(e) => {
              const v = e.target.value;
              setRejectDesc(v);
            }}
          />
        </div>
        <Divider />
        <Row justify="end" gutter={20}>
          {btns.map((btn, i) => (
            <Col key={btn.key}>
              <Button
                type={i === btns.length - 1 ? 'primary' : 'default'}
                danger={btn.key === '申请驳回'}
                onClick={() => {
                  onClick(btn.key);
                }}
              >
                {btn.text}
              </Button>
            </Col>
          ))}
        </Row>
      </>
    );
  };
  return (
    <Modal
      title={`审核`}
      width="45vw"
      className="standardListForm"
      bodyStyle={{ padding: '28px 0 0' }}
      destroyOnClose
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      {getModalContent()}
    </Modal>
  );
};

export default AuditModal;
