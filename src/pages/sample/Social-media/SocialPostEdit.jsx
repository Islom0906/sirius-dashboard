import React, {useEffect} from 'react';
import {Button, Col, Form, Input, message, Row} from "antd";
import {useMutation, useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import {AppLoader} from "../../../@crema";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";

const initialValueForm = {
    facebook:"",
    instagram:"",
    telegram:"",

};



const SocialPostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId}=useSelector(state => state.editData)
    const dispatch=useDispatch()




    // query-social
    const {
        mutate: postSocialMutate,
        data: postSocial,
        isLoading: postSocialLoading,
        isSuccess: postSocialSuccess,
    } = useMutation(({url, data}) => apiService.postData(url, data),{
        onSuccess:()=>{

            message.success('Success')
        },
        onError:(error)=>{

            for (let obj in error.response.data){
                message.error(`${obj}: ${error.response.data[obj][0]}`)
            }
        }
    });

    // query-edit
    const {
        isLoading: editSocialLoading,
        data: editSocialData,
        refetch: editSocialRefetch,
        isSuccess: editSocialSuccess,
    } = useQuery(["edit-social", editId], () => apiService.getDataByID("/about/socials", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putSocial,
        isLoading: putSocialLoading,
        data: putData,
        isSuccess: putSocialSuccess
    } = useMutation(({
                         url,
                         data,
                         id
                     }) => apiService.editData(url, data, id),{
        onSuccess:()=>{
            message.success('Success')
        },
        onError:(error)=>{

            for (let obj in error.response.data){
                message.error(`${obj}: ${error.response.data[obj][0]}`)
            }

        }
    });

    // social success
    useEffect(() => {
        if (putSocialSuccess) {
            dispatch({type:EDIT_DATA,payload:""})
        }

        if (postSocialSuccess || putSocialSuccess) {
            navigate('/social')
        }
    }, [postSocial,putData])





    // if edit social
    useEffect(() => {
        if (editId !== "") {
            editSocialRefetch();
        }
    }, [editId]);

    // if no edit social
    useEffect(() => {
        if (editId===""){
            form.setFieldsValue(initialValueForm)
        }
    }, []);




    //edit social
    useEffect(()=>{
        if (editSocialSuccess){

            const edit={
                facebook:editSocialData.facebook.split('//')[1],
                instagram:editSocialData.instagram.split('//')[1],
                telegram:editSocialData.telegram.split('//')[1],
            }
            form.setFieldsValue(edit)
        }

    },[editSocialData])



    const onFinish = (values) => {



        const data={
            facebook:`https://${values.facebook}`,
            telegram:`https://${values.telegram}`,
            instagram:`https://${values.instagram}`,
        }



        if (editSocialData){
            putSocial({url: '/about/socials',data,id:editId})
        }else{
            postSocialMutate({url: "/about/socials/", data});
        }






    }
    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };


    // refresh page again get data

    useEffect(() => {
        const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
        if (storedValues) {
            storedValues.images=[]
            form.setFieldsValue(storedValues);
        }

        const handleBeforeUnload = () => {

            localStorage.setItem(
                'myFormValues',
                JSON.stringify(form.getFieldsValue()),
            );
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return ()=>{
            localStorage.removeItem('editDataId')
            localStorage.removeItem('myFormValues')
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, []);






    return (
        <div>
            {( postSocialLoading ||editSocialLoading ||putSocialLoading) ?
                <AppLoader/> :
                <Form
                    form={form}
                    name="basic"
                    labelCol={{
                        span: 24
                    }}
                    wrapperCol={{
                        span: 24
                    }}
                    style={{
                        maxWidth: "100%"
                    }}
                    initialValues={initialValueForm}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item
                                label="Facebook"
                                name="facebook"
                                rules={[{required: true, message: 'Требуется Facebook'}]}

                            >
                                <Input addonBefore={'https://'}/>
                            </Form.Item>

                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Instagram"
                                name="instagram"
                                rules={[{required: true, message: 'Требуется Instagram'}]}
                            >
                                <Input addonBefore={'https://'}/>
                            </Form.Item>

                        </Col>

                    </Row>
                    <Row gutter={20}>
                        <Col span={24}>
                            <Form.Item
                                label="Telegram"
                                name="telegram"
                                rules={[{required: true, message: 'Требуется Telegram'}]}
                            >
                                <Input addonBefore={'https://'}/>
                            </Form.Item>

                        </Col>


                    </Row>
                    <Button type="primary" htmlType="submit" style={{width: "100%",marginTop:"20px"}}>
                        {
                            editSocialSuccess ? 'Edit' : 'Add'
                        }
                    </Button>
                </Form>
            }
        </div>
    );
};

export default SocialPostEdit;