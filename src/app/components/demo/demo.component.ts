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
  users: any[] = [];
  channelGroup: string = 'users-list';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(){
    this.getName();
    this.initialize();
    this.initGroup((status, response) => {
      this.grant();
    });
  }

  // async ngOnInit(){
  //   const deleteStatus = await this.deleteGroup();
  //   console.log('delete status ', deleteStatus);
  // }

  grant(){
    this.init.grant(
        {
            channels: [this.channelGroup],
            read: true, // false to disallow
            write: true, // false to disallow
        },
        (status) => {
            // handle status
              this.subscribe();
              this.addListners();
        }
    );
  }

  addChanneltoGroup(name, callback){
    this.init.channelGroups.addChannels(
      {
          channels: [name],
          channelGroup: this.channelGroup
      }, callback);
  }

  subscribe(){
    const payload = {
      channelGroups: [this.channelGroup, `${this.channelGroup}-pnpres`],
      withPresence: true
    };
    this.init.subscribe(payload);
  }

  initGroup(callback){
    this.init.channelGroups.listChannels({channelGroup: "users-list"}, callback);
  }

  getName(){
    this.name = this.route.snapshot.queryParams['name'];
  }

  initialize(){
    const payload = {
      publishKey: 'pub-c-2c71b4eb-57bb-4653-8a5a-02dccc1233c2',
      subscribeKey: 'sub-c-b184bbc2-5c1d-11e9-a6e0-8a4660381032',
      secretKey: 'sec-c-MzlhYzY3NjgtOGVkOS00ZGYwLWIwN2ItYjk1OWE3ZDAxOTE5',
      uuid: this.name
    }
    this.init = new pubnub(payload);
  }

  addListners(){
    this.init.addListener({
      status: (response) => {
        if (response.category === "PNConnectedCategory") {
          this.hereNow();
        }
      },
      presence: (response) => {
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
      }, 
      message: (resp) => {
        if(resp.channel){
          const i = this.users.findIndex(item => item.name === resp.publisher);
          if(i > -1)
            this.fetchHistory(i);
        }
      }
    });
  }
  
  hereNow() {
    this.init.hereNow(
      {
        channelGroups: [this.channelGroup],
        includeUUIDs: true,
        includeState: true
      },
        (status, response) => {
        const keys = Object.keys(response.channels);
        const users = response.channels[keys[0]].occupants;
        if(users.length > 0){
          users.forEach(user => {
            const filtered = this.users.filter(item => item.name === user.uuid);
            if(this.name !== user.uuid && filtered.length === 0){
              this.users.push({name: user.uuid, subscribed: false});
              this.startChat(this.users.length - 1);
            }
          });
        }
      });
  }

  join(response){
      for(let i=0; i < response.occupancy; i++){
        if(response.uuid !== undefined){
          var uuidMatchJoin = this.users.indexOf(response.uuid);
          if(uuidMatchJoin === -1){
            const filtered = this.users.filter(item => item.name === response.uuid);
            if(this.name !== response.uuid && filtered.length === 0){
              this.users.push({name: response.uuid, subscribed: false});
              this.startChat(this.users.length - 1);
            }
          }
        }
      }
  }

  leave(response){
        var uuidMatchLeave = this.users.indexOf(response.uuid);
        if(uuidMatchLeave > -1){
          this.users.splice(uuidMatchLeave, 1);
        }
  }

  userLeave(response){
    for(let i=0; i < response.occupancy; i++){
      var uuidMatchIntervalLeave = this.users.indexOf(response.leave[i]);
      if(uuidMatchIntervalLeave > -1){
        this.users.splice(uuidMatchIntervalLeave, 1);
      }
    }
  }

  startChat(i: number){
    this.users[i].subscribed = true;
    const channelName = this.createUniqueChannel(this.users[i].name, this.name);
    this.addChanneltoGroup(channelName, (status, response) => {
      this.init.subscribe({channels: [channelName], withPresence: true, uuid: this.name});
      this.addListners();
      this.users[i].channel = channelName;
    });
  }

  send(i){
    this.init.publish({message:{message: this.users[i].input, user: this.users[i].name}, channel: this.users[i].channel }, () => {
      this.users[i].input = '';
      this.fetchHistory(i);
    });
  }

  createUniqueChannel(name1: string, name2: string){
    const arr = [name1, name2].sort();
    const str = arr[0] + arr[1];
    let codedString = '';
    for(let i = 0; i < str.length; i++){
    codedString += str.charCodeAt(i);
    }
    return codedString;
  }

  fetchHistory(i: number){
    this.init.history({channel: this.users[i].channel}, (status, response) => {
      this.users[i].response = response.messages;
    })
  }

  async deleteGroup(){
    return new Promise((resolve, reject) => {
      this.init.channelGroups.deleteGroup(
          { channelGroup: this.channelGroup },(status) => {
              if (status.error) {
                  reject(status);
              } else {
                  resolve(true);
              }
          })
    });
  }
}
