import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  ngOnInit() {
    this.pw = true;
  }

  keyClick(event: any) {
    this.pw = false;
    this.u2f = false;
    this.key = true;
  }

  passwdClick(event: any) {
    this.pw = true;
    this.u2f = false;
    this.key = false;
  }

  u2fClick(event: any) {
    this.pw = false;
    this.u2f = true;
    this.key = false;
  }

  connect(event: any) {
    this.router.navigateByUrl('/user');
  }

}
