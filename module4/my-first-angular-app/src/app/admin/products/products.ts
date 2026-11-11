import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Pencil, PlusCircle, Trash2 } from 'lucide-angular';

export interface AdminProductItem {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'Còn hàng' | 'Sắp hết';
}

@Component({
  selector: 'app-products',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  readonly PlusCircle = PlusCircle;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;

  mode = input<'list' | 'insert'>('list');
  modeChange = output<'list' | 'insert'>();

  products = signal<AdminProductItem[]>([
    {
      id: 101,
      name: 'Tai nghe chống ồn Studio Pro X',
      category: 'Âm thanh',
      price: 2490000,
      stock: 42,
      status: 'Còn hàng',
    },
    {
      id: 102,
      name: 'Đồng hồ thông minh Pulse Fit 5',
      category: 'Đồng hồ',
      price: 3850000,
      stock: 18,
      status: 'Còn hàng',
    },
    {
      id: 103,
      name: 'Bàn phím cơ không dây KeyNova K8',
      category: 'Phụ kiện',
      price: 1690000,
      stock: 5,
      status: 'Sắp hết',
    },
    {
      id: 104,
      name: 'Máy ảnh lấy liền RetroCam Mini',
      category: 'Nhiếp ảnh',
      price: 2150000,
      stock: 27,
      status: 'Còn hàng',
    },
  ]);

  newName = '';
  newCategory = 'Âm thanh';
  newPrice: number | null = null;
  newStock: number | null = 10;

  switchMode(target: 'list' | 'insert'): void {
    this.modeChange.emit(target);
  }

  onInsertProduct(): void {
    if (!this.newName.trim() || !this.newPrice) return;

    const stockValue = this.newStock ?? 0;
    const created: AdminProductItem = {
      id: Date.now() % 10000,
      name: this.newName.trim(),
      category: this.newCategory,
      price: Number(this.newPrice),
      stock: stockValue,
      status: stockValue > 5 ? 'Còn hàng' : 'Sắp hết',
    };

    this.products.update((list) => [created, ...list]);
    this.newName = '';
    this.newPrice = null;
    this.newStock = 10;
    this.modeChange.emit('list');
  }

  deleteProduct(id: number): void {
    this.products.update((list) => list.filter((item) => item.id !== id));
  }
}

export { Products as ProductsComponent };
