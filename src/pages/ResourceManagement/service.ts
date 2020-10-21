import request from 'umi-request';

/**
 * 按条件查询文章列表
 *
 * @export
 * @param {TableListParams} [params]
 * @return {*}
 */
export async function showFileList(params: { currentPath: string }) {
  const result = await request('/api/showFileList', {
    method: 'POST',
    data: { ...params },
  });

  if (result.status === 'ok') {
    // const list = result.data.map((file: FileItemType, index: number) => ({
    //   ...file,
    //   uid: index,
    //   status: 'done',
    //   size: 100,
    // }));
    // return list;
    return result.data;
  }
  return [];
}

/**
 * 删除文件
 *
 * @export
 * @param {string} filePath 文件相对路径
 * @param {string} fileName 文件名
 * @returns
 */
export async function remove(filePath: string, fileName: string) {
  return request('/api/file', {
    method: 'DELETE',
    data: {
      filePath,
      fileName
    },
  });
}
