import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms'; // Import ReactiveFormsModule and form classes
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isLoginView = true;

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]), // Example: Minimum password length
    repeatPassword: new FormControl('', Validators.required)
  }, { validators: this.passwordsMatchValidator }); // Add custom validator for password match

  // Custom validator function
  passwordsMatchValidator(form: AbstractControl): { [key: string]: any } | null {
    const password = form.get('password');
    const repeatPassword = form.get('repeatPassword');
    // Check if controls exist and if passwords match
    return password && repeatPassword && password.value === repeatPassword.value ? null : { passwordsMismatch: true };
  }

  toggleView(): void {
    this.isLoginView = !this.isLoginView;
    // Reset forms when switching views
    this.loginForm.reset();
    this.registerForm.reset();
  }

  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Login data:', this.loginForm.value);
      // TODO: Implement actual login logic (e.g., call an API service)
    } else {
      console.log('Login form is invalid');
      this.loginForm.markAllAsTouched();
    }
  }

  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Registration data:', this.registerForm.value);
      // TODO: Implement actual registration logic (e.g., call an API service)
    } else {
      console.log('Registration form is invalid');
       // Check specifically for the password mismatch error
       if (this.registerForm.errors?.['passwordsMismatch']) {
        console.log('Passwords do not match');
        // Optionally, set an error on the repeatPassword control to display a specific message
        this.registerForm.get('repeatPassword')?.setErrors({ passwordsMismatch: true });
      }
      this.registerForm.markAllAsTouched();
    }
  }
}
