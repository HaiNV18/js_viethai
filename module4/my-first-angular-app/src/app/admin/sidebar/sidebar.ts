import { Component, input, output } from '@angular/core';
import {
  ChevronRight,
  LayoutDashboard,
  List,
  LucideAngularModule,
  Package,
  PlusCircle,
  Settings,
} from 'lucide-angular';

export type AdminMenuKey = 'dashboard' | 'products-list' | 'products-insert' | 'setting' | 'profile';

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly LayoutDashboard = LayoutDashboard;
  readonly Package = Package;
  readonly ChevronRight = ChevronRight;
  readonly List = List;
  readonly PlusCircle = PlusCircle;
  readonly Settings = Settings;

  activeMenu = input<AdminMenuKey>('dashboard');
  menuChange = output<AdminMenuKey>();

  selectMenu(menu: AdminMenuKey): void {
    this.menuChange.emit(menu);
  }

  isProductsActive(): boolean {
    const current = this.activeMenu();
    return current === 'products-list' || current === 'products-insert';
  }
}

export { Sidebar as SidebarComponent };
