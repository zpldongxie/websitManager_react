/**
 * 请求获取到的栏目列表
 *
 * @export
 * @interface ChannelType
 */
export interface ChannelType {
  id: number;
  name: string;
  parentId?: number;
}

/**
 * 栏目树数据结构
 *
 * @interface TreeNodeType
 */
export interface TreeNodeType {
  value?: string | number;
  label?: React.ReactNode;
  children?: Array<TreeNodeType>;
  [key: string]: any;
}
