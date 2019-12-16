import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddAddressPage } from './add-address';
import {MultiPickerModule} from 'ion-multi-picker';

@NgModule({
  declarations: [
    AddAddressPage,
  ],
  imports: [
    MultiPickerModule,
    IonicPageModule.forChild(AddAddressPage),
  ],
})
export class AddAddressPageModule {}
