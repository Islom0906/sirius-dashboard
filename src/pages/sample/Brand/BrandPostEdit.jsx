import React, {useEffect, useMemo} from 'react';
import {Button, Col, Form, message, Row, Select} from "antd";
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
    sub_category:[],
};




const BrandPostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()



    // query-sub-category-get
    const {data: categoryData} = useQuery(
        'get-category',
        () => apiService.getData('/sub_categories/')
    );

    // query-brand
    const {
        mutate: postBrandMutate,
        data: postBrand,
        isLoading: postBrandLoading,
        isSuccess: postBrandSuccess,
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
        isLoading: editBrandLoading,
        data: editBrandData,
        refetch: editBrandRefetch,
        isSuccess: editBrandSuccess,
    } = useQuery(["edit-brand", editId], () => apiService.getDataByID("/brands", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putBrand,
        isLoading: putBrandLoading,
        data: putData,
        isSuccess: putBrandSuccess
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

    // brand success
    useEffect(() => {
        if (putBrandSuccess) {
            dispatch({type: EDIT_DATA, payload: ""})
        }

        if (postBrandSuccess || putBrandSuccess) {

            navigate('/brand')
        }
    }, [postBrand, putData])


    // if edit brand
    useEffect(() => {
        if (editId !== "") {
            editBrandRefetch();
        }
    }, [editId]);

    // if no edit cate
    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }

    }, []);


    //edit brand
    useEffect(() => {
        const sub_category=[]

        if (editBrandSuccess) {
            editBrandData?.sub_categories?.map((sub)=>{
                sub_category.push(sub.id)
            })

            const edit = {
                title_uz: editBrandData.title_uz,
                title_ru: editBrandData.title_ru,
                sub_category,
            }
            form.setFieldsValue(edit)
        }

    }, [editBrandData])


    const onFinish = (values) => {
        if (editBrandData) {
            putBrand({url: '/brands', data: values, id: editId})
        } else {
            postBrandMutate({url: "/brands/", data: values});
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



    // option category
    const optionsCategory = useMemo(() => {
        return categoryData?.map((option) => {
            return {
                value: option?.id,
                label: option?.title_ru,
            };
        });
    }, [categoryData]);


    return (
        <div>
            {(postBrandLoading || editBrandLoading || putBrandLoading) ?
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
                                required_text={'Brand kiritishingiz kerak'}
                                label={'Brand'}
                                name={'title_uz'}
                            />


                        </Col>
                        <Col span={12}>
                            <FormInput
                                required={true}
                                required_text={'Вы должны ввести бренд'}
                                label={'Бренд Ru'}
                                name={'title_ru'}
                            />

                        </Col>
                        <Col span={24}>
                            <Form.Item

                                label={'Выберите подкатегория'}
                                name={'sub_category'}
                                rules={[{
                                    required: true, message: 'Страну должны быть выбраны'
                                }]}
                                wrapperCol={{
                                    span: 24,
                                }}
                            >
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder='Выберите одну подкатегория'
                                    optionLabelProp='label'
                                    options={optionsCategory}
                                />
                            </Form.Item>

                        </Col>
                    </Row>


                    <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                        {
                            editBrandSuccess ? 'Edit' : 'Add'
                        }
                    </Button>
                </Form>
            }
        </div>
    );
};

export default BrandPostEdit;