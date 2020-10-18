/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { Collapse, Layout, Tree } from 'antd';

import { DataNode, EventDataNode } from 'antd/lib/tree';
import { UploadFile } from 'antd/lib/upload/interface';
import { showFileList } from './service';
import ViewFileList from './components/ViewFileList';
import styles from './index.less';
import { FileItemType } from './data';

const { Sider, Content } = Layout;
const { Panel } = Collapse;

export default () => {
  const [type, setType] = useState('image');
  const [path, setPath] = useState('');
  const [imageDirList, setImageDirList] = useState<DataNode[]>([]);
  const [videoDirList, setVideoDirList] = useState<DataNode[]>([]);
  const [audioDirList, setAudioDirList] = useState<DataNode[]>([]);
  const [otherDirList, setOtherDirList] = useState<DataNode[]>([]);
  const [currentFileList, setCurrentFileList] = useState<UploadFile<any>[]>([]);

  useEffect(() => {
    (async () => {
      let setMethod;
      switch (type) {
        case 'image':
          if (!imageDirList.length) setMethod = setImageDirList;
          break;
        case 'video':
          if (!videoDirList.length) setMethod = setVideoDirList;
          break;
        case 'audio':
          if (!videoDirList.length) setMethod = setAudioDirList;
          break;
        case 'other':
          if (!videoDirList.length) setMethod = setOtherDirList;
          break;
        default:
        // do nothing
      }

      if (setMethod) {
        const list = await showFileList({ currentPath: type });
        const dirList: DataNode[] = list
          .filter((f: FileItemType) => f.type === 'dir')
          .map((f: FileItemType) => ({
            title: f.name,
            key: `/${f.name}`,
          }));
        setMethod(dirList);
        if (type === 'image' && dirList.length) setPath(`${dirList[0].key}`);
      }
    })();
  }, [type]);

  useEffect(() => {
    (async () => {
      const list = await showFileList({ currentPath: type + path });
      const fileList = list
        .filter((f: FileItemType) => f.type !== 'dir')
        .map((f: FileItemType, index: number) => ({
          ...f,
          uid: `${index}`,
          status: 'done',
          size: 100,
          type: type === 'image' ? '' : type,
        }));
      setCurrentFileList(fileList);
    })();
  }, [path]);

  const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] => {
    return list.map((node) => {
      if (node.key === key) {
        return {
          ...node,
          children,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });
  };

  const onLoadData = ({ key, children }: EventDataNode): Promise<void> => {
    return new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }
      setTimeout(() => {
        setImageDirList((origin) =>
          updateTreeData(origin, key, [
            { title: 'Child Node', key: `${key}-0` },
            { title: 'Child Node', key: `${key}-1` },
          ]),
        );

        resolve();
      }, 1000);
    });
  };

  const onSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length) {
      setPath(`${selectedKeys[0]}`);
    }
  };

  return (
    <PageContainer className={styles.main} title={false}>
      <Layout>
        <Content className={styles.content}>
          <ViewFileList currentFileList={currentFileList} setCurrentFileList={setCurrentFileList} />
        </Content>
        <Sider className={styles.slider}>
          <Collapse
            defaultActiveKey={['image']}
            accordion
            onChange={(key: string | string[]) => {
              if (key) {
                setType(key as string);
                let list: DataNode[];
                switch (key as string) {
                  case 'image':
                    list = imageDirList;
                    break;
                  case 'video':
                    list = videoDirList;
                    break;
                  case 'audio':
                    list = audioDirList;
                    break;
                  case 'other':
                    list = otherDirList;
                    break;
                  default:
                    list = [];
                }
                setPath(list.length ? `${list[0].key}` : '');
              }
            }}
          >
            <Panel header="图片" key="image">
              <Tree loadData={onLoadData} treeData={imageDirList} onSelect={onSelect} />
            </Panel>
            <Panel header="视频" key="video">
              <Tree loadData={onLoadData} treeData={imageDirList} onSelect={onSelect} />
            </Panel>
            <Panel header="音频" key="audio">
              <Tree loadData={onLoadData} treeData={imageDirList} onSelect={onSelect} />
            </Panel>
            <Panel header="其他" key="other">
              <Tree loadData={onLoadData} treeData={imageDirList} onSelect={onSelect} />
            </Panel>
          </Collapse>
        </Sider>
      </Layout>
    </PageContainer>
  );
};
