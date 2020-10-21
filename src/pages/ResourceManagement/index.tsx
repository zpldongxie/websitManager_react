/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { Col, Collapse, message, Row, Tree } from 'antd';

import { DataNode, EventDataNode } from 'antd/lib/tree';
import { UploadFile } from 'antd/lib/upload/interface';
import { showFileList, remove } from './service';
import ViewFileList from './components/ViewFileList';
import styles from './index.less';
import { FileItemType } from './data';

const { Panel } = Collapse;

export default () => {
  const [type, setType] = useState('image');
  const [path, setPath] = useState('');
  const [imageDirList, setImageDirList] = useState<DataNode[]>([]);
  const [videoDirList, setVideoDirList] = useState<DataNode[]>([]);
  const [audioDirList, setAudioDirList] = useState<DataNode[]>([]);
  const [otherDirList, setOtherDirList] = useState<DataNode[]>([]);
  const [currentFileList, setCurrentFileList] = useState<UploadFile<any>[]>([]);

  // 类型发生变化时，刷新子目录并自动加载第一个
  useEffect(() => {
    (async () => {
      let setMethod;
      switch (type) {
        case 'image':
          setMethod = setImageDirList;
          break;
        case 'video':
          setMethod = setVideoDirList;
          break;
        case 'audio':
          setMethod = setAudioDirList;
          break;
        case 'other':
          setMethod = setOtherDirList;
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
        const newPath = `${type}${dirList.length ? dirList[0].key : ''}`;
        setPath(newPath);
      }
    })();
  }, [type]);

  // 路径发生变化时，刷新展示区内容
  useEffect(() => {
    (async () => {
      const list = await showFileList({ currentPath: path });
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

  /**
   * 删除文件操作
   *
   * @param {string} fileName
   * @returns
   */
  const removeFileHandler = async (fileName: string) => {
    const res = await remove(path, fileName);
    if (res.status === 'ok') {
      return true;
    }
    message.error(typeof res.message === 'string' ? res.message : JSON.stringify(res.message));
    return false;
  }

  /**
   * 展开折叠面板时，刷新目录，并自动显示第一个子目录下的文件
   *
   * @param {(string | string[])} key
   */
  const collapseChandHandler = (key: string | string[]) => {
    if (key) {
      setType(key as string);
    }
  };

  /**
   * 更新树节点信息
   *
   * @param {DataNode[]} list
   * @param {React.Key} key
   * @param {DataNode[]} children
   * @returns {DataNode[]}
   */
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

  /**
   * 展开树节点，自动加载下一级信息
   *
   * @param {EventDataNode} { key, children }
   * @returns {Promise<void>}
   */
  const onLoadData = ({ key, children }: EventDataNode): Promise<void> => {
    // TODO: 待完善
    return new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }
      setTimeout(() => {
        setImageDirList((origin) =>
          updateTreeData(origin, key, [
            // { title: 'Child Node', key: `${key}-0` },
            // { title: 'Child Node', key: `${key}-1` },
          ]),
        );

        resolve();
      }, 10);
    });
  };

  /**
   * 选择树节点，更新path，触发图片列表刷新
   *
   * @param {React.Key[]} selectedKeys
   */
  const onSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length) {
      setPath(`${type}${selectedKeys[0]}`);
    }
  };

  return (
    <PageContainer className={styles.main} title={false}>
      <Row className={styles.row}>
        <Col className={styles.content} flex='auto'>
          <ViewFileList 
            type={type}
            currentFileList={currentFileList} 
            setCurrentFileList={setCurrentFileList} 
            onRemove={removeFileHandler}
          />
        </Col>
        <Col className={styles.slider} flex='15em'>
          <Collapse
            defaultActiveKey={['image']}
            accordion
            onChange={collapseChandHandler}
          >
            <Panel header="图片" key="image">
              <Tree loadData={onLoadData} treeData={imageDirList} onSelect={onSelect} />
            </Panel>
            <Panel header="视频" key="video">
              <Tree loadData={onLoadData} treeData={videoDirList} onSelect={onSelect} />
            </Panel>
            <Panel header="音频" key="audio">
              <Tree loadData={onLoadData} treeData={audioDirList} onSelect={onSelect} />
            </Panel>
            <Panel header="其他" key="other">
              <Tree loadData={onLoadData} treeData={otherDirList} onSelect={onSelect} />
            </Panel>
          </Collapse>
        </Col>
      </Row>
    </PageContainer>
  );
};
