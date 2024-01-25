import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, message, Modal, Row, Select} from "antd";
import {AppLoader} from "../../../@crema";
import FormInput from "../../../@crema/core/Form/FormInput";
import {useMutation} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import PropTypes from "prop-types";


const initialValueForm = {
    title_uz: "",
    title_ru: "",
    category:null,
};

const AddSubCategoryModal = ({refetchSubCategory, categoryData,clearSelection}) => {
    const [form] = Form.useForm();


    const [isModalOpen, setIsModalOpen] = useState(false);


    // query-brands
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


    const showModal = () => {
        setIsModalOpen(true);

    };


    const onFinish = (values) => {
        postSubCategoryMutate({url: "/sub_categories/", data:values});
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
        if (postSubCategorySuccess) {
            refetchSubCategory()
            setIsModalOpen(false)
            clearSelection('subCategory')
            form.setFieldsValue(initialValueForm)

        }
    }, [postSubCategory]);


    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };


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
            <Button type="primary" onClick={showModal}>
                Создать новый подкатегория
            </Button>
            <Modal title="Новый тип" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={600}>
                {
                    (postSubCategoryLoading) ?
                        <AppLoader/>
                        :
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
                                <Col span={24}>
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
                        </Form>
                }


            </Modal>
        </div>
    );
};

AddSubCategoryModal.propTypes = {
    refetchSubCategory: PropTypes.func,
    categoryData: PropTypes.array,
    clearSelection:PropTypes.func
}


export default AddSubCategoryModal;