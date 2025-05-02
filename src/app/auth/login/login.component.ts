import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Importar Router
import { AuthenticationService } from '../../services/authentication.service'; 
import { User } from '../../models/user'; 

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
  loginError: string | null = null; // Para mostrar errores de login
  registerError: string | null = null; // Para mostrar errores de registro

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    repeatPassword: new FormControl('', Validators.required)
  }, { validators: this.passwordsMatchValidator });

  // Inyectar AuthenticationService y Router
  constructor(
    private authService: AuthenticationService,
    private router: Router // Inyectar Router
  ) {}

  passwordsMatchValidator(form: AbstractControl): { [key: string]: any } | null {
    const password = form.get('password');
    const repeatPassword = form.get('repeatPassword');
    // Check if controls exist and if passwords match
    return password && repeatPassword && password.value === repeatPassword.value ? null : { passwordsMismatch: true };
  }

  toggleView(): void {
    this.isLoginView = !this.isLoginView;
    this.loginForm.reset();
    this.registerForm.reset();
    this.loginError = null; // Limpiar errores al cambiar de vista
    this.registerError = null; // Limpiar errores al cambiar de vista
  }

  onLoginSubmit(): void {
    this.loginError = null; 
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      console.log('Sending login credentials:', credentials); 
      this.authService.login(credentials).subscribe({
        next: (response) => { // La respuesta es procesada por el 'tap' en el servicio
          console.log('Login successful, state saved.');
          // Redirigir a la página de inicio
          this.router.navigate(['/']); 
        },
        error: (err) => {
          console.error('Login failed:', err);
          // Usar el mensaje de error del servicio si existe, o uno genérico
          this.loginError = err.message.includes('Invalid response format') 
            ? 'Error inesperado en la respuesta del servidor.' 
            : 'Usuario o contraseña incorrectos.';
        }
      });
    } else {
      console.log('Login form is invalid');
      this.loginForm.markAllAsTouched();
    }
  }

  onRegisterSubmit(): void {
    this.registerError = null; // Resetear error
    if (this.registerForm.valid) {
      // Extraer solo username y password para enviar
      const { username, password } = this.registerForm.value;
      const userData = { username, password }; 
      console.log('Sending registration data:', userData); // Log registration data
      this.authService.register(userData).subscribe({
        next: (user: User) => {
          console.log('Registration successful:', user);
          // TODO: Opcionalmente loguear al usuario automáticamente, mostrar mensaje, redirigir
          // Ejemplo: Podrías llamar a login aquí o mostrar un mensaje de éxito y pedir que inicie sesión.
          this.toggleView(); // Cambiar a la vista de login después del registro exitoso
        },
        error: (err) => {
          console.error('Registration failed:', err);
          this.registerError = 'Error al registrar el usuario. Inténtalo de nuevo.'; // Mensaje genérico
           // TODO: Manejar errores específicos (ej: usuario ya existe) si la API los provee
        }
      });
    } else {
      console.log('Registration form is invalid');
      if (this.registerForm.errors?.['passwordsMismatch']) {
        console.log('Passwords do not match');
        this.registerForm.get('repeatPassword')?.setErrors({ passwordsMismatch: true });
      }
      this.registerForm.markAllAsTouched();
    }
  }
}
