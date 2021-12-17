import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AddUser } from 'src/app/services/users.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  formData = {
    name: '',
    email: '',
    gender: ''
  };

  constructor() { }

  ngOnInit(): void {
  }

  @Output() add = new EventEmitter<AddUser>();

  addMode = false;

  AddOn() {
    this.addMode = !this.addMode;
    console.log(this.addMode);
  }

  addUser() {
    const user: AddUser = {
      name: this.formData.name,
      email: this.formData.email,
      gender: this.formData.gender,
      status: 'active'
    };

    console.log(user);

    this.addMode = !this.addMode;
    console.log(this.addMode);

    this.add.emit(user);
  }

}
