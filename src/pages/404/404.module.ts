import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WrongPage } from './404';

@NgModule({
  declarations: [
    WrongPage,
  ],
  imports: [
    IonicPageModule.forChild(WrongPage),
  ],
})
export class WrongPageModule {}
