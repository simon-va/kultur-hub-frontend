import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrganisationsStore } from '@kultur-hub/portal/domain';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'lib-portal-create-organisation',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, MessageModule],
  templateUrl: './portal-create-organisation.html',
  styleUrl: './portal-create-organisation.scss',
})
export class PortalCreateOrganisationPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly store = inject(OrganisationsStore);

  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorMessage.set('');
    try {
      await this.store.createOrganisation(this.form.getRawValue().name);
      this.router.navigate(['/portal']);
    } catch {
      this.errorMessage.set('Die Organisation konnte nicht erstellt werden.');
    } finally {
      this.loading.set(false);
    }
  }
}
