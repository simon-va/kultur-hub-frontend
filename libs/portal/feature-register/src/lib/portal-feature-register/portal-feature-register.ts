import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { SignUpRequest } from '@kultur-hub/shared/domain';

@Component({
  selector: 'lib-register-page',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule, MessageModule],
  templateUrl: './portal-feature-register.html',
  styleUrl: './portal-feature-register.scss',
})
export class RegisterPage {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    invitationCode: ['', Validators.required],
  });

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    const body: SignUpRequest = this.form.getRawValue();

    this.http.post('/api/signup', body).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => {
        this.errorMessage.set('Registrierung fehlgeschlagen. Bitte prüfe deinen Einladungslink.');
        this.loading.set(false);
      },
    });
  }
}
