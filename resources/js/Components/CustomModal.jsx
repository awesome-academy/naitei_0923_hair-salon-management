import { Modal } from 'antd';
import styled from 'styled-components';

export default function CustomModal(props) {

    const MyModal = styled(Modal)`
        .ant-modal {
            width: 700px;
        };
        .ant-modal-header {
            background-color: #bae0ff;
            border-radius: 5px 5px 0 0;
        };
        .ant-modal-content {
            border-radius: 5px;
        }
    `;

    return (
        <MyModal {...props}/>
    )
}
