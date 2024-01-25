import {Button, Image, Popconfirm, Space, Table, Tag} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import {useNavigate} from "react-router-dom";

const ProductTable = ({data,deleteHandle}) => {
    const dispatch=useDispatch()
    const navigate =useNavigate()
    const Delete = async (id) => {
        deleteHandle('/products',id)
    };


    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch({type:EDIT_DATA,payload:id})
        navigate('/product/add')
    };
    const columns = [
        {
            title: 'Product Uz',
            dataIndex: 'title_uz',
            id: 'title_uz',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Category',
            dataIndex: 'categories',
            id: 'categories',
            render: (text) => <p>{text?.title_ru}</p>,
        },
        {
            title: 'Brand',
            dataIndex: 'brands',
            id: 'brands',
            render: (text) => <p>{text?.title_ru}</p>,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            id: 'price',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Is Available',
            dataIndex: 'is_available',
            id: 'is_available',
            render: (text) => text ? <Tag color="#108ee9">В продаже</Tag> : <Tag color="#f50">Нет в продаже</Tag>
        },
        {
            title: 'Main Image',
            dataIndex: 'images',
            id: 'images',
            render: (image) => {
                return (
                    <Image
                        width={50}

                        src={image[0]?.image}
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
                        onClick={() => Edit(record.slug)}
                        type='primary'
                        icon={<EditOutlined />}>
                        Edit
                    </Button>
                    <Popconfirm
                        title={'Are you sure to delete this task?'}
                        description={'Delete the task '}
                        onConfirm={() => Delete(record.slug)}>
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