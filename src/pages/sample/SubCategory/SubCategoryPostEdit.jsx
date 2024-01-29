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
    category:null,
    brand:[]
};




const SubCategoryPostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()



    // query-category-get
    const {data: categoryData, refetch: categoryFetch} = useQuery(
        'get-category',
        () => apiService.getData('/categories/'),
        {
            enabled: false,
        },
    );



    // query-sub-category
    const {
        mutate: postSubCategoryMutate,
        data: postSubCategory,
        isLoading: postSubCategoryLoading,
        isSuccess: postSubCategorySuccess,
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
        isLoading: editSubCategoryLoading,
        data: editSubCategoryData,
        refetch: editSubCategoryRefetch,
        isSuccess: editSubCategorySuccess,
    } = useQuery(["edit-sub-category", editId], () => apiService.getDataByID("/sub_categories", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putSubCategory,
        isLoading: putSubCategoryLoading,
        data: putData,
        isSuccess: putSubCategorySuccess
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

    // sub-category success
    useEffect(() => {
        if (putSubCategorySuccess) {
            dispatch({type: EDIT_DATA, payload: ""})
        }

        if (postSubCategorySuccess || putSubCategorySuccess) {

            navigate('/sub-category')
        }
    }, [postSubCategory, putData])


    // if edit sub-category
    useEffect(() => {
        if (editId !== "") {
            editSubCategoryRefetch();
        }
    }, [editId]);

    // if no edit cate
    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }
        categoryFetch()
    }, []);


    //edit sub-category
    useEffect(() => {
        if (editSubCategorySuccess) {



            const edit = {
                title_uz: editSubCategoryData.title_uz,
                title_ru: editSubCategoryData.title_ru,
                category: editSubCategoryData.categories.id,
            }
            form.setFieldsValue(edit)
        }

    }, [editSubCategoryData])


    const onFinish = (values) => {


        if (editSubCategoryData) {
            putSubCategory({url: '/sub_categories', data: values, id: editId})
        } else {
            postSubCategoryMutate({url: "/sub_categories/", data: values});
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
            {(postSubCategoryLoading || editSubCategoryLoading || putSubCategoryLoading) ?
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
                                required_text={'Qo\'shimcha kategoriya kiritishingiz kerak'}
                                label={'Qo\'shimcha kategoriya'}
                                name={'title_uz'}
                            />


                        </Col>
                        <Col span={12}>
                            <FormInput
                                required={true}
                                required_text={'Вы должны ввести дополнительная категория'}
                                label={'Дополнительная категория Ru'}
                                name={'title_ru'}
                            />

                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={'Выберите категория'}
                                name={'category'}
                                rules={[{
                                    required: true, message: 'Страну должны быть выбраны'
                                }]}
                                wrapperCol={{
                                    span: 24,
                                }}
                            >
                                <Select
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder='Выберите одну категория'
                                    optionLabelProp='label'
                                    options={optionsCategory}
                                />
                            </Form.Item>

                        </Col>

                    </Row>


                    <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                        {
                            editSubCategorySuccess ? 'Edit' : 'Add'
                        }
                    </Button>
                </Form>
            }
        </div>
    );
};

export default SubCategoryPostEdit;