import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-special-days',
	templateUrl: './special-days.component.html',
	styleUrls: ['./special-days.component.scss']
})
export class SpecialDaysComponent implements OnInit {


	horizontalPosition: MatSnackBarHorizontalPosition = 'center';
	verticalPosition: MatSnackBarVerticalPosition = 'top';
	dayName: String = null;
	dayId = null;
	displayedColumns: string[] = ['sno', 'name', 'action'];
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
			flag: "getSpecial",
		}
		this.apiService.specialData(requestData).subscribe((data) => {
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
		if (this.dayId != null) {
			requestData = {
				flag: "updateSpecial",
				id: this.dayId,
				name: this.dayName
			}
		} else {
			requestData = {
				flag: "addSpecial",
				name: this.dayName
			}
		}

		this.apiService.specialData(requestData).subscribe((data) => {
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
		this.dayName = editData.name;
		this.dayId = editData.id;
	}
	delete(deleteData) {
		this.confirmDialogRef = this.matDialog.open(FuseConfirmDialogComponent, { disableClose: false });
		this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure want to delete Details?';
		this.confirmDialogRef.afterClosed().subscribe(result => {
			if (result) {
				let requestData = {
					flag: "deleteSpecial",
					id: deleteData.id,
				}
				this.apiService.specialData(requestData).subscribe((data) => {
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
		this.dayName = null;
		this.dayId = null;
	}
	openSnackBar(message) {
		this.snackBar.open(message, 'Close', {
			duration: 5000,
			horizontalPosition: this.horizontalPosition,
			verticalPosition: this.verticalPosition,
		});
	}

}
