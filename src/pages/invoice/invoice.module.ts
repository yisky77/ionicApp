import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvoicePage } from './invoice';

@NgModule({
  declarations: [
    InvoicePage,
  ],
  imports: [
    IonicPageModule.forChild(InvoicePage),
  ],
})
export class InvoicePageModule {}
