import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from '../../date.adapter';
@Component({
	selector: 'app-collection-details',
	templateUrl: './collection-details.component.html',
	styleUrls: ['./collection-details.component.scss'],
	providers: [
		{
			provide: DateAdapter, useClass: AppDateAdapter
		}, {
			provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
		}
	]
})
export class CollectionDetailsComponent implements OnInit {
	horizontalPosition: MatSnackBarHorizontalPosition = 'center';
	verticalPosition: MatSnackBarVerticalPosition = 'top';
	date = new Date();
	busNumber: any;
	driverName: any;
	conductorName: any;
	collectionAmount: any;
	startTicketNo: any;
	endTicketNo: any;
	startKilometer: any;
	endKilometer: any;
	collectionInspector: any;
	routeDetails:any;
	driverData: any;
	conductorData: any;
	noTrips :any;
	specialDay: any;
	daysData: any;
	routeData: any;


	displayedColumns: string[] = ['sno', 'entry_date', 'bus_name', "ticket", "kilometer", 'collection_amount', 'action'];
	dataSource = new MatTableDataSource<any>();
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
	busData: any;
	collectionId: any;
	connectionCharges: any;
	totalLuggages: any;
	tripData: any[];
	machineId: any;


	constructor(
		private apiService: ApiService,
		public snackBar: MatSnackBar,
		public matDialog: MatDialog,
	) { }

	ngOnInit() {
		let requestData = {
			flag: "getCollectionDetails",
		}
		this.apiService.collection(requestData).subscribe((data) => {
			this.driverData = data['driverData'];
			this.routeData = data['routeData'];
			this.conductorData = data['conductorData'];
			this.busData = data['busData'];
			this.daysData = data['daysData'];
			if (data['response'] == 'error') {
				this.load([])
			} else {
				this.load(data['data']);
			}
		});
	}

	busChange(){
		this.busData.map((data, index)=>{
			if (data.auto_inc_id == this.busNumber) {
				this.noTrips = data.no_trips;
				this.calculateTrip();
			}
		})
	}
	calculateTrip(){
		let tempObject = new Array(parseInt(this.noTrips));
		for (let index = 0; index < this.noTrips; index++) {
			tempObject[index] = {
				fullTicket: null,
				halfTicket: null,
				lCount: null,
				pCount: null,
				totalTripAmount: null,
				imageUrl :null
			};
		}
		this.tripData = tempObject;
	}

	dataChange(){
		let tempAmount = 0;
		let tempCount = 0;
		for (let index = 0; index < this.noTrips; index++) {
			if (this.tripData[index].totalTripAmount) {
				tempAmount += this.tripData[index].totalTripAmount;
			}
			if (this.tripData[index].lCount){
				tempCount += this.tripData[index].lCount;
			}
		}
		if(this.connectionCharges){
			tempAmount += this.connectionCharges;
		}
		this.totalLuggages = tempCount|| null;
		this.collectionAmount = tempAmount;
	}
	edit(editData) {
		let contentDiv = document.getElementsByClassName('content')[0];
		contentDiv.scrollIntoView();
		this.date = editData.entry_date;
		this.busNumber = editData.bus_details;
		this.driverName = editData.driver_id;
		this.conductorName = editData.conductor_id;
		this.collectionAmount = parseInt(editData.collection_amount);
		this.startTicketNo = parseInt(editData.start_ticket_no);
		this.endTicketNo = parseInt(editData.end_ticket_no);
		this.startKilometer = parseInt(editData.start_kilometer);
		this.endKilometer = parseInt(editData.end_kilometer);
		this.collectionInspector = editData.collection_inspector_name;
		this.totalLuggages = parseInt(editData.luggages) ? parseInt(editData.luggages):null;
		this.connectionCharges = parseInt(editData.connection);
		this.collectionId = editData.id;
		this.machineId = editData.machine_id;
		this.specialDay = editData.special_days;
		this.routeDetails = editData.route_details;
		this.noTrips = parseInt(editData.no_trips);
		
		if (editData.trip_data) {
			this.tripData = JSON.parse(editData.trip_data);
			this.dataChange();
		}else{
			this.busChange();
		}
	}
	delete(deleteData) {
		this.confirmDialogRef = this.matDialog.open(FuseConfirmDialogComponent, { disableClose: false });
		this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure want to delete collection details?';
		this.confirmDialogRef.afterClosed().subscribe(result => {
			if (result) {
				let requestData = {
					flag: "deleteCollectionDetails",
					id: deleteData.id,
				}
				this.apiService.collection(requestData).subscribe((data) => {
					this.openSnackBar(data['message']);
					this.driverData = data['driverData'];
					this.routeData = data['routeData'];
					this.conductorData = data['conductorData'];
					this.busData = data['busData'];
					this.daysData = data['daysData'];
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

	onSubmit(form) {
		let requestData = {
			bus_details: this.busNumber,
			entry_date: this.date,
			driver_id: this.driverName,
			conductor_id: this.conductorName,
			start_ticket_no: this.startTicketNo,
			end_ticket_no: this.endTicketNo,
			start_kilometer: this.startKilometer,
			end_kilometer: this.endKilometer,
			collection_amount: this.collectionAmount,
			collection_inspector_name: this.collectionInspector,
			connection: this.connectionCharges,
			luggages: this.totalLuggages,
			machine_id: this.machineId,
			special_days: this.specialDay,
			no_trips : this.noTrips,
			route_details: this.routeDetails,
			trip_data : JSON.stringify(this.tripData),
		}

		if (this.collectionId != null) {
			requestData['flag'] = "updateCollectionDetails";
			requestData['id'] = this.collectionId;
		} else {
			requestData['flag'] = "addCollectionDetails";
		}

		this.apiService.collection(requestData).subscribe((data) => {
			this.openSnackBar(data['message'])
			this.driverData = data['driverData'];
			this.routeData = data['routeData'];
			this.conductorData = data['conductorData'];
			this.busData = data['busData'];
			this.daysData = data['daysData'];
			if (data['response'] == 'error') {
				this.load([])
			} else {
				this.cancel();
				form.resetForm();
				this.load(data['data']);
			}
		});
	}

	uploadedFile(event: any, index): void {
		if (event.target.files.length > 0) {
			const file = event.target.files[0];
			const reader = new FileReader();
			reader.onload = (e) => {
				this.tripData[index]["imageUrl"] = reader.result;
			}
			reader.readAsDataURL(file);
		}
	}
	cancel(){
		this.date = new Date();
		this.busNumber = null;
		this.driverName = null;
		this.conductorName = null;
		this.collectionAmount = null;
		this.startTicketNo = null;
		this.endTicketNo = null;
		this.startKilometer = null;
		this.endKilometer = null;
		this.collectionInspector = null;
		this.connectionCharges = null;
		this.totalLuggages = null;
		this.machineId = null;
		this.noTrips = 0;
		this.specialDay = null;
		this.routeDetails = null;
	}

	load(loadData) {
		loadData.forEach((element,index) => {
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
