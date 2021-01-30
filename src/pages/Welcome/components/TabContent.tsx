import React, { useState } from 'react';

import { List } from 'antd';

type PropsType = {
  title?: string;
  data?: any;
  dataRequest?: {
    method: 'post' | 'get';
    url: string;
    payload: string | Record<string, string>;
  };
};

type ListItemType = {
  name: string;
  status: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TabContent: React.FC<PropsType> = ({ data, dataRequest }) => {
  const [currentData] = useState<ListItemType[]>(data);
  return <>
    <List
      dataSource={currentData}
      renderItem={item => (
        <List.Item>
          <p>{item?.name}</p>
          {item.status ? <span>{item.status}</span>:''}
        </List.Item>
      )}
    />
  </>;
};

export default TabContent;
