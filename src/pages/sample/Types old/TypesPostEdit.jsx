import React, {useEffect} from 'react';
import {Button, Col, Form, message, Row} from "antd";
import {useMutation, useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import {AppLoader} from "../../../@crema";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import FormInput from "../../../@crema/core/Form/FormInput";

const initialValueForm = {
    title_uz: "",
    title_ru: "",

};




const TypesPostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()




    // query-types
    const {
        mutate: postTypesMutate,
        data: postTypes,
        isLoading: postTypesLoading,
        isSuccess: postTypesSuccess,
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
        isLoading: editTypesLoading,
        data: editTypesData,
        refetch: editTypesRefetch,
        isSuccess: editTypesSuccess,
    } = useQuery(["edit-types", editId], () => apiService.getDataByID("/cars/types", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putTypes,
        isLoading: putTypesLoading,
        data: putData,
        isSuccess: putTypesSuccess
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
                message.error(`${obj}: ${error.response.data[obj][0]}`)
            }
        }
    });

    // types success
    useEffect(() => {
        if (putTypesSuccess) {
            dispatch({type: EDIT_DATA, payload: ""})
        }

        if (postTypesSuccess || putTypesSuccess) {

            navigate('/types')
        }
    }, [postTypes, putData])


    // if edit types
    useEffect(() => {
        if (editId !== "") {
            editTypesRefetch();
        }
    }, [editId]);

    // if no edit types
    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }
    }, []);


    //edit types
    useEffect(() => {
        if (editTypesSuccess) {

            const edit = {
                title_uz: editTypesData.title_uz,
                title_ru: editTypesData.title_ru,
            }

            form.setFieldsValue(edit)
        }

    }, [editTypesData])


    const onFinish = (values) => {


        const formData = new FormData();

        formData.append('title_uz', values.title_uz);
        formData.append('title_ru', values.title_ru);


        if (editTypesData) {
            putTypes({url: '/cars/types', data: formData, id: editId})
        } else {
            postTypesMutate({url: "/cars/types/", data: formData});
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
            {(postTypesLoading || editTypesLoading || putTypesLoading) ?
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
                                required_text={'Tur nomini kiritishingiz kerak'}
                                label={'Tur nomi Uz'}
                                name={'title_uz'}
                            />


                        </Col>
                        <Col span={12}>
                            <FormInput
                                required={true}
                                required_text={'Необходимо ввести название типа'}
                                label={'Название типа Ru'}
                                name={'title_ru'}
                            />

                        </Col>
                    </Row>

                    <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                        {
                            editTypesSuccess ? 'Edit' : 'Add'
                        }
                    </Button>
                </Form>
            }
        </div>
    );
};

export default TypesPostEdit;