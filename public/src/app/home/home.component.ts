import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor() { }

  connectionList: Array<any>;
  lastConnections: Array<any>;

  ngOnInit() {
      //TODO: Read last Connection from Connection Log File! 
      //TODO: Create Connection Log File!
      this.connectionList = [];
      this.connectionList[0] = {ip: "255.255.255.255", user: "root", pw: "root"};
      this.connectionList[1] = {ip: "255.255.255.255", user: "root", pw: "root"};
      this.connectionList[2] = {ip: "255.255.255.255", user: "root", pw: "root"};
      this.connectionList[3] = {ip: "255.255.255.255", user: "root", pw: "root"};
      this. lastConnections = this.connectionList.slice(0, 4) 
  }

}
