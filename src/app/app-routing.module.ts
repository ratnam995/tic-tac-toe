import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "tic-tac-toe/null"
  },
  {
    path:"tic-tac-toe/:playerId",
    component: TicTacToeComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
