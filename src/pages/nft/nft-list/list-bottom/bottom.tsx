import './index.less';

import { Image, List } from 'antd';

export default function Bottom() {
  // 用来记录总数
  // const [total] = useState<number>(10);
  // TablePaginationConfig是从antd中引入的
  // const [pagination, setPagination] = useState<TablePagitionConfig>({
  //     current: 1,
  //     pageSize: 10,
  //     total: total,
  //     showTotal: (total) => `共 ${total} 条`,
  //     pageSizeOptions: ['5', '10', '15', '20'],
  // });
  // // 当前页数
  // const current: any = pagination.current;
  // // 每页条数
  // const pageSize: any = pagination.pageSize;
  // // 跳过多少个数据
  // const skip: number = (current - 1) * pageSize;
  // // 一页显示多少个数据
  // const take: number = pageSize;

  // console.log(skip, take);
  // 表格页码发生变化时触发的方法
  // const listPageChange = (pagination: any) => {
  //     setPagination({
  //         current: pagination.current,
  //         pageSize: pagination.pageSize,
  //         total: total,
  //         showTotal: (total) => `共 ${total} 条`,
  //     });
  // };
  const data = [
    {
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png ',
    },
    {
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png ',
    },
    {
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png ',
    },
    {
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png ',
    },
    {
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png ',
    },
    {
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png ',
    },
    {
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png ',
    },
    {
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png ',
    },
    {
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png ',
    },
    {
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png ',
    },
    {
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png ',
    },
    {
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png ',
    },
  ];
  return (
    <div className="nft-list-bottom">
      <List
        style={{ height: '100%' }}
        grid={{ gutter: 16, column: 4 }}
        dataSource={data}
        renderItem={() => (
          <List.Item>
            {/* style={{ width: '80%', height: '80%' }} */}
            <Image
              style={{ height: '20em', width: '20em' }}
              //  style={{ maxWidth: '100%', maxHeight: '50%', minHeight: '30%' }}
              src="https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png"
            ></Image>
          </List.Item>
        )}
        pagination={{ pageSize: 8, position: 'bottom' }}
        // onChange={listPageChange}
      />
    </div>
  );
}
