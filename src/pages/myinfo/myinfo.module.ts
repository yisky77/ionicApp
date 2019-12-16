import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyinfoPage } from './myinfo';

@NgModule({
  declarations: [
    MyinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(MyinfoPage),
  ],
})
export class MyinfoPageModule {}
