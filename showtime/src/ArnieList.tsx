import {DataTable, DataTableSortStatus} from 'mantine-datatable';
import {useState} from 'react';
import {useAsync} from 'react-async-hook';
import {useNavigate} from 'react-router-dom';
import ago from 's-ago';
import {Container} from '@mantine/core';

import {ArnieBrief, ArnieService, ModelOutput} from './api';

const columns = [
  {
    accessor: 'name',
    sortable: true,
    width: 200,
  },
  {
    accessor: 'killCount',
    sortable: true,
    width: 200,
  },
  {
    accessor: 'updatedAt',
    title: 'Last updated',
    sortable: true,
    width: 200,
    render: (record: ArnieBrief & ModelOutput) => {
      return ago(new Date(record.updatedAt));
    },
    visibleMediaQuery: (theme: any) => `(min-width: ${theme.breakpoints.xs})`,
  },
];

export default function ArnieList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: '',
    direction: 'asc',
  });
  const handleSortStatusChange = (status: DataTableSortStatus) => {
    setPage(1);
    setSortStatus(status);
  };

  let data, total;
  const sort = sortStatus.columnAccessor
    ? `${sortStatus.direction === 'desc' ? '-' : ''}${sortStatus.columnAccessor}`
    : undefined;
  const asyncData = useAsync(ArnieService.listArnies, [page, 20, sort]);
  const {result} = asyncData;
  if (result) {
    data = result.data;
    total = result.meta.total;
  }

  return (
    <Container>
      <DataTable
        withBorder
        fetching={!result}
        columns={columns}
        records={data}
        page={page}
        recordsPerPage={pageSize}
        totalRecords={total}
        onPageChange={setPage}
        sortStatus={sortStatus}
        onSortStatusChange={handleSortStatusChange}
        onRowClick={row => navigate(row.id as string)}
      />
    </Container>
  );
}
