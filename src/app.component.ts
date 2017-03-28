import {Component, OnInit} from '@angular/core';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from './multiselect-dropdown';

@Component({
    selector: 'my-app',
    template: `
		<div>
      <h2>Example</h2>
      <ss-multiselect-dropdown [options]="filteredCountries" [settings]="selectSettings" [texts]="texts" [(ngModel)]="selectedCountries"></ss-multiselect-dropdown>
    </div>
    <hr/>
    <div class="row">
      <div class="col-md-6">
        <h2>Config</h2>
        <ul class="config">
          <li *ngFor="let setting of settings, let i = index">
            <label [for]="'chkSetting_'+i">{{setting.name}}</label>
            <input *ngIf="setting.inputType==='checkbox' && setting.name !== 'checkedStyle'" [id]="'chkSetting_'+i" type="checkbox" [(ngModel)]="selectSettings[setting.name]" (change)="applySettings()" />
            <input *ngIf="setting.inputType!=='checkbox' && setting.name !== 'checkedStyle'" [id]="'chkSetting_'+i" [type]="setting.inputType" [(ngModel)]="selectSettings[setting.name]" (change)="applySettings()" />
            <select *ngIf="setting.name === 'checkedStyle'" [(ngModel)]="selectSettings[setting.name]" (change)="applySettings()">
              <option value="checkboxes">checkboxes</option>
              <option value="glyphicon">glyphicon</option>
              <option value="fontawesome">fontawesome</option>
            </select>
          </li>
        </ul>
      </div>
      <div class="col-md-6">
        <h2>Data</h2>
        <label for="chkParents">Parents</label>
        <input id="chkParents" #chkParents type="checkbox" [checked]="dataParents" (change)="filterCountries($event.target.checked, chkLabels.checked)" />
        <label for="chkLabels">Labels</label>
        <input id="chkLabels" #chkLabels type="checkbox" [checked]="dataLabels" (change)="filterCountries(chkParents.checked, $event.target.checked)" />
        <pre class="data">{{ filteredCountries | json }}</pre>
      </div>
	`,
	providers: []
})
export class AppComponent implements OnInit {
	private selectedCountries: number[] = [2, 3];
  private dataParents: boolean = false;
  private dataLabels: boolean = false;

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
    this.filterCountries(true, false);
    this.settings = Object.keys(this.selectSettings).map(setting => ({
      name: setting,
      inputType: (typeof(this.selectSettings[setting])=='boolean' ? 'checkbox' :
      (typeof(this.selectSettings[setting])=='number') ? 'number' : 'text')
    }));
  }

  filterCountries(dataParents: boolean, dataLabels: boolean) {
    this.dataParents = dataParents;
    this.dataLabels = dataLabels;
    this.filteredCountries = this.countries.filter(country => dataParents || dataLabels || !country.isLabel)
      .map(country => {
        let countryModel = { id:country.id, name: country.name };
        if (dataParents && country.parentId) countryModel['parentId'] = country.parentId;
        if (dataLabels && country.isLabel) countryModel['isLabel'] = country.isLabel;
        return countryModel;
      });
  }

  applySettings() {
    this.selectSettings = Object.assign({}, this.selectSettings);
    this.filteredCountries = this.filteredCountries.slice();
  }
}
