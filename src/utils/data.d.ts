// 栏目类型
export type ChannelTypeType = {
  id?: string;
  name: string;
  descStr?: string;
  orderIndex: number;
};

/**
 * 请求获取到的栏目列表
 *
 * @export
 * @interface ChannelType
 */
export type ChannelType = {
  id?: string;
  name: string;
  enName: string;
  parentId?: string | null;
  keyWord: string;
  descStr: string;
  showStatus: number;
  orderIndex?: number;
  url?: string;
  settingExtend: boolean;
  createdAt?: string;
  updatedAt?: string;
  ChannelTypeId: string;
  ChannelType?: ChannelTypeType;
  ChannelSettings?: ChannelSettingType[];
  ChannelSettingList?: ChannelSettingList[];
};

/**
 * 栏目树数据结构
 *
 * @interface TreeNodeType
 */
export type TreeNodeType = {
  value?: string;
  label?: React.ReactNode;
  key: string;
  title?: React.ReactNode;
  children?: TreeNodeType[];
  [key: string]: any;
}
export type channelParams = {
  id: string;
};
// 栏目配置
export type ChannelSettingType = {
  id?: string;
  title?: string;
  descStr?: string;
  key?: string;
  pic?: string;
  video?: string;
  link?: string;
  orderIndex?: number;
  type?: 'pic' | 'url' | 'desc' | 'video' | undefined;
  group?: string;
  Channel?: channelParams | null;
  ChannelId?: string;
  disabled?: boolean;
};
// 栏目配置
export type ChannelSettingTypes = {
  ids: (string | undefined)[];
  title?: string;
  descStr?: string;
  key?: string;
  pic?: string;
  video?: string;
  link?: string;
  orderIndex?: number;
  type?: string;
  group?: string;
  Channel?: channelParams | null;
  ChannelId?: string;
  disabled?: boolean;
};
// 栏目配置信息分组列表
export type ChannelSettingGroupList = {
  groupName: string | null | undefined;
  groupEdit?: boolean;
  groupUsed?: boolean;
  dataResource: ChannelSettingType[];
};
// 栏目配置信息总列表
export type ChannelSettingList = {
  type: 'pic' | 'url' | 'desc' | 'video' | undefined;
  tabName: string;
  list: ChannelSettingGroupList[];
};

// 全站配置信息总列表
export type SiteSettingList = {
  total: number;
  list: ChannelSettingType[];
  ChannelSettingList?: ChannelSettingList[];
};