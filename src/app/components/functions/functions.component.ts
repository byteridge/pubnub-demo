import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';
@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.scss']
})
export class FunctionsComponent implements OnInit {

  history: any = [];
  message: string;
  constructor(private http: HttpClient) { }

  ngOnInit() {

    this.fetchHistory();

  }

  fetchHistory(){
    this.http.get(`${environment.url}history`).subscribe((resp:any) => {
      this.history = resp.messages;
    })
  };

  publish(){
    if(this.message){
      this.http.post(`${environment.url}publish`, {message: this.message}).subscribe(resp => {
        this.fetchHistory();
      });
    }
  };

}
