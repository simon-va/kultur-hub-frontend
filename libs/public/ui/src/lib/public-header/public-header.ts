import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

const menuSlide = trigger('menuSlide', [
  transition(':enter', [
    style({ transform: 'translateX(-300px)', opacity: 0 }),
    animate('250ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ transform: 'translateX(-300px)', opacity: 0 })),
  ]),
]);

@Component({
  selector: 'lib-public-header',
  imports: [RouterLink, RouterLinkActive, ButtonModule, DividerModule],
  templateUrl: './public-header.html',
  styleUrl: './public-header.scss',
  animations: [menuSlide],
})
export class PublicHeader {
  private el = inject(ElementRef);
  menuOpen = signal(false);

  toggle(): void {
    this.menuOpen.update(open => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.menuOpen.set(false);
    }
  }
}
