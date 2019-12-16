import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductServicePage } from './product-service';

@NgModule({
  declarations: [
    ProductServicePage,
  ],
  imports: [
    IonicPageModule.forChild(ProductServicePage),
  ],
})
export class ProductServicePageModule {}
