import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { UsersService, User, Post } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent implements OnInit {

  user!: User;
  userPosts: Post[] = [];
  userPage!: number;

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly userService: UsersService) { }

  ngOnInit(): void {
    this.loadUser();
    this.userPage = this.userService.getPage(this.user.id);
  }

  loadUser() {
    const userId = this.getUserId() ?? 1;
    this.userService.getUser(+userId)
    .subscribe(
      ((res: any) => {
        console.log(res);
        this.user = res.body.data;
        this.loadPosts();
    }), ((err: any) => {
      let errorUser: User = {
        id: userId,
        name: "",
        email: "",
        gender: "male",
        status: "inactive"
      }
      console.log(err.error.data.message);
      console.log(`userId = ${userId}`);
      this.user = errorUser;
    }))
    
  }

  loadPosts() {
    this.userService.getUserPosts(this.user.id)
      .subscribe((res: any) => {
        this.userPosts = res.data;
        console.log(this.userPosts);
      }, (error => {
        console.log(error);
      }))
  }

  getUserId(): number | null {
    let number = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    return number;
  }

  getBack() {
    console.log(this.userPage);
    this.userService.getUsers(this.userPage);
  }

}
