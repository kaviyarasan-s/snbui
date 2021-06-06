import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Router } from "@angular/router";
import { ApiService } from '../../api.service';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: String;

  /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };
  }
  ngOnInit(): void {
	  if (localStorage.getItem('SPB_SUPERADMIN_DATA') != null) {
      this.router.navigate(["home"]);
    }
    this.loginForm = this._formBuilder.group({
      user_name: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', Validators.required]
    });
  }
  resetErrorMessage() {
    this.errorMessage = '';
  }
  onSubmit() {
	  this.apiService.login(this.loginForm.value)
      .subscribe((data) => {
        if (data['response'] == 'error')
          this.errorMessage = data['message'];
        else {
			localStorage.setItem('SPB_SUPERADMIN_DATA', JSON.stringify(data['userData']));
          this.router.navigate(["home"]);
        }
      });
  }
}
