import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHandler } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as CryptoJS from 'crypto-js';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
}

export interface AddUser {
  name: string;
  email: string;
  gender: string;
  status: string;
}

export interface Response {
  meta: string;
  data: any;
}

export interface Post {
  id: number;
  user_id: number;
  title: string;
  body: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  url = environment.APIUrl;
  maxPages: number = 1;
  users: User[] = [];

  private getMd5(obj: any): string {
    const hash = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(obj));
    return hash.toString();
  }

  constructor(private readonly client: HttpClient) {}

  getUsers(page: number): Observable<{}> {
    const url = this.url + `users?page=${page}`;
    const hash = this.getMd5(url);

    for (let i = 0; i < localStorage.length; i++) {
      let checkValue = localStorage.getItem(`cache_${i + 1}`);
      if (checkValue) {
        const checkValueJSON = JSON.parse(checkValue);
        let checkPage = checkValueJSON.meta.pagination.page;
        if (page == checkPage) {
          const storageValueJSON = checkValueJSON;
          console.log(storageValueJSON);
          console.log('from storage');
          return of(storageValueJSON);
        }
      }
    }

    console.log('from api');
    return this.client.get(url).pipe(
      tap((data) => {
        const jsonData = JSON.stringify(data);
        if (localStorage.length < 5) {
          localStorage.setItem(`cache_${localStorage.length + 1}`, jsonData);
        } else {
          for (let i = 1; i <= 4; i++) {
            let transferData = localStorage.getItem(`cache_${i + 1}`);
            if (localStorage.getItem(`cache_${i}`) != null && transferData) {
              localStorage.setItem(`cache_${i}`, transferData);
            }
          }
          localStorage.setItem('cache_5', jsonData);
        }
      })
    );
  }

  getUser(id: number): Observable<{}> {
    return this.client.get(this.url + 'users/' + id, { observe: 'response' });
  }

  getUserPosts(user_id: number): Observable<{}> {
    return this.client.get(this.url + 'users/' + user_id + '/posts');
  }

  getMaxPages() {
    this.getUsers(1).subscribe((res: any) => {
      this.maxPages = res.meta.pagination.pages;
    });
  }

  getPage(id: number): number {
    this.getMaxPages();
    for (let page = 1; page <= this.maxPages; page++) {
      this.getUsers(page).subscribe((res: any) => {
        this.users = res.data;
      });
      for (let user of this.users) {
        if (id == user.id) {
          return page;
        }
      }
    }
    return 1;
  }

  addUser(newUser: AddUser): Observable<{}> {
    const url = this.url + 'users';
    console.log(`adding ${newUser}`);
    return this.client.post(url, newUser, {
      headers: { Authorization: `Bearer ${environment.APIToken}` },
    });
  }
}
