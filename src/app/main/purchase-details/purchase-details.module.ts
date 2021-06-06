import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseDetailsComponent } from './purchase-details.component';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatButtonModule, MatTabsModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatTableModule, MatDatepickerModule, MatPaginatorModule, MatSortModule, MatSnackBarModule } from '@angular/material';

const routes = [
  {
    path: 'purchase-details',
    component: PurchaseDetailsComponent
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    FuseSharedModule,
    MatTabsModule
  ],
  declarations: [PurchaseDetailsComponent]
})
export class PurchaseDetailsModule { }
