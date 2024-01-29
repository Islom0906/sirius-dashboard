import React from 'react';
import {RoutePermittedRole} from '../../shared/constants/AppEnums';



const Dashboard = React.lazy(() => import('./Dashboard'));
const Order = React.lazy(() => import('./Order'));
const Contact = React.lazy(() => import('./Contact'));
const ContactPostEdit = React.lazy(() => import('./Contact/ContactPostEdit'));
const Services = React.lazy(() => import('./Service'));
const ServicesPostEdit = React.lazy(() => import('./Service/ServicePostEdit'));
const Social = React.lazy(() => import('./Social-media'));
const SocialPostEdit = React.lazy(() => import('./Social-media/SocialPostEdit'));
const Category = React.lazy(() => import('./Category'));
const CategoryPostEdit = React.lazy(() => import('./Category/CategoryPostEdit'));
const SubCategory = React.lazy(() => import('./SubCategory'));
const SubCategoryPostEdit = React.lazy(() => import('./SubCategory/SubCategoryPostEdit'));
const Brand = React.lazy(() => import('./Brand'));
const BrandPostEdit = React.lazy(() => import('./Brand/BrandPostEdit'));
const IndexCategory = React.lazy(() => import('./Index-category'));
const IndexCategoryPostEdit = React.lazy(() => import('./Index-category/IndexCategoryPostEdit'));
const Product = React.lazy(() => import('./Product'));
const ProductPostEdit = React.lazy(() => import('./Product/ProductPostEdit'));
const Banner = React.lazy(() => import('./Banner'));
const BannerPostEdit = React.lazy(() => import('./Banner/BannerPostEdit'));
const Stock = React.lazy(() => import('./Stock'));
const StockPostEdit = React.lazy(() => import('./Stock/StockPostEdit'));


export const samplePagesConfigs = [

  {
    permittedRole: RoutePermittedRole.user,
    path: '/dashboard',
    element: <Dashboard/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/Order',
    element: <Order/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/contact',
    element: <Contact/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/contact/add',
    element: <ContactPostEdit/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/service',
    element: <Services/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/service/add',
    element: <ServicesPostEdit/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/service',
    element: <Services/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/service/add',
    element: <ServicesPostEdit/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/social',
    element: <Social/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/social/add',
    element: <SocialPostEdit/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/category',
    element: <Category/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/category/add',
    element: <CategoryPostEdit/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/sub-category',
    element: <SubCategory/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/sub-category/add',
    element: <SubCategoryPostEdit/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/brand',
    element: <Brand/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/brand/add',
    element: <BrandPostEdit/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/index-category',
    element: <IndexCategory/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/index-category/add',
    element: <IndexCategoryPostEdit/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/product',
    element: <Product/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/product/add',
    element: <ProductPostEdit/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/banner',
    element: <Banner/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/banner/add',
    element: <BannerPostEdit/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/stock',
    element: <Stock/>,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/stock/add',
    element: <StockPostEdit/>,
  },
];
