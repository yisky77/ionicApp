import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductParameterPage } from './product-parameter';

@NgModule({
  declarations: [
    ProductParameterPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductParameterPage),
  ],
})
export class ProductParameterPageModule {}
