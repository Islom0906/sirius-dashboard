import React, {useEffect, useState} from 'react';
import {Button, Col, Form, message, Row, Upload} from "antd";
import {useMutation, useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import {AppLoader} from "../../../@crema";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import ImgCrop from "antd-img-crop";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import FormInput from "../../../@crema/core/Form/FormInput";
import FormTextArea from "../../../@crema/core/Form/FormTextArea";




const initialValueForm = {
    image: [],
    title_uz: "",
    title_ru: "",
    sub_title_uz: "",
    sub_title_ru: "",
};


const ServicePostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()


    const [fileListProps, setFileListProps] = useState([]);




    // query-about
    const {
        mutate: postServiceMutate,
        data: postService,
        isLoading: postServiceLoading,
        isSuccess: postServiceSuccess,

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
        isLoading: editServiceLoading,
        data: editServiceData,
        refetch: editServiceRefetch,
        isSuccess: editServiceSuccess,

    } = useQuery(["edit-service", editId], () => apiService.getDataByID("/about/services", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putService, isLoading: putServiceLoading, data: putData, isSuccess: putServiceSuccess
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

    // delete image


    //                                              =====useEffect====

    // service success
    useEffect(() => {
        if (putServiceSuccess) {
            dispatch({type: EDIT_DATA, payload: ""})
        }
        if (postServiceSuccess || putServiceSuccess) {
            navigate('/service')
        }
    }, [postService, putData])

    // if edit service
    useEffect(() => {
        if (editId !== "") {
            editServiceRefetch();
        }
    }, [editId]);

    // if no edit service
    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }
    }, []);


    //edit service
    useEffect(() => {
        const imageInitialMain = [{
            uid: editServiceData?.id,
            name: editServiceData?.id,
            status: 'done',
            url: editServiceData?.image,
        }];

        if (editServiceSuccess) {

            const edit = {
                image: imageInitialMain,
                title_uz: editServiceData.title_uz,
                title_ru: editServiceData.title_ru,
                sub_title_uz: editServiceData.sub_title_uz,
                sub_title_ru: editServiceData.sub_title_ru,

            }

            setFileListProps(imageInitialMain);
            form.setFieldsValue(edit)
        }

    }, [editServiceData])
    const onFinish = (values) => {

        const formData=new FormData()

        formData.append('title_uz', values.title_uz);
        formData.append('title_ru', values.title_ru);
        formData.append('sub_title_uz', values.sub_title_uz);
        formData.append('sub_title_ru', values.sub_title_ru);

        if (fileListProps[0]?.originFileObj) {
            formData.append('image', fileListProps[0]?.originFileObj);
        }


        if (editServiceSuccess) {
            putService({url: "/about/services", data:formData, id: editId});
        } else {
            postServiceMutate({url: "/about/services/", data:formData});
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




    return (
        <div>
        {(postServiceLoading || editServiceLoading || putServiceLoading) ? <AppLoader/> :
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
                        <FormTextArea
                            required={true}
                            required_text={'Qo\'shimcha sarlavha kiritish talab qilinada'}
                            label={'Qo\'shimcha sarlavha Uz'}
                            name={'sub_title_uz'}
                        />


                    </Col>
                    <Col span={12}>
                        <FormTextArea
                            required={true} required_text={'Требуется дополнительный заголовок'}
                            label={'Дополнительное название Ru'}
                            name={'sub_title_ru'}
                        />

                    </Col>
                </Row>


                <Row gutter={20}>

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
                    {editServiceSuccess ? 'Edit' : 'Add'}
                </Button>
            </Form>}
    </div>);
};

export default ServicePostEdit;