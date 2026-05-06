import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, SupabaseService } from '@kultur-hub/shared/auth/data-access';
import { OrganisationsStore } from '@kultur-hub/portal/domain';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'lib-portal-header',
  imports: [ButtonModule, PopoverModule, DividerModule],
  templateUrl: './portal-header.html',
  styleUrl: './portal-header.scss',
})
export class PortalHeader {
  private readonly router = inject(Router);
  private readonly supabase = inject(SupabaseService);
  protected readonly userService = inject(UserService);
  protected readonly store = inject(OrganisationsStore);

  async logout(): Promise<void> {
    await this.supabase.signOut();
    this.userService.clear();
    this.router.navigate(['/login']);
  }
}
