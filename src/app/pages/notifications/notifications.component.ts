import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { NotificationService, AppNotification } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [MatIconModule, MatRippleModule, NgFor, NgIf, DatePipe],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  notifications: AppNotification[] = [];

  constructor(
    private notifService: NotificationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.notifications = this.notifService.getAll();
  }

  markAsRead(id: string): void {
    this.notifService.markAsRead(id);
    this.notifications = this.notifService.getAll();
  }

  markAllAsRead(): void {
    this.notifService.markAllAsRead();
    this.notifications = this.notifService.getAll();
  }

  getIcon(type: string): string {
    switch (type) {
      case 'warning': return 'warning';
      case 'alert': return 'error';
      default: return 'info';
    }
  }

  getColor(type: string): string {
    switch (type) {
      case 'warning': return '#F57C00';
      case 'alert': return '#D32F2F';
      default: return '#1565C0';
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
