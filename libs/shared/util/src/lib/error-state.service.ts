import { computed, Injectable, signal } from '@angular/core';
import { ApplicationError } from '@kultur-hub/shared/domain';

@Injectable({ providedIn: 'root' })
export class ErrorStateService {
  private readonly _error = signal<ApplicationError | null>(null);

  readonly error = computed(() => this._error());
  readonly hasError = computed(() => this._error() !== null);

  showError(message: string, statusCode?: number): void {
    this._error.set({ message, statusCode });
  }

  showValidationErrors(
    message: string,
    validationErrors: Record<string, string[]>,
    statusCode?: number
  ): void {
    this._error.set({ message, statusCode, validationErrors });
  }

  clearError(): void {
    this._error.set(null);
  }
}
