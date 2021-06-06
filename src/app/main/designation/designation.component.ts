import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-designation',
	templateUrl: './designation.component.html',
	styleUrls: ['./designation.component.scss']
})
export class DesignationComponent implements OnInit {

	horizontalPosition: MatSnackBarHorizontalPosition = 'center';
	verticalPosition: MatSnackBarVerticalPosition = 'top';
	departmentData = [];
	department = [];
	designation :String = null;
	designationId = null;
	displayedColumns: string[] = ['sno', 'designation_name', 'department_names', 'action'];
	dataSource = new MatTableDataSource<any>();
	designationBtnText = "Add Designation";
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

	constructor(
		private apiService: ApiService,
		public snackBar: MatSnackBar,
		public matDialog: MatDialog,
	) { }

	ngOnInit() {
		let requestData = {
			flag: "getDesignation",
		}
		this.apiService.designation(requestData).subscribe((data) => {
			this.departmentData = data['departmentData'];
			if (data['response'] == 'error') {
				this.load([])
			} else {
				this.load(data['data']);
			}
		});
	}
	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}
	onSubmit(form){
		let requestData = {};
		if (this.designationId != null) {
			requestData = {
				flag: "updateDesignation",
				id: this.designationId,
				designation_name: this.designation,
				department_id: this.department.join(",")
			}
		} else {
			requestData = {
				flag: "addDesignation",
				designation_name: this.designation,
				department_id : this.department.join(",")
			}
		}

		this.apiService.designation(requestData).subscribe((data) => {
			this.openSnackBar(data['message'])
			this.departmentData = data['departmentData'];
			if (data['response'] == 'error') {
				this.load([])
			} else {
				this.cancel();
				form.resetForm();
				this.load(data['data']);
			}
		});
	}
	load(loadData) {
		this.dataSource = new MatTableDataSource<any>(loadData);
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	edit(editData) {
		let contentDiv = document.getElementsByClassName('content')[0];
		contentDiv.scrollIntoView();
		this.department = editData.department_id.split(",");
		this.designation = editData.designation_name;
		this.designationId = editData.id;
		this.designationBtnText = "Update Designation";
	}
	delete(deleteData) {
		this.confirmDialogRef = this.matDialog.open(FuseConfirmDialogComponent, { disableClose: false });
		this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure want to delete Designation?';
		this.confirmDialogRef.afterClosed().subscribe(result => {
			if (result) {
				let requestData = {
					flag: "deleteDesignation",
					id: deleteData.id,
				}
				this.apiService.designation(requestData).subscribe((data) => {
					this.openSnackBar(data['message']);
					this.departmentData = data['departmentData'];
					if (data['response'] == 'error') {
						this.load([])
					} else {
						this.load(data['data']);
					}
				});
			}
			this.confirmDialogRef = null;
		});
	}
	cancel() {
		this.designationBtnText = "Add Designation";
		this.department = [];
		this.designation = null;
		this.designationId = null;
	}
	openSnackBar(message) {
		this.snackBar.open(message, 'Close', {
			duration: 5000,
			horizontalPosition: this.horizontalPosition,
			verticalPosition: this.verticalPosition,
		});
	}
}
