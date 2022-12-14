import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  validateForm() {
    if (!this.loginForm.value.username || !this.loginForm.value.password) {
      alert('All fields must be filled');
      return false;
    }
    return true;
  }

  onSubmit() {
    this.submitted = true;

    if (!this.validateForm() && this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService
      .login(this.f['username'].value, this.f['password'].value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate(['chat'], {
            queryParams: { code: data.code },
          });
        },
        (error) => {
          this.loading = false;
        }
      );
  }

  loginViaGoogle() {
    this.authenticationService.loginViaGoogle();
  }
}
