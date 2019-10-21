import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnInit {

  someCode = "class Test { console.log(\"Test\"); }";

  constructor() { }

  ngOnInit() {
  }

}
