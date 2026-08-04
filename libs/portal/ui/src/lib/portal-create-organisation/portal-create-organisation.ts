import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrganisationsStore } from '@kultur-hub/portal/domain';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'lib-portal-create-organisation',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './portal-create-organisation.html',
  styleUrl: './portal-create-organisation.scss',
})
export class PortalCreateOrganisationPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly store = inject(OrganisationsStore);

  protected readonly loading = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading.set(true);
    try {
      await this.store.createOrganisation(this.form.getRawValue().name);
      this.router.navigate(['/portal']);
    } finally {
      this.loading.set(false);
    }
  }
}
