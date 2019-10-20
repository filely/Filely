import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IpcService } from './ipc.service';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { ConnectComponent } from './connect/connect.component';
import { ServerListComponent } from './server-list/server-list.component';
import { ConsoleComponent } from './console/console.component';
import { FileTransferComponent } from './file-transfer/file-transfer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SettingsComponent,
    ConnectComponent,
    ServerListComponent,
    ConsoleComponent,
    FileTransferComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [IpcService],
  bootstrap: [AppComponent]
})
export class AppModule { }
