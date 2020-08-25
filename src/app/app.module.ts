import { DashboardComponent } from "./dashboard/dashboard.component";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ProductSalesComponent } from "./product-sales/product-sales.component";
// import { MatFormFieldModule } from "@angular/material/form-field";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Ng5SliderModule } from "ng5-slider";                 
import {
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatAutocompleteModule,
  MatNativeDateModule,
  MatButtonModule,
  MatProgressBarModule
} from "@angular/material";
import { AlertsService } from "./services/alerts.service";
import { UploadfilesService } from "./services/uploadfiles.service";
import { FileUploadModule } from "ng2-file-upload";
import { SatDatepickerModule, SatNativeDateModule } from "saturn-datepicker";
import { HighchartsChartComponent } from 'highcharts-angular';
import { TestComponent } from './test/test.component';
import { YouTubePlayerModule } from "@angular/youtube-player";
import { VgCoreModule } from 'videogular2/compiled/core';
import { VgControlsModule } from 'videogular2/compiled/controls';
// import { MatMomentDateModule } from "@angular/material-moment-adapter";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    ProductSalesComponent,
    HighchartsChartComponent,
    TestComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatAutocompleteModule,
    FileUploadModule,
    Ng5SliderModule,
    MatButtonModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatProgressBarModule,
    YouTubePlayerModule,
    VgCoreModule,
    VgControlsModule
  ],
  providers: [AlertsService, UploadfilesService],
  bootstrap: [AppComponent]
})
export class AppModule {}
