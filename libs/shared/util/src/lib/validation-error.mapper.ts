import { FormGroup } from '@angular/forms';

export function mapValidationErrorsToForm(
  form: FormGroup,
  errors: Record<string, string[]>
): void {
  for (const [field, messages] of Object.entries(errors)) {
    const control = form.get(field);
    if (control) {
      control.setErrors({ serverError: messages.join(' ') });
    }
  }
}
