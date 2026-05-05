import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, EMPTY, map, switchMap, filter, take, tap } from 'rxjs';
import { Client } from '@kultur-hub/shared/api';
import { SupabaseService } from './supabase.service';
import { User } from '@kultur-hub/shared/domain';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly client = inject(Client);
  private readonly supabase = inject(SupabaseService);

  readonly currentUser = signal<User | null>(null);

  private readonly _ready$ = new BehaviorSubject<boolean>(false);
  readonly ready$ = this._ready$.asObservable();

  constructor() {
    this.supabase.initialized$.pipe(
      filter(Boolean),
      take(1),
      switchMap(() => {
        if (!this.supabase.currentSession) {
          this._ready$.next(true);
          return EMPTY;
        }
        return this.loadCurrentUser();
      })
    ).subscribe();
  }

  loadCurrentUser() {
    this._ready$.next(false);
    const userId = this.supabase.currentSession!.user.id;
    return this.client.users(userId).pipe(
      map((res) => ({
        id: res.userId,
        firstName: res.firstName,
        lastName: res.lastName,
        email: this.supabase.currentSession?.user?.email ?? '',
        isAdmin: res.isAdmin,
        organizationMemberships: [],
      } satisfies User)),
      tap((user) => {
        this.currentUser.set(user);
        this._ready$.next(true);
      })
    );
  }

  isAdmin(): boolean {
    return this.currentUser()?.isAdmin ?? false;
  }

  clear(): void {
    this.currentUser.set(null);
    this._ready$.next(true);
  }
}
