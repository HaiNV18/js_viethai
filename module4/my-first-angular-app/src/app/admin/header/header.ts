import { Component, ElementRef, HostListener, inject, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  Bell,
  ChevronDown,
  LayoutGrid,
  LogOut,
  LucideAngularModule,
  Search,
  ShieldCheck,
  User,
} from 'lucide-angular';

@Component({
  selector: 'app-header',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly elementRef = inject(ElementRef);
  private readonly router = inject(Router);

  readonly ShieldCheck = ShieldCheck;
  readonly Search = Search;
  readonly Bell = Bell;
  readonly ChevronDown = ChevronDown;
  readonly User = User;
  readonly LogOut = LogOut;
  readonly LayoutGrid = LayoutGrid;

  isDropdownOpen = signal(false);
  profileSelected = output<void>();

  toggleDropdown(): void {
    this.isDropdownOpen.update((open) => !open);
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }

  onProfileClick(): void {
    this.closeDropdown();
    this.profileSelected.emit();
  }

  onLogout(): void {
    this.closeDropdown();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeDropdown();
  }
}

export { Header as HeaderComponent };
