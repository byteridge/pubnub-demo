import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';
import * as pubnub from 'pubnub';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss']
})
export class AccessComponent implements OnInit {
  name: string;
  read: boolean;
  write: boolean;

  granted: any[] = [];
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }


  grant(){
    const payload =  {
      key: pubnub.generateUUID(),
      read: this.read,
      write: this.write
    };
    this.http.post(`${environment.url}grant`, payload).subscribe(resp => {
      console.log(resp);
      this.granted.push({...payload, name: this.name});
      this.reset();
    });
  }

  reset(){
    this.name = undefined;
    this.read = undefined;
    this.write = undefined;
  }

}
