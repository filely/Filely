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
import { EditorComponent } from './editor/editor.component';
import {HighlightModule} from "ngx-highlightjs";

import xml from 'highlight.js/lib/languages/xml';
import scss from 'highlight.js/lib/languages/scss';
import typescript from 'highlight.js/lib/languages/typescript';

export function hljsLanguages() {
  return [
    {name: 'typescript', func: typescript},
    {name: 'scss', func: scss},
    {name: 'xml', func: xml}
  ];
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SettingsComponent,
    ConnectComponent,
    ServerListComponent,
    ConsoleComponent,
    FileTransferComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HighlightModule.forRoot({ languages: hljsLanguages }),
    FormsModule
  ],
  providers: [IpcService],
  bootstrap: [AppComponent]
})
export class AppModule { }
