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
    sub_category:[],
};


const AddBrandModal = ({subCategory,refetchSubCategory,clearSelection}) => {
    const [form] = Form.useForm();



    const [isModalOpen, setIsModalOpen] = useState(false);


    // query-brands
    const {
        mutate: postBrandsMutate,
        data: postBrands,
        isLoading: postBrandsLoading,
        isSuccess: postBrandsSuccess,
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
            postBrandsMutate({url: "/brands/", data: values});
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
        if (postBrandsSuccess){
            refetchSubCategory()
            setIsModalOpen(false)
            clearSelection('brand')
            form.setFieldsValue(initialValueForm)

        }
    }, [postBrands]);


    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    // option sub-category
    const optionsSubCategory = useMemo(() => {
        return subCategory?.map((option) => {
            return {
                value: option?.id,
                label: option?.title_ru,
            };
        });
    }, [subCategory]);



    return (
        <div>
            <Button type="primary" onClick={showModal}>
                Создать новый бренд
            </Button>
            <Modal title="Новый тип" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    {(postBrandsLoading ) ?
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
                                            options={optionsSubCategory}
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

AddBrandModal.propTypes={
    refetchSubCategory:PropTypes.func,
    subCategory:PropTypes.array,
    clearSelection:PropTypes.func
}


export default AddBrandModal;