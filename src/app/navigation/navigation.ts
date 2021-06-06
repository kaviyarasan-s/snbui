import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        icon: 'dashboard',
        url: '/dashboard',
    },
    {
        id: 'collection',
        title: 'Collection Details',
        type: 'item',
        icon: 'attach_money',
        url: '/collection-details',
    },
    {
        id: 'expense',
        title: 'Expense Details',
        type: 'item',
        icon: 'attach_money',
        url: '/expense-details',
    },
    {
        id: 'schedule',
        title: 'Scheduling Details',
        type: 'item',
        icon: 'directions_bus',
        url: '/scheduling-details',
    },
    {
        id: 're-schedule',
        title: 'Re-Scheduling Details',
        type: 'item',
        icon: 'directions_bus',
        url: '/re-scheduling-details',
    },
    {
        id: 'accident',
        title: 'Accident History',
        type: 'item',
        icon: 'directions_bus',
        url: '/accident-history',
    },
    {
        id: 'service-details',
        title: 'Service Details',
        type: 'item',
        icon: 'directions_bus',
        url: '/service-details',
    },
    {
        id: 'purchase-details',
        title: 'Purchase Details',
        type: 'item',
        icon: 'directions_bus',
        url: '/purchase-details',
    },
    {
        id: 'inventory-details',
        title: 'Inventory Details',
        type: 'item',
        icon: 'directions_bus',
        url: '/inventory-details',
    },
    {
        id: 'bus',
        title: 'Vehicle Details',
        type: 'item',
        icon: 'directions_bus',
        url: '/vehicle-details',
    },
    {
        id: 'employee',
        title: 'Employee Details',
        type: 'item',
        icon: 'attach_money',
        url: '/employee',
    },
    {
        id: 'order',
        title: 'List of Values',
        type: 'collapsable',
        icon: 'build',
        children: [
            {
                id: 'department',
                title: 'Departmant Details',
                type: 'item',
                url: '/department',
            },
            {
                id: 'designation',
                title: 'Designation Details',
                type: 'item',
                url: '/designation',
            },
            {
                id: 'wages',
                title: 'Wage Details',
                type: 'item',
                url: '/wage',
            },
            {
                id: 'service',
                title: 'Service Types',
                type: 'item',
                url: '/service-types',
            },
            {
                id: 'special-days',
                title: 'Special Days',
                type: 'item',
                url: '/special-days',
            },
            {
                id: 'route-details',
                title: 'Route Details',
                type: 'item',
                url: '/route-details',
            },
            {
                id: 'service-checklist',
                title: 'Service Checklist',
                type: 'item',
                url: '/service-checklist',
            }

        ]
    }
    
];
