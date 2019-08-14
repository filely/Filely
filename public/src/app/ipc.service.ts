import { Injectable } from '@angular/core'
import { IpcRenderer } from 'electron'

@Injectable({
  providedIn: 'root',
})
export class IpcService {
  private ipc: IpcRenderer;

  constructor() {
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
      } catch (error) {
        throw error;
      }
    } else {
      console.warn('Could not load electron ipc');
    }
  }

  send(channel, msg) {
    this.ipc.send(channel, msg);
  }

  on(channel, cb) {
    this.ipc.on(channel, (event, arg) => cb(arg));
  }

}
