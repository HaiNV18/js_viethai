import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private router = inject(Router);

  // Dữ liệu gắn với form [(ngModel)]
  username = 'emilys';
  password = 'emilyspass';
  rememberMe = false;

  // Trạng thái giao diện
  isLoading = signal(false);
  errorMessage = signal('');

  onLogin(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
        expiresInMins: 30,
      }),
      // Lưu ý: Nếu trình duyệt báo lỗi CORS khi chạy ở localhost,
      // bạn có thể xóa dòng credentials: 'include' bên dưới đi.
      credentials: 'include',
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          // Ném lỗi nếu sai username/password (HTTP 400)
          throw new Error('Đăng nhập thất bại!');
        }
        return data;
      })
      .then((data) => {
        console.log('Đăng nhập thành công:', data);

        // Lưu token và thông tin user vào localStorage
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data));

        this.isLoading.set(false);

        // Chuyển hướng sang trang Dashboard
        this.router.navigate(['/dashboard']);
      })
      .catch((err: Error) => {
        console.error('Lỗi đăng nhập:', err);
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      });
  }
}
