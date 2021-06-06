import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-route-details',
	templateUrl: './route-details.component.html',
	styleUrls: ['./route-details.component.scss']
})
export class RouteDetailsComponent implements OnInit {

	horizontalPosition: MatSnackBarHorizontalPosition = 'center';
	verticalPosition: MatSnackBarVerticalPosition = 'top';
	source: String = null;
	destination: String = null;
	noTrips: Number = null;
	noStages: Number = null;
	routeId = null;
	displayedColumns: string[] = ['sno', 'source', 'destination', 'trips', 'stages', 'action'];
	dataSource = new MatTableDataSource<any>();
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
			flag: "getRoute",
		}
		this.apiService.routeDetails(requestData).subscribe((data) => {
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
		let requestData = {
			source : this.source,
			destination : this.destination,
			no_trips : this.noTrips,
			no_stages: this.noStages
		};
		if (this.routeId != null) {
			requestData["flag"] = "updateRoute";
			requestData["id"] = this.routeId;
		} else {
			requestData["flag"] = "addRoute";
		}

		this.apiService.routeDetails(requestData).subscribe((data) => {
			this.openSnackBar(data['message'])
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
		this.source = editData.source;
		this.destination = editData.destination;
		this.noTrips = editData.no_trips;
		this.noStages = editData.no_stages;
		this.routeId = editData.id;
	}
	delete(deleteData) {
		this.confirmDialogRef = this.matDialog.open(FuseConfirmDialogComponent, { disableClose: false });
		this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure want to delete Details?';
		this.confirmDialogRef.afterClosed().subscribe(result => {
			if (result) {
				let requestData = {
					flag: "deleteRoute",
					id: deleteData.id,
				}
				this.apiService.routeDetails(requestData).subscribe((data) => {
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
		this.source = null;
		this.destination = null;
		this.noTrips = null;
		this.noStages = null;
		this.routeId = null;
	}
	openSnackBar(message) {
		this.snackBar.open(message, 'Close', {
			duration: 5000,
			horizontalPosition: this.horizontalPosition,
			verticalPosition: this.verticalPosition,
		});
	}
}
