import { Component, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Popover, PopoverModule } from 'primeng/popover';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'lib-public-header',
  imports: [RouterLink, RouterLinkActive, ButtonModule, PopoverModule, DividerModule],
  templateUrl: './public-header.html',
  styleUrl: './public-header.scss',
})
export class PublicHeader {
  @ViewChild('menu') menu!: Popover;

  toggle(event: Event): void {
    this.menu.toggle(event);
  }

  close(): void {
    this.menu.hide();
  }
}
