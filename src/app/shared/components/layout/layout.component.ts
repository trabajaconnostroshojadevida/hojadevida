import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NavbarComponent],
  template: `
    <div class="flex h-screen bg-background text-text-primary overflow-hidden">
      <app-sidebar [isOpen]="isSidebarOpen" (close)="isSidebarOpen = false"></app-sidebar>
      
      <div class="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 md:ml-64">
        <app-navbar (toggleSidebar)="toggleSidebar()"></app-navbar>
        
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 md:p-8 relative">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class LayoutComponent {
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
