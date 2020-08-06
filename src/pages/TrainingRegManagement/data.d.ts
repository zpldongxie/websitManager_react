export interface TableListItem {
  id?: string;
  name: string;
  mobile: string;
  email: string;
  comp: string;
  signInTime?: string;
  TrainingId: string;
  Training?: {id: string, title: string, Channel: {id: number, name: string}};
  updatedAt?: string;
  createdAt?: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
