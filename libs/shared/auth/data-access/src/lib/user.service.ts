import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { Client } from '@kultur-hub/shared/api';
import { SupabaseService } from './supabase.service';
import { User } from '@kultur-hub/shared/domain';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly client = inject(Client);
  private readonly supabase = inject(SupabaseService);

  readonly currentUser = signal<User | null>(null);

  loadCurrentUser() {
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
      tap((user) => this.currentUser.set(user))
    );
  }

  isAdmin(): boolean {
    return this.currentUser()?.isAdmin ?? false;
  }

  clear(): void {
    this.currentUser.set(null);
  }
}
