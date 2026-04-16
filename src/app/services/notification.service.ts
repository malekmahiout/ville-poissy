import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert';
  date: string;
  read: boolean;
}

const NOTIF_KEY = 'poissy_notifications';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications: AppNotification[] = [];
  unreadCount$ = new BehaviorSubject<number>(0);

  constructor() {
    this.loadNotifications();
  }

  private loadNotifications(): void {
    try {
      const data = localStorage.getItem(NOTIF_KEY);
      this.notifications = data ? JSON.parse(data) : this.getSampleNotifications();
    } catch {
      this.notifications = this.getSampleNotifications();
    }
    this.updateUnreadCount();
  }

  private getSampleNotifications(): AppNotification[] {
    return [
      {
        id: '1',
        title: 'Travaux rue du Maréchal Foch',
        message: 'Des travaux de voirie auront lieu du 25 au 30 mars. Circulation alternée.',
        type: 'info',
        date: new Date().toISOString(),
        read: false,
      },
      {
        id: '2',
        title: 'Alerte canicule',
        message: 'Vague de chaleur prévue ce weekend. Le centre d\'accueil climatisé est ouvert.',
        type: 'warning',
        date: new Date(Date.now() - 3600000).toISOString(),
        read: false,
      },
      {
        id: '3',
        title: 'Fête de quartier - Place du Marché',
        message: 'La fête de quartier se tiendra samedi prochain à partir de 14h.',
        type: 'info',
        date: new Date(Date.now() - 86400000).toISOString(),
        read: true,
      },
    ];
  }

  private updateUnreadCount(): void {
    this.unreadCount$.next(this.notifications.filter(n => !n.read).length);
  }

  getAll(): AppNotification[] {
    return [...this.notifications].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  markAsRead(id: string): void {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      localStorage.setItem(NOTIF_KEY, JSON.stringify(this.notifications));
      this.updateUnreadCount();
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(this.notifications));
    this.updateUnreadCount();
  }
}
