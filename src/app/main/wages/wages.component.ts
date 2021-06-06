import { Component, OnInit, ViewChild} from '@angular/core';
import { ApiService } from '../../api.service';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-wages',
  templateUrl: './wages.component.html',
  styleUrls: ['./wages.component.scss']
})
export class WagesComponent implements OnInit {

	horizontalPosition: MatSnackBarHorizontalPosition = 'center';
	verticalPosition: MatSnackBarVerticalPosition = 'top';
	departmentData = [];
	designationData = [];
	filteredDesignation = [];
	designation = null;
	department = null;
	wagesMode :String = null;
	wagesModeId = null;
	displayedColumns: string[] = ['sno', 'department_names', 'designation_name', 'wages_mode', 'action'];
	dataSource = new MatTableDataSource<any>();
	wagesButtonText = "Add WagesMode";
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
			flag: "getWagesMode",
		}
		this.apiService.wages(requestData).subscribe((data) => {
			this.departmentData = data['departmentData'];
			this.designationData = data['designationData'];
			this.filteredDesignation = data['designationData'];
			if (data['response'] == 'error') {
				this.load([])
			} else {
				this.load(data['data']);
			}
		});
	}
	getDepartmentName(designation_id){
		let data = "";
		this.designationData.forEach(element => {
			if (element.id == designation_id) {
				data =  element['department_names'];
				return;
			}
		});
		return data;
	}
	getDesignationName(designation_id){
		let data = "";
		this.designationData.forEach(element => {
			if (element.id == designation_id) {
				data = element['designation_name'];
				return;
			}
		});
		return data;
	}

	departmentChange(newObj): void {
		let filteredDesignation = [];
		if (this.department && this.department != null) {
			this.designationData.forEach(element => {
				if (element.department_id.split(",").includes(this.department)) {
					filteredDesignation.push(element);
				}
			});
		} else {
			filteredDesignation = this.designationData;
		}
		this.filteredDesignation = filteredDesignation;
	}
	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}
	onSubmit(form) {
		let requestData = {};
		if (this.wagesModeId != null) {
			requestData = {
				flag: "updateWagesMode",
				id: this.wagesModeId,
				modes_name: this.wagesMode,
				designation_id	: this.designation
			}
		} else {
			requestData = {
				flag: "addWagesMode",
				modes_name: this.wagesMode,
				designation_id	: this.designation
			}
		}

		this.apiService.wages(requestData).subscribe((data) => {
			this.openSnackBar(data['message'])
			this.departmentData = data['departmentData'];
			this.designationData = data['designationData'];
			this.filteredDesignation = data['designationData'];
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
		this.department = null;
		this.designation = editData.designation_id;
		this.wagesMode = editData.modes_name;
		this.wagesModeId = editData.id;
		this.wagesButtonText = "Update WagesMode";
	}
	delete(deleteData) {
		this.confirmDialogRef = this.matDialog.open(FuseConfirmDialogComponent, { disableClose: false });
		this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure want to delete Wage Mode?';
		this.confirmDialogRef.afterClosed().subscribe(result => {
			if (result) {
				let requestData = {
					flag: "deleteWagesMode",
					id: deleteData.id,
				}
				this.apiService.wages(requestData).subscribe((data) => {
					this.openSnackBar(data['message']);
					this.departmentData = data['departmentData'];
					this.designationData = data['designationData'];
					this.filteredDesignation = data['designationData'];
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
		this.wagesButtonText = "Add WagesMode";
		this.department = null;
		this.designation = null;
		this.wagesModeId = null;
		this.wagesMode = null;
	}
	openSnackBar(message) {
		this.snackBar.open(message, 'Close', {
			duration: 5000,
			horizontalPosition: this.horizontalPosition,
			verticalPosition: this.verticalPosition,
		});
	}
}
