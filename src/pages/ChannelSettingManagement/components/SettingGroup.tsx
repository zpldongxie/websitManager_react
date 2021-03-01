/* eslint-disable react/no-array-index-key */
import type { FC } from 'react';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { Collapse, Input, message } from 'antd';
import {
  PlusOutlined,
} from '@ant-design/icons';

import IconFont from '@/components/CustomIcon';
import EditableTable from './EditableTable';

import styles from '../index.module.less';
import type { ChannelSettingGroupList, ChannelSettingType } from '@/utils/data';
import myContext from '../myContext';
import { updateChannelSetting, updateChannelSettings } from '../service';


const { Panel } = Collapse;

type GroupProps = {
  type?: 'pic' | 'url' | 'desc' | 'video' | undefined;
  list?: ChannelSettingGroupList[];
  channel: string;
}
const SettingGroup: FC<GroupProps> = (props) => {
  const { type, list = [], channel } = props;

  const { siteData, settingExtend, refreshData } = useContext(myContext);

  const [dataSource, setDataSource] = useState<ChannelSettingGroupList[]>([]);

  useEffect(() => {
    // if (channel === 'site'){
    //   const siteType = siteData?.find((item) => item.type === type);
    //   setDataSource(siteType!.list)
    // }
    // 开启继承的时候，需要把本页面中全站不存在的分组拼进来让下层组件进行渲染
    if (channel !== 'site' && settingExtend) {
      // 从全站配置中找对应类型
      const siteType = siteData?.find((item) => item.type === type);
      if (siteType) {
        const pageGroupNameList = list.map((item) => item.groupName);
        // 从全站配置查找本页不存在的分组
        const siteGroups = siteType.list.filter((item) => !pageGroupNameList.includes(item.groupName));
        setDataSource(list.concat(siteGroups))
      } else {
        setDataSource(list);
      }
    } else {
      setDataSource(list)
    }
  }, [channel, list, settingExtend, siteData, type])

  const handleAdd = () => {
    const curJudge = dataSource.filter((item) => item.groupEdit === true);
    if(curJudge.length > 0){
      message.warning('同时间只能修改或新增一个分组名称');
      return;
    }
    const newArr: ChannelSettingGroupList[] = [{
      groupName: '',
      groupEdit: true,
      dataResource: []
    }];
    const newDataSource = dataSource?.concat(newArr);
    setDataSource(newDataSource);
  };
  const handleRename = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, ind: number, evtType: string) => {
    e.stopPropagation();
    let newDataSource = [...(dataSource || [])];
    if (ind < newDataSource.length) {
      if (evtType === "Edit") {
        const curJudge = dataSource.filter((item) => item.groupEdit === true);
        if(curJudge.length > 0){
          message.warning('同时间只能修改或新增一个分组名称');
          return;
        }
        newDataSource[ind].groupEdit = true;
      } else {
        newDataSource[ind].groupEdit = false; const tabHeader = (e.target as HTMLImageElement).closest('div[class*="tabHeader"]');
        const groupName = (tabHeader!.querySelector(".ant-input") as HTMLInputElement).value;
        if (evtType === "save") {
          newDataSource[ind].groupName = groupName;
          if(newDataSource[ind].dataResource.length > 0){
            const idArr = newDataSource[ind].dataResource.map((item) => item.id);
            const queryParams = {
              'ids':idArr,
              'type':type!,
              'group':groupName!
            };
            updateChannelSettings(queryParams).then(result=>{
              if(result.success){
                message.success('分组名称修改成功');
              }
            });
          }
        } else if (groupName === "") {
          newDataSource = newDataSource.filter((_item, index) => index !== ind);
        }
      }
    }
    setDataSource(newDataSource);
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) =>{
    e.stopPropagation();
    if((e.target as HTMLInputElement).value.trim() === ""){
      message.warning('分组名称不可为空');
      e.target.focus();
    }
  };
  const panelHeader = (name: string, index: number, status?: boolean) => {
    return (
      <div className={styles.tabHeader} >
        {status ? <>
          <Input defaultValue={name} autoFocus onBlur={(e) => handleBlur(e)} />
          <IconFont
            onClick={(e) => handleRename(e, index, "save")}
            type='icon-ok'
          />
          <IconFont
            onClick={(e) => handleRename(e, index, "cancel")}
            type='icon-cancel'
          />
        </> : <span>
            {name}
            <IconFont
              onClick={(e) => handleRename(e, index, "Edit")}
              type='icon-edit'
            />
          </span>}
      </div>
    )
  };
  const onSubmit = async (values: ChannelSettingType) => {
    const result = await updateChannelSetting(values);
    if(result.success){
      refreshData!();
      message.info('数据提交成功');
    }
  };
  return (
    <>
      {dataSource?.map((item, index) => <Collapse
        expandIconPosition='left'
        defaultActiveKey={index === 0 ? '1' : ''}
        key={index}
      >
        <Panel collapsible={item.groupEdit ? 'disabled' : 'header'} header={panelHeader(item.groupName!, index, item.groupEdit)} key={index * 1 + 1}>
          <EditableTable type={type} groupName={item.groupName!} channel={channel} curDataSource={item.dataResource} onSubmit={onSubmit} />
        </Panel>
      </Collapse>)}
      <button className={styles.addNewBtn} onClick={handleAdd}><PlusOutlined />新建分组</button>
    </>
  );
};

export default SettingGroup;
