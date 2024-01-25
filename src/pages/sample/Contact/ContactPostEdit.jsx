import React, {useEffect} from 'react';
import {Button, Col, Form,  message, Row} from "antd";
import {useMutation, useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import {AppLoader} from "../../../@crema";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import FormInput from "../../../@crema/core/Form/FormInput";
import FormInputEmail from "../../../@crema/core/Form/FormInputEmail";

const initialValueForm = {
    address_uz: "",
    address_ru: "",
    phone_1: "",
    phone_2: "",
    email: "",
    map: "",

};


const ContactPostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()


    // query-contact
    const {
        mutate: postContactMutate,
        data: postContact,
        isLoading: postContactLoading,
        isSuccess: postContactSuccess,
    } = useMutation(({url, data}) => apiService.postData(url, data), {
        onSuccess: () => {

            message.success('Success')
        },
        onError: (error) => {
            for (let obj in error.response.data) {
                message.error(`${obj}: ${error.response.data[obj][0]}`)
            }
        }
    });

    // query-edit
    const {
        isLoading: editContactLoading,
        data: editContactData,
        refetch: editContactRefetch,
        isSuccess: editContactSuccess,
    } = useQuery(["edit-contact", editId], () => apiService.getDataByID("/about/contacts", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putContact,
        isLoading: putContactLoading,
        data: putData,
        isSuccess: putContactSuccess
    } = useMutation(({
                         url,
                         data,
                         id
                     }) => apiService.editData(url, data, id), {
        onSuccess: () => {
            message.success('Success')
        },
        onError: (error) => {
            for (let obj in error.response.data) {
                message.error(`${obj}: ${error.response.data[obj]}`)
            }
        }
    });

    // contact success
    useEffect(() => {
        if (putContactSuccess) {
            dispatch({type: EDIT_DATA, payload: ""})
        }

        if (postContactSuccess || putContactSuccess) {

            navigate('/contact')
        }
    }, [postContact, putData])


    // if edit contact
    useEffect(() => {
        if (editId !== "") {
            editContactRefetch();
        }
    }, [editId]);

    // if no edit contact
    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }
    }, []);


    //edit contact
    useEffect(() => {
        if (editContactSuccess) {



            const edit = {
                address_uz: editContactData.address_uz,
                address_ru: editContactData.address_ru,
                phone_1: editContactData.phone_1,
                phone_2: editContactData.phone_2,
                email: editContactData.email,
                map:editContactData.map
            }
            form.setFieldsValue(edit)
        }

    }, [editContactData])


    const onFinish = (values) => {

        console.log(values)
        if (editContactData) {
            putContact({url: '/about/contacts', data: values, id: editId})
        } else {
            postContactMutate({url: "/about/contacts/", data: values});
        }


    }
    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };


    // refresh page again get data

    useEffect(() => {
        const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
        if (storedValues) {
            storedValues.images = []
            form.setFieldsValue(storedValues);
        }

        const handleBeforeUnload = () => {

            localStorage.setItem(
                'myFormValues',
                JSON.stringify(form.getFieldsValue()),
            );
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            localStorage.removeItem('editDataId')
            localStorage.removeItem('myFormValues')
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, []);


    return (
        <div>
            {(postContactLoading || editContactLoading || putContactLoading) ?
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
                            <FormInput
                                required={true}
                                required_text={'Address kiritish kerak'}
                                label={'Address Uz'}
                                name={'address_uz'}
                            />

                        </Col>
                        <Col span={12}>
                            <FormInput
                                required={true}
                                required_text={'Необходимо ввести адрес'}
                                label={'Адрес Ru'}
                                name={'address_ru'}
                            />
                        </Col>

                    </Row>

                    <Row gutter={20}>
                        <Col span={12}>
                            <FormInput
                                required={true}
                                required_text={'Вам необходимо ввести номер телефона'}
                                label={'Номер телефона 1'}
                                name={'phone_1'}
                            />

                        </Col>
                        <Col span={12}>
                            <FormInput
                                required={true}
                                required_text={'Вам необходимо ввести номер телефона'}
                                label={'Номер телефона 2'}
                                name={'phone_2'}
                            />

                        </Col>
                        <Col span={24}>
                            <FormInputEmail
                                required={true}
                                required_text={'Требуется электронная почта'}
                                label={'Электронная почта'}
                                name={'email'}
                            />
                        </Col>

                    </Row>

                    <Row gutter={20}>
                        <Col span={24}>
                            <FormInput
                                required={true}
                                required_text={'Введите ссылку на геолокацию'}
                                label={'Ссылка на геолокацию'}
                                name={'map'}
                            />
                        </Col>
                    </Row>

                    <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                        {
                            editContactSuccess ? 'Edit' : 'Add'
                        }
                    </Button>
                </Form>
            }
        </div>
    );
};

export default ContactPostEdit;