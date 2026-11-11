import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class AboutComponent {
  stats = [
    { value: '50K+', label: 'Khách hàng tin dùng' },
    { value: '1,200+', label: 'Sản phẩm chính hãng' },
    { value: '99.4%', label: 'Đánh giá hài lòng' },
    { value: '24/7', label: 'Hỗ trợ tận tâm' },
  ];

  values = [
    {
      icon: '🚚',
      title: 'Giao hàng siêu tốc 2H',
      desc: 'Nhận hàng ngay trong ngày tại nội thành với đội ngũ vận chuyển chuyên nghiệp.',
    },
    {
      icon: '🛡️',
      title: 'Bảo hành chính hãng 100%',
      desc: 'Cam kết hoàn tiền 200% nếu phát hiện hàng giả, đổi trả miễn phí trong 30 ngày.',
    },
    {
      icon: '💳',
      title: 'Thanh toán an toàn',
      desc: 'Hỗ trợ trả góp 0%, ví điện tử, thẻ quốc tế và thanh toán khi nhận hàng (COD).',
    },
  ];



  total = 1000;

}
