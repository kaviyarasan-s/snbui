import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from '../../date.adapter';
import * as moment from "moment";

@Component({
	selector: 'app-workshop-details',
	templateUrl: './workshop-details.component.html',
	styleUrls: ['./workshop-details.component.scss'],
	providers: [
		{
			provide: DateAdapter, useClass: AppDateAdapter
		}, {
			provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
		}
	]
})
export class WorkshopDetailsComponent implements OnInit {

	
	horizontalPosition: MatSnackBarHorizontalPosition = 'center';
	verticalPosition: MatSnackBarVerticalPosition = 'top';
	vehicleTypes = ["Bus", "Lorry", "2 Wheeler", "4 Wheeler"]
	displayedColumns: string[] = ['sno', 'vehicle_type', 'bus_no', 'workshop_name', 'service_amount', 'payment_status', 'balance_amount', 'action'];
	dataSource = new MatTableDataSource<any>();
	serviceBtnText = "Add Service";
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

	workshopName: any;
	typeofService: any;
	serviceAmount: any;
	vehicleType: any;

	modeofPayment : any;
	paymentStatus : any;
	paymentBusNo : any;
	amountPaid : any;
	balanceAmount : any;

	generalService = false;
	paymentStatusData = {
		1:"Full Payment",
		2:"Partial Payment",
		3:"Pending"
	}
	amountPaidPartial = [
		{
		amount :0,
		date : new Date()
	}]
	amountPartialLen = 1;

	bankName : any;
	chequeNo: any;
	kilometerIn : any;
	busNumber :any;
	kilometerOut : any;

	labourCharges = 0;
	labourDiscount = 0;
	PartsCharges = 0;
	PartsDiscount = 0;
	cgstAmount = 0;
	sgstAmount = 0;

	workshopId:any;
	date = new Date();
	busData: any;
	serviceData:any;

	imageUrl: any;
	imageUploadFlag : Boolean = false;

	serviceChecklistData = [];
	invoice_date = new Date();

	constructor(
		private apiService: ApiService,
		public snackBar: MatSnackBar,
		public matDialog: MatDialog,
	) { }

	ngOnInit() {
		let requestData = {
			flag: "getWorkShop",
		}
		this.apiService.workshop(requestData).subscribe((data) => {
			this.busData = data['busData'];
			this.serviceData = data['serviceData'];
			this.serviceChecklistData = data['serviceChecklistData'];
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
	calculateBalance(){
		if (this.paymentStatus == 3) {
			this.amountPaid = 0;
		}else{
			let tempAmount = 0;
			for (let index = 0; index < this.amountPaidPartial.length; index++) {
				tempAmount += this.amountPaidPartial[index].amount;
			}
			this.amountPaid = tempAmount
		}

		this.balanceAmount = this.serviceAmount-this.amountPaid	;
	}
	calculateTotal(){
		this.serviceAmount = this.labourCharges+this.PartsCharges+this.cgstAmount+this.sgstAmount;
		this.serviceAmount -= (this.labourDiscount+this.PartsDiscount);
		this.calculateBalance();
	}
	addPayment(){
		if(this.amountPaidPartial.length < 5){
			this.amountPaidPartial.push({
				amount :0,
				date : new Date()
			})
			this.amountPartialLen = this.amountPaidPartial.length;
		}
		this.calculateBalance();
	}
	removePayment(){
		this.amountPaidPartial.pop();
		this.amountPartialLen = this.amountPaidPartial.length;
		this.calculateBalance();
	}
	onSubmit(form) {
		let requestData = {
			workshop_name: this.workshopName,
			service: this.typeofService,
			bus_details: this.busNumber,
			vehicle_type : this.vehicleType,
			service_amount: parseFloat(this.serviceAmount) ,
			payment_status : parseFloat(this.paymentStatus) ,
			paid_amount : parseFloat(this.amountPaid),
			payment_info : JSON.stringify(this.amountPaidPartial),
			balance_amount : parseFloat(this.balanceAmount) ,
			checklist: JSON.stringify(this.generalService),
			payment_mode : this.modeofPayment,
			payment_bus_details: this.paymentBusNo,
			bank_name: this.bankName,
			cheque_no: this.chequeNo,
			kilometer_in: this.kilometerIn,
			kilometer_out:this.kilometerOut,
			entry_date: moment(this.date).format("YYYY-MM-DD"),
			invoice_date: moment(this.invoice_date).format("YYYY-MM-DD"),
			parts_charges : this.PartsCharges,
			parts_discount : this.PartsDiscount,
			labour_charges : this.labourCharges,
			labour_discount : this.labourDiscount,
			cgst_amount : this.cgstAmount,
			sgst_amount : this.sgstAmount,
		};
		if (this.workshopId != null) {
			requestData['flag'] = "updateDetails";
			requestData['id'] = this.workshopId;
		} else {
			requestData['flag'] = "addWorkshop"
		}

		if(this.imageUploadFlag){
			requestData["imageUrl"] = JSON.stringify(this.imageUrl) 
		}

		this.apiService.workshop(requestData).subscribe((data) => {
			this.busData = data['busData'];
			this.serviceData = data['serviceData'];
			this.serviceChecklistData = data['serviceChecklistData'];
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
	edit(editData){
		let contentDiv = document.getElementsByClassName('content')[0];
		contentDiv.scrollIntoView();
		this.workshopName = editData.workshop_name;
		this.typeofService = editData.service;
		this.serviceAmount = editData.service_amount;
		this.vehicleType = editData.vehicle_type;
		this.modeofPayment = editData.payment_mode;
		this.paymentBusNo = editData.payment_bus_details;

		this.paymentStatus = editData.payment_status;
		this.amountPaid = editData.paid_amount;
		this.balanceAmount = editData.balance_amount;
		this.generalService = JSON.parse(editData.checklist)

		this.amountPaidPartial = JSON.parse(editData.payment_info);
		this.invoice_date = moment(editData.invoice_date, "YYYY-MM-DD").toDate();
		this.imageUrl = editData.imageUrl;
		this.PartsCharges = editData.parts_charges;
		this.PartsDiscount = editData.parts_discount;
		this.labourCharges = editData.labour_charges;
		this.labourDiscount = editData.labour_discount;
		this.cgstAmount = editData.cgst_amount;
		this.sgstAmount = editData.sgst_amount;
		this.imageUrl = editData.imageUrl;

		this.bankName = editData.bank_name;
		this.chequeNo = editData.cheque_no;
		this.kilometerIn = editData.kilometer_in;
		this.busNumber = editData.bus_details;
		this.kilometerOut = editData.kilometer_out;
		this.workshopId = editData.id;
		this.date = moment(editData.entry_date,"YYYY-MM-DD").toDate();
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
				this.apiService.workshop(requestData).subscribe((data) => {
					this.busData = data['busData'];
					this.serviceData = data['serviceData'];
					this.openSnackBar(data['message'])
					this.serviceChecklistData = data['serviceChecklistData'];
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
		this.workshopName = null;
		this.typeofService = null;
		this.serviceAmount = null;
		this.vehicleType = null;
		this.modeofPayment = null;
		this.paymentBusNo = null;
		this.paymentStatus = null;
		this.amountPaid = null;
		this.balanceAmount = null;
		this.generalService = false;


		this.imageUrl = null;
		this.PartsCharges = null;
		this.PartsDiscount = null;
		this.labourCharges = null;
		this.labourDiscount = null;
		this.cgstAmount = null;
		this.sgstAmount = null;

		this.bankName = null;
		this.chequeNo = null;
		this.kilometerIn = null;
		this.busNumber = null;
		this.kilometerOut = null;
		this.date = new Date();
		this.invoice_date = new Date();
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
