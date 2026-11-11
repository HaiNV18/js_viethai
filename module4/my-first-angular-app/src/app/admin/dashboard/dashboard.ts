import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DollarSign,
  LucideAngularModule,
  Package,
  PlusCircle,
  ShoppingBag,
  TrendingUp,
  Users,
} from 'lucide-angular';

import { Header } from '../header/header';
import { Products } from '../products/products';
import { AdminMenuKey, Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  imports: [Header, Sidebar, Products, FormsModule, LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  readonly DollarSign = DollarSign;
  readonly ShoppingBag = ShoppingBag;
  readonly Package = Package;
  readonly Users = Users;
  readonly TrendingUp = TrendingUp;
  readonly PlusCircle = PlusCircle;

  activeMenu = signal<AdminMenuKey>('dashboard');

  stats = [
    {
      label: 'Tổng doanh thu',
      value: '128.5M₫',
      change: '+14.2% so với tháng trước',
      icon: DollarSign,
      tone: 'blue',
    },
    {
      label: 'Đơn hàng mới',
      value: '342',
      change: '+8.4% tuần này',
      icon: ShoppingBag,
      tone: 'emerald',
    },
    {
      label: 'Tổng sản phẩm',
      value: '1,248',
      change: '12 sản phẩm sắp hết kho',
      icon: Package,
      tone: 'amber',
    },
    {
      label: 'Khách hàng mới',
      value: '1,890',
      change: '+21.0% tăng trưởng',
      icon: Users,
      tone: 'purple',
    },
  ];

  recentOrders = [
    { id: 'ORD-9041', customer: 'Trần Hoàng Nam', total: '2.490.000₫', status: 'Hoàn tất' },
    { id: 'ORD-9040', customer: 'Lê Thu Hà', total: '3.850.000₫', status: 'Đang giao' },
    { id: 'ORD-9039', customer: 'Nguyễn Quốc Bảo', total: '1.690.000₫', status: 'Hoàn tất' },
    { id: 'ORD-9038', customer: 'Phạm Minh Châu', total: '4.300.000₫', status: 'Chờ xử lý' },
  ];

  storeName = 'NovaMart Official Store';
  supportEmail = 'support@novamart.vn';
  maintenanceMode = false;

  onMenuChange(menu: AdminMenuKey): void {
    this.activeMenu.set(menu);
  }

  onProductModeChange(mode: 'list' | 'insert'): void {
    this.activeMenu.set(mode === 'insert' ? 'products-insert' : 'products-list');
  }

  openProfile(): void {
    this.activeMenu.set('profile');
  }
}
