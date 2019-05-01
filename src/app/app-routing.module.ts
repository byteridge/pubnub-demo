import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PresenceComponent } from './components/presence/presence.component';
import { FunctionsComponent } from './components/functions/functions.component';
import { AccessComponent } from './components/access/access.component';
import { DemoComponent } from './components/demo/demo.component';

const routes: Routes = [
  {
    path: 'presence', 
    component: PresenceComponent
  },
  {
    path: 'access-manager', 
    component: AccessComponent
  },
  {
    path: 'functions', 
    component: FunctionsComponent
  },
  {
    path: '', 
    component: DemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
