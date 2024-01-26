import {Button, Popconfirm, Space, Table, Image, Tag} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import {useNavigate} from "react-router-dom";



const ProductTable = ({data,deleteHandle}) => {
    const dispatch=useDispatch()
    const navigate =useNavigate()
    const Delete = async (id) => {
        deleteHandle('/banners',id)
    };




    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch({type:EDIT_DATA,payload:id})
        navigate('/banner/add')
    };





    const columns = [

        {
            title: 'Изображение для версии для ПК',
            dataIndex: 'web_image_ru',
            id: 'web_image_ru',
            render: (image) => {
                return (
                    <Image
                        width={50}
                        src={image}
                    />
                )},
        },
        {
            title: 'Изображение для мобильной версии',
            dataIndex: 'rsp_image_ru',
            id: 'rsp_image_ru',
            render: (image) => {
                return (
                    <Image
                        width={50}
                        src={image}
                    />
                )},
        },
        {
            title: 'Это рекламный баннер?',
            dataIndex: 'is_advertisement',
            id: 'is_advertisement',
            render:(text) => text ? <Tag color="#108ee9">Да</Tag> : <Tag color="#f50">Нет</Tag>,
        },
        {
            title: 'Action',
            id: 'action',
            render: (_, record) => (
                <Space size={20}>
                    <Button
                        onClick={() => Edit(record.id)}
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
            <Table
                columns={columns}
                dataSource={data}
                rowKey={(record) => record.id}
            />
        </div>
    );
};

ProductTable.propTypes={
    data:PropTypes.array,
    deleteHandle:PropTypes.func
}

export default ProductTable;