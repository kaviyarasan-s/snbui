import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseDetailsComponent } from './expense-details.component';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { MatButtonModule, MatTabsModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatTableModule, MatDatepickerModule, MatPaginatorModule, MatSortModule, MatSnackBarModule } from '@angular/material';
const routes = [
  {
    path: 'expense-details',
    component: ExpenseDetailsComponent
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
    MatTabsModule,
    AmazingTimePickerModule
  ],
  declarations: [ExpenseDetailsComponent]
})
export class ExpenseDetailsModule { }
