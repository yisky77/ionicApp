import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddresslistPage } from './addresslist';

@NgModule({
  declarations: [
    AddresslistPage,
  ],
  imports: [
    IonicPageModule.forChild(AddresslistPage),
  ],
})
export class AddresslistPageModule {}
