// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  url: 'http://localhost:4040/api/',
  pubnub: {
    publishKey : 'pub-c-dd019e7f-50ff-4631-93d0-2ecf3c5c972c',
    subscribeKey : 'sub-c-5760a76a-51f4-11e9-8df3-c6b3364936ee',
    channels: {
        demo: 'pubnub-demo-channel',
        access: 'access-demo-channel',
        presence: 'presence-demo-channel'
    },
    presence: {
      publishKey: 'pub-c-6b0d4584-2b62-40ee-99e0-8ee1f8ce3c91',
      subscribeKey: 'sub-c-fd8f95d2-5524-11e9-94f2-3600c194fb1c',
    }
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
