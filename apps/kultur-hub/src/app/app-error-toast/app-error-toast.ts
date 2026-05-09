import { Component, effect, inject } from '@angular/core';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ErrorStateService } from '@kultur-hub/shared/util';

@Component({
  selector: 'app-error-toast',
  imports: [Toast],
  templateUrl: './app-error-toast.html',
})
export class AppErrorToast {
  private readonly messageService = inject(MessageService);
  private readonly errorState = inject(ErrorStateService);

  constructor() {
    effect(() => {
      const error = this.errorState.error();
      if (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Fehler',
          detail: error.message,
          life: 5000,
        });
        this.errorState.clearError();
      }
    });
  }
}
