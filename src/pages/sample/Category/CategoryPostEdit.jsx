import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, message, Row, Select, Typography, Upload} from "antd";
import {useMutation, useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import {AppLoader} from "../../../@crema";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import ImgCrop from "antd-img-crop";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import FormInput from "../../../@crema/core/Form/FormInput";
const {Title}=Typography


const initialValueForm = {
    image: [],
    title_uz: "",
    title_ru: "",
    is_index: null
};


const CategoryPostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()


    const [fileListProps, setFileListProps] = useState([]);


    // query-category-count-get
    const {data: categoryCount, refetch: refetchCategoryCount} = useQuery(
        'get-category-count',
        () => apiService.getData('/categories-count/'), {
            enabled: false
        }
    );

    // query-category
    const {
        mutate: postCategoryMutate,
        data: postCategory,
        isLoading: postCategoryLoading,
        isSuccess: postCategorySuccess,

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
        isLoading: editCategoryLoading,
        data: editCategoryData,
        refetch: editCategoryRefetch,
        isSuccess: editCategorySuccess,

    } = useQuery(["edit-category", editId], () => apiService.getDataByID("/categories", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putCategory,
        isLoading: putCategoryLoading,
        data: putData,
        isSuccess: putCategorySuccess
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

    // category success
    useEffect(() => {
        if (putCategorySuccess) {
            dispatch({type: EDIT_DATA, payload: ""})
        }
        if (postCategorySuccess || putCategorySuccess) {
            navigate('/category')
        }
    }, [postCategory, putData])

    // if edit category
    useEffect(() => {
        if (editId !== "") {
            editCategoryRefetch();
        }
    }, [editId]);

    // if no edit category
    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }
            refetchCategoryCount()
    }, []);


    //edit category
    useEffect(() => {
        const imageInitialMain = [{
            uid: editCategoryData?.id,
            name: editCategoryData?.id,
            status: 'done',
            url: editCategoryData?.image,
        }];

        if (editCategorySuccess) {

            const edit = {
                image: imageInitialMain,
                title_uz: editCategoryData.title_uz,
                title_ru: editCategoryData.title_ru,
                is_index: editCategoryData.is_index,

            }

            setFileListProps(imageInitialMain);
            form.setFieldsValue(edit)
        }

    }, [editCategoryData])
    const onFinish = (values) => {

        const formData = new FormData()

        formData.append('title_uz', values.title_uz);
        formData.append('title_ru', values.title_ru);
        formData.append('is_index', values.is_index);

        if (fileListProps[0]?.originFileObj) {
            formData.append('image', fileListProps[0]?.originFileObj);
        }


        if (editCategorySuccess) {
            putCategory({url: "/categories", data: formData, id: editId});
        } else {
            postCategoryMutate({url: "/categories/", data: formData});
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


    const onChangeMainImage = ({fileList: newFileList}) => {
        setFileListProps(newFileList);
        form.setFieldsValue({image: newFileList});
    };


    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };


    const optionsIsIndex = useMemo(() => {

        if (categoryCount){
        return [
            {
                value: true,
                label: 'Показывать',
                disabled:categoryCount?.count > 8
            },
            {
                value: false,
                label: 'Не показывай',
            }
        ]

        }
    }, [categoryCount]);
    return (
        <div>
            {(postCategoryLoading || editCategoryLoading || putCategoryLoading) ? <AppLoader/> :
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
                                required_text={'Sarlavha talab qilinadi'}
                                label={'Sarlavha Uz'}
                                name={'title_uz'}
                            />


                        </Col>
                        <Col span={12}>
                            <FormInput
                                required={true}
                                required_text={'Необходимо ввести заголовок'}
                                label={'Заголовок Ru'}
                                name={'title_ru'}
                            />

                        </Col>
                    </Row>



                    <Row gutter={20}>
                        <Col span={12}>
                            <Title level={5}>
                                Количество просмотров на главной странице: {categoryCount && categoryCount?.count}
                            </Title>
                            <Form.Item
                                label={`Сделайте так, чтобы он отображался в виде баннера на главной странице.`}
                                name={'is_index'}
                                rules={[{
                                    required: true, message: 'Категория должны быть выбраны'
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
                                    options={optionsIsIndex}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>

                            <Form.Item
                                label='Изображение основной'
                                name={'image'}
                                rules={[{required: true, message: 'Изображение баннера должно быть загружено.'}]}>
                                <ImgCrop>
                                    <Upload
                                        maxCount={1}
                                        fileList={fileListProps}
                                        listType='picture-card'
                                        onChange={onChangeMainImage}
                                        onPreview={onPreview}
                                        beforeUpload={() => false}
                                    >
                                        {fileListProps.length > 0 ? "" : "Upload"}
                                    </Upload>
                                </ImgCrop>
                            </Form.Item>
                        </Col>
                    </Row>


                    <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                        {editCategorySuccess ? 'Edit' : 'Add'}
                    </Button>
                </Form>}
        </div>);
};

export default CategoryPostEdit;