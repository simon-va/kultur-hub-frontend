import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthClient, SignUpRequest } from '@kultur-hub/shared/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'lib-register-page',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule],
  templateUrl: './portal-feature-register.html',
  styleUrl: './portal-feature-register.scss',
})
export class RegisterPage {
  private readonly authClient = inject(AuthClient);
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

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.loading.set(true);

    try {
      const body = new SignUpRequest(this.form.getRawValue());
      await lastValueFrom(this.authClient.signUp(body));
      this.router.navigate(['/login']);
    } finally {
      this.loading.set(false);
    }
  }
}
