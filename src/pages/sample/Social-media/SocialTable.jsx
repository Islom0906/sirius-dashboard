import { Button, Space, Table } from "antd";
import { EditOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import {useNavigate} from "react-router-dom";

const SocialTable = ({data}) => {
    const dispatch=useDispatch()
    const navigate =useNavigate()


    // const [reverseData,setReverseData]=useState([])

    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch({type:EDIT_DATA,payload:id})
        navigate('/social/add')
    };

    // useEffect(()=>{
    //     const reverse=data?.reverse()
    //     setReverseData(reverse)
    // },[data])
    const columns = [
        {
            title: 'Facebook',
            dataIndex: 'facebook',
            id: 'facebook',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Instagram',
            dataIndex: 'instagram',
            id: 'instagram',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Telegram',
            dataIndex: 'telegram',
            id: 'telegram',
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

SocialTable.propTypes={
    data:PropTypes.array,
}

export default SocialTable;