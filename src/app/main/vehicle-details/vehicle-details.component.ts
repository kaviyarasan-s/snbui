import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss']
})
export class VehicleDetailsComponent implements OnInit {

	horizontalPosition: MatSnackBarHorizontalPosition = 'center';
	verticalPosition: MatSnackBarVerticalPosition = 'top';
	busNo: any;
	chassisNo: any;
	engineNo: any;

	invoiceAmount : any;
	invoiceDate: any;

	ownerName: any;
	
	fcDate: any;
	taxDate: any;
	routeFrom: any;
	routeTo: any;
	driverName: any;
	conductorName: any;
	traineeName: any;

	startAmountOne: any;
	endAmountOne: any;
	betaAmountOne: any;
	startAmountTwo: any;
	endAmountTwo: any;
	betaAmountTwo: any;

	insCompanyName: any;
	insuranceDate: any;
	insAmount : any;
	permitRenewDate : any;

	driverBetaPercent : any;
	conductorBetaPercent : any;

	taxAmount: any;
	loanAmount: any;
	loanAccNumber: any;
	loanBankName: any;
	loanDueAmount: any;
	loanDueDate: any;
	loanEndDate: any;
	permitAmount: any;
	permitStartDate: any;
	permitEndDate: any;
	vehicleModelNo: any;
	busId: any = null;
	department:any;
	selectedIndex: any = 0;
	companyName :any;

	driverData: any;
	conductorData: any;
	traineeData: any;
	busData: any;
	departmentData: any;
	imageUrl: any;
	imageUploadFlag : Boolean = false;
	
	displayedColumns: string[] = ['sno', 'bus_no', 'owner_name', 'vehicle_model_no', 'insurance_amount', 'action'];
	dataSource = new MatTableDataSource<any>();
	submitBtnText = "Add Details";
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
	allData: any;
	noTrips: any;
	noStages: any;
	tripData: any[];
	routeDetails: any;
	routeData: any;

  	constructor(
			private apiService: ApiService,
			public snackBar: MatSnackBar,
			public matDialog: MatDialog,
	  ) { }

	ngOnInit() {
		let requestData = {
			flag: "getBusDetails",
		}
		this.apiService.bus(requestData).subscribe((data) => {
			this.departmentData = data['departmentData'];
			this.driverData = data['driverData'];
			this.routeData = data['routeData'];
			this.conductorData = data['conductorData'];
			this.traineeData = data['traineeData'];
			if (data['response'] == 'error') {
				this.allData = [];
				this.load()
			} else {
				this.allData = data['data'];
				this.load();
			}
		});
	}
	calculateTrip() {
		console.log("kjasdbf")
		let tempObject = new Array(parseInt(this.noTrips));
		for (let index = 0; index < this.noTrips; index++) {
			tempObject[index] = {
				from: null,
				to : null,
				startTime: null,
				endTime: null,
			};
		}
		this.tripData = tempObject;
	}
	changeTab(data){
		this.selectedIndex = data.index;
		this.load();
	}
	uploadedFile(event: any): void {
		if (event.target.files.length > 0) {
			const file = event.target.files[0];
			const reader = new FileReader();
			reader.onload = (e) => {
				this.imageUrl = reader.result;
				this.imageUploadFlag = true;
			}
			reader.readAsDataURL(file);
		}
	}
	selectRoute(){
		for (let index = 0; index <this.routeData.length; index++) {
			if (this.routeData[index].id == this.routeDetails) {
				if (!this.noTrips) {
					this.noTrips = this.routeData[index].no_trips;
					this.calculateTrip();
				}
				if (!this.noStages) {
					this.noStages = this.routeData[index].no_stages;
				}
			}
		}
	}
	onSubmit(form) {
		let requestData = {
			bus_no : this.busNo,
			chassis_no: this.chassisNo,
			engine_no: this.engineNo,
			owner_name: this.ownerName,
			company_name : this.companyName,
			invoice_date: this.invoiceDate,
			insurance_date: this.insuranceDate,

			insurance_amount: this.insAmount,
			permit_renew_date: this.permitRenewDate,
			invoice_amount: this.invoiceAmount,

			driver_beta_percent: this.driverBetaPercent,
			conductor_beta_percent: this.conductorBetaPercent,

			beta_start_limit_one :this.startAmountOne,
			beta_end_limit_one : this.endAmountOne,
			beta_amount_one : this.betaAmountOne,
			beta_start_limit_two : this.startAmountTwo,
			beta_end_limit_two : this.endAmountTwo,
			beta_amount_two : this.betaAmountTwo,

			type:this.selectedIndex,
			fc_date: this.fcDate,
			tax_date: this.taxDate,
			driver_id: this.driverName,
			conductor_id: this.conductorName,
			trainee_id: this.traineeName,
			department_id: this.department,
			insurance_company_name: this.insCompanyName,
			tax_amount: this.taxAmount,
			loan_amount: this.loanAmount,
			loan_account_number: this.loanAccNumber,
			loan_bank_name: this.loanBankName,
			loan_due_amount: this.loanDueAmount,
			loan_due_date: this.loanDueDate,
			loan_end_date: this.loanEndDate,
			permit_start_date: this.permitStartDate,
			permit_end_date: this.permitEndDate,
			permit_amount: this.permitAmount,
			vehicle_model_no: this.vehicleModelNo,
			route_details: this.routeDetails,
			no_trips: this.noTrips,
			no_stages: this.noStages,
			trip_data: JSON.stringify(this.tripData),
		}

		if(this.imageUploadFlag){
			requestData["imageUrl"] = this.imageUrl
		}
		if (this.busId != null) {
			requestData['flag'] = "updateBusDetails";
			requestData['id'] = this.busId;
		} else {
			requestData['flag'] = "addBusDetails";
		}

		this.apiService.bus(requestData).subscribe((data) => {
			this.openSnackBar(data['message'])
			this.departmentData = data['departmentData'];
			this.driverData = data['driverData'];
			this.routeData = data['routeData'];
			this.conductorData = data['conductorData'];
			this.traineeData = data['traineeData'];
			if (data['response'] == 'error') {
				this.allData = [];
				this.load()
			} else {
				this.allData = data['data'];
				this.load();
				this.cancel();
				form.resetForm();
			}
		});
	}
	cancel() {
		this.submitBtnText = "Add Details";
		this.imageUploadFlag = false;
		this.busNo = null;
		this.chassisNo= null;
		this.engineNo= null;
		this.invoiceDate= null;
		this.ownerName= null;
		this.companyName = null;
		this.insuranceDate= null;
		this.insCompanyName= null;

		this.insuranceDate= null;
		this.insAmount = null;
		this.permitRenewDate = null;
		this.invoiceAmount = null;

		this.driverBetaPercent = null;
		this.conductorBetaPercent = null;

		this.startAmountOne = null;
		this.endAmountOne = null;
		this.betaAmountOne = null;
		this.startAmountTwo = null;
		this.endAmountTwo = null;
		this.betaAmountTwo = null;

		this.fcDate= null;
		this.taxDate= null;
		this.routeFrom= null;
		this.routeTo= null;
		this.driverName= null;
		this.conductorName= null;
		this.traineeName= null;
		this.insCompanyName= null;
		this.taxAmount= null;
		this.loanAmount= null;
		this.loanAccNumber= null;
		this.loanBankName= null;
		this.loanDueAmount= null;
		this.loanDueDate= null;
		this.loanEndDate= null;
		this.imageUrl = null;
		this.permitAmount= null;
		this.permitStartDate= null;
		this.permitEndDate= null;
		this.vehicleModelNo= null;
		this.busId= null;
		this.department = null;
		this.noStages = null;
		this.noTrips = null;
		this.routeDetails = null;
	}
	edit(editData) {
		let contentDiv = document.getElementsByClassName('content')[0];
		contentDiv.scrollIntoView();
		this.submitBtnText = "Update Details";
		this.imageUploadFlag = false;
		this.busId = editData.id;
		this.busNo = editData.bus_no;
		this.chassisNo = editData.chassis_no;
		this.engineNo = editData.engine_no;
		this.ownerName = editData.owner_name;
		this.companyName = editData.company_name;
		this.invoiceDate = editData.invoice_date;
		this.insuranceDate = editData.insurance_date;

		this.insAmount = editData.insurance_amount;
		this.permitRenewDate = editData.permit_renew_date;
		this.invoiceAmount = editData.invoice_amount;

		this.driverBetaPercent = editData.driver_beta_percent;
		this.conductorBetaPercent = editData.conductor_beta_percent;

		this.startAmountOne = editData.beta_start_limit_one;
		this.endAmountOne = editData.beta_end_limit_one;
		this.betaAmountOne = editData.beta_amount_one;
		this.startAmountTwo = editData.beta_start_limit_two;
		this.endAmountTwo = editData.beta_end_limit_two;
		this.betaAmountTwo = editData.beta_amount_two;

		this.fcDate = editData.fc_date;
		this.taxDate = editData.tax_date;
		this.driverName = editData.driver_id;
		this.conductorName = editData.conductor_id;
		this.traineeName = editData.trainee_id;
		this.department = editData.department_id;
		this.insCompanyName = editData.insurance_company_name;
		this.taxAmount = editData.tax_amount;
		this.loanAmount = editData.loan_amount;
		this.imageUrl = editData.imageUrl;
		this.loanAccNumber = editData.loan_account_number;
		this.loanBankName = editData.loan_bank_name;
		this.loanDueAmount = editData.loan_due_amount;
		this.loanDueDate = editData.loan_due_date;
		this.loanEndDate = editData.loan_end_date;
		this.permitStartDate = editData.permit_start_date;
		this.permitEndDate = editData.permit_end_date;
		this.permitAmount = editData.permit_amount;
		this.vehicleModelNo = editData.vehicle_model_no;
		this.noTrips = editData.no_trips;
		this.noStages = editData.no_stages;
		this.routeDetails = editData.route_details;
		if (editData.trip_data) {
			this.tripData = JSON.parse(editData.trip_data);
		}else{
			this.calculateTrip();
		}
	}
	delete(deleteData) {
		this.confirmDialogRef = this.matDialog.open(FuseConfirmDialogComponent, { disableClose: false });
		this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure want to delete Bus details?';
		this.confirmDialogRef.afterClosed().subscribe(result => {
			if (result) {
				let requestData = {
					flag: "deleteBusDetails",
					id: deleteData.id,
				}
				this.apiService.bus(requestData).subscribe((data) => {
					this.openSnackBar(data['message']);
					this.departmentData = data['departmentData'];
					this.driverData = data['driverData'];
					this.routeData = data['routeData'];
					this.conductorData = data['conductorData'];
					this.traineeData = data['traineeData'];
					if (data['response'] == 'error') {
						this.allData = [];
						this.load()
					} else {
						this.allData = data['data'];
						this.load();
					}
				});
			}
			this.confirmDialogRef = null;
		});
	}
	load() {
		let loadData = [];
		this.allData.forEach(element => {
			if (element.type == this.selectedIndex) {
				loadData.push(element);
			}
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
