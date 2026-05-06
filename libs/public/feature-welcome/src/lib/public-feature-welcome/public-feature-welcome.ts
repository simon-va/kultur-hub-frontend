import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'lib-public-feature-welcome',
  imports: [ButtonModule, RouterLink],
  templateUrl: './public-feature-welcome.html',
  styleUrl: './public-feature-welcome.scss',
})
export class PublicFeatureWelcome {}
