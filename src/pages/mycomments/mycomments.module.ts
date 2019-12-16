import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MycommentsPage } from './mycomments';

@NgModule({
  declarations: [
    MycommentsPage,
  ],
  imports: [
    IonicPageModule.forChild(MycommentsPage),
  ],
})
export class MycommentsPageModule {
  
}
