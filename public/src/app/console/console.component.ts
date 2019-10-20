import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {IpcService} from '../ipc.service';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.less']
})
export class ConsoleComponent implements OnInit {

    @ViewChild('prompt') prompt: ElementRef;
    promptText: string = "";

  lastCommends: Array<any>;
  previous: String = "";
  scrollIndex: number = 0;
  current: Object = {ip: "192.168.2.101", port: 8800, protocol: "SSH"}
  constructor(private ipc: IpcService) { }

  ngOnInit() {
    this.prompt.nativeElement.focus();
    this.lastCommends = [];
  }

  onKey(event: any) {
    if(event.key == 'Enter') {
        event.preventDefault();
        let comment = document.getElementById("prompt").innerHTML;
        this.ipc.send('execute', comment);
        this.lastCommends.push({date: Date.now(), comment: comment});
        this.previous += document.getElementById("userServer").innerHTML + comment + "\n";
        document.getElementById("prompt").innerHTML = "";
        this.previous = this.previous.replace(new RegExp("<br>", 'g') , "");
        this.scrollIndex = this.lastCommends.length - 1;
    }
    if(event.key == 'ArrowUp') {
        event.preventDefault();
        this.scrollIndex = (this.scrollIndex == 0 ? 0 : this.scrollIndex - 1);
        if(this.lastCommends.length > 0) {
            document.getElementById("prompt").innerHTML = this.lastCommends[this.scrollIndex].comment;
        }
    }
    if(event.key == 'ArrowDown') {
        event.preventDefault();
        this.scrollIndex = (this.scrollIndex == this.lastCommends.length - 1 ? this.lastCommends.length - 1 : this.scrollIndex + 1);
        if(this.lastCommends.length > 0) {
            document.getElementById("prompt").innerHTML = this.lastCommends[this.scrollIndex].comment;
        }
    }
  }


}
