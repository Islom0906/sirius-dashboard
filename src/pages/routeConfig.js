import {TiContacts} from "react-icons/ti";


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
                icon: <TiContacts/>,
                path: '/dashboard',
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
                icon: <TiContacts/>,
                path: '/service',
            },
            {
                id: 'social',
                title: 'social',
                messageId: 'sidebar.sample.social',
                type: 'item',
                icon: <TiContacts/>,
                path: '/social',
            },
            {
                id: 'banner',
                title: 'banner',
                messageId: 'sidebar.sample.banner',
                type: 'item',
                icon: <TiContacts/>,
                path: '/banner',
            },
            {
                id: 'category',
                title: 'category',
                messageId: 'sidebar.sample.category',
                type: 'item',
                icon: <TiContacts/>,
                path: '/category',
            },
            {
                id: 'sub-category',
                title: 'sub-category',
                messageId: 'sidebar.sample.subCategory',
                type: 'item',
                icon: <TiContacts/>,
                path: '/sub-category',
            },
            {
                id: 'brand',
                title: 'brand',
                messageId: 'sidebar.sample.brand',
                type: 'item',
                icon: <TiContacts/>,
                path: '/brand',
            },
            {
                id: 'index-category',
                title: 'index-category',
                messageId: 'sidebar.sample.index-category',
                type: 'item',
                icon: <TiContacts/>,
                path: '/index-category',
            },
            {
                id: 'product',
                title: 'product',
                messageId: 'sidebar.sample.product',
                type: 'item',
                icon: <TiContacts/>,
                path: '/product',
            },
        ],
    },
];
export default routesConfig;
