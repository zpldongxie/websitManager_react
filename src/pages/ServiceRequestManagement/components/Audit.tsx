/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Button, Col, Divider, Input, message, Row, Steps } from 'antd';
import { useEffect, useState } from 'react';
import type { ServiceStatus, TableListItem } from '../data';
import { upsert } from '../service';

const { Step } = Steps;

/*
 * @description: 审批组件
 * @author: zpl
 * @Date: 2021-01-22 11:12:09
 * @LastEditTime: 2021-01-25 11:05:26
 * @LastEditors: zpl
 */
/**
 * 根据流程状态获取提示信息和可操作按钮
 *
 * @param {(ServiceStatus | undefined)} status
 * @return {*}
 */
const getOpt = (
  status: ServiceStatus | undefined,
): {
  desc: string;
  btns: {
    key: ServiceStatus;
    text: string;
  }[];
} => {
  switch (status) {
    case '申请中':
      return {
        desc: '接受或拒绝，如果拒绝，需要填写拒绝原因。',
        btns: [
          {
            key: '拒绝申请',
            text: '拒绝申请',
          },
          {
            key: '接受申请',
            text: '接受申请',
          },
        ],
      };
    case '接受申请':
      return {
        desc: '双方沟通无异议，即可开始服务。如果拒绝，请输入拒绝原因。',
        btns: [
          {
            key: '拒绝申请',
            text: '拒绝申请',
          },
          {
            key: '服务中',
            text: '开始服务',
          },
        ],
      };
    case '服务中':
      return {
        desc: '若已完成所有相关事项，请点击“服务完成”以结束此流程。',
        btns: [
          {
            key: '服务完成',
            text: '服务完成',
          },
        ],
      };
    case '服务完成':
      return {
        desc: '本次服务已完成，如需继续服务并跟踪，请点击“重新开启”。',
        btns: [
          {
            key: '服务中',
            text: '重新开启',
          },
        ],
      };
    case '拒绝申请':
      return {
        desc: '服务已拒绝。若仍需服务，请相关人员重新申请。',
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
 * @param {(ServiceStatus | undefined)} status
 * @return {*}
 */
const getStepList = (status: ServiceStatus | undefined) => {
  if (status === '拒绝申请') {
    return [
      <Step title="申请中" status="finish"></Step>,
      <Step title="拒绝申请" status="error"></Step>,
    ];
  }
  const list = ['申请中', '接受申请', '服务中', '服务完成'];
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

// const statusColor = {
//   '申请中': '#666',
//   '接受申请': '#1890ff',
//   '拒绝申请': '#ff4d4f',
//   '服务中': '#1890ff',
//   '服务完成': '#52c41a',
// };

type PropsType = {
  info: TableListItem | null;
  onSuccess: (s: ServiceStatus) => void;
  onCancel: () => void;
};

const Audit = ({ info, onSuccess }: PropsType) => {
  const { status } = info || {};

  const [desc, setDesc] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReasonDisable, setRejectReasonDisable] = useState(false);
  const [btns, setBtns] = useState<{ key: ServiceStatus | '确认拒绝'; text: string }[]>([]);

  useEffect(() => {
    const opt = getOpt(status);
    setDesc(opt.desc);
    setBtns(opt.btns);
  }, [status]);

  useEffect(() => {
    // 当拒绝原因输入框出现时，拒绝申请按钮改为确认拒绝
    const rejectBtn = btns.find((btn) => btn.text === '拒绝申请');
    if (rejectBtn) {
      if (showRejectReason) {
        const reRejestBtn: {
          key: ServiceStatus | '确认拒绝';
          text: string;
        } = {
          key: '确认拒绝',
          text: '确认拒绝',
        };
        const newBtns = [reRejestBtn].concat(...btns.filter((btn) => btn.text !== '拒绝申请'));
        setBtns(newBtns);
      }
    }
  }, [showRejectReason]);

  const onClick = async (s: ServiceStatus | '确认拒绝') => {
    if (info) {
      // 拒绝申请操作需要多确认一次
      if (s === '拒绝申请') {
        message.info('请输入拒绝原因');
        setShowRejectReason(true);
        return;
      }
      const newStatus = s === '确认拒绝' ? '拒绝申请' : s;
      if (newStatus === '拒绝申请' && rejectReason === '') {
        message.warn('请输入拒绝原因');
        return;
      }
      const res = await upsert({ ...info, status: newStatus, rejectReason });
      if (res.status === 'ok') {
        message.info('操作成功');
        onSuccess(newStatus);
        if (newStatus === '拒绝申请') {
          setRejectReasonDisable(true);
        } else {
          setShowRejectReason(false);
        }
      } else {
        message.error(res.message);
      }
    }
  };

  return (
    <>
      <Steps progressDot style={{ margin: '0 auto' }}>
        {getStepList(status)}
      </Steps>
      {/* <div
        style={{ fontSize: '16px', textAlign: 'center', color: statusColor[status || '申请中'], fontWeight: 'bold' }}
      >{status}</div> */}
      <div
        style={{
          textAlign: 'center',
          padding: '3rem 1rem',
        }}
      >
        {desc}
      </div>
      <Input.TextArea
        hidden={!showRejectReason}
        value={rejectReason}
        disabled={rejectReasonDisable}
        onChange={(e) => {
          const v = e.target.value;
          setRejectReason(v);
        }}
      />
      <Divider />
      <Row justify="end" gutter={20}>
        {btns.map((btn, i) => (
          <Col key={btn.key}>
            <Button
              type={i === btns.length - 1 ? 'primary' : 'default'}
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

export default Audit;
