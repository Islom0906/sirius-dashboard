import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form,  message, Radio, Row, Select, Typography, Upload} from "antd";
import {useMutation, useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import {AppLoader} from "../../../@crema";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import ImgCrop from "antd-img-crop";
const {Title}=Typography

const initialValueForm = {
    web_image_ru:[],
    rsp_image_ru:[],
    web_image_uz:[],
    rsp_image_uz:[],
    is_advertisement:false,
    category:"",
    sub_category:"",
    brand:"",
    stock:"",
    product:"",
};




const BannerPostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()

    const [checkType, setCheckType] = useState("")
    const [fileListPropsWebRu, setFileListPropsWebRu] = useState([])
    const [fileListPropsMobileRu, setFileListPropsMobileRu] = useState([])
    const [fileListPropsWebUz, setFileListPropsWebUz] = useState([])
    const [fileListPropsMobileUz, setFileListPropsMobileUz] = useState([])


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

    // query-stock-get
    const {data:stockData, refetch: refetchStock,isSuccess:stockSuccess} = useQuery(
        'get-stock',
        () => apiService.getData('/stocks/'), {
            enabled: false
        }
    );

    // query-product-get
    const {data: productData, refetch: refetchProduct,isSuccess:productSuccess} = useQuery(
        'get-products',
        () => apiService.getData('/products/'), {
            enabled: false
        }
    );


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
    } = useQuery(["edit-banner", editId], () => apiService.getDataByID("/banners", editId), {
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

            const imageWebRu=[{
                uid: editBannerData.id,
                name: editBannerData.id,
                status: "done",
                url: editBannerData.web_image_ru
            }];
            const imageMobileRu=[{
                uid: editBannerData.id,
                name: editBannerData.id,
                status: "done",
                url: editBannerData.rsp_image_ru
            }];
            const imageWebUz=[{
                uid: editBannerData.id,
                name: editBannerData.id,
                status: "done",
                url: editBannerData.web_image_uz
            }];
            const imageMobileUz=[{
                uid: editBannerData.id,
                name: editBannerData.id,
                status: "done",
                url: editBannerData.rsp_image_uz
            }];


            const edit = {
                web_image_ru:imageWebRu,
                rsp_image_ru:imageMobileRu,
                web_image_uz:imageWebUz,
                rsp_image_uz:imageMobileUz,
                is_advertisement:editBannerData.is_advertisement,
                category:editBannerData.category!==null ? editBannerData.category.id :"" ,
                sub_category:editBannerData.sub_category!==null ? editBannerData.sub_category.id :"",
                brand:editBannerData.brand!== null ? editBannerData.brand.id : "",
                stock:editBannerData.stock !==null?  editBannerData.stock.id : "",
                product:editBannerData.product!==null ? editBannerData.product.id :"",
            }

            if (editBannerData.category!==null){
                setCheckType('category')
                form.setFieldsValue({checkProductType:"category"})
            }else if(editBannerData.sub_category!==null){
                setCheckType('subCategory')
                form.setFieldsValue({checkProductType:"subCategory"})
            }else if(editBannerData.brand!==null){
                setCheckType('brand')
                form.setFieldsValue({checkProductType:"brand"})
            }
            else if(editBannerData.product!==null){
                setCheckType('product')
                form.setFieldsValue({checkProductType:"product"})
            }
            else if(editBannerData.stock!==null){
                setCheckType('stock')
                form.setFieldsValue({checkProductType:"stock"})
            }
            setFileListPropsWebRu(imageWebRu)
            setFileListPropsMobileRu(imageMobileRu)
            setFileListPropsWebUz(imageWebUz)
            setFileListPropsMobileUz(imageMobileUz)
            form.setFieldsValue(edit)
        }

    }, [editBannerData])


    const onFinish = (values) => {


        const formData = new FormData();

        formData.append('category', values.category);
        formData.append('sub_category', values.sub_category);
        formData.append('brand', values.brand);
        formData.append('stock', values.stock);
        formData.append('product', values.product);
        formData.append('is_advertisement', values.is_advertisement);

        if (fileListPropsWebRu[0]?.originFileObj) {
            formData.append('web_image_ru', fileListPropsWebRu[0]?.originFileObj);
        }
        if (fileListPropsMobileRu[0]?.originFileObj) {
            formData.append('rsp_image_ru', fileListPropsMobileRu[0]?.originFileObj);
        }
        if (fileListPropsWebUz[0]?.originFileObj) {
            formData.append('web_image_uz', fileListPropsWebUz[0]?.originFileObj);
        }
        if (fileListPropsMobileUz[0]?.originFileObj) {
            formData.append('rsp_image_uz', fileListPropsMobileUz[0]?.originFileObj);
        }

        if (editBannerData) {
            putBanner({url: '/banners', data: formData, id: editId})
        } else {
            postBannerMutate({url: "/banners/", data: formData});
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
            form.setFieldsValue({
                sub_category:"",
                brand:"",
                stock:"",
                product:""
            })

        }else if(checkType==='subCategory'){
            if (!subCategorySuccess){
                refetchSubCategory()
            }
            form.setFieldsValue({
                category:"",
                brand:"",
                stock:"",
                product:""

            })
        }else if(checkType==='brand'){
            if (!brandSuccess){
                refetchBrand()
            }
            form.setFieldsValue({
                category:"",
                sub_category:"",
                stock:"",
                product:""

            })
        }
        else if(checkType==='product'){
            if (!productSuccess){
                refetchProduct()
            }
            form.setFieldsValue({
                category:"",
                sub_category:"",
                stock:"",
                brand:""

            })
        }
        else if(checkType==='stock'){
            if (!stockSuccess){
                refetchStock()
            }
            form.setFieldsValue({
                category:"",
                sub_category:"",
                brand:"",
                product:""

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
    const onChangeWebRu = ({fileList: newFileList}) => {
        setFileListPropsWebRu(newFileList);
        form.setFieldsValue({web_image_ru: newFileList});
    };

    const onChangeMobileRu = ({fileList: newFileList}) => {
        setFileListPropsMobileRu(newFileList);
        form.setFieldsValue({rsp_image_ru: newFileList});
    };
    const onChangeWebUz = ({fileList: newFileList}) => {
        setFileListPropsWebUz(newFileList);
        form.setFieldsValue({web_image_uz: newFileList});
    };
    const onChangeMobileUz = ({fileList: newFileList}) => {
        setFileListPropsMobileUz(newFileList);
        form.setFieldsValue({rsp_image_uz: newFileList});
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

    // select option
    const optionStock = useMemo(() => {
        return stockData?.map((option) => {
            return {
                value: option?.id,
                label: option?.title_ru,
            };
        });
    }, [stockData]);



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
    const optionsProduct = useMemo(() => {
        return productData?.map((option) => {
            return {
                value: option?.id,
                label: option?.title_ru,
            };
        });
    }, [productData]);

    // option type banner
    const optionsTypeBanner = useMemo(() => {
        return [
            {
                value: true,
                label: 'Рекламный баннер',
            },
            {
                value: false,
                label: 'Простой баннер',
            },
        ]
    }, []);

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
                                label='Изображение десктоп Ру'
                                name={'web_image_ru'}
                                rules={[{required: true, message: 'Требуется изображение баннера.'}]}>
                                <ImgCrop rotationSlider>
                                    <Upload
                                        maxCount={1}
                                        fileList={fileListPropsWebRu}
                                        listType='picture-card'
                                        onChange={onChangeWebRu}
                                        onPreview={onPreview}
                                        beforeUpload={() => false}
                                    >
                                        {fileListPropsWebRu.length > 0 ? "" : "Upload"}
                                    </Upload>
                                </ImgCrop>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label='Изображение мобильный Ру'
                                name={'rsp_image_ru'}
                                rules={[{required: true, message: 'Требуется изображение баннера.'}]}>
                                <ImgCrop rotationSlider>
                                    <Upload
                                        maxCount={1}
                                        fileList={fileListPropsMobileRu}
                                        listType='picture-card'
                                        onChange={onChangeMobileRu}
                                        onPreview={onPreview}
                                        beforeUpload={() => false}
                                    >
                                        {fileListPropsMobileRu.length > 0 ? "" : "Upload"}
                                    </Upload>
                                </ImgCrop>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label='Rasm Web Uz'
                                name={'web_image_uz'}
                                rules={[{required: true, message: 'Rasm yuklash talab qilinadi.'}]}>
                                <ImgCrop rotationSlider>
                                    <Upload
                                        maxCount={1}
                                        fileList={fileListPropsWebUz}
                                        listType='picture-card'
                                        onChange={onChangeWebUz}
                                        onPreview={onPreview}
                                        beforeUpload={() => false}
                                    >
                                        {fileListPropsWebUz.length > 0 ? "" : "Upload"}
                                    </Upload>
                                </ImgCrop>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label='Rasm mobile Uz'
                                name={'rsp_image_uz'}
                                rules={[{required: true, message: 'Rasm yuklash talab qilinadi'}]}>
                                <ImgCrop rotationSlider>
                                    <Upload
                                        maxCount={1}
                                        fileList={fileListPropsMobileUz}
                                        listType='picture-card'
                                        onChange={onChangeMobileUz}
                                        onPreview={onPreview}
                                        beforeUpload={() => false}
                                    >
                                        {fileListPropsMobileUz.length > 0 ? "" : "Upload"}
                                    </Upload>
                                </ImgCrop>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={12} >
                            <Form.Item
                                label={'Выберите тип баннера'}
                                name={'is_advertisement'}
                                rules={[{
                                    required: true, message: 'Должны быть выбраны'
                                }]}
                                wrapperCol={{
                                    span: 24,
                                }}
                            >
                                <Select
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder='Выберите одну тип'
                                    optionLabelProp='label'
                                    options={optionsTypeBanner}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Title level={3}>К какому типу баннера он относится?</Title>
                    <Form.Item label="Размер товара" name="checkProductType">
                        <Radio.Group onChange={chooseType} value={checkType}>
                            <Radio.Button value="category">Категория</Radio.Button>
                            <Radio.Button value="subCategory">Подкатегория</Radio.Button>
                            <Radio.Button value="brand">Бренд</Radio.Button>
                            <Radio.Button value="product">Продукт</Radio.Button>
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
                        <Col span={12} style={{display:checkType==='product'?'block' :'none'}}>
                            <Form.Item
                                    label={'Выберите Продукт'}
                                name={'product'}
                                rules={[{
                                    required: checkType==='product', message: 'Продукт должны быть выбраны'
                                }]}
                                wrapperCol={{
                                    span: 24,
                                }}
                            >
                                <Select
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder='Выберите одну продукт'
                                    optionLabelProp='label'
                                    options={optionsProduct}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12} style={{display:checkType==='stock'?'block' :'none'}}>
                            <Form.Item
                                label={'Выберите Скидка'}
                                name={'stock'}
                                rules={[{
                                    required:checkType==='stock', message: 'Скидка должны быть выбраны'
                                }]}
                                wrapperCol={{
                                    span: 24,
                                }}
                            >
                                <Select
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder='Выберите одну Скидка'
                                    optionLabelProp='label'
                                    options={optionStock}
                                />
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