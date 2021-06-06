import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../../api.service';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from '../../date.adapter';
import * as moment from 'moment';
@Component({
	selector: 'app-scheduling-details',
	templateUrl: './scheduling-details.component.html',
	styleUrls: ['./scheduling-details.component.scss'],
	providers:[
		{
			provide: DateAdapter, useClass: AppDateAdapter
		}, {
			provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
		}
	]
})
export class SchedulingDetailsComponent implements OnInit {


	myFilter = (d): boolean => {
		// const day = (d || new Date()).getDay();
		// return day == 1;
		return true;
	}

	myFilterOne = (d): boolean => {
		let date1 = d;
		let date2 = this.startDate;
		let diffTime = Math.abs(date2 - date1);
		let diffTimeOne = date2 - date1;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		if (diffTimeOne <= 0 && diffDays >= 0 && diffDays < 7 ) {
			return true
		}
		return false
	}

	moment: any = moment;
	horizontalPosition: MatSnackBarHorizontalPosition = 'center';
	verticalPosition: MatSnackBarVerticalPosition = 'top';
	startDate: any;
	endDate: any;
	routeFrom: any;
	routeTo: any;
	driverName: any;
	conductorName: any;
	traineeName: any;
	busNumber:any;

	displayedColumns: string[] = ['sno', 'bus_no', 'action'];
	dataSource = new MatTableDataSource<any>();
	submitBtnText = "Add Details";
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
	driverData: any;
	conductorData: any;
	traineeData: any;
	busData: any;
	schedulingId: any;
	selectedDates = [];
	overAllData = {};


	constructor(
		private apiService: ApiService,
		public snackBar: MatSnackBar,
		public matDialog: MatDialog,
	) { }

	ngOnInit() {
		let requestData = {
			flag: "getSchedulingDetails",
		}
		this.apiService.scheduling(requestData).subscribe((data) => {
			this.driverData = data['driverData'];
			this.busData = data['busData'];
			this.conductorData = data['conductorData'];
			this.traineeData = data['traineeData'];
			if (data['response'] == 'error') {
				this.load([])
			} else {
				this.load(data['data']);
			}
		});
	}
	endDateChange(){
		if (this.endDate && this.startDate) {
			var now = this.endDate;
			var daysOfYear = [];
			for (var d = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate()); d <= now; d.setDate(d.getDate() + 1)) {
				daysOfYear.push(d.getDate() + "-" + (d.getMonth() +1)+ "-" + d.getFullYear());
			}
			this.selectedDates = daysOfYear;
		}
		this.dataChange()	
	}
	dataChange(){
		if (this.endDate && this.startDate) {
			this.overAllData = {};
			let tempObject = {};
			this.selectedDates.forEach(date => {
				let tempObjectOne = {};
				this.busNumber.forEach(bus => {
					let driverDetails = this.getDriverDetails(bus, date)
					let conductorDetails = this.getConductorDetails(bus, date)
					let traineeDetails = this.getTraineeDetails(bus, date)
					tempObjectOne[bus] = {
						driverName: driverDetails,
						conductorName: conductorDetails,
						traineeName: traineeDetails
					}
					if (moment(date, "D-M-YYYY").diff(moment(new Date(), "D-M-YYYY"), "days") < 0) {
						tempObjectOne[bus].disable = true
					}
				});
				tempObject[date] = tempObjectOne;
			});

			this.overAllData = tempObject;	
		}else{
			this.overAllData = {};
		}

	}
	getDriverDetails(bus, date){
		for (let index = 0; index < this.dataSource.data.length; index++) {
			const element = this.dataSource.data[index];
			if (element.bus_details == bus && moment(element.date, "YYYY-MM-DD").format("D-M-YYYY") == date) {
				return element.driver_id
			}
		}
		for (let index = 0; index < this.busData.length; index++) {
			const element = this.busData[index];
			if (element.auto_inc_id == bus) {
				return element.driver_id
			}
		}
		return null;
	}
	getConductorDetails(bus, date) {
		for (let index = 0; index < this.dataSource.data.length; index++) {
			const element = this.dataSource.data[index];
			if (element.bus_details == bus && moment(element.date, "YYYY-MM-DD").format("D-M-YYYY") == date) {
				return element.conductor_id
			}
		}
		for (let index = 0; index < this.busData.length; index++) {
			const element = this.busData[index];
			if (element.auto_inc_id == bus) {
				return element.conductor_id
			}
		}
		return null;
	}
	getTraineeDetails(bus, date) {
		for (let index = 0; index < this.dataSource.data.length; index++) {
			const element = this.dataSource.data[index];
			if (element.bus_details == bus) {
				if (moment(element.date, "YYYY-MM-DD").format("D-M-YYYY") == date) {
					return element.trainee_id
				}
			}
		}
		for (let index = 0; index < this.busData.length; index++) {
			const element = this.busData[index];
			if (element.auto_inc_id == bus) {
				return element.trainee_id
			}
		}
		return null;
	}
	busChange(){
		this.dataChange()
	}
	onSubmit(form) {
		//console.log(this.overAllData)
		let requestPreData = [];
		let Keys = Object.keys(this.overAllData);
		for (let index = 0; index < Keys.length; index++) {
			const dateKey = Keys[index];
			if (moment(dateKey, "D-M-YYYY").diff(moment(new Date(), "D-M-YYYY"), "days") >= 0) {
				let innerObjectKeys = Object.keys(this.overAllData[dateKey]);
				for (let index1 = 0; index1 < innerObjectKeys.length; index1++) {
					const busKey = innerObjectKeys[index1];
					let tempData = this.overAllData[dateKey][busKey];
					requestPreData.push({
						bus_details: busKey,
						date: dateKey,
						driver_id: this.overAllData[dateKey][busKey].driverName,
						conductor_id: this.overAllData[dateKey][busKey].conductorName,
						trainee_id: this.overAllData[dateKey][busKey].traineeName,
					})
				}
			}
		}
		let requestData = {
			data: requestPreData,
			flag:"addSchedulingDetails"
		}

		this.apiService.scheduling(requestData).subscribe((data) => {
			this.openSnackBar(data['message'])
			
			if (data['response'] == 'error') {
				this.load([])
			} else {
				this.cancel();
				form.resetForm();
				this.load(data['data']);
			}
			this.driverData = data['driverData'];
			this.conductorData = data['conductorData'];
			this.traineeData = data['traineeData'];
		});
	}
	edit(editData) {
		let contentDiv = document.getElementsByClassName('content')[0];
		contentDiv.scrollIntoView();
		this.submitBtnText = "Update Details";
		this.schedulingId = editData.id;
		this.busNumber = editData.bus_details
		this.routeFrom = editData.route_from;
		this.routeTo = editData.route_to;
		this.driverName = editData.driver_id;
		this.conductorName = editData.conductor_id;
		this.traineeName = editData.trainee_id;
		this.startDate = editData.start_date;
		this.endDate = editData.end_date;
	}
	getBusName(id){
		for (let index = 0; index < this.busData.length; index++) {
			if (this.busData[index].auto_inc_id == id) {
				return this.busData[index].bus_no
			}
			
		}
	}
	delete(deleteData) {
		this.confirmDialogRef = this.matDialog.open(FuseConfirmDialogComponent, { disableClose: false });
		this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure want to delete details?';
		this.confirmDialogRef.afterClosed().subscribe(result => {
			if (result) {
				let requestData = {
					flag: "deleteSchedulingDetails",
					id: deleteData.id,
				}
				this.apiService.scheduling(requestData).subscribe((data) => {
					this.openSnackBar(data['message']);
					this.driverData = data['driverData'];
					this.conductorData = data['conductorData'];
					this.traineeData = data['traineeData'];
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
		this.selectedDates = [];
		this.overAllData = {};
		this.submitBtnText = "Add Details";
		this.busNumber = null;
		this.startDate = null;
		this.endDate = null;
		this.routeFrom = null;
		this.routeTo = null;
		this.driverName = null;
		this.conductorName = null;
		this.traineeName = null;
		this.schedulingId = null;
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
