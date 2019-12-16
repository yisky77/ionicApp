import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MycouponsPage } from './mycoupons';

@NgModule({
  declarations: [
    MycouponsPage,
  ],
  imports: [
    IonicPageModule.forChild(MycouponsPage),
  ],
})
export class MycouponsPageModule {}
