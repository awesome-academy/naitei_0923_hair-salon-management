import { Table } from 'antd';
import styled from 'styled-components';

export default function CustomTable(props) {

    const MyTable = styled(Table)`
        .ant-table-thead > tr > th {
            background-color: #f0f0f0;
            color: #000;
        }
    `;

    return (
        <MyTable {...props}/>
    )
}
