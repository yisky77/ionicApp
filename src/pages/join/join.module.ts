import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JoinPage } from './join';

@NgModule({
  declarations: [
    JoinPage,
  ],
  imports: [
    IonicPageModule.forChild(JoinPage),
  ],
})
export class JoinPageModule {}
