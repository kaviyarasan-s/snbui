import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import { BusDetailsModule } from "app/main/vehicle-details/vehicle-details.module";
import { ExpenseDetailsModule } from "app/main/expense-details/expense-details.module";
import { CollectionDetailsModule } from "app/main/collection-details/collection-details.module";
import { LoginModule } from "app/main/login/login.module";
import { HomeModule } from "app/main/home/home.module";
import { WagesModule } from "app/main/wages/wages.module";
import { DepartmentModule } from "app/main/department/department.module";
import { WorkshopDetailsModule } from "app/main/workshop-details/workshop-details.module";
import { SericeDetailsModule } from "app/main/serice-details/serice-details.module";
import { AccidentHistoryModule } from "app/main/accident-history/accident-history.module";
import { PurchaseDetailsModule } from "app/main/purchase-details/purchase-details.module";
import { InventoryDetailsModule } from "app/main/inventory-details/inventory-details.module";
import { EmployeeModule } from "app/main/employee/employee.module";
import { DesignationModule } from "app/main/designation/designation.module";
import { SchedulingDetailsModule } from "app/main/scheduling-details/scheduling-details.module";
import { ReScheduleDetailsModule } from "app/main/re-schedule-details/re-schedule-details.module";
import { SpecialDaysModule } from "app/main/special-days/special-days.module";
import { RouteDetailsModule } from "app/main/route-details/route-details.module";
import { ServiceChecklistModule } from "app/main/service-checklist/service-checklist.module";

const appRoutes: Routes = [
    {
        path: 'service-checklist',
        redirectTo: 'app/main/service-checklist/service-checklist.modulee#ServiceChecklistModule'
    },
    {
        path: 'dashboard',
        redirectTo: 'app/main/home/home.module#HomeModule'
    },
    {
        path      : 'vehicle-details',
        redirectTo: 'app/main/vehicle-details/vehicle-details.module#BusDetailsModule'
    },
    {
        path: 'special-days',
        redirectTo: 'app/main/special-days/special-days.module#SpecialDaysModule'
    },
    {
        path: 'route-details',
        redirectTo: 'app/main/route-details/route-details.module#RouteDetailsModule'
    },
    {
        path: 'scheduling-details',
        redirectTo: 'app/main/scheduling-details/scheduling-details.module#SchedulingDetailsModule'
    },
    {
        path: 're-scheduling-details',
        redirectTo: 'app/main/re-schedule-details/re-schedule-details.module#ReScheduleDetailsModule'
    },
    {
        path: 'service-details',
        redirectTo: 'app/main/workshop-details/workshop-details.module#WorkshopDetailsModule'
    },
    {
        path: 'purchase-details',
        redirectTo: 'app/main/purchase-details/purchase-details.module#PurchaseDetailsModule'
    },
    {
        path: 'inventory-details',
        redirectTo: 'app/main/inventory-details/inventory-details.module#InventoryDetailsModule'
    },
    {
        path: 'accident-history',
        redirectTo: 'app/main/accident-history/accident-history.module#AccidentHistoryModule'
    },
    {
        path: 'service-types',
        redirectTo: 'app/main/serice-details/serice-details.module#SericeDetailsModule'
    },
    {
        path: 'expense-details',
        redirectTo: 'app/main/expense-details/expense-details.module#ExpenseDetailsModule'
    },
    {
        path: 'collection-details',
        redirectTo: 'app/main/collection-details/collection-details.module#CollectionDetailsModule'
    },
    {
        path: 'home',
        redirectTo: 'app/main/home/home.module#HomeModule'
    },
    {
        path: 'employee',
        redirectTo: 'app/main/employee/employee.module#EmployeeModule'
    },
    {
        path: 'wage',
        redirectTo: 'app/main/wages/wages.module#WagesModule'
    },
    {
        path: 'department',
        redirectTo: 'app/main/department/department#DepartmentModule'
    },
    {
        path: 'designation',
        redirectTo: 'app/main/designation/designation#DesignationModule'
    },
    {
        path: '**',
        redirectTo: 'login'        
    }
];

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        SampleModule,
        LoginModule,
        HomeModule,
        BusDetailsModule,
        ExpenseDetailsModule,
        CollectionDetailsModule,
        WagesModule,
        EmployeeModule,
        DepartmentModule,
        DesignationModule,
        SchedulingDetailsModule,
        WorkshopDetailsModule,
        SericeDetailsModule,
        AccidentHistoryModule,
        PurchaseDetailsModule,
        InventoryDetailsModule,
        ReScheduleDetailsModule,
        SpecialDaysModule,
        RouteDetailsModule,
        ServiceChecklistModule
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
