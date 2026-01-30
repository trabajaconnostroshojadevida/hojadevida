import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, map } from 'rxjs';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'customer' | 'admin';
  avatar_url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _currentUser = new BehaviorSubject<User | null>(null);
  private _userProfile = new BehaviorSubject<UserProfile | null>(null);

  constructor(private supabaseService: SupabaseService) {
    this.supabaseService.client.auth.getSession().then(({ data: { session } }) => {
      this.handleAuthStateChange(session?.user ?? null);
    });

    this.supabaseService.client.auth.onAuthStateChange((_event, session) => {
      this.handleAuthStateChange(session?.user ?? null);
    });
  }

  private async handleAuthStateChange(user: User | null) {
    this._currentUser.next(user);
    if (user) {
      const { data } = await this.supabaseService.client
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      this._userProfile.next(data as UserProfile);
    } else {
      this._userProfile.next(null);
    }
  }

  get currentUser(): Observable<User | null> {
    return this._currentUser.asObservable();
  }

  get userProfile(): Observable<UserProfile | null> {
    return this._userProfile.asObservable();
  }

  get isAdmin(): Observable<boolean> {
    return this._userProfile.pipe(map(profile => profile?.role === 'admin'));
  }

  async loginWithEmail(email: string, password: string): Promise<import('@supabase/supabase-js').AuthResponse> {
    return this.supabaseService.client.auth.signInWithPassword({
      email,
      password,
    });
  }

  async registerWithEmail(email: string, password: string, firstName: string = '', lastName: string = ''): Promise<import('@supabase/supabase-js').AuthResponse> {
    return this.supabaseService.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
  }

  async loginWithGoogle(): Promise<import('@supabase/supabase-js').OAuthResponse> {
    return this.supabaseService.client.auth.signInWithOAuth({
      provider: 'google',
    });
  }

  async resetPassword(email: string) {
    return this.supabaseService.client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
  }

  async logout(): Promise<{ error: AuthError | null }> {
    return this.supabaseService.client.auth.signOut();
  }

  async updateProfile(updates: Partial<UserProfile>) {
    const user = this._currentUser.value;
    if (!user) throw new Error('No user logged in');

    return this.supabaseService.client
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
  }
}
