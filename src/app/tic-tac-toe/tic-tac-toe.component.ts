import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { PubNubAngular } from "pubnub-angular2";

@Component({
  selector: "app-tic-tac-toe",
  templateUrl: "./tic-tac-toe.component.html",
  styleUrls: ["./tic-tac-toe.component.css"]
})
export class TicTacToeComponent implements OnInit {
  uuid = "";
  pubnub2;
  host: boolean = false;
  hostWon: boolean = false;
  otherWon: boolean = false;
  gameOver: boolean = false;
  gameStart: boolean = false;
  chanceHistory: any[] = [];
  opponentUrl = "";
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pubnub: PubNubAngular
  ) {}

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params && params.hasOwnProperty("playerId")) {
        if (params.playerId !== "null") {
          this.host = false;
          this.chanceHistory = [];
          this.pubnub2 = new PubNubAngular();
          this.pubnub2.getInstance("another").init({
            publishKey: "pub-c-86688a5b-9714-49c0-8529-2c158288f773",
            subscribeKey: "sub-c-5978d7dc-c9f2-11e8-b41d-e643bd6bdd68",
            uuid: params.playerId
          });

          this.pubnub2.getInstance("another").subscribe({
            channels: ["Channel-6lq5h0iu2"],
            withPresence: true
          });
          this.pubnub2.getInstance("another").addListener({
            status: statusEvent => {
              if (statusEvent.category === "PNConnectedCategory") {
                console.log("Status Event", statusEvent);
              }
            },
            message: response => {
              this.onMessageReceive(response);
            }
          });
          this.disableGameBoard();
          this.sendAcknowledgement();
        } else {
          this.host = true;
          this.chanceHistory = [];
          this.uuid = "Player" + Math.floor(1 + Math.random() * 1000);
          this.opponentUrl = "http://localhost:4200/tic-tac-toe/" + this.uuid;
          this.pubnub.init({
            publishKey: "pub-c-86688a5b-9714-49c0-8529-2c158288f773",
            subscribeKey: "sub-c-5978d7dc-c9f2-11e8-b41d-e643bd6bdd68",
            uuid: this.uuid
          });
          this.pubnub.subscribe({
            channels: ["Channel-6lq5h0iu2"],
            withPresence: true
          });
          this.pubnub.addListener({
            status: statusEvent => {
              if (statusEvent.category === "PNConnectedCategory") {
                console.log("Status Event", statusEvent);
              }
            },
            message: response => {
              this.onMessageReceive(response);
            }
          });
        }
      }
    });
  }

  sendAcknowledgement() {
    this.pubnub2.getInstance("another").publish(
      {
        message: { startGame: true },
        channel: "Channel-6lq5h0iu2"
      },
      (status, response) => {
        if (status.error) {
          console.log("Error while publishing", status.error);
        } else {
          console.log("message Published w/ timetoken", response.timetoken);
        }
      }
    );
  }

  onMessageReceive(response) {
    if (response.message.hasOwnProperty("startGame") && response.message.startGame) {
      alert("Game is started. Chance is of X");
      this.gameStart = true;
      this.gameOver = false;
      this.hostWon = false;
      this.otherWon = false;
    } else {
      this.chanceHistory.push(response.message);
      let positionDiv = document.getElementById(
        "position" + response.message.position
      );
      let iElement = document.createElement("i");
      switch (response.message.player) {
        case "host":
          iElement.setAttribute("class", "fa fa-times fa-5x");
          if (!this.host) this.enableGameBoard();
          break;
        case "other":
          iElement.setAttribute("class", "fa fa-circle-o fa-5x");
          if (this.host) this.enableGameBoard();
          break;
      }
      positionDiv.appendChild(iElement);
      positionDiv.classList.add("disable-div");
      this.checkWinner();
    }
  }

  enableGameBoard() {
    let gameBoardDiv = document.getElementById("gameBoardDiv");
    gameBoardDiv.classList.remove("disable-div");
  }

  disableGameBoard() {
    let gameBoardDiv = document.getElementById("gameBoardDiv");
    gameBoardDiv.classList.add("disable-div");
  }

  checkWinner() {
    let hostChances = this.chanceHistory.filter(
      singleChance => singleChance.player === "host"
    );
    let otherChances = this.chanceHistory.filter(
      singleChance => singleChance.player === "other"
    );
    this.hostWon = this.checkSequence(hostChances);
    this.otherWon = this.checkSequence(otherChances);
    if (this.hostWon || this.otherWon) {
      this.gameOver = true;
      if (this.hostWon) alert("X has won");
      if (this.otherWon) alert("O has won");
    } else {
      if (this.chanceHistory.length === 9) {
        this.gameOver = true;
        this.hostWon = false;
        this.otherWon = false;
        alert("Nobody Won");
      }
    }
  }

  checkSequence(chanceArray) {
    let positionArray = chanceArray.map(singleChance => singleChance.position);
    if (
      positionArray.indexOf("11") >= 0 &&
      positionArray.indexOf("12") >= 0 &&
      positionArray.indexOf("13") >= 0
    ) {
      return true;
    } else if (
      positionArray.indexOf("21") >= 0 &&
      positionArray.indexOf("22") >= 0 &&
      positionArray.indexOf("23") >= 0
    ) {
      return true;
    } else if (
      positionArray.indexOf("31") >= 0 &&
      positionArray.indexOf("32") >= 0 &&
      positionArray.indexOf("33") >= 0
    ) {
      return true;
    } else if (
      positionArray.indexOf("11") >= 0 &&
      positionArray.indexOf("21") >= 0 &&
      positionArray.indexOf("31") >= 0
    ) {
      return true;
    } else if (
      positionArray.indexOf("12") >= 0 &&
      positionArray.indexOf("22") >= 0 &&
      positionArray.indexOf("32") >= 0
    ) {
      return true;
    } else if (
      positionArray.indexOf("13") >= 0 &&
      positionArray.indexOf("23") >= 0 &&
      positionArray.indexOf("33") >= 0
    ) {
      return true;
    } else if (
      positionArray.indexOf("11") >= 0 &&
      positionArray.indexOf("22") >= 0 &&
      positionArray.indexOf("33") >= 0
    ) {
      return true;
    } else if (
      positionArray.indexOf("13") >= 0 &&
      positionArray.indexOf("22") >= 0 &&
      positionArray.indexOf("31") >= 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  onPositionClickByHost(position) {
    this.disableGameBoard();
    this.pubnub.publish(
      {
        message: { player: "host", position: position },
        channel: "Channel-6lq5h0iu2"
      },
      (status, response) => {
        if (status.error) {
          console.log("Error while publishing", status.error);
        } else {
          console.log("message Published w/ timetoken", response.timetoken);
        }
      }
    );
  }

  onPositionClickByOther(position) {
    this.disableGameBoard();
    this.pubnub2.getInstance("another").publish(
      {
        message: { player: "other", position: position },
        channel: "Channel-6lq5h0iu2"
      },
      (status, response) => {
        if (status.error) {
          console.log("Error while publishing", status.error);
        } else {
          console.log("message Published w/ timetoken", response.timetoken);
        }
      }
    );
  }

  onStartNewGameClick() {
    location.reload();
  }
}
