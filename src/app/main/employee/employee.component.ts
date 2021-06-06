import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-employee',
	templateUrl: './employee.component.html',
	styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

	@ViewChild('imageInput')
	imageInput: ElementRef;

	horizontalPosition: MatSnackBarHorizontalPosition = 'center';
	verticalPosition: MatSnackBarVerticalPosition = 'top';
	departmentData = [];
	designationData = [];
	wagesData = []
	filteredDesignation = [];
	filteredWages = [];
	designation = null;
	department = null;
	wageMode = null;
	employeeId = null;
	employeeName :String = null;
	doj = null;
	salary = null;
	salaryAdvance = null;
	advanceAmount = null;
	bloodGroup: String = null;
	aadharNumber = null;
	licenseNumber: String = "";
	address: String = null;
	licenseExpiry: String = null;
	insurancePolicyCompany: String = null;
	policyNumber: String = null;
	accountNumber = null;
	bankName: String = null;
	ifscNumber: String = null;
	employeeMobile: String = null;
	contactRelation: String = null;
	contactName: String = null;
	contactMobile: String = null;
	commisionAmount: String = null;
	experience = null;
	yearsExperience: String = null;
	previousEmployer: String = null;

	imageUrl : any;
	imageUploadFlag : Boolean = false;

	branchName: String = null;
	displayedColumns: string[] = ['sno', 'employee_name', 'department_name', 'designation_name', 'doj', 'advance', 'salary', 'salary_advance', 'action'];
	dataSource = new MatTableDataSource<any>();
	employeeBtnText = "Add Employee";
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
			flag: "getEmployees",
		}
		this.apiService.employee(requestData).subscribe((data) => {
			this.departmentData = data['departmentData'];
			this.designationData = data['designationData'];
			this.wagesData = data['wagesData'];
			this.filteredWages = data['wagesData'];
			this.filteredDesignation = data['designationData'];
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
	getDepartmentName(department_id) {
		let data = "";
		this.departmentData.forEach(element => {
			if (element.id == department_id) {
				data = element['department_name'];
				return;
			}
		});
		return data;
	}
	getDesignationName(designation_id) {
		let data = "";
		this.designationData.forEach(element => {
			if (element.id == designation_id) {
				data = element['designation_name'];
				return;
			}
		});
		return data;
	}
	departmentChange(newObj): void {
		let filteredDesignation = [];
		if (this.department && this.department != null) {
			this.designationData.forEach(element => {
				if (element.department_id.split(",").includes(this.department)) {
					filteredDesignation.push(element);
				}
			});
		} else {
			filteredDesignation = [];
		}
		this.filteredDesignation = filteredDesignation;
	}
	designationChange(newObj){
		let filteredWages = []
		if (this.designation && this.designation != null) {
			this.wagesData.forEach(element => {
				if (element.designation_id == this.designation) {
					filteredWages.push(element);
				}
			});
		} else {
			filteredWages = [];
		}
		this.filteredWages = filteredWages;
	}

	uploadedFile(event: any): void {
		if (event.target.files.length > 0) {
			const file = event.target.files[0];
			const reader = new FileReader();
			reader.onload = (e) =>{
				this.imageUrl = reader.result;
				this.imageUploadFlag = true;
			} 
			reader.readAsDataURL(file);
		}
	}

	onSubmit(form) {
		let requestData = {
			employee_name:this.employeeName,
			employee_mobile :this.employeeMobile,
			department_id:this.department,
			designation_id:this.designation,
			doj:this.doj,
			wages_mode_id: this.wageMode,
			salary:this.salary,
			advance_amount:this.advanceAmount,
			salary_advance:this.salaryAdvance,
			blood_group:this.bloodGroup,
			aadhaar_number:this.aadharNumber,
			bank_ac_number:this.accountNumber,
			bank_name:this.bankName,
			bank_ifsc_code:this.ifscNumber,
			license_number:this.licenseNumber,
			license_exp_date:this.licenseExpiry,
			insurance_company:this.insurancePolicyCompany,
			policy_number:this.policyNumber,
			imageUrl: this.imageUrl,
			emergency_contact_name: this.contactName,
			emergency_contact_mobile: this.contactMobile,
			emergency_contact_relation: this.contactRelation,
			address:this.address,
			commision : this.commisionAmount,
			previous_employer :this.previousEmployer,
			experience :this.experience,
			years_of_experience :this.yearsExperience,
			bank_branch: this.branchName
		};

		if(this.imageUploadFlag){
			requestData["imageUrl"] = this.imageUrl
		}

		if (this.employeeId != null) {
			requestData['flag']=  "updateEmployee";
			requestData['id'] =  this.employeeId;
		} else {
			requestData['flag'] = "addEmployee";
		}

		this.apiService.employee(requestData).subscribe((data) => {
			this.openSnackBar(data['message'])
			this.departmentData = data['departmentData'];
			this.designationData = data['designationData'];
			this.wagesData = data['wagesData'];
			this.filteredWages = data['wagesData'];
			this.filteredDesignation = data['designationData'];
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
	cancel() {
		this.employeeBtnText = "Add Employee";
		this.imageUploadFlag = false;
		this.department = null;
		this.designation = null;
		this.designation = null;
		this.department = null;
		this.wageMode = null;
		this.employeeId = null;
		this.employeeName = null;
		this.employeeMobile = null;
		this.doj = null;
		this.salary = null;
		this.salaryAdvance = null;
		this.advanceAmount = null;
		this.bloodGroup = null;
		this.aadharNumber = null;
		this.licenseNumber = null;
		this.licenseExpiry = null;
		this.insurancePolicyCompany = null;
		this.policyNumber = null;
		this.accountNumber = null;
		this.bankName = null;
		this.ifscNumber = null;
		this.contactMobile = null;
		this.contactName = null;
		this.contactRelation = null;
		this.imageUrl = null;
		this.address= null;
		this.commisionAmount = null;
		this.experience = null;
		this.yearsExperience = null;
		this.previousEmployer = null;
		this.branchName = null;
		this.imageInput.nativeElement.value = "";
	}
	edit(editData) {
		let contentDiv = document.getElementsByClassName('content')[0];
		contentDiv.scrollIntoView();
		this.imageUploadFlag = false;
		this.department = editData.department_id;
		this.designation = editData.designation_id;
		this.wageMode = editData.wages_mode_id;
		this.employeeId = editData.id;
		this.employeeName = editData.employee_name;
		this.employeeMobile = editData.employee_mobile;
		this.doj = editData.doj_default;
		this.salary = editData.salary;
		this.salaryAdvance = editData.salary_advance;
		this.advanceAmount = editData.advance_amount;
		this.bloodGroup = editData.blood_group;
		this.aadharNumber = editData.aadhaar_number;
		this.licenseNumber = editData.license_number;
		this.licenseExpiry = editData.license_exp_date;
		this.insurancePolicyCompany = editData.insurance_company;
		this.policyNumber = editData.policy_number;
		this.accountNumber = editData.bank_ac_number;
		this.bankName = editData.bank_name;
		this.ifscNumber = editData.bank_ifsc_code;
		this.contactMobile = editData.emergency_contact_mobile;
		this.contactName = editData.emergency_contact_name;
		this.contactRelation = editData.emergency_contact_relation;
		this.employeeBtnText = "Update Employee";
		this.imageUrl = editData.imageUrl;
		this.address = editData.address;
		this.commisionAmount = editData.commision;
		this.experience = editData.experience;
		this.yearsExperience = editData.years_of_experience;
		this.previousEmployer = editData.previous_employer;
		this.branchName = editData.bank_branch;
		this.departmentChange({});
		this.designationChange({});
	}

	delete(deleteData) {
		this.confirmDialogRef = this.matDialog.open(FuseConfirmDialogComponent, { disableClose: false });
		this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure want to delete Employee?';
		this.confirmDialogRef.afterClosed().subscribe(result => {
			if (result) {
				let requestData = {
					flag: "deleteEmployee",
					id: deleteData.id,
				}
				this.apiService.employee(requestData).subscribe((data) => {
					this.openSnackBar(data['message']);
					this.departmentData = data['departmentData'];
					this.designationData = data['designationData'];
					this.wagesData = data['wagesData'];
					this.filteredWages = data['wagesData'];
					this.filteredDesignation = data['designationData'];
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
	openSnackBar(message) {
		this.snackBar.open(message, 'Close', {
			duration: 5000,
			horizontalPosition: this.horizontalPosition,
			verticalPosition: this.verticalPosition,
		});
	}
}
