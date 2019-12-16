import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyorderPage } from './myorder';

@NgModule({
  declarations: [
    MyorderPage,
  ],
  imports: [
    IonicPageModule.forChild(MyorderPage),
  ],
})
export class MyorderPageModule {}
