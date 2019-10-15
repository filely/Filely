import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor() { }

  connectionList: Array<any>;
  connection0: Object;
  connection1: Object;
  connection2: Object;
  connection3: Object;

  ngOnInit() {
      this.connectionList = [];
      this.connectionList[0] = {ip: "255.255.255.255", user: "root", pw: "root"};
      this.connectionList[1] = {ip: "255.255.255.255", user: "root", pw: "root"};
      this.connectionList[2] = {ip: "255.255.255.255", user: "root", pw: "root"};
      this.connectionList[3] = {ip: "255.255.255.255", user: "root", pw: "root"};
      this.connection0 = this.connectionList[0];
      this.connection1 = this.connectionList[1];
      this.connection2 = this.connectionList[2];
      this.connection3 = this.connectionList[3];
  }

}
