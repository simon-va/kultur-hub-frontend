import { Component, inject, signal } from '@angular/core';
import { NavigationError, Router, RouterOutlet } from '@angular/router';
import { PortalHeader } from '../portal-header/portal-header';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'lib-portal-shell',
  imports: [RouterOutlet, PortalHeader, ButtonModule],
  templateUrl: './portal-shell.html',
  styleUrl: './portal-shell.scss',
})
export class PortalShell {
  private readonly router = inject(Router);
  protected readonly loadError = signal(false);

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationError) {
        this.loadError.set(true);
      }
    });
  }

  protected retryNavigation(): void {
    this.loadError.set(false);
    this.router.navigateByUrl(this.router.url);
  }
}
