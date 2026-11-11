import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  oldPrice?: string;
  badge?: string;
  image: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  categories = ['Tất cả', 'Tai nghe & Âm thanh', 'Đồng hồ thông minh', 'Phụ kiện công nghệ', 'Balo & Túi'];

  products: Product[] = [
    {
      id: 1,
      name: 'Tai nghe chống ồn Studio Pro X',
      category: 'Tai nghe & Âm thanh',
      price: '2.490.000₫',
      oldPrice: '3.190.000₫',
      badge: '-22%',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    },
    {
      id: 2,
      name: 'Đồng hồ thông minh Pulse Fit 5',
      category: 'Đồng hồ thông minh',
      price: '3.850.000₫',
      badge: 'Mới',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    },
    {
      id: 3,
      name: 'Giày chạy bộ AeroRun Cloud',
      category: 'Thời trang thể thao',
      price: '1.790.000₫',
      oldPrice: '2.100.000₫',
      badge: 'Bán chạy',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    },
    {
      id: 4,
      name: 'Máy ảnh lấy liền RetroCam Mini',
      category: 'Nhiếp ảnh',
      price: '2.150.000₫',
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80',
    },
  ];
}
