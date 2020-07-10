import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewsPageRoutingModule } from './news-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

import { NewsPage } from './news.page';
import { NewsDetailPage } from './news-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [
    NewsPage,
    NewsDetailPage
  ]
})
export class NewsPageModule {}
