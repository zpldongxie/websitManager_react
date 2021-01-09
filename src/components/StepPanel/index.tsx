/** !
 * @description: 分步操作面板
 * @author: zpl
 * @Date: 2021-01-08 14:22:59
 * @LastEditTime: 2021-01-08 14:23:03
 * @LastEditors: zpl
 */
import React from 'react';
import { Steps } from 'antd';

const { Step } = Steps;

interface PropsType {
  steps: string[];
  current?: number;
}

const StepPanel = (props: PropsType) => {
  const { steps, current = 0 } = props;
  return (
    <>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item} title={item} />
        ))}
      </Steps>
    </>
  );
};

export default StepPanel;
