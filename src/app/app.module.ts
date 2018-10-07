import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { PubNubAngular } from "pubnub-angular2";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { TicTacToeComponent } from "./tic-tac-toe/tic-tac-toe.component";

@NgModule({
  declarations: [AppComponent, TicTacToeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule
  ],
  providers: [PubNubAngular],
  bootstrap: [AppComponent]
})
export class AppModule {}
