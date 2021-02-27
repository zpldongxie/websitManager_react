/* eslint-disable no-plusplus */
import type { FC} from 'react';
import { useEffect, useState } from 'react';

import { Transfer, Switch } from 'antd';

const TransferSetting: FC<{}> = () => {
  const [oneWay, setOneWay]= useState<boolean>(false);
  const [mockData, setMockData] = useState<any>([]);
  const [targetKeys, setTargetKeys] = useState<any>([]);

  useEffect(() => {
    const newTargetKeys = [];
    const newMockData = [];
    for (let i = 0; i < 20; i++) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: Math.random() * 2 > 1,
      };
      if (data.chosen) {
        newTargetKeys.push(data.key);
      }
      newMockData.push(data);
    }

    setTargetKeys(newTargetKeys);
    setMockData(newMockData);
  }, [])

  const onChange = (newTargetKeys: any, direction: any, moveKeys: any) => {
    console.log(newTargetKeys, direction, moveKeys);
    setTargetKeys(newTargetKeys);
  };

  return (
    <>
      <Transfer
        dataSource={mockData}
        targetKeys={targetKeys}
        onChange={onChange}
        render={item => item.title!}
        oneWay={oneWay}
        pagination
      />
      <br />
      <Switch
        unCheckedChildren="one way"
        checkedChildren="one way"
        checked={oneWay}
        onChange={setOneWay}
      />
    </>
  );
};

export default TransferSetting;