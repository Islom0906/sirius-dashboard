import {Button, Space, Table, Image, Popconfirm} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import {useNavigate} from "react-router-dom";

const ServiceTable = ({data,deleteHandle}) => {
    const dispatch=useDispatch()
    const navigate =useNavigate()


    const Delete = async (id) => {
        deleteHandle('/about/services',id)
    };

    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch({type:EDIT_DATA,payload:id})
        navigate('/service/add')
    };


    const columns = [
        {
            title: 'Title Uz',
            dataIndex: 'title_uz',
            id: 'title_uz',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Title Ru',
            dataIndex: 'title_ru',
            id: 'title_ru',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Image',
            dataIndex: 'image',
            id: 'image',
            render: (image) => {
                    return (
                    <Image
                        width={50}

                        src={image}
                    />
                )
            },
        },
        {
            title: 'Action',
            id: 'action',
            render: (_, record) => (
                <Space size={20}>
                    <Button
                        onClick={() => Edit(record?.id)}
                        type='primary'
                        icon={<EditOutlined />}>
                        Edit
                    </Button>
                    <Popconfirm
                        title={'Are you sure to delete this task?'}
                        description={'Delete the task '}
                        onConfirm={() => Delete(record.id)}>
                        <Button type='danger' icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {

                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey={(record) => record?.id}
                />
            }
        </div>
    );
};

ServiceTable.propTypes={
    data:PropTypes.array,
    deleteHandle:PropTypes.func
}

export default ServiceTable;