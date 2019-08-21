import {Component} from '@angular/core';
import {IpcService} from './ipc.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'public';

  restore = false;

  constructor(private ipc: IpcService, private router: Router) {

  }

  getRoute() {
    if (this.router.url === '/home') {
      return 'home';
    }
  }

  sendWindowAction(action) {
    this.ipc.send('window-action', action);

    if(action === "restore") {
      this.restore = false;
    } else if(action === "maximize") {
      this.restore = true;
    }
  }


}
