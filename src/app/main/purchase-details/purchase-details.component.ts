import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from '../../date.adapter';
import * as moment from "moment";

@Component({
	selector: 'app-purchase-details',
	templateUrl: './purchase-details.component.html',
	styleUrls: ['./purchase-details.component.scss'],
	providers: [
		{
			provide: DateAdapter, useClass: AppDateAdapter
		}, {
			provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
		}
	]
})
export class PurchaseDetailsComponent implements OnInit {
	horizontalPosition: MatSnackBarHorizontalPosition = 'center';
	verticalPosition: MatSnackBarVerticalPosition = 'top';
	displayedColumns: string[] = ['sno', 'view_date', 'shop_name', 'item_name', 'action'];
	dataSource = new MatTableDataSource<any>();
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

	vehicleType: any;
	bankName: any;
	shopName:any;
	itemName:any;
	billAmount = 0;
	busNumber: any;
	department: any;
	date = new Date();
	invoiceNo:any;
	busData: any;
	purchaseId:any;
	departmentData = [];


	modeofPayment: any;
	paymentStatus: any;
	paymentBusNo: any;
	amountPaid: any;
	balanceAmount: any;
	chequeNo: any;
	paymentStatusData = {
		1: "Full Payment",
		2: "Partial Payment",
		3: "Pending"
	}
	amountPaidPartial = [
		{
			amount: 0,
			date: new Date()
		}]
	amountPartialLen = 1;
	items = [
		{
			price: 0,
			name: ""
		}];
	itemCount: any;

	imageUrl: any;
	imageUploadFlag: Boolean = false;

	constructor(
		private apiService: ApiService,
		public snackBar: MatSnackBar,
		public matDialog: MatDialog,
	) { }

	ngOnInit() {
		let requestData = {
			flag: "getDetails",
		}
		this.apiService.purchase(requestData).subscribe((data) => {
			this.busData = data['busData'];
			this.departmentData = data['departmentData'];
			this.load(data['data']);
			if (data['response'] == 'error') {

			} else {

			}
		});
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
	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}
	calculateBalance() {
		if (this.paymentStatus == 3) {
			this.amountPaid = 0;
		} else {
			let tempAmount = 0;
			for (let index = 0; index < this.amountPaidPartial.length; index++) {
				tempAmount += this.amountPaidPartial[index].amount;
			}
			this.amountPaid = tempAmount
		}
		this.balanceAmount = this.billAmount - this.amountPaid;
	}
	addPayment() {
		if (this.amountPaidPartial.length < 5) {
			this.amountPaidPartial.push({
				amount: 0,
				date: new Date()
			})
			this.amountPartialLen = this.amountPaidPartial.length;
		}

	}
	removePayment() {
		this.amountPaidPartial.pop();
		this.amountPartialLen = this.amountPaidPartial.length;
		this.calculateBalance()
	}
	addItem() {
		if (this.items.length < 5) {
			this.items.push({
				price: 0,
				name:""
			})
			this.itemCount = this.items.length;
		}

	}
	calculateAmount(){
		let tempAmount = 0;
		for (let index = 0; index < this.items.length; index++) {
			tempAmount += this.items[index].price;
		}
		this.billAmount = tempAmount;
		this.calculateBalance();
	}
	removeItem() {
		this.items.pop();
		this.itemCount = this.items.length;
	}
	onSubmit(form) {
		let requestData = {
			invoice_no: this.invoiceNo,
			shop_name: this.shopName,
			item_name: this.itemName,
			vehicle_type: this.vehicleType,

			payment_status: parseFloat(this.paymentStatus),
			paid_amount: parseFloat(this.amountPaid),
			bus_details: this.busNumber,
			department: this.department,
			payment_info: JSON.stringify(this.amountPaidPartial),
			item_info: JSON.stringify(this.items),

			balance: parseFloat(this.balanceAmount),
			amount: this.billAmount,
			
			payment_mode: this.modeofPayment,
			payment_bus_details: this.paymentBusNo,
			bank_name: this.bankName,
			cheque_no: this.chequeNo,
			date: moment(this.date).format("YYYY-MM-DD")
		};
		if (this.purchaseId != null) {
			requestData['flag'] = "updateDetails";
			requestData['id'] = this.purchaseId;
		} else {
			requestData['flag'] = "addDetails"
		}
		if (this.imageUploadFlag) {
			requestData["imageUrl"] = JSON.stringify(this.imageUrl)
		}

		this.apiService.purchase(requestData).subscribe((data) => {
			this.busData = data['busData'];
			this.departmentData = data['departmentData'];
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
		this.date = new Date();
		this.shopName = editData.shop_name;
		this.invoiceNo = editData.invoice_no;
		this.billAmount = editData.amount;

		this.busNumber = editData.bus_details;
		this.items = JSON.parse(editData.item_info)
		this.amountPaidPartial = JSON.parse(editData.payment_info)
		this.amountPartialLen = this.amountPaidPartial.length

		this.paymentStatus = editData.payment_status;
		this.department = editData.department;
		this.vehicleType = editData.vehicle_type;
		this.modeofPayment = editData.payment_mode;
		this.paymentBusNo = editData.payment_bus_details;
		this.bankName = editData.bank_name;
		this.chequeNo = editData.cheque_no;
		this.purchaseId = editData.id;
		this.balanceAmount = editData.balance;

		this.imageUrl = editData.imageUrl;

		this.calculateAmount();
		this.calculateBalance();
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
				this.apiService.purchase(requestData).subscribe((data) => {
					this.busData = data['busData'];
					this.departmentData = data['departmentData'];
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
		this.date = new Date();
		this.shopName = null;
		this.invoiceNo = null;
		this.itemName = null;
		this.billAmount = 0;
		this.vehicleType = null;
		this.modeofPayment = null;
		this.paymentBusNo = null;

		this.paymentStatus = null;
		this.modeofPayment = null;
		this.busNumber = null;
		this.department = null;

		this.bankName = null;
		this.chequeNo = null;
		this.purchaseId = null;
		this.balanceAmount = null;
		this.imageUrl = null;
		this.amountPaidPartial = [
			{
				amount: 0,
				date: new Date()
			}]
		this.amountPartialLen = 1;
		this.items = [
			{
				price: 0,
				name: ""
			}];
		this.itemCount = 1;

		this.imageUrl = [];
		this.imageUploadFlag = false;
	}
	load(loadData) {
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
