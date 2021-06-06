import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ApiService } from '../../api.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	animations: fuseAnimations
})
export class HomeComponent implements OnInit {
	widget8 = {
		legend: false,
		explodeSlices: false,
		labels: true,
		doughnut: false,
		gradient: false,
		scheme: {
			domain: ['#f44336', '#9c27b0', '#03a9f4', '#e91e63', '#ffc107']
		},
		onSelect: (ev) => {
			// console.log(ev);
		}
	};
	busData: any;
	busNumber = "all";
	employees = 0;
	vehicle = 0;
	loadwidget8 = 0;
	totalExpense = 0
	allData = [];
	widgets = {
		'widget8': {
			'title': 'Expense',
			'mainChart': [
				{
					'name': 'Diesel',
					'value': 10
				},
				{
					'name': 'Beta',
					'value': 10
				},
				{
					'name': 'Special beta',
					'value': 10
				},
				{
					'name': 'Workshop',
					'value': 10
				},
				{
					'name': 'Pooja',
					'value': 10
				},
				{
					'name': 'Clearance',
					'value': 10
				},
				{
					'name': 'Cleaning',
					'value': 10
				},
				{
					'name': 'Other',
					'value': 10
				},
				{
					'name': 'Agent',
					'value': 10
				}
			]
		},
		'widget10': {
			'title': 'Budget Details',
			'table': {
				'columns': [
					{
						'title': 'Bus No'
					},
					{
						'title': 'Collection'
					},
					{
						'title': 'Expense'
					},
					{
						'title': 'Remaining'
					}
				]
			}
		}
	}
	overallExpense: any;
	vehicleExpense: any;
	vehicleCollection: any;
	collection: any;
	buscount: number;
	lorry_count: number;
	constructor(
		private apiService: ApiService,
	) { }

	ngOnInit() {
		let requestData = {
			flag: "getDashboardDetails",
		}
		this.apiService.dashboard(requestData).subscribe((data) => {
			if (data["status"] == "success") {
				this.busData = data['vehicle'];
				this.overallExpense = data["expense"];
				this.vehicleExpense = data["expense_vehicle"];
				this.collection = data["collection"];
				this.vehicleCollection = data["collection_vechicle"];
				this.totalExpense = 0;
				this.totalExpense += parseInt(data["expense"].diesel) || 0
				this.totalExpense += parseInt(data["expense"].beta) || 0
				this.totalExpense += parseInt(data["expense"].special_beta) || 0
				this.totalExpense += parseInt(data["expense"].workshop) || 0
				this.totalExpense += parseInt(data["expense"].pooja) || 0
				this.totalExpense += parseInt(data["expense"].clearance) || 0
				this.totalExpense += parseInt(data["expense"].cleaning) || 0
				this.totalExpense += parseInt(data["expense"].other) || 0
				this.totalExpense += parseInt(data["expense"].agent) || 0
				this.setExpenseData(data["expense"])
				this.employees = data["employees"];
				this.buscount = parseInt(data["bus_count"]) 
				this.lorry_count = parseInt(data["lorry_count"]) 
				this.vehicle = parseInt(data["two_wheeler_count"]) + parseInt(data["four_wheeler_count"]);
			}
		});
	}
	getCollection(bus_id){
		let collection = 0;
		this.vehicleCollection.forEach(element => {
			if (element.bus_details == bus_id) {
				collection =  element.collection
			}
		});
		return collection
	}
	getExpense(bus_id) {
		let expense = 0;
		this.vehicleExpense.forEach(element => {
			if (element.bus_details == bus_id) {
				expense += parseInt(element.diesel)  || 0
				expense += parseInt(element.beta)  || 0
				expense += parseInt(element.special_beta)  || 0
				expense += parseInt(element.workshop)  || 0
				expense += parseInt(element.pooja)  || 0
				expense += parseInt(element.clearance)  || 0
				expense += parseInt(element.cleaning)  || 0
				expense += parseInt(element.other)  || 0
				expense += parseInt(element.agent)  || 0
			}
		});
		return expense
	}
	getRemaining(bus_id){
		let collection = 0;
		let expense = 0;
		this.vehicleExpense.forEach(element => {
			if (element.bus_details == bus_id) {
				expense += parseInt(element.diesel) || 0
				expense += parseInt(element.beta) || 0
				expense += parseInt(element.special_beta) || 0
				expense += parseInt(element.workshop) || 0
				expense += parseInt(element.pooja) || 0
				expense += parseInt(element.clearance) || 0
				expense += parseInt(element.cleaning) || 0
				expense += parseInt(element.other) || 0
				expense += parseInt(element.agent) || 0
			}
		});
		this.vehicleCollection.forEach(element => {
			if (element.bus_details == bus_id) {
				collection =  element.collection
			}
		});
		return collection - expense
	}
	dataChange() {
		if (this.busNumber == "all") {
			this.setExpenseData(this.overallExpense)
		}else{
			this.vehicleExpense.forEach(element => {
				if (element.bus_details == this.busNumber) {
					this.setExpenseData(element)
				}
			});
			this.setExpenseData({})
		}
	}
	setExpenseData(data){
		this.loadwidget8 = 0;
		if (data.diesel && 
			data.beta && 
			data.special_beta && 
			data.workshop && 
			data.pooja && 
			data.clearance && 
			data.cleaning && 
			data.other&& 
			data.agent 
		) {
			this.widgets.widget8.mainChart[0].value = data.diesel == null ? 0 : data.diesel
			this.widgets.widget8.mainChart[1].value = data.beta == null ? 0 : data.beta
			this.widgets.widget8.mainChart[2].value = data.special_beta == null ? 0 : data.special_beta
			this.widgets.widget8.mainChart[3].value = data.workshop == null ? 0 : data.workshop
			this.widgets.widget8.mainChart[4].value = data.pooja == null ? 0 : data.pooja
			this.widgets.widget8.mainChart[5].value = data.clearance == null ? 0 : data.clearance
			this.widgets.widget8.mainChart[6].value = data.cleaning == null ? 0 : data.cleaning
			this.widgets.widget8.mainChart[7].value = data.other == null ? 0 : data.other
			this.widgets.widget8.mainChart[8].value = data.agent == null ? 0 : data.agent
			setTimeout(() => {
				this.loadwidget8 = 1;
			}, 500);			
		}else{
			this.loadwidget8 = 2;
		}

	}
}
