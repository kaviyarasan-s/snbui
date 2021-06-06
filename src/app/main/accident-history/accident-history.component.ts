import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from '../../date.adapter';
import * as moment from "moment";

@Component({
	selector: 'app-accident-history',
	templateUrl: './accident-history.component.html',
	styleUrls: ['./accident-history.component.scss'],
	providers: [
		{
			provide: DateAdapter, useClass: AppDateAdapter
		}, {
			provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
		}
	]
})
export class AccidentHistoryComponent implements OnInit {

	horizontalPosition: MatSnackBarHorizontalPosition = 'center';
	verticalPosition: MatSnackBarVerticalPosition = 'top';
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
	displayedColumns: string[] = ['sno', 'bus_name', 'claim_status', 'case_status', 'ins_amount_claimed', "ins_amount_received", 'settlement_amount', 'action'];
	dataSource = new MatTableDataSource<any>();

	driverName:any;
	busNumber:any;
	date = new Date();
	reviewDate = new Date();
	placeofAccident:any;
	claimStatus:any;
	caseStatus:any;
	settlementAmount:any;
	lawyerName:any;
	mobileNumber:any;
	historyId:any;
	insuranceCompany: any;
	busData: any;
	driverData: any;
	officerMobileNumber: any;

	insAmountClaimed : any;
	insAmountReceived : any;

	imageUrl: any;
	imageUploadFlag : Boolean = false;

	constructor(
		private apiService: ApiService,
		public snackBar: MatSnackBar,
		public matDialog: MatDialog,
	) { }

	ngOnInit() {
		let requestData = {
			flag: "getHistory",
		}
		this.apiService.accident(requestData).subscribe((data) => {
			this.busData = data['busData'];
			this.driverData = data['driverData'];
			this.load(data['data']);
			if (data['response'] == 'error') {

			} else {

			}
		});
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}
	uploadedFile(event: any): void {
		if (event.target.files.length > 0) {
			const files = event.target.files;
			let images = [];
			for (let index = 0; index < files.length && index < 5; index++) {
				const element = files[index];
				const reader = new FileReader();
				reader.onload = (e) => {
					images.push(reader.result);
					// this.imageUrl = reader.result;
					this.imageUploadFlag = true;
				}
				reader.readAsDataURL(files[index]);
			}
			this.imageUrl = images;
		}
	}
	onSubmit(form) {
		let requestData = {
			place_of_accident: this.placeofAccident,
			claim_status: this.claimStatus,
			bus_details: this.busNumber,
			employee_details: this.driverName,
			case_status: this.caseStatus,
			settlement_amount: this.settlementAmount,

			ins_amount_claimed : this.insAmountClaimed,
			ins_amount_received : this.insAmountReceived,

			lawyer_name: this.lawyerName,
			mobile_number: this.mobileNumber,
			accident_date: this.date,
			review_date : this.reviewDate,
			insurance_company: this.insuranceCompany,
			officer_mobile_number: this.officerMobileNumber
		};

		if(this.imageUploadFlag){
			requestData["imageUrl"] = JSON.stringify(this.imageUrl) 
		}

		if (this.historyId != null) {
			requestData['flag'] = "updateDetails";
			requestData['id'] = this.historyId;
		} else {
			requestData['flag'] = "addDetails"
		}

		this.apiService.accident(requestData).subscribe((data) => {
			this.busData = data['busData'];
			this.driverData = data['driverData'];
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

	edit(editData) {
		let contentDiv = document.getElementsByClassName('content')[0];
		contentDiv.scrollIntoView();
		this.historyId = editData.id;
		this.imageUploadFlag = false;
		this.driverName = editData.employee_details;
		this.claimStatus = editData.claim_status;
		this.caseStatus = editData.case_status;
		this.settlementAmount = editData.settlement_amount;

		this.insAmountClaimed = editData.ins_amount_claimed;
		this.insAmountReceived = editData.ins_amount_received;

		this.lawyerName = editData.lawyer_name;
		this.insuranceCompany = editData.insurance_company;
		this.officerMobileNumber = editData.officer_mobile_number;
		this.mobileNumber = editData.mobile_number;
		this.busNumber = editData.bus_details;
		this.placeofAccident = editData.place_of_accident;
		this.imageUrl = editData.imageUrl;
		this.date = moment(editData.accident_date, "YYYY-MM-DD").toDate();
		this.reviewDate = moment(editData.review_date, "YYYY-MM-DD").toDate();
	}
	delete(deleteData) {
		this.confirmDialogRef = this.matDialog.open(FuseConfirmDialogComponent, { disableClose: false });
		this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure want to delete Entry?';
		this.confirmDialogRef.afterClosed().subscribe(result => {
			if (result) {
				let requestData = {
					flag: "deleteDetails",
					id: deleteData.id,
				}
				this.apiService.accident(requestData).subscribe((data) => {
					this.busData = data['busData'];
					this.driverData = data['driverData'];
					this.openSnackBar(data['message'])
					this.load(data['data']);
					if (data['response'] == 'error') {

					} else {

					}
				});
			}
			this.confirmDialogRef = null;
		});
	}
	cancel() {
		this.driverName = null;
		this.imageUploadFlag = false;
		this.claimStatus = null;
		this.caseStatus = null;
		this.settlementAmount = null;
		this.lawyerName = null;
		this.mobileNumber = null;
		this.officerMobileNumber = null;
		this.insuranceCompany = null;

		this.insAmountClaimed = null;
		this.insAmountReceived = null;

		this.busNumber = null;
		this.imageUrl = null;
		this.placeofAccident = null;
		this.date = new Date();
		this.reviewDate = new Date();
	}
	load(loadData) {
		loadData.forEach((element, index) => {
			this.busData.forEach(bus => {
				if (bus.auto_inc_id == element.bus_details) {
					loadData[index].bus_name = bus.bus_no
				}
			});
		});
		this.dataSource = new MatTableDataSource<any>(loadData);
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	openSnackBar(message) {
		this.snackBar.open(message, 'Close', {
			duration: 5000,
			horizontalPosition: this.horizontalPosition,
			verticalPosition: this.verticalPosition,
		});
	}
}
