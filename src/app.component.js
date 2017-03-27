"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var AppComponent = (function () {
    function AppComponent() {
        this.selectedCountries = [1, 2];
        this.countries = [
            { id: 1, name: 'Sweden' },
            { id: 2, name: 'Norway' },
            { id: 3, name: 'Denmark' },
            { id: 4, name: 'Finland' },
        ];
        this.texts = {
            defaultTitle: 'Select countries'
        };
        this.selectSettings = {
            checkedStyle: 'glyphicon',
            showCheckAll: true,
            showUncheckAll: true,
        };
        this.selectSettings2 = {
            enableSearch: true,
        };
        this.selectSettings3 = {
            selectionLimit: 3,
            dynamicTitleMaxItems: 0,
        };
        this.selectSettings4 = {
            selectionLimit: 1,
            autoUnselect: true
        };
    }
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        template: "\n\t\t<div>\n\t\t\t<h2>Default</h2>\n\t\t\t<ss-multiselect-dropdown [options]=\"countries\" [texts]=\"texts\"></ss-multiselect-dropdown>\n      <h3>Markup</h3>\n\n\t\t\t<h2>Glyphicons and check all/none</h2>\n\t\t\t<ss-multiselect-dropdown [options]=\"countries\" [settings]=\"selectSettings\" [texts]=\"texts\"></ss-multiselect-dropdown>\n      <h3>Markup</h3>\n\n\t\t\t<h2>Search filter</h2>\n\t\t\t<ss-multiselect-dropdown [options]=\"countries\" [settings]=\"selectSettings2\" [texts]=\"texts\"></ss-multiselect-dropdown>\n      <h3>Markup</h3>\n\n\t\t\t<h2>Default model, selection limit and no dynamic title</h2>\n\t\t\t<ss-multiselect-dropdown [options]=\"countries\" [settings]=\"selectSettings3\" [texts]=\"texts\"></ss-multiselect-dropdown>\n      <h3>Markup</h3>\n\n      <h2>Default model, selection limit, auto-unselect</h2>\n\t\t\t<ss-multiselect-dropdown [options]=\"countries\" [settings]=\"selectSettings4\" [texts]=\"texts\"></ss-multiselect-dropdown>\n      <h3>Markup</h3>\n\n\t    </div>\n\t",
        providers: []
    })
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map