import { Moment } from 'moment';

export interface TrainingDataType {
  id?: string;
  /**
   * 培训标题
   *
   * @type {string}
   * @memberof TrainingDataType
   */
  title: string;
  /**
   * 培训副标题
   *
   * @type {string}
   * @memberof TrainingDataType
   */
  subTitle: string;
  /**
   * 虚拟属性，报名时间范围
   *
   * @type {[string, string]}
   * @memberof registTimeRange
   */
  registTimeRange?: [Moment, Moment];
  /**
   * 报名开始时间
   *
   * @type {string}
   * @memberof TrainingDataType
   */
  registStartTime: string;
  /**
   * 报名截止时间
   *
   * @type {string}
   * @memberof TrainingDataType
   */
  registEndTime: string;
  /**
   * 培训方式
   *
   * @type {string}
   * @memberof TrainingDataType
   */
  trainingMethod: string;
  /**
   * 虚拟属性，培训时间范围
   *
   * @type {[string, string]}
   * @memberof registTimeRange
   */
  timeRange?: [Moment, Moment];
  /**
   * 培训开始时间
   *
   * @type {string}
   * @memberof TrainingDataType
   */
  startTime: string;
  /**
   * 培训结束时间
   *
   * @type {string}
   * @memberof TrainingDataType
   */
  endTime: string;
  /**
   * 培训介绍
   *
   * @type {string}
   * @memberof TrainingDataType
   */
  desc: string;
  Channel: {
    name: string
  },
}

export interface QueryListDataType {
  ChannelId?: number;
  search?: {name: string, value: string}[],
  pageNum?: number;
  pageSize?: number;
}

export interface Member {
  avatar: string;
  name: string;
  id: string;
}

export interface BasicListItemDataType {
  id: string;
  owner: string;
  title: string;
  avatar: string;
  cover: string;
  status: 'normal' | 'exception' | 'active' | 'success';
  percent: number;
  logo: string;
  href: string;
  body?: any;
  updatedAt: number;
  createdAt: number;
  subDescription: string;
  description: string;
  activeUser: number;
  newUser: number;
  star: number;
  like: number;
  message: number;
  content: string;
  members: Member[];
}
