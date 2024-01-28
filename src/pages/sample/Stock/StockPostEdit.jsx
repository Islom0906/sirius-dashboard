import React, {useEffect,  } from 'react';
import {Button, Col, Form, message, Row, } from "antd";
import {useMutation, useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import {AppLoader} from "../../../@crema";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import FormInput from "../../../@crema/core/Form/FormInput";


const initialValueForm = {
    title_ru: "",
    title_uz:""
};


const StockPostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()





    // query-stock
    const {
        mutate: postStockMutate,
        data: postStock,
        isLoading: postStockLoading,
        isSuccess: postStockSuccess,

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
        isLoading: editStockLoading,
        data: editStockData,
        refetch: editStockRefetch,
        isSuccess: editStockSuccess,

    } = useQuery(["edit-stock", editId], () => apiService.getDataByID("/stocks", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putStock,
        isLoading: putStockLoading,
        data: putData,
        isSuccess: putStockSuccess
    } = useMutation(({
                         url, data, id
                     }) => apiService.editData(url, data, id), {
        onSuccess: () => {

            message.success('Success')
        },
        onError: (error) => {
            for (let obj in error.response.data) {
                message.error(`${obj}: ${error.response.data[obj][0]}`)
            }
        }
    });

    //                                              =====useEffect====

    // stock success
    useEffect(() => {
        if (putStockSuccess) {
            dispatch({type: EDIT_DATA, payload: ""})
        }
        if (postStockSuccess || putStockSuccess) {
            navigate('/stock')
        }
    }, [postStock, putData])

    // if edit stock
    useEffect(() => {
        if (editId !== "") {
            editStockRefetch();
        }
    }, [editId]);

    // if no edit stock
    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }
    }, []);


    //edit stock
    useEffect(() => {


        if (editStockSuccess) {

            const edit = {
                title_ru: editStockData.title_ru,
                title_uz: editStockData.title_uz,

            }

            form.setFieldsValue(edit)
        }

    }, [editStockData])
    const onFinish = (values) => {

        const formData = new FormData()

        formData.append('title_ru', values.title_ru);
        formData.append('title_uz', values.title_uz);



        if (editStockSuccess) {
            putStock({url: "/stocks", data: formData, id: editId});
        } else {
            postStockMutate({url: "/stocks/", data: formData});
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

            localStorage.setItem('myFormValues', JSON.stringify(form.getFieldsValue()),);
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
            {(postStockLoading || editStockLoading || putStockLoading) ? <AppLoader/> :
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
                                required_text={'Требуется тип действия'}
                                label={'Введите тип продвижения'}
                                name={'title_ru'}
                            />


                        </Col>

                        <Col span={12}>
                            <FormInput
                                required={true}
                                required_text={'Aksiyasini turi kiritish talab qilinadi'}
                                label={'Aksiyasini turini kiriting'}
                                name={'title_uz'}
                            />


                        </Col>

                    </Row>




                    <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                        {editStockSuccess ? 'Edit' : 'Add'}
                    </Button>
                </Form>}
        </div>);
};

export default StockPostEdit;