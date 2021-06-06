import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-serice-details',
	templateUrl: './serice-details.component.html',
	styleUrls: ['./serice-details.component.scss']
})
export class SericeDetailsComponent implements OnInit {

	horizontalPosition: MatSnackBarHorizontalPosition = 'center';
	verticalPosition: MatSnackBarVerticalPosition = 'top';
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
	serviceName: String = null;
	serviceId = null;
	displayedColumns: string[] = ['sno', 'service_name', 'action'];
	dataSource = new MatTableDataSource<any>();
	serviceBtnText = "Add Service";
	vehicleType: any;
	
	constructor(
		private apiService: ApiService,
		public snackBar: MatSnackBar,
		public matDialog: MatDialog,
	) { }

	ngOnInit() {
		let requestData = {
			flag: "getService",
		}
		this.apiService.service(requestData).subscribe((data) => {
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
	onSubmit(form) {
		let requestData = {};
		if (this.serviceId != null) {
			requestData = {
				flag: "updateService",
				id: this.serviceId,
				service_name: this.serviceName,
				vehicle_type: this.vehicleType
			}
		} else {
			requestData = {
				flag: "addService",
				service_name: this.serviceName,
				vehicle_type: this.vehicleType
			}
		}

		this.apiService.service(requestData).subscribe((data) => {
			this.openSnackBar(data['message'])
			this.load(data['data']);
			if (data['response'] == 'error') {
				this.load([])
			} else {
				this.cancel();
				form.resetForm();
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
		this.serviceName = editData.service_name;
		this.serviceId = editData.id;
		this.serviceBtnText = "Update Service";
		this.vehicleType = editData.vehicle_type;
	}
	delete(deleteData) {
		this.confirmDialogRef = this.matDialog.open(FuseConfirmDialogComponent, { disableClose: false });
		this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure want to delete Service?';
		this.confirmDialogRef.afterClosed().subscribe(result => {
			if (result) {
				let requestData = {
					flag: "deleteService",
					id: deleteData.id,
				}
				this.apiService.service(requestData).subscribe((data) => {
					this.openSnackBar(data['message'])
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
		this.serviceBtnText = "Add Service";
		this.serviceName = null;
		this.serviceId = null;
		this.vehicleType = null;
	}
	openSnackBar(message) {
		this.snackBar.open(message, 'Close', {
			duration: 5000,
			horizontalPosition: this.horizontalPosition,
			verticalPosition: this.verticalPosition,
		});
	}

}
