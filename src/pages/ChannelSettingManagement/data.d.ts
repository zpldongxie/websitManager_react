// 栏目配置
export type ChannelSettingType = {
  id?: string;
  title?: string;
  descStr?: string;
  pic?: string;
  video?: string;
  link?: string;
  orderIndex?: number;
  type?: 'pic' | 'url' | 'desc' | 'video' | undefined;
  group?: string;
  ChannelId?: string;
  ChannelSettingType?: boolean;
};
// 栏目配置信息分组列表
export type ChannelSettingGroupList = {
  groupName: string | null | undefined;
  groupEdit?: boolean;
  dataResource: ChannelSettingType[];
};
// 栏目配置信息总列表
export type ChannelSettingList = {
  type: 'pic' | 'url' | 'desc' | 'video' | undefined;
  tabName: string;
  list: ChannelSettingGroupList[];
};
// 渲染表单行
export type TableListItem = {
  key: number;
} & ChannelType;

// 翻页信息
export type TableListPaginationType = {
  total: number;
  pageSize: number;
  current: number;
};

// 表结构定义
export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPaginationType>;
};
