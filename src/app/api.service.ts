import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	constructor(private http: HttpClient) { }
	baseURL = 'http://snbgroup.in/spb/superadmin/';
	login(data) {
		let Url = this.baseURL + 'login.php';
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
		return this.http.post(Url, data, httpOptions)
	}
	dashboard(data) {
		let Url = this.baseURL + 'dashboardController.php';
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
		return this.http.post(Url, data, httpOptions)
	}
	department(data) {
		let Url = this.baseURL + 'departmentController.php';
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
		return this.http.post(Url, data, httpOptions)
	}
	service(data) {
		let Url = this.baseURL + 'serviceController.php';
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
		return this.http.post(Url, data, httpOptions)
	}
	serviceChecklist(data) {
		let Url = this.baseURL + 'serviceChecklistController.php';
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
		return this.http.post(Url, data, httpOptions)
	}
	
	workshop(data) {
		let Url = this.baseURL + 'workshopController.php';
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
		return this.http.post(Url, data, httpOptions)
	}
	accident(data) {
		let Url = this.baseURL + 'accidentController.php';
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
		return this.http.post(Url, data, httpOptions)
	}
	purchase(data) {
		let Url = this.baseURL + 'purchaseController.php';
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
		return this.http.post(Url, data, httpOptions)
	}
	inventory(data) {
		let Url = this.baseURL + 'inventoryController.php';
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
		return this.http.post(Url, data, httpOptions)
	}
	designation(data) {
		let Url = this.baseURL + 'designationController.php';
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
		return this.http.post(Url, data, httpOptions)
	}
	wages(data) {
		let Url = this.baseURL + 'wagesModeController.php';
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
		return this.http.post(Url, data, httpOptions)
	}
	employee(data) {
		let Url = this.baseURL + 'employeeDetails.php';
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
		return this.http.post(Url, data, httpOptions)
	}
	bus(data) {
		let Url = this.baseURL + 'busController.php';
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
		return this.http.post(Url, data, httpOptions)
	}
	collection(data) {
		let Url = this.baseURL + 'collectionController.php';
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
		return this.http.post(Url, data, httpOptions)
	}
	expense(data) {
		let Url = this.baseURL + 'expenseController.php';
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
		return this.http.post(Url, data, httpOptions)
	}
	scheduling(data) {
		let Url = this.baseURL + 'schedulingController.php';
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
		return this.http.post(Url, data, httpOptions)
	}
	specialData(data) {
		let Url = this.baseURL + 'specialDaysController.php';
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
		return this.http.post(Url, data, httpOptions)
	}
	routeDetails(data) {
		let Url = this.baseURL + 'routeController.php';
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
		return this.http.post(Url, data, httpOptions)
	}
}
