import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import {IpcService} from '../ipc.service';


@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.less']
})
export class ConnectComponent implements OnInit {

  constructor(private router: Router, private ipc: IpcService) { }

  mode = "pw";

  blacking: boolean = false;
  loadingVisible: boolean = false;
  dialogVisible: boolean = false;
  dialog: any = {title: "Connection error occurred!", message: "Error while trying to connecting to the server:", left: "open", right: "close"};
  scanning: string = ".";
  scanner: any;
  authType: string = "pw";
  pathToKey: string;


  /**
   * 
   * Fix Dialog Bug
   * Dialog is only poping out sometime
   * @Alexander 
   * (I'm to stupid for Angular)
   */

  ngOnInit() {
    this.ipc.on("connect-reply", (data) => {
        if(data.successfully) {
            this.router.navigateByUrl('/console');
        } else {
            if(data.error.code == "ECONNREFUSED") {
                this.blacking = true;
                this.loadingVisible = true;
                this.dialogVisible = true;
            }
        }
    });
  }

  keyClick(event: any) {
    this.mode = "key";
    clearInterval(this.scanner);
  }

  passwdClick(event: any) {
    this.mode = "pw";
    clearInterval(this.scanner);
  }

  u2fClick(event: any) {
    this.mode = "u2f";
    this.scanner = setInterval(() => {
        this.scanning += ".";
        if(this.scanning.length == 5) {
            this.scanning = ".";
        }
    }, 1000);
  }

  connect(event: any) {
    let successfully = false;
    this.ipc.send('connect', {authType: this.authType, connectOptions: { keyFile: "", user: "", password: "", keyHash: ""}});
    console.log("Connect executed");
  }

  fileChangeEvent(event: any) {
    if (event.target.files && event.target.files[0]) {
        this.pathToKey = "" + event.target.files[0].path;
        var reader = new FileReader();
        reader.onload = function(){
            //TODO: Handle Key!
        };
        reader.readAsText(event.target.files[0]);
    }
  }

  closeDialog() {
    this.blacking = false;
    this.loadingVisible = false;
    this.dialogVisible = false;
  }

}
