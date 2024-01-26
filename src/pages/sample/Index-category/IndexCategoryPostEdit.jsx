import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, message, Row, Radio, Upload, Typography, Select} from "antd";
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
    category:"",
    sub_category:"",
    brand:"",
    stock:""
};


const IndexCategoryPostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()


    const [fileListProps, setFileListProps] = useState([]);
    const [checkType, setCheckType] = useState("")


    // query-category-get
    const {data: categoryData, refetch: refetchCategory,isSuccess:categorySuccess} = useQuery(
        'get-categories',
        () => apiService.getData('/categories/'), {
            enabled: false
        }
    );

    // query-sub-category-get
    const {data: subCategoryData, refetch: refetchSubCategory,isSuccess:subCategorySuccess} = useQuery(
        'get-sub-categories',
        () => apiService.getData('/sub_categories/'), {
            enabled: false
        }
    );

    // query-brand-get
    const {data:brandData, refetch: refetchBrand,isSuccess:brandSuccess} = useQuery(
        'get-brand',
        () => apiService.getData('/brands/'), {
            enabled: false
        }
    );

    // query-about
    const {
        mutate: postIndexCategoryMutate,
        data: postIndexCategory,
        isLoading: postIndexCategoryLoading,
        isSuccess: postIndexCategorySuccess,

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
        isLoading: editIndexCategoryLoading,
        data: editIndexCategoryData,
        refetch: editIndexCategoryRefetch,
        isSuccess: editIndexCategorySuccess,

    } = useQuery(["edit-index-category", editId], () => apiService.getDataByID("/index-categories", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putIndexCategory,
        isLoading: putIndexCategoryLoading,
        data: putData,
        isSuccess: putIndexCategorySuccess
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

    // index-category success
    useEffect(() => {
        if (putIndexCategorySuccess) {
            dispatch({type: EDIT_DATA, payload: ""})
        }
        if (postIndexCategorySuccess || putIndexCategorySuccess) {
            navigate('/index-category')
        }
    }, [postIndexCategory, putData])

    // if edit index-category
    useEffect(() => {
        if (editId !== "") {
            editIndexCategoryRefetch();
        }
    }, [editId]);

    // if no edit index-category
    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }
    }, []);


    //edit index-category
    useEffect(() => {
        const imageInitialMain = [{
            uid: editIndexCategoryData?.id,
            name: editIndexCategoryData?.id,
            status: 'done',
            url: editIndexCategoryData?.image,
        }];

        if (editIndexCategorySuccess) {

            const edit = {
                image: imageInitialMain,
                title_uz: editIndexCategoryData.title_uz,
                title_ru: editIndexCategoryData.title_ru,
                category: editIndexCategoryData.category,
                sub_category: editIndexCategoryData.sub_category,
                brand: editIndexCategoryData.brand,
                stock: editIndexCategoryData.stock
            }
            if (editIndexCategoryData.category!==null){
                setCheckType('category')
                form.setFieldsValue({checkProductType:"category"})
            }else if(editIndexCategoryData.sub_category!==null){
                setCheckType('subCategory')
                form.setFieldsValue({checkProductType:"subCategory"})
            }else if(editIndexCategoryData.brand!==null){
                setCheckType('brand')
                form.setFieldsValue({checkProductType:"brand"})
            }
            else if(editIndexCategoryData.stock!==null){
                setCheckType('stock')
                form.setFieldsValue({checkProductType:"stock"})
            }

            setFileListProps(imageInitialMain);
            form.setFieldsValue(edit)
        }

    }, [editIndexCategoryData])
    const onFinish = (values) => {


        const formData = new FormData()

        formData.append('title_uz', values.title_uz);
        formData.append('title_ru', values.title_ru);
        formData.append('category', values.category);
        formData.append('sub_category', values.sub_category);
        formData.append('brand', values.brand);
        formData.append('stock', "");

        if (fileListProps[0]?.originFileObj) {
            formData.append('image', fileListProps[0]?.originFileObj);
        }


        if (editIndexCategorySuccess) {
            putIndexCategory({url: "/index-categories", data: formData, id: editId});
        } else {
            postIndexCategoryMutate({url: "/index-categories/", data: formData});
        }
    }
    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };


    const chooseType = (e) => {
        setCheckType(e.target.value)
    }

    useEffect(() => {
        if (checkType==='category'){
            if (!categorySuccess){
                refetchCategory()
            }
            form.setFieldsValue({sub_category:"",
                brand:"",
                stock:""
            })

        }else if(checkType==='subCategory'){
            if (!subCategorySuccess){
                refetchSubCategory()
            }
            form.setFieldsValue({category:"",
                brand:"",
                stock:""
            })
        }else if(checkType==='brand'){
            if (!brandSuccess){
                refetchBrand()
            }
            form.setFieldsValue({category:"",
                sub_category:"",
                stock:""
            })
        }
        else if(checkType==='stock'){
            form.setFieldsValue({category:"",
                sub_category:"",
                brand:""
            })
        }
    }, [checkType]);

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


    // select option

    const optionStock = useMemo(() => {
        return [
            {
                value: "best_seller",
                label: 'Бестселлер',
            },
            {
                value: "daily_product",
                label: 'Ежедневный продукт',
            },
            {
                value: "",
                label: 'С тех пор',
            },
        ]
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

    const optionsSubCategory = useMemo(() => {
        return subCategoryData?.map((option) => {
            return {
                value: option?.id,
                label: option?.title_ru,
            };
        });
    }, [subCategoryData]);
    const optionsBrand = useMemo(() => {
        return brandData?.map((option) => {
            return {
                value: option?.id,
                label: option?.title_ru,
            };
        });
    }, [brandData]);

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
            {(postIndexCategoryLoading || editIndexCategoryLoading || putIndexCategoryLoading) ? <AppLoader/> :
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
                            <Form.Item
                                label='Рекламная картинка'
                                name={'image'}
                                rules={[{required: true, message: 'Изображение должно быть загружено.'}]}>
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

                    <Title level={3}>Какой это тип рекламы?</Title>
                    <Form.Item label="Размер товара" name="checkProductType">
                        <Radio.Group onChange={chooseType} value={checkType}>
                            <Radio.Button value="category">Категория</Radio.Button>
                            <Radio.Button value="subCategory">Подкатегория</Radio.Button>
                            <Radio.Button value="brand">Бренд</Radio.Button>
                            <Radio.Button value="stock">Скидка</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Row gutter={20}>
                        <Col span={12} style={{display:checkType==='category'?'block' :'none'}}>
                            <Form.Item
                                label={'Выберите категория'}
                                name={'category'}
                                rules={[{
                                    required: checkType==='category', message: 'Категория должны быть выбраны'
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

                        <Col span={12} style={{display:checkType==='subCategory'?'block' :'none'}}>
                            <Form.Item
                                label={'Выберите Подкатегория'}
                                name={'sub_category'}
                                rules={[{
                                    required: checkType==='subCategory', message: 'Подкатегория должны быть выбраны'
                                }]}
                                wrapperCol={{
                                    span: 24,
                                }}
                            >
                                <Select
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder='Выберите одну Подкатегория'
                                    optionLabelProp='label'
                                    options={optionsSubCategory}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12} style={{display:checkType==='brand'?'block' :'none'}}>
                            <Form.Item
                                label={'Выберите Бренд'}
                                name={'brand'}
                                rules={[{
                                    required: checkType==='brand', message: 'Бренд должны быть выбраны'
                                }]}
                                wrapperCol={{
                                    span: 24,
                                }}
                            >
                                <Select
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder='Выберите одну Бренд'
                                    optionLabelProp='label'
                                    options={optionsBrand}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12} style={{display:checkType==='stock'?'block' :'none'}}>
                            <Form.Item
                                label={'Выберите Бренд'}
                                name={'stock'}
                                rules={[{
                                    required: checkType==='stock', message: 'Бренд должны быть выбраны'
                                }]}
                                wrapperCol={{
                                    span: 24,
                                }}
                            >
                                <Select
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder='Выберите одну Бренд'
                                    optionLabelProp='label'
                                    options={optionStock}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                        {editIndexCategorySuccess ? 'Edit' : 'Add'}
                    </Button>
                </Form>}
        </div>);
};

export default IndexCategoryPostEdit;