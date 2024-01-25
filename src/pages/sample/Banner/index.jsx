import React, {useEffect, useState} from 'react';
import BannerTable from "./BannerTable";
import {Button, Col, Input, message, Row, Space, Spin} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import apiService from "../../../@crema/services/apis/api";
import {useMutation, useQuery} from "react-query";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import {useDispatch} from "react-redux";


const Index = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {mutate, isSuccess, isLoading: deleteBannerLoading} = useMutation(({
                                                                              url,
                                                                              id
                                                                            }) => apiService.deleteData(url, id))
  const {data, isLoading: getBannerLoading, refetch} = useQuery('banner-get', () =>
          apiService.getData('/banners/'), {
        // enabled:false,

        onError: (error) => {
          for (let obj in error.response.data) {
            message.error(`${obj}: ${error.response.data[obj][0]}`)
          }
        }
      }
  );

  const [search,setSearch]=useState([])
  const [isSearch,setIsSearch]=useState(false)

  const deleteHandle = (url, id) => {
    mutate({url, id})

  }


  useEffect(() => {
    if (isSuccess) {
      refetch()
    }
  }, [isSuccess])

  const addArticle = () => {
    dispatch({type: EDIT_DATA, payload: ""})
    navigate('/banner/add')
  }

  const serachProduct=(value)=>{
    if (value===""){
      setIsSearch(false)
    }
    else{
      setIsSearch(true)
    }


    const filterData=data?.filter(data=>data.name_uz.toLowerCase().includes(value.toLowerCase()) || data.name_ru.toLowerCase().includes(value.toLowerCase()))
    setSearch(filterData)
  }

  return (
      <div className={'site-space-compact-wrapper'}>
        <Space direction={'vertical'} style={{width: '100%'}}>
          <Row gutter={20}>
            <Col span={16}>
              <Input onChange={(e)=>serachProduct(e.target.value)}/>
            </Col>
            <Col span={8}>
              <Button type="primary" icon={<PlusOutlined/>} style={{width: '100%'}} onClick={addArticle}>
                Add
              </Button>
            </Col>
          </Row>
          <Spin size='medium' spinning={getBannerLoading || deleteBannerLoading}>
            <BannerTable data={isSearch ? search : data} deleteHandle={deleteHandle}/>
          </Spin>
        </Space>


      </div>
  );
};

export default Index;