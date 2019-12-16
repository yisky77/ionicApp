import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CouponPage } from './coupon';

@NgModule({
  declarations: [
    CouponPage,
  ],
  imports: [
    IonicPageModule.forChild(CouponPage),
  ],
})
export class CouponPageModule {}
