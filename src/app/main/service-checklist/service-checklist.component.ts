import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
	selector: 'app-service-checklist',
	templateUrl: './service-checklist.component.html',
	styleUrls: ['./service-checklist.component.scss']
})
export class ServiceChecklistComponent implements OnInit {

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
		this.apiService.serviceChecklist(requestData).subscribe((data) => {
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
				service_name: this.serviceName
			}
		} else {
			requestData = {
				flag: "addService",
				service_name: this.serviceName
			}
		}

		this.apiService.serviceChecklist(requestData).subscribe((data) => {
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
				this.apiService.serviceChecklist(requestData).subscribe((data) => {
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
	}
	openSnackBar(message) {
		this.snackBar.open(message, 'Close', {
			duration: 5000,
			horizontalPosition: this.horizontalPosition,
			verticalPosition: this.verticalPosition,
		});
	}


}
