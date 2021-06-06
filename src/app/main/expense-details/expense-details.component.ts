import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from '../../date.adapter';

import * as moment from "moment";
@Component({
	selector: 'app-expense-details',
	templateUrl: './expense-details.component.html',
	styleUrls: ['./expense-details.component.scss'],
	providers: [
		{
			provide: DateAdapter, useClass: AppDateAdapter
		}, {
			provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
		}
	]
})
export class ExpenseDetailsComponent implements OnInit {
	[x: string]: any;

	horizontalPosition: MatSnackBarHorizontalPosition = 'center';
	verticalPosition: MatSnackBarVerticalPosition = 'top';
	litres: any;
	dieselRate: any;
	dieselTotal: any;
	workShop: any;
	pooja: any;
	clearance: any;
	agent: any;
	other: any;
	discountDiesel: any;
	driverBeta: any;
	conductorBeta: any;
	specialDriverBeta: any;
	SpecialConductorBeta: any;

	fillTime: any;
	onlineRate: any;
	traineeBeta: any;
	specialTraineeBeta: any;
	ticketReturn: any;
	connectionCharges: any;
	cleaningCharges: any;
	
	busNumber = null;
	date = new Date();

	displayedColumns: string[] = ['sno', 'entry_date', 'bus_name', 'action'];
	dataSource = new MatTableDataSource<any>();
	submitBtnText = "Add Details";
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('busNumberSelect') busNumberSelect: ElementRef;
	confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
	busData: any;
	expenseId: any;
	collectionAmount = 0;
	comments: any;
	ticketData = [];
	freeTickets = 0;
	otherExpense = [
		{
			amount: 0,
			comment:""
		}]
	totalOtherExp = 0;
	otherExpLen = 1;

	constructor(
		private apiService: ApiService,
		public snackBar: MatSnackBar,
		public matDialog: MatDialog,
	) { }

	ngOnInit() {
		let requestData = {
			flag: "getExpenseDetails",
		}
		this.apiService.expense(requestData).subscribe((data) => {
			this.busData = data['busData'];
			if (data['response'] == 'error') {
				this.load([])
			} else {
				this.load(data['data']);
			}
		});
	}
	calculateTotal(){
		if(this.litres && this.dieselRate){
			this.dieselTotal = this.litres*this.dieselRate;
			if(this.discountDiesel)
				this.dieselTotal -= this.discountDiesel;
		}	
	}
	calculateOtherTotal() {
		let totalOtherExp = 0;
		for (let index = 0; index < this.otherExpense.length; index++) {
			totalOtherExp = totalOtherExp + this.otherExpense[index].amount;
		}
		this.totalOtherExp = totalOtherExp;
	}
	addPayment() {
		if (this.otherExpense.length < 5) {
			this.otherExpense.push({
				amount: 0,
				comment: ""
			})
			this.otherExpLen = this.otherExpense.length;
		}
	}
	removePayment() {
		this.otherExpense.pop();
		this.otherExpLen = this.otherExpense.length;
	}
	dataChange(){
		if(this.date && this.busNumber){
			let requestData = {
				flag: "getCollectionDetailCondition",
				date: moment(this.date).format("YYYY-MM-DD"),
				bus_details: this.busNumber
			}
			this.apiService.collection(requestData).subscribe((data) => {
				if (Object.keys(data).length > 0) {
					this.collectionAmount = data[0].collection_amount;
					let betaDetails = this.getBetaData();
					if (betaDetails) {
						if (betaDetails.driver_beta_percent && betaDetails.conductor_beta_percent) {
							this.driverBeta = Math.floor(  this.collectionAmount * (betaDetails.driver_beta_percent /100))
							this.conductorBeta = Math.floor( this.collectionAmount * (betaDetails.conductor_beta_percent /100))	
						}
						if (betaDetails.beta_start_limit_two && betaDetails.beta_start_limit_one) {
							if (this.collectionAmount >= betaDetails.beta_start_limit_two) {
								this.specialDriverBeta = betaDetails.beta_amount_two || 0;
								this.SpecialConductorBeta = betaDetails.beta_amount_two  || 0;
							}else if (this.collectionAmount >= betaDetails.beta_start_limit_one) {
								this.specialDriverBeta = betaDetails.beta_amount_one  || 0;
								this.SpecialConductorBeta = betaDetails.beta_amount_one  || 0;
							}
						}
						
					}else{
						this.collectionAmount = 0;
						this.conductorBeta = 0;
						this.driverBeta = 0;
						this.specialDriverBeta = 0;
						this.SpecialConductorBeta = 0;
					}
				}else{
					this.collectionAmount = 0;
					this.conductorBeta = 0;
					this.driverBeta = 0;
					this.specialDriverBeta = 0;
					this.SpecialConductorBeta = 0;
					// this.openSnackBar("Enter Collection Details for the date.")
				}
			});
		}
	}
	getBetaData(){
		for (let index = 0; index < this.busData.length; index++) {
			if (this.busData[index].auto_inc_id == this.busNumber) {
				return this.busData[index];
			}
		}
		return false;
	}
	calculate() {
		let tempObject = new Array(this.freeTickets);
		for (let index = 0; index < this.freeTickets; index++) {
			tempObject[index] = {
				tripNo: null,
				name: null,
				from: null,
				to: null,
			};
		}
		this.ticketData = tempObject;
	}
	onSubmit(form) {
		if(!this.busNumber){
			this.busNumberSelect.nativeElement.focus();
			return false;
		}
		let requestData = {
			bus_details: this.busNumber,
			entry_date: moment(this.date).format("YYYY-MM-DD") ,
			litre: this.litres,
			rate: this.dieselRate,
			discount: this.discountDiesel,
			total: this.dieselTotal,
			driver_beta: this.driverBeta,
			driver_special_beta: this.specialDriverBeta,
			conductor_beta: this.conductorBeta,
			conductor_special_beta: this.SpecialConductorBeta,
			workshop: this.workShop,
			pooja: this.pooja,
			clearance: this.clearance,
			agent: this.agent,
			other: JSON.stringify(this.otherExpense) ,
			online_rate:this.onlineRate,
			trainee_beta: this.traineeBeta,
			trainee_special_beta:this.specialTraineeBeta,
			fill_time:this.fillTime,
			connection:this.connectionCharges,
			cleaning:this.cleaningCharges,
			ticket_return:this.ticketReturn,
			no_of_free_tickets: this.freeTickets,
			free_ticket_data: JSON.stringify(this.ticketData),
			other_total: this.totalOtherExp
		}

		if (this.expenseId != null) {
			requestData['flag'] = "updateExpenseDetails";
			requestData['id'] = this.expenseId;
		} else {
			requestData['flag'] = "addExpenseDetails";
		}

		this.apiService.expense(requestData).subscribe((data) => {
			this.openSnackBar(data['message'])
			this.busData = data['busData'];
			this.load(data['data']);
			if (data['response'] == 'error') {

			} else {
				this.cancel();
				form.resetForm();
			}
		});
	}

	edit(editData) {
		let contentDiv = document.getElementsByClassName('content')[0];
		contentDiv.scrollIntoView();
		this.submitBtnText = "Update Details";
		this.date = editData.entry_date;
		this.busNumber = editData.bus_details;
		this.litres = editData.litre;
		this.dieselRate = editData.rate;
		this.dieselTotal = editData.total;
		this.workShop = editData.workshop;
		this.pooja = editData.pooja;
		this.clearance = editData.clearance;
		this.agent = editData.agent;
		this.otherExpense = JSON.parse(editData.other) ? JSON.parse(editData.other): [
			{
				amount: 0,
				comment: ""
			}];
		this.otherExpLen = this.otherExpense.length;
		this.discountDiesel = editData.discount;
		this.driverBeta = editData.driver_beta;
		this.conductorBeta = editData.conductor_beta;
		this.specialDriverBeta = editData.driver_special_beta;
		this.SpecialConductorBeta = editData.conductor_special_beta;
		this.expenseId = editData.id;
		this.onlineRate = editData.online_rate;
		this.traineeBeta = editData.trainee_beta;
		this.specialTraineeBeta = editData.trainee_special_beta;
		this.fillTime = editData.fill_time;
		this.connectionCharges = editData.connection;
		this.cleaningCharges = editData.cleaning;
		this.ticketReturn = editData.ticket_return;
		this.freeTickets = editData.no_of_free_tickets;
		this.ticketData = editData.free_ticket_data ? JSON.parse(editData.free_ticket_data):[];
		this.dataChange();
		this.calculateOtherTotal()
	}

	delete(deleteData) {
		this.confirmDialogRef = this.matDialog.open(FuseConfirmDialogComponent, { disableClose: false });
		this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure want to delete expense details?';
		this.confirmDialogRef.afterClosed().subscribe(result => {
			if (result) {
				let requestData = {
					flag: "deleteExpenseDetails",
					id: deleteData.id,
				}
				this.apiService.expense(requestData).subscribe((data) => {
					this.openSnackBar(data['message']);
					this.busData = data['busData'];
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
		this.submitBtnText = "Add Details";
		this.litres = null;
		this.dieselRate = null;
		this.dieselTotal = null;
		this.workShop = null;
		this.pooja = null;
		this.clearance = null;
		this.agent = null;
		this.otherExpLen = 1;
		this.otherExpense = [
			{
				amount: 0,
				comment: ""
			}]
		this.discountDiesel = null;
		this.driverBeta = null;
		this.conductorBeta = null;
		this.specialDriverBeta = null;
		this.SpecialConductorBeta = null;
		this.busNumber = null;
		this.date = new Date();
		this.expenseId = null;
		this.onlineRate = null;
		this.traineeBeta = null;
		this.specialTraineeBeta = null;
		this.fillTime = null;
		this.connectionCharges = null;
		this.cleaningCharges = null;
		this.ticketReturn = null;	
		this.comments = null;
		this.freeTickets = null;
		this.ticketData = null;
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
	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}
	openSnackBar(message) {
		this.snackBar.open(message, 'Close', {
			duration: 5000,
			horizontalPosition: this.horizontalPosition,
			verticalPosition: this.verticalPosition,
		});
	}
}
