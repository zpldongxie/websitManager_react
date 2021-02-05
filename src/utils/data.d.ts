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
};

/**
 * 栏目树数据结构
 *
 * @interface TreeNodeType
 */
export interface TreeNodeType {
  value?: string;
  label?: React.ReactNode;
  children?: TreeNodeType[];
  [key: string]: any;
}
