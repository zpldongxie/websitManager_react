// export type ShowStatus = '不显示' | '全部显示' | '仅主菜单显示' | '仅侧边菜单显示' | '单独显示';

// 栏目配置
export type ChannelSettingType = {
  id?: string;
  title: string;
  descStr?: string;
  pic?: string;
  video?: string;
  link?: string;
  type: 'pic' | 'url' | 'desc' | 'video';
  group: string;
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
