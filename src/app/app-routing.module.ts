import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from "./components/app/app.component";
import { BrowserModule } from "@angular/platform-browser";
import { UsersComponent } from "./components/users/users.component";
import { UserItemComponent } from "./components/user-item/user-item.component";

const routes: Routes = [
  {
    path: '', component: UsersComponent, pathMatch: 'full'
  },
  {
    path: 'user/:id', component: UserItemComponent
  },
]

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
