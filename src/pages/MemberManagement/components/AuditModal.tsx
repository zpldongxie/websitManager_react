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
}
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
        desc: '通过或驳回，如果驳回，需要填写驳回原因。',
        btns: [
          {
            key: '申请驳回',
            text: '申请驳回',
          },
          {
            key: '初审通过',
            text: '初审通过',
          },
        ],
      };
    case '初审通过':
      return {
        desc: '会员资料确认无误，双方均无异议，如果驳回，请输入驳回原因。',
        btns: [
          {
            key: '申请驳回',
            text: '申请驳回',
          },
          {
            key: '正式会员',
            text: '正式会员',
          },
        ],
      };
    case '正式会员':
      return {
        desc: '会员身份已经通过审核，如需存在争议，可点击“禁用”。',
        btns: [
          {
            key: '禁用',
            text: '禁用',
          },
        ],
      };
    case '申请驳回':
      return {
        desc: '该项会员申请已拒绝。若仍需申请，请相关人员重新申请。',
        btns: [],
      };
    case '禁用':
      return {
        desc: '会员身份存在争议，如确认无误可点击“正式会员”。',
        btns: [
          {
            key: '正式会员',
            text: '正式会员',
          },
        ],
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
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectDescDisable] = useState(false);
  const [btns, setBtns] = useState<{ key: MemberStatus | '确认驳回'; text: string }[]>([]);

  useEffect(() => {
    const opt = getOpt(status);
    setDesc(opt.desc);
    setBtns(opt.btns);
  }, [status]);

  useEffect(() => {
    // 当驳回原因输入框出现时，拒绝申请按钮改为确认驳回
    const rejectBtn = btns.find((btn) => btn.text === '申请驳回');
    if (rejectBtn) {
      if (showRejectReason) {
        const reRejestBtn: {
          key: MemberStatus | '确认驳回';
          text: string;
        } = {
          key: '确认驳回',
          text: '确认驳回',
        };
        const newBtns = [reRejestBtn].concat(...btns.filter((btn) => btn.text !== '申请驳回'));
        setBtns(newBtns);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRejectReason]);

  const onClick = async (s: MemberStatus | '确认驳回') => {
    if (current) {
      // 拒绝申请操作需要多确认一次
      if (s === '申请驳回') {
        message.info('请输入拒绝原因');
        setShowRejectReason(true);
        return;
      }
      const newStatus = s === '确认驳回' ? '申请驳回' : s;
      if (newStatus === '申请驳回' && rejectDesc === '') {
        message.warn('请输入驳回原因');
        return;
      }
      onSubmit?.({...current, status: newStatus, rejectDesc });
    }
  };

  const getModalContent = () => {
    return (
      <>
        <Steps progressDot style={{ margin: '0 auto' }}>
          {getStepList(status)}
        </Steps>
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 1rem 1rem',
          }}
        >
          {desc}
        </div>
        <div style={{
          textAlign: 'center',
          padding: '0 3rem',
        }}>
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
      width={600}
      className='standardListForm'
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
