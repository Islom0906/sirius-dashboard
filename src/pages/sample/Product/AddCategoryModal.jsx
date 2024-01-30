import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, message, Modal, Row, Select, Typography,Upload} from "antd";
import {AppLoader} from "../../../@crema";
import FormInput from "../../../@crema/core/Form/FormInput";
import {useMutation, useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import PropTypes from "prop-types";
import ImgCrop from "antd-img-crop";
const {Title}=Typography
const initialValueForm = {
    image: [],
    title_uz: "",
    title_ru: "",
    is_index: null
};
const AddCategoryModal = ({refetchCategory,clearSelection}) => {
    const [form] = Form.useForm();



    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const showModal = () => {
        setIsModalOpen(true);

    };

    useEffect(() => {
        refetchCategoryCount()
    }, []);


    const onFinish = (values) => {
        const formData = new FormData();

        formData.append('title_uz', values.title_uz);
        formData.append('title_ru', values.title_ru);
        formData.append('is_index', values.is_index);
        formData.append('image', fileListProps[0]?.originFileObj);

        postCategoryMutate({url: "/categories/", data: formData});


    }

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                onFinish(values);
            })
            .catch((errorInfo) => {
                console.log('Failed:', errorInfo);
            });
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (postCategorySuccess){

            refetchCategory()
            setIsModalOpen(false)
            setFileListProps([])
            clearSelection('category')
            form.setFieldsValue(initialValueForm)
        }
    }, [postCategory]);


    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

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
                    disabled:categoryCount?.count > 6
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
            <Button type="primary" onClick={showModal}>
                Создать новый категория
            </Button>
            <Modal title="Новый категория" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    {(postCategoryLoading) ?
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
                                <Title level={5}>
                                    Количество просмотров на главной странице: {categoryCount && categoryCount?.count}
                                </Title>
                                <Col span={24}>
                                    <Form.Item
                                        label={`Сделайте так, чтобы он отображался в виде баннера на главной странице. `}
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
                                <Col span={24}>
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

                        </Form>
                    }
            </Modal>
        </div>
    );
};

AddCategoryModal.propTypes={
    refetchCategory:PropTypes.func,
    clearSelection:PropTypes.func
}


export default AddCategoryModal;