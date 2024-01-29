import {TiContacts} from "react-icons/ti";
import {IoIosStats} from "react-icons/io";
import {HiOutlineInbox} from "react-icons/hi";
import {GrTableAdd} from "react-icons/gr";
import {MdOutlineCategory, MdOutlineMiscellaneousServices} from "react-icons/md";
import {TbCategoryPlus, TbDiscount2} from "react-icons/tb";
import {IoLogoAppleAr, IoShareSocialOutline} from "react-icons/io5";
import {BiCategoryAlt, BiSolidImageAdd} from "react-icons/bi";
import {BsBasket3} from "react-icons/bs";


const routesConfig = [
    {
        id: 'app',
        title: 'Sample',
        messageId: 'sidebar.sample',
        type: 'group',
        children: [
            {
                id: 'dashboard',
                title: 'dashboard',
                messageId: 'sidebar.sample.dashboard',
                type: 'item',
                icon: <IoIosStats/>,
                path: '/dashboard',
            },
            {
                id: 'product',
                title: 'product',
                messageId: 'sidebar.product',
                icon: <HiOutlineInbox/>,
                type: 'collapse',
                children: [
                    {
                        id: 'productAdd',
                        title: 'productAdd',
                        messageId: 'sidebar.sample.product',
                        icon: <GrTableAdd/>,
                        path: '/product',
                    },
                    {
                        id: 'category',
                        title: 'category',
                        messageId: 'sidebar.sample.category',
                        icon: <MdOutlineCategory/>,
                        path: '/category',
                    },
                    {
                        id: 'sub-category',
                        title: 'sub-category',
                        messageId: 'sidebar.sample.subCategory',
                        icon: <TbCategoryPlus/>,
                        path: '/sub-category',
                    },
                    {
                        id: 'brand',
                        title: 'brand',
                        messageId: 'sidebar.sample.brand',
                        icon: <IoLogoAppleAr/>,
                        path: '/brand',
                    },
                    {
                        id: 'index-category',
                        title: 'index-category',
                        messageId: 'sidebar.sample.index-category',
                        type: 'item',
                        icon: <BiCategoryAlt/>,
                        path: '/index-category',
                    },
                    {
                        id: 'stock',
                        title: 'stock',
                        messageId: 'sidebar.sample.stock',
                        type: 'item',
                        icon: <TbDiscount2/>,
                        path: '/stock',
                    },
                ]
            },
            {
                id: 'order',
                title: 'order',
                messageId: 'sidebar.sample.order',
                type: 'item',
                icon: <BsBasket3/>,
                path: '/order',
            },

            {
                id: 'banner',
                title: 'banner',
                messageId: 'sidebar.sample.banner',
                type: 'item',
                icon: <BiSolidImageAdd/>,
                path: '/banner',
            },

            {
                id: 'contact',
                title: 'contact',
                messageId: 'sidebar.sample.contact',
                type: 'item',
                icon: <TiContacts/>,
                path: '/contact',
            },
            {
                id: 'service',
                title: 'service',
                messageId: 'sidebar.sample.service',
                type: 'item',
                icon: <MdOutlineMiscellaneousServices/>,
                path: '/service',
            },
            {
                id: 'social',
                title: 'social',
                messageId: 'sidebar.sample.social',
                type: 'item',
                icon: <IoShareSocialOutline/>,
                path: '/social',
            },


        ],
    },
];
export default routesConfig;
