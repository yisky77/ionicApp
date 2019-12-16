import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InteProductPage } from './inte-product';

@NgModule({
  declarations: [
    InteProductPage,
  ],
  imports: [
    IonicPageModule.forChild(InteProductPage),
  ],
})
export class InteProductPageModule {}
