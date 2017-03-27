import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MultiselectDropdown, MultiSelectSearchFilter } from './multiselect-dropdown';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, MultiselectDropdown, MultiSelectSearchFilter ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
