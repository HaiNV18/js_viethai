import { Component, OnInit, signal } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar';

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  thumbnail: string;
}

@Component({
  selector: 'app-home',
  imports: [NavbarComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  // Signal lưu danh sách sản phẩm và trạng thái loading
  products = signal<Product[]>([]);
  isLoading = signal<boolean>(true);

  // OnInit lifecycle hook để gọi API khi component được khởi tạo
  ngOnInit(): void {
    fetch('https://dummyjson.com/products')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        this.products.set(data.products); // Lưu mảng data.products vào signal
        this.isLoading.set(false); // Tắt trạng thái loading
      })
      .catch((err) => {
        console.error('Lỗi khi gọi API:', err);
        this.isLoading.set(false);
      });
  }
}
