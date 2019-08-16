import { Component } from '@angular/core';
import { ipcRenderer } from 'electron';
import { IpcService } from './ipc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'public';

  constructor(private ipc: IpcService) {
    ipc.send("test", "test");
  }

}
