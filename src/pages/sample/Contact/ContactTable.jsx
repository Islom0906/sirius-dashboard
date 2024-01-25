import { Button,   Space, Table } from "antd";
import { EditOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import {useNavigate} from "react-router-dom";

const ContactTable = ({data}) => {
    const dispatch=useDispatch()
    const navigate =useNavigate()


    // const [reverseData,setReverseData]=useState([])

    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch({type:EDIT_DATA,payload:id})
        navigate('/contact/add')
    };

    // useEffect(()=>{
    //     const reverse=data?.reverse()
    //     setReverseData(reverse)
    // },[data])
    const columns = [
        {
            title: 'Address Uz',
            dataIndex: 'address_uz',
            id: 'address_uz',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Address Ru',
            dataIndex: 'address_ru',
            id: 'address_ru',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone_1',
            id: 'phone_1',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            id: 'email',
            render: (text) => <p>{text}</p>,
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

                </Space>
            ),
        },
    ];

    return (
        <div>
            {
                data[0] &&
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey={(record) => record?.id}
                />
            }
        </div>
    );
};

ContactTable.propTypes={
    data:PropTypes.array,
    deleteHandle:PropTypes.func
}

export default ContactTable;