import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import {IpcService} from '../ipc.service';
const { dialog } = require('electron').remote


@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.less']
})
export class ConnectComponent implements OnInit {

  constructor(private router: Router, private ipc: IpcService) { }

  pw: boolean = true;
  u2f: boolean = false;
  key: boolean = false;
  scanning: string = ".";
  scanner: any;
  authType: string = "pw";

  ngOnInit() {
    this.ipc.on("connect-reply", (data) => {
        console.log("test");
        console.log(data);
        if(data.successfully) {
            this.router.navigateByUrl('/console');
        } else {
            console.log(data.error);
        }
    });
  }

  keyClick(event: any) {
    this.pw = false;
    this.u2f = false;
    this.key = true;
    clearInterval(this.scanner);
  }

  passwdClick(event: any) {
    this.pw = true;
    this.u2f = false;
    this.key = false;
    clearInterval(this.scanner);
  }

  u2fClick(event: any) {
    this.pw = false;
    this.u2f = true;
    this.key = false;


    let that = this;
    this.scanner = setInterval(() => {
        that.scanning += ".";
        if(that.scanning.length == 5) {
            that.scanning = ".";
        }
    }, 1000);
  }

  connect(event: any) {
    let sucsessfully = false;
    this.ipc.send('connect', {authType: this.authType, connectOptions: { keyFile: "", user: "", password: "", keyHash: ""}});
    console.log("Connect executed");
  }

  selectKeyFile(event: any) {
    $("#keyFile").click();
  }



  fileChangeEvent(event: any) {
    if (event.target.files && event.target.files[0]) {
        console.log(event.target.files);
        (<HTMLInputElement>document.getElementById("pathToKey")).value = "" + event.target.files[0].path;
        var reader = new FileReader();
        reader.onload = function(){
            console.log(reader.result);
        };
        reader.readAsText(event.target.files[0]);
    }
  }

}
