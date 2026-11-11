import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordComponent {
  email = '';
  isSubmitted = signal(false);

  onResetPassword(): void {
    if (!this.email) return;
    console.log('Yêu cầu đặt lại mật khẩu cho:', this.email);
    this.isSubmitted.set(true);
  }
}
