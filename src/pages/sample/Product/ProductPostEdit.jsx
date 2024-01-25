import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, message, Row, Upload, Typography, Select} from "antd";
import {useMutation, useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import {AppLoader} from "../../../@crema";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import ImgCrop from "antd-img-crop";
import {MinusCircleOutlined} from "@ant-design/icons";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import FormInput from "../../../@crema/core/Form/FormInput";
import FormTextArea from "../../../@crema/core/Form/FormTextArea";
import FormInputNumber from "../../../@crema/core/Form/FormInputNumber";
import AddCategoryModal from "./AddCategoryModal";
import AddBrandModal from "./AddBrandModal";
import AddSubCategoryModal from "./AddSubCategoryModal";
import './carPostEdit.css'

const {Title} = Typography


const initialValueForm = {
    title_uz: "",
    title_ru: "",
    price: null,
    sales: null,
    category: null,
    sub_category: null,
    brand: null,
    index_category: null,
    is_available: null,
    stock: null,
    image_ids: [],
    description_uz: "",
    description_ru: "",
    short_descriptions: [
        {
            key_uz: "",
            key_ru: "",
            value_uz: "",
            value_ru: "",
        }
    ],
    characteristics: [
        {
            key_uz: "",
            key_ru: "",
            value_uz: "",
            value_ru: "",
        }
    ],
};


const ProductPostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()


    const [fileListProps, setFileListProps] = useState([]);
    const [getSelectValue, setGetSelectValue] = useState({
        categoryId: "",
        subCategoryId: "",
    })


    // query-category-get
    const {data: categoryData, refetch: refetchCategory} = useQuery(
        'get-categories-option',
        () => apiService.getData('/categories/'), {
            enabled: false
        }
    );

    // query-sub_categories-get
    const {data: sub_categoryData, refetch: refetchSubCategory} = useQuery(
        'get-sub_category-option',
        () => apiService.getData('/sub_categories/'), {
            enabled: false
        }
    );

// query-index-category-get
    const {data: indexCategoryData, refetch: refetchIndexCategory} = useQuery(
        'get-index-categories-option',
        () => apiService.getData('/index-categories/'), {
            enabled: false
        }
    );

    // query-image
    const {
        mutate: imagesUploadMutate,
        data: imagesUpload,
        isLoading: imagesUploadLoading,
        isSuccess: imagesUploadSuccess,
    } = useMutation(({url, formData}) => apiService.postData(url, formData), {

        onSuccess: () => {

            message.success('Success')
        },
        onError: (error) => {
            for (let obj in error.response.data) {
                message.error(`${obj}: ${error.response.data[obj][0]}`)
            }
        }
    });


    // query-product
    const {
        mutate: postProductMutate, data: postProduct, isLoading: postProductLoading, isSuccess: postProductSuccess,

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
        isLoading: editProductLoading,
        data: editProductData,
        refetch: editProductRefetch,
        isSuccess: editProductSuccess,

    } = useQuery(["edit-product", editId], () => apiService.getDataByID("/products", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putProduct, isLoading: putProductLoading, data: putData, isSuccess: putProductSuccess
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

    const {mutate: imagesDeleteMutate} = useMutation(({url, ids}) => apiService.deleteImages(url, ids), {
        onSuccess: () => message.success('Success'), onError: (error) => message.error(error.message)
    });

    //                                              =====useEffect====

    // product success
    useEffect(() => {
        if (putProductSuccess) {
            dispatch({type: EDIT_DATA, payload: ""})
        }
        if (postProductSuccess || putProductSuccess) {
            navigate('/product')
        }
    }, [postProduct, putData])

    // if edit product
    useEffect(() => {
        if (editId !== "") {
            editProductRefetch();
        }
    }, [editId]);

    // if no edit product
    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }
        refetchCategory()
        refetchSubCategory()
        refetchIndexCategory()
    }, []);


    //edit product
    useEffect(() => {
        const image_ids = [];
        if (editProductData !== undefined) {
            editProductData.images.map(image => {
                const data = {
                    uid: image.id,
                    name: image.id,
                    status: "done",
                    url: image.image
                }
                image_ids.push(data)
            })

        }

        if (editProductSuccess) {

            const edit = {
                title_uz: editProductData?.title_uz,
                title_ru: editProductData?.title_ru,
                price: editProductData?.price,
                sales: editProductData?.sales,
                is_available: editProductData?.is_available,
                category: editProductData?.categories.id,
                sub_category: editProductData?.sub_categories.id,
                brand: editProductData?.brands?.id,
                index_category: editProductData?.index_categories ? editProductData?.index_categories.id : "",
                description_uz: editProductData?.description_uz,
                description_ru: editProductData?.description_ru,
                stock: editProductData?.stock?.stock_type ? editProductData?.stock?.stock_type : null,
                image_ids,
                short_descriptions: editProductData?.short_descriptions,
                characteristics: editProductData?.characteristics
            }

            setGetSelectValue({
                categoryId: editProductData?.categories.id,
                subCategoryId: editProductData?.sub_categories.id,
            })
            setFileListProps(image_ids);
            form.setFieldsValue(edit)
        }

    }, [editProductData])
    const onFinish = (values) => {
        const image_ids = []
        fileListProps.map(image => {
            image_ids.push(image.uid)
        })

        const data = {
            title_uz: values.title_uz,
            title_ru: values.title_ru,
            price: values.price,
            sales: values.sales === "" ? null : values.sales,
            category: values.category,
            sub_category: values.sub_category,
            index_category: values?.index_category ? values.index_category : null,
            brand: values.brand,
            image_ids,
            stock: {
                stock_type: values.stock
            },
            short_descriptions: values?.short_descriptions,
            characteristics: values?.characteristics,
            description_uz: values?.description_uz,
            description_ru: values?.description_ru
        };
        if (editProductSuccess) {
            putProduct({url: "/products", data, id: editId});
        } else {
            postProductMutate({url: "/products/", data});
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

    // image
    useEffect(() => {
        if (imagesUploadSuccess) {
            const initialImage = [...fileListProps]
            const uploadImg = {
                uid: imagesUpload?.images[0]?.id,
                name: imagesUpload?.images[0]?.id,
                status: "done",
                url: imagesUpload?.images[0]?.url
            }
            initialImage.push(uploadImg)
            form.setFieldsValue({image_ids: [uploadImg]});
            setFileListProps(initialImage);
        }
    }, [imagesUpload]);

    const onChangeImage = ({fileList: newFileList}) => {
        if (newFileList.length < fileListProps.length) {
            return
        }
        const formData = new FormData();
        if (newFileList.length !== 0) {
            formData.append("uploaded_images", newFileList[newFileList.length - 1].originFileObj);
            imagesUploadMutate({url: "/images/", formData});
        }

    };

    const handleRemoveImage = (file) => {
        const withoutDeleteImage = []

        fileListProps.map((image) => {
            if (image?.uid !== file?.uid) {
                withoutDeleteImage.push(image)
            }
        })
        if (!withoutDeleteImage.length > 0) {
            form.setFieldsValue({image_ids: []});
        }
        const ids = {
            image_ids: [file?.uid]
        }
        imagesDeleteMutate({url: "/images/delete", ids});
        setFileListProps(withoutDeleteImage)

    }


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


    const clearSelection = (clearType) => {
        if (clearType === 'category') {
            form.setFieldsValue({category: null, sub_category: null, brand: null})


        } else if (clearType === 'subCategory') {
            form.setFieldsValue({sub_category: null, brand: null})
            refetchCategory()
        } else if (clearType === 'brand') {
            form.setFieldsValue({brand: null})
            refetchSubCategory()
        }
    }
    // selection
    const optionAvailable = useMemo(() => {
        return [
            {
                value: true,
                label: 'В продаже',
            },
            {
                value: false,
                label: 'Нет в продаже',
            },
        ]
    }, []);

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


    // option subCategory
    const optionsSubCategory = useMemo(() => {
        if (!getSelectValue.categoryId) {
            return []
        }
        const filterCategory = categoryData?.find(category => category.id === getSelectValue.categoryId)
        return filterCategory?.sub_categories?.map((option) => {
            return {
                value: option?.id,
                label: option?.title_ru,
            };
        });
    }, [getSelectValue.categoryId, categoryData]);

    const optionsBrand = useMemo(() => {
        if (!getSelectValue.subCategoryId) {
            return []
        }
        const filterCountry = sub_categoryData?.find(subCategory => subCategory.id === getSelectValue.subCategoryId)
        return filterCountry?.brands?.map((option) => {
            return {
                value: option?.id,
                label: option?.title_ru,
            };
        });
    }, [getSelectValue.subCategoryId, sub_categoryData]);

    const optionsIndexCategory = useMemo(() => {
        const data=indexCategoryData?.map((option) => {
            return {
                value: option?.id,
                label: option?.title_ru,
            };
        });

        const defaultData={
            value: "",
            label: 'Не добавлять на главную страницу',
        }

        data?.push(defaultData)
        return data
    }, [indexCategoryData]);

    const onChangeCategory = (value) => {
        const data = {...getSelectValue, categoryId: value}
        setGetSelectValue(data)
        form.setFieldsValue({sub_category: null, brands: null})
    }
    const onChangeSubCategory = (value) => {
        const data = {...getSelectValue, subCategoryId: value}
        setGetSelectValue(data)
        form.setFieldsValue({brand: null})
    }


    return (<div>
        {(postProductLoading || editProductLoading || putProductLoading || imagesUploadLoading) ? <AppLoader/> :
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
                            label={'Выберите категория'}
                            name={'category'}
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
                                onChange={onChangeCategory}
                                placeholder='Выберите одну категория'
                                optionLabelProp='label'
                                options={optionsCategory}
                            />
                        </Form.Item>

                        <AddCategoryModal refetchCategory={refetchCategory}
                                          clearSelection={clearSelection}
                        />
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={'Выберите подкатегория'}
                            name={'sub_category'}
                            rules={[{
                                required: true, message: 'Подкатегория должны быть выбраны'
                            }]}
                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                onChange={onChangeSubCategory}
                                placeholder='Выберите одну подкатегория'
                                optionLabelProp='label'
                                options={optionsSubCategory}
                            />
                        </Form.Item>
                        <AddSubCategoryModal arrCountry={sub_categoryData}
                                             clearSelection={clearSelection}
                                             categoryData={categoryData}
                                             refetchSubCategory={refetchSubCategory}/>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={'Выберите бренд'}
                            name={'brand'}
                            rules={[{
                                required: true, message: 'Бренд должны быть выбраны'
                            }]}
                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder='Выберите одну бренд'
                                optionLabelProp='label'
                                options={optionsBrand}
                            />
                        </Form.Item>
                        <AddBrandModal
                            subCategory={sub_categoryData}
                            clearSelection={clearSelection}
                            refetchSubCategory={refetchSubCategory}/>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={'Категория домашней страницы'}
                            name={'index_category'}

                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder='Выберите домашней страницы'
                                optionLabelProp='label'
                                options={optionsIndexCategory}
                            />
                        </Form.Item>

                    </Col>
                </Row>

                <Row gutter={20}>

                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Mahsulot nomi talab qilinadi'}
                            label={'Mahsulot nomi Uz'}
                            name={'title_uz'}
                        />


                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Требуется наименование товара'}
                            label={'Наименование товара Ru'}
                            name={'title_ru'}
                        />

                    </Col>
                </Row>
                <Row gutter={20}>

                    <Col span={12}>
                        <FormInputNumber
                            required={true}
                            required_text={'Необходимо ввести наименование товара'}
                            label={'Цена товара'}
                            name={'price'}
                        />


                    </Col>
                    <Col span={12}>
                        <FormInputNumber

                            label={'Цена со скидкой на товара'}
                            name={'sales'}
                        />

                    </Col>
                </Row>

                <Row gutter={20}>

                    <Col span={12}>
                        <Form.Item
                            label={'Доступно ли оно в настоящее время?'}
                            name={'is_available'}
                            rules={[{
                                required: true, message: 'Вы должны выбрать'
                            }]}
                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder='Выберите статус продажи'
                                optionLabelProp='label'
                                options={optionAvailable}
                            />
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={'К какому виду продукта он относится?'}
                            name={'stock'}
                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder=''
                                optionLabelProp='label'
                                options={optionStock}
                            />
                        </Form.Item>

                    </Col>
                </Row>
                <Row gutter={20}>
                    <Col span={12}>
                        <FormTextArea
                            required={true}
                            required_text={'Требуется описание'}
                            label={'Описание Ru'}
                            name={'description_ru'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormTextArea
                            required={true}
                            required_text={'Description kiritish talab qilinadi'}
                            label={'Description Uz'}
                            name={'description_uz'}
                        />
                    </Col>
                </Row>

                <Row gutter={20}>
                    <Col span={12}>
                        <Form.Item
                            label='Изображение основной'
                            name={'image_ids'}
                            rules={[{required: true, message: 'Требуется изображение'}]}>
                            <ImgCrop>
                                <Upload
                                    maxCount={3}
                                    fileList={fileListProps}
                                    listType='picture-card'
                                    onChange={onChangeImage}
                                    onPreview={onPreview}
                                    onRemove={handleRemoveImage}
                                    beforeUpload={() => false}
                                >
                                    {fileListProps.length > 2 ? "" : "Upload"}
                                </Upload>
                            </ImgCrop>
                        </Form.Item>
                    </Col>
                </Row>
                <Title level={3}>Добавить короткий характеристики товара</Title>
                <Form.List name="short_descriptions">
                    {(fields, {add, remove}) => (
                        <>
                            {fields.map((field, index) => {
                                return (
                                    <div key={field.fieldKey} style={{marginBottom: 20}}>
                                        <Row gutter={20}>

                                            <Col span={12}>
                                                <FormInput
                                                    required={true}
                                                    required_text={'To\'ldirish talab qilinadi'}
                                                    label={`Xususiyatni nomini kiriting:(Ulanish turi) Uz ${index + 1}`}
                                                    name={[field.name, 'key_uz']}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <FormInput
                                                    required={true}
                                                    required_text={'Требуется заполнение'}
                                                    label={`Xususiyatni qiymati: (simsiz) Ru ${index + 1}`}
                                                    name={[field.name, 'value_uz']}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <FormInput
                                                    required={true}
                                                    required_text={'Требуется заполнение'}
                                                    label={`Название характера: (Тип подключения ) Ru ${index + 1}`}
                                                    name={[field.name, 'key_ru']}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <FormInput
                                                    required={true}
                                                    required_text={'Требуется заполнение'}
                                                    label={`Характеристическое значение: (Беспроводное) Ru ${index + 1}`}
                                                    name={[field.name, 'value_ru']}
                                                />
                                            </Col>
                                        </Row>


                                        <Title level={3}> <MinusCircleOutlined
                                            onClick={() => remove(field.name)}/> Удалить имя характеристики (РАЗМЕР И
                                            МАССА)</Title>

                                    </div>

                                );
                            })}
                            <Form.Item>
                                <Button type="primary" onClick={() => add()} block
                                        style={{backgroundColor: '#28a745'}}>
                                    Открыть новый раздел для характеристика
                                </Button>
                            </Form.Item>

                        </>
                    )}
                </Form.List>

                <Title level={3}>Добавить характеристики товара</Title>
                <Form.List name="characteristics">
                    {(fields, {add, remove}) => (
                        <>
                            {fields.map((field, index) => {
                                return (
                                    <div key={field.fieldKey} style={{marginBottom: 20}}>
                                        <Row gutter={20}>

                                            <Col span={12}>
                                                <FormInput
                                                    required={true}
                                                    required_text={'To\'ldirish talab qilinadi'}
                                                    label={`Xususiyatni nomini kiriting:(Ulanish turi) Uz ${index + 1}`}
                                                    name={[field.name, 'key_uz']}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <FormInput
                                                    required={true}
                                                    required_text={'Требуется заполнение'}
                                                    label={`Xususiyatni qiymati: (simsiz) Ru ${index + 1}`}
                                                    name={[field.name, 'value_uz']}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <FormInput
                                                    required={true}
                                                    required_text={'Требуется заполнение'}
                                                    label={`Название характера: (Тип подключения ) Ru ${index + 1}`}
                                                    name={[field.name, 'key_ru']}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <FormInput
                                                    required={true}
                                                    required_text={'Требуется заполнение'}
                                                    label={`Характеристическое значение: (Беспроводное) Ru ${index + 1}`}
                                                    name={[field.name, 'value_ru']}
                                                />
                                            </Col>
                                        </Row>


                                        <Title level={3}> <MinusCircleOutlined
                                            onClick={() => remove(field.name)}/> Удалить имя характеристики (РАЗМЕР И
                                            МАССА)</Title>

                                    </div>

                                );
                            })}
                            <Form.Item>
                                <Button type="primary" onClick={() => add()} block
                                        style={{backgroundColor: '#28a745'}}>
                                    Открыть новый раздел для характеристика
                                </Button>
                            </Form.Item>

                        </>
                    )}
                </Form.List>


                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editProductSuccess ? 'Изменить продукт' : 'Создать продукт'}
                </Button>
            </Form>}
    </div>);
};

export default ProductPostEdit;