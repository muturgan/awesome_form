import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from '../shared/shared.module';

import { FooterComponent } from '../main-layout/footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaskComponent } from './task/task.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
  ],
  declarations: [
    FooterComponent,
    DashboardComponent,
    TaskComponent,
  ],
  exports: [
    FooterComponent,
    DashboardComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ViewsModule {}
