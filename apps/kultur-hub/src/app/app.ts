import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppErrorToast } from './app-error-toast/app-error-toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppErrorToast],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
