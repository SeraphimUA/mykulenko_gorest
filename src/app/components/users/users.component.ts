import { Component, OnInit } from '@angular/core';
import { UsersService, User, AddUser } from 'src/app/services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: User[] = [];

  page: number = 1;

  maxPages!: number;

  addResultMessage: string = "";

  constructor(private readonly usersService: UsersService, private readonly router: Router) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  canGoPrevious(): boolean {
    return !(this.page <= 1);
  }

  canGoNext(): boolean {
    return !(this.page >= this.maxPages);
  }

  previousPageClick() {
    if(this.canGoPrevious()) {
      this.page -= 1;
      this.loadUsers();
    }
  }

  nextPageClick() {
    if(this.canGoNext()) {
      this.page += 1;
      this.loadUsers();
    }
  }

  userDetails(id: number){
    this.router.navigateByUrl(`/user/${id}`);
  }

  loadUsers() {
    console.log(`load users page ${this.page}`);
    this.usersService.getUsers(this.page)
      .subscribe((res: any) => {
        this.maxPages = res.meta.pagination.pages;
        this.users = res.data;
      })
  }

  addUser(newUser: AddUser): void {
    console.log(`UsersComponent ${newUser}`);
    this.usersService.addUser(newUser).subscribe(() => {
      console.log("New user added");
      this.addResultMessage = "New user added";
      this.loadUsers();
    });
  }

}
