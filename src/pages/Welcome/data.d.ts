/*
 * @description: 数据格式定义
 * @author: zpl
 * @Date: 2021-01-24 17:12:34
 * @LastEditTime: 2021-01-25 09:34:11
 * @LastEditors: zpl
 */
// 图形组件类型
type ChartType = 'Line' | 'Column';
// 自定义组件类型
type CustomeType = 'test' | 'Grid' | 'Legend' | 'Tab' | 'List';

// 拆线图配置
export type LineChartSettings = LineConfig & React.RefAttributes<unknown>;

// 柱状图配置
export type ColumnChartSettings = LineConfig & React.RefAttributes<unknown>;

export type LayoutItemType = {
  key: string | number;
  /**
   * 组件类型
   *
   * @type {ChartType}
   */
  type: 'group' | ChartType | CustomeType;
  children?: layoutConfigType;
  /**
   * 标题
   *
   * @type {string}
   */
  title?: string;
  /**
  * 数据是否反转显示
  *
  * @type {boolean}
  * 
  */

  reverse?: boolean;
  /**
   * 数据，请自行保证组件使用数据的正确性
   *
   * @type {*}
   */
  data?: any;
  /**
   * 请求数据的方式，存在data时此参数不应生效，请在组件中控制
   *
   * @type {({
   *     method: 'post' | 'get';
   *     url: string;
   *     payload: string | Record<string, string>
   *   })}
   */
  dataRequest?: {
    method: 'post' | 'get';
    url: string;
    payload: string | Record<string, string>;
  };
  /**
   * 可针对各组件设置特殊配置
   *
   * @type {(LineChartSettings | ColumnChartSettings)}
   */
  settings?: LineChartSettings | ColumnChartSettings;
  /**
   * 排序值
   *
   * @type {number}
   */
  orderIndex?: number;
  height?: string;
  className?: string;
  /**
   * 布局宽度，请参考antd Col对应属性
   *
   * @type {(string | number)}
   */
  span?: string | number;
  /**
   * 布局宽度，请参考antd Col对应属性
   *
   * @type {(string | number)}
   */
  flex?: string | number;
};

export type layoutConfigType = {
  /**
   * 横向间隔，单位为px
   *
   * @type {number}
   */
  paddingX: number;
  /**
   * 纵向间隔，单位px
   *
   * @type {number}
   */
  paddingY: number;
  list: LayoutItemType[];
};
