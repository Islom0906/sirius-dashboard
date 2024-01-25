import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Input, message, Row, Upload} from "antd";
import {useMutation, useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import {AppLoader} from "../../../@crema";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import ImgCrop from "antd-img-crop";

const initialValueForm = {
    url: "",
    image:[]
};




const BannerPostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()


    const [fileListProps, setFileListProps] = useState([]);


    // query-banner
    const {
        mutate: postBannerMutate,
        data: postBanner,
        isLoading: postBannerLoading,
        isSuccess: postBannerSuccess,
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
        isLoading: editBannerLoading,
        data: editBannerData,
        refetch: editBannerRefetch,
        isSuccess: editBannerSuccess,
    } = useQuery(["edit-banner", editId], () => apiService.getDataByID("/about/header-banner", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putBanner,
        isLoading: putBannerLoading,
        data: putData,
        isSuccess: putBannerSuccess
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

    // banner success
    useEffect(() => {
        if (putBannerSuccess) {
            dispatch({type: EDIT_DATA, payload: ""})
        }

        if (postBannerSuccess || putBannerSuccess) {

            navigate('/banner')
        }
    }, [postBanner, putData])


    // if edit contact
    useEffect(() => {
        if (editId !== "") {
            editBannerRefetch();
        }
    }, [editId]);

    // if no edit banner
    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }
    }, []);


    //edit banner
    useEffect(() => {
        if (editBannerSuccess) {

            const image=[{
                uid: editBannerData.id,
                name: editBannerData.id,
                status: "done",
                url: editBannerData.image
            }];


            const edit = {
                url: editBannerData.url.split('//')[1],
                image
            }

            setFileListProps(image)
            form.setFieldsValue(edit)
        }

    }, [editBannerData])


    const onFinish = (values) => {


        const formData = new FormData();

        formData.append('url', `https://${values.url}`);

        if (fileListProps[0]?.originFileObj) {
            formData.append('image', fileListProps[0]?.originFileObj);
        }

        if (editBannerData) {
            putBanner({url: '/about/header-banner', data: formData, id: editId})
        } else {
            postBannerMutate({url: "/about/header-banner/", data: formData});
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


    // image
    const onChange = ({fileList: newFileList}) => {
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
            {(postBannerLoading || editBannerLoading || putBannerLoading) ?
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
                            <Form.Item
                                label="Ссылка на баннер"
                                name="url"
                                rules={[{required: true, message: 'Требуется Ссылка на баннер'}]}
                            >
                                <Input addonBefore={'https://'}/>
                            </Form.Item>

                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label='Изображение баннера'
                                name={'image'}
                                rules={[{required: true, message: 'Требуется изображение баннера.'}]}>
                                <ImgCrop rotationSlider>
                                    <Upload
                                        maxCount={1}
                                        fileList={fileListProps}
                                        listType='picture-card'
                                        onChange={onChange}
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
                        {
                            editBannerSuccess ? 'Edit' : 'Add'
                        }
                    </Button>
                </Form>
            }
        </div>
    );
};

export default BannerPostEdit;