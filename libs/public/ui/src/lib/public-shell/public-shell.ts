import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicHeader } from '../public-header/public-header';

@Component({
  selector: 'lib-public-shell',
  imports: [RouterOutlet, PublicHeader],
  templateUrl: './public-shell.html',
})
export class PublicShell {}
