import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulingDetailsComponent } from './scheduling-details.component';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatTableModule, MatDatepickerModule, MatPaginatorModule, MatSortModule, MatSnackBarModule } from '@angular/material';
const routes = [
  {
    path: 'scheduling-details',
    component: SchedulingDetailsComponent
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
    FuseSharedModule
  ],
  declarations: [SchedulingDetailsComponent]
})
export class SchedulingDetailsModule { }
