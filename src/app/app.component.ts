import { Component } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { PubNubAngular } from "pubnub-angular2";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "app";

}
