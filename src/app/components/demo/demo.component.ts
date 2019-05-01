import { Component, OnInit } from '@angular/core';
import * as pubnub from 'pubnub';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  init: any;
  name: string;
  playerList: string[] = [];
  channelGroup: string = 'users-list';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(){
    this.getName();
    this.initialize();
    this.initGroup((status, response) => {
      console.log('status ', status);
      console.log('response ', response);
      this.grant();
    });
  }

  grant(){
    this.init.grant(
      {
          channels: [this.channelGroup],
          read: true, // false to disallow
          write: true, // false to disallow
      },
       (status) => {
          // handle status
          console.log('grant ', status);
          this.addChanneltoGroup((status, response) => {
            console.log('add status ', status);
            this.subscribe();
            this.addListners();
          });
      }
  );
  
  }

  addChanneltoGroup(callback){
    this.init.channelGroups.addChannels(
      {
          channels: [this.name],
          channelGroup: this.channelGroup
      }, callback);
  }

  subscribe(){
    const payload = {
      channelGroups: [this.channelGroup, `${this.channelGroup}-pnpres`],
      channels: [this.name],
      withPresence: true,
    };
    this.init.subscribe(payload);
  }

  initGroup(callback){
    this.init.channelGroups.listChannels({channelGroup: "users-list"}, callback);
  }

  getName(){
    this.name = this.route.snapshot.queryParams['name'];
    console.log(this.name);
  }

  initialize(){
    const payload = {
      publishKey: 'pub-c-2c71b4eb-57bb-4653-8a5a-02dccc1233c2',
      subscribeKey: 'sub-c-b184bbc2-5c1d-11e9-a6e0-8a4660381032',
      secretKey: 'sec-c-MzlhYzY3NjgtOGVkOS00ZGYwLWIwN2ItYjk1OWE3ZDAxOTE5'
    }
    this.init = new pubnub(payload);
  }

  addListners(){
    this.init.addListener({
      status: (response) => {
        console.log('presence status ', response);
        if (response.category === "PNConnectedCategory") {
          this.hereNow();
        }
      },
      presence: (response) => {
        console.log('presence resp ', response);
        if(response.leave!==undefined){
          this.userLeave(response);
        }else{
          switch(response.action){
            case 'join': {
              this.join(response);
              break;
            };
            case 'leave': {
              this.leave(response);
              break;
            };
            default : {
              break;
            }
          }
        }
        console.log("Presence UUIDs:", this.playerList);
      }
    });
  }
  
  hereNow() {
    this.init.hereNow(
      {
        channels: [this.channelGroup],
        includeUUIDs: true,
        includeState: true
      },
        (status, response) => {
        console.log("hereNow Response: ", response);
        // if(response.channels[environment.pubnub.channels.presence].occupants){
        //   response.channels[environment.pubnub.channels.presence].occupants.forEach((occupant) => {
        //     this.playerList.push(occupant.uuid);
        //   })
        // }
        // console.log("hereNow UUIDs: ", this.playerList);
      });
  }

  join(response){
      for(let i=0; i < response.occupancy; i++){
        if(response.uuid !== undefined){
          var uuidMatchJoin = this.playerList.indexOf(response.uuid);
          if(uuidMatchJoin === -1){
            this.playerList.push(response.uuid);
          }
        }
      }
  }

  leave(response){
        var uuidMatchLeave = this.playerList.indexOf(response.uuid);
        if(uuidMatchLeave > -1){
          this.playerList.splice(uuidMatchLeave, 1);
          // this.messages.push({text: `${response.uuid} left`, class:'list-group-item-secondary'});
        }
  }

  userLeave(response){
    for(let i=0; i < response.occupancy; i++){
      var uuidMatchIntervalLeave = this.playerList.indexOf(response.leave[i]);
      if(uuidMatchIntervalLeave > -1){
        this.playerList.splice(uuidMatchIntervalLeave, 1);
        // this.messages.push({text: `${response.leave[i]} left`, class:'list-group-item-secondary'});
      }
    }
  }

  message(response){
    console.log('Message event');
  }
}
