import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService, SupabaseService } from '@kultur-hub/shared/auth/data-access';
import { Client } from '@kultur-hub/shared/api';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'lib-portal-shell',
  imports: [RouterOutlet, ButtonModule, PopoverModule, DividerModule],
  templateUrl: './portal-shell.html',
  styleUrl: './portal-shell.scss',
})
export class PortalShell {
  private readonly router = inject(Router);
  private readonly supabase = inject(SupabaseService);
  protected readonly userService = inject(UserService);
  protected readonly organisations = toSignal(inject(Client).organisationsAll(), { initialValue: [] });

  async logout(): Promise<void> {
    await this.supabase.signOut();
    this.userService.clear();
    this.router.navigate(['/login']);
  }
}
