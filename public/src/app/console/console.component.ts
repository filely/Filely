import { Component, OnInit } from '@angular/core';
import {IpcService} from '../ipc.service';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.less']
})
export class ConsoleComponent implements OnInit {

  lastComments: Array<any>;
  previouse: String = "";
  scrollIndex: number = 0;
  current: Object = {ip: "192.168.2.101", port: 8800, protocol: "SSH"}
  constructor(private ipc: IpcService) { }

  ngOnInit() {
      this.lastComments = [];
  }

  onKey(event: any) {
      document.getElementById("prompt").focus();
    if(event.key == 'Enter') {
        event.preventDefault();
        let comment = document.getElementById("prompt").innerHTML;
        this.ipc.send('execute', comment);
        this.lastComments.push({date: Date.now(), comment: comment});
        this.previouse += document.getElementById("userServer").innerHTML + comment + "\n";
        document.getElementById("prompt").innerHTML = "...";
        this.previouse = this.previouse.replace(new RegExp("<br>", 'g') , "");
        this.scrollIndex = this.lastComments.length - 1;
    }
    if(event.key == 'ArrowUp') {
        event.preventDefault();
        this.scrollIndex = (this.scrollIndex == 0 ? 0 : this.scrollIndex - 1);
        if(this.lastComments.length > 0) {
            document.getElementById("prompt").innerHTML = this.lastComments[this.scrollIndex].comment;
        }
    }
    if(event.key == 'ArrowDown') {
        event.preventDefault();
        this.scrollIndex = (this.scrollIndex == this.lastComments.length - 1 ? this.lastComments.length - 1 : this.scrollIndex + 1);
        if(this.lastComments.length > 0) {
            document.getElementById("prompt").innerHTML = this.lastComments[this.scrollIndex].comment;
        }
    }
  }


}
