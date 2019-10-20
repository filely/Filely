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

  lastCommands: Array<any>;
  previous: String = "";
  scrollIndex: number = 0;
  current: Object = {ip: "192.168.2.101", port: 8800, protocol: "SSH"};

  userServer = "root@TestServer# ";

  constructor(private ipc: IpcService) { }

  ngOnInit() {
    this.prompt.nativeElement.focus();
    this.lastCommands = [];
  }

  onKey(event: any) {
    this.promptText = this.prompt.nativeElement.innerHTML.replace(new RegExp("&nbsp;", 'g'), " ");
    if(event.key == 'Enter') {
        event.preventDefault();
        //this.ipc.send('execute', this.promptText);
        this.lastCommands.push({date: Date.now(), comment: this.promptText});
        this.previous += this.userServer + this.promptText + "\n";
        this.prompt.nativeElement.innerHTML = "";
        this.promptText = "";
        this.previous = this.previous.replace(new RegExp("<br>", 'g') , "");
        this.scrollIndex = this.lastCommands.length - 1;
    }
    if(event.key == 'ArrowUp') {
        event.preventDefault();
        this.scrollIndex = (this.scrollIndex == 0 ? 0 : this.scrollIndex - 1);
        if(this.lastCommands.length > 0) {
          this.prompt.nativeElement.innerHTML = this.lastCommands[this.scrollIndex].comment;
        }
    }
    if(event.key == 'ArrowDown') {
        event.preventDefault();
        this.scrollIndex = (this.scrollIndex == this.lastCommands.length - 1 ? this.lastCommands.length - 1 : this.scrollIndex + 1);
        if(this.lastCommands.length > 0) {
          this.prompt.nativeElement.innerHTML = this.lastCommands[this.scrollIndex].comment;
        }
    }
  }


}
