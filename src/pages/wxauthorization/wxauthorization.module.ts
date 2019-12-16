import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WxauthorizationPage } from './wxauthorization';

@NgModule({
  declarations: [
    WxauthorizationPage,
  ],
  imports: [
    IonicPageModule.forChild(WxauthorizationPage),
  ],
})
export class WxauthorizationPageModule {}
