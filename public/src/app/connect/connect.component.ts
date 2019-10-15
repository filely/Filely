import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.less']
})
export class ConnectComponent implements OnInit {

  constructor(private router: Router) { }

  pw: boolean = true;
  u2f: boolean = false;
  key: boolean = false;
  scanning: string = ".";
  scanner: any;

  ngOnInit() {
    this.pw = true;
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
    this.router.navigateByUrl('/console');
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
