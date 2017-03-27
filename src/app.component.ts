import {Component, OnInit} from '@angular/core';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from './multiselect-dropdown';

@Component({
    selector: 'my-app',
    template: `
		<div>
      <h2>Select</h2>
      <ss-multiselect-dropdown [options]="filteredCountries" [settings]="selectSettings" [texts]="texts" [(ngModel)]="selectedCountries"></ss-multiselect-dropdown>
      <h2>Config</h2>
      <ul>
        <li *ngFor="let setting of settings, let i = index">
          <label [for]="'chkSetting_'+i">{{setting.name}}</label>
          <input *ngIf="setting.inputType==='checkbox' && setting.name !== 'checkedStyle'" [id]="'chkSetting_'+i" type="checkbox" [(ngModel)]="selectSettings[setting.name]" (change)="applySettings()" />
          <input *ngIf="setting.inputType!=='checkbox' && setting.name !== 'checkedStyle'" [id]="'chkSetting_'+i" [type]="setting.inputType" [(ngModel)]="selectSettings[setting.name]" (change)="applySettings()" />
          <select *ngIf="setting.name === 'checkedStyle'" [(ngModel)]="selectSettings[setting.name]">
            <option value="checkboxes">checkboxes</option>
            <option value="glyphicon">glyphicon</option>
            <option value="fontawesome">fontawesome</option>
          </select>
        </li>
      </ul>
      <h2>Data</h2>
      <label for="chkLabels">Labels</label>
      <input id="chkLabels" type="checkbox" (change)="filterCountries($event.target.checked)" />
      <pre>{{ filteredCountries | json }}</pre>
    </div>
	`,
	providers: []
})
export class AppComponent implements OnInit {
	private selectedCountries: number[] = [2, 3];

	private countries: IMultiSelectOption[] = [
    { id: 1, name: 'Europe', isLabel: true },
		{ id: 2, name: 'Sweden', parentId: 1 },
		{ id: 3, name: 'Norway', parentId: 1 },
		{ id: 4, name: 'Denmark', parentId: 1 },
		{ id: 5, name: 'Finland', parentId: 1 },
    { id: 6, name: 'Asia', isLabel: true },
    { id: 7, name: 'China', parentId: 6 },
    { id: 8, name: 'Japan', parentId: 6 },
    { id: 9, name: 'Indonesia', parentId: 6 },
    { id: 10, name: 'Thailand', parentId: 6 },
	];

  private filteredCountries: IMultiSelectOption[] = this.countries;
  private settings: any[] = [];

	private texts: IMultiSelectTexts = {
		defaultTitle: 'Select countries'
	};

	private selectSettings: IMultiSelectSettings = {
    pullRight: false,
    enableSearch: false,
    checkedStyle: 'checkboxes',
    buttonClasses: 'btn btn-default btn-secondary',
    selectionLimit: 0,
    closeOnSelect: false,
    autoUnselect: false,
    showCheckAll: false,
    showUncheckAll: false,
    dynamicTitleMaxItems: 3,
    maxHeight: '300px'
	};

  ngOnInit() {
    this.filterCountries(false);
    this.settings = Object.keys(this.selectSettings).map(setting => ({
      name: setting,
      inputType: (typeof(this.selectSettings[setting])=='boolean' ? 'checkbox' :
      (typeof(this.selectSettings[setting])=='number') ? 'number' : 'text')
    }));
  }

  filterCountries(displayLabels: boolean) {
    this.filteredCountries = this.countries.filter(country => displayLabels || !country.isLabel).map(country => displayLabels ? country : { id:country.id, name: country.name });
  }

  applySettings() {
    this.selectSettings = Object.assign({}, this.selectSettings);
  }
}
