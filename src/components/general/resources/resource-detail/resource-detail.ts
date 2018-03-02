import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { ResourcesComponent } from '../resources';

@Component({
  selector: 'resource-detail',
  templateUrl: 'resource-detail.html'
})
export class ResourceDetailComponent extends ResourcesComponent{

 @Input('resource') resource:string;

}
