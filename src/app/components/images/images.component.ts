import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
})
export class ImagesComponent  implements OnInit {

  private _data! : string; 

  @Input() url!: { webPath? : string, data? : string };

  @Output() emitDeleteEvent: EventEmitter<string> = new EventEmitter<string>();
  constructor() {
    
   }

  removeImagetoDisplayingImagesEvent(data: string|undefined){
    if(data){
      this.emitDeleteEvent.emit(data);
    }
  }

  ngOnInit() {}

  validateData(url: { webPath? : string, data? : string }){
    if(!url.data && !url.webPath){
      throw new Error("url: {url.data && url.webPath} est mal defini")
    }
  }

}
