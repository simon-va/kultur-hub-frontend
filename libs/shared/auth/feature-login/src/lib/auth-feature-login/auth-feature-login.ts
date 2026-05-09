import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService, UserService } from '@kultur-hub/shared/auth/data-access';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'lib-login-page',
  imports: [ReactiveFormsModule, ButtonModule, CardModule, InputTextModule, PasswordModule, MessageModule],
  templateUrl: './auth-feature-login.html',
  styleUrl: './auth-feature-login.scss',
})
export class LoginPage {
  private readonly supabase = inject(SupabaseService);
  private readonly userService = inject(UserService);
  protected readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.form.getRawValue();
    const { error } = await this.supabase.signIn(email, password);

    if (error) {
      this.errorMessage.set('E-Mail oder Passwort ungültig.');
      this.loading.set(false);
      return;
    }

    this.userService.loadCurrentUser().pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (user) => {
        const target = user.isAdmin ? '/admin' : '/portal';
        this.router.navigate([target]);
      },
    });
  }
}
