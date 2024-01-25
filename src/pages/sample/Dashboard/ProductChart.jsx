import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend ,ResponsiveContainer} from 'recharts';
import { useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import {message,Typography } from 'antd';
import { useMemo } from 'react';
const { Title } = Typography;



const DealersChart = () => {
    const {data} = useQuery(
        'product-get',
        () => apiService.getData('/products'),
        {
            onError: (error) => {

                message.error(error);
            },
        },
    );
    const dataProduct = useMemo(() => {
        const productByDate = {};

        data?.forEach((product) => {
            const createAt = product.created_at;
            const date = createAt.split('T')[0];

            if (productByDate[date]) {
                productByDate[date].product += 1;
            } else {
                productByDate[date] = {
                    date,
                    product: 1,
                };
            }
        });
        const result = Object.values(productByDate);
        return result.reverse();
    }, [data]);

    return (
        <div>
            <Title type='h2'>Статистика создания продукта</Title>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart  data={dataProduct}>
                    <CartesianGrid strokeDasharray="3 6" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="product" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default DealersChart