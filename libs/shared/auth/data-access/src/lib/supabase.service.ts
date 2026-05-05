import { inject, Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './supabase.tokens';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly client: SupabaseClient = createClient(
    inject(SUPABASE_URL),
    inject(SUPABASE_ANON_KEY)
  );

  private readonly _session$ = new BehaviorSubject<Session | null>(null);

  readonly session$: Observable<Session | null> = this._session$.asObservable();

  constructor() {
    this.client.auth.getSession().then(({ data }) => {
      this._session$.next(data.session);
    });

    this.client.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      this._session$.next(session);
    });
  }

  get currentSession(): Session | null {
    return this._session$.getValue();
  }

  signIn(email: string, password: string) {
    return this.client.auth.signInWithPassword({ email, password });
  }

  signOut() {
    return this.client.auth.signOut();
  }
}
