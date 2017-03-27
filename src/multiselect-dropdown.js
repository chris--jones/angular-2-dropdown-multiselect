/*
 * Angular 2 Dropdown Multiselect for Bootstrap
 *
 * Simon Lindh
 * https://github.com/softsimon/angular-2-dropdown-multiselect
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var MULTISELECT_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return MultiselectDropdown; }),
    multi: true
};
var MultiSelectSearchFilter = (function () {
    function MultiSelectSearchFilter() {
    }
    MultiSelectSearchFilter.prototype.transform = function (options, args) {
        var matchPredicate = function (option) { return option.name.toLowerCase().indexOf((args || '').toLowerCase()) > -1; }, getChildren = function (option) { return options.filter(function (child) { return child.parentId === option.id; }); }, getParent = function (option) { return options.find(function (parent) { return option.parentId === parent.id; }); };
        return options.filter(function (option) {
            return matchPredicate(option) ||
                (typeof (option.parentId) === 'undefined' && getChildren(option).some(matchPredicate)) ||
                (typeof (option.parentId) !== 'undefined' && matchPredicate(getParent(option)));
        });
    };
    return MultiSelectSearchFilter;
}());
MultiSelectSearchFilter = __decorate([
    core_1.Pipe({
        name: 'searchFilter'
    })
], MultiSelectSearchFilter);
exports.MultiSelectSearchFilter = MultiSelectSearchFilter;
var MultiselectDropdown = (function () {
    function MultiselectDropdown(element, differs) {
        this.element = element;
        this.disabled = false;
        this.selectionLimitReached = new core_1.EventEmitter();
        this.dropdownClosed = new core_1.EventEmitter();
        this.onAdded = new core_1.EventEmitter();
        this.onRemoved = new core_1.EventEmitter();
        this.numSelected = 0;
        this.isVisible = false;
        this.searchFilterText = '';
        this.defaultSettings = {
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
            maxHeight: '300px',
        };
        this.defaultTexts = {
            checkAll: 'Check all',
            uncheckAll: 'Uncheck all',
            checked: 'checked',
            checkedPlural: 'checked',
            searchPlaceholder: 'Search...',
            defaultTitle: 'Select',
            allSelected: 'All selected',
        };
        this.onModelChange = function (_) { };
        this.onModelTouched = function () { };
        this.differ = differs.find([]).create(null);
    }
    MultiselectDropdown.prototype.onClick = function (target) {
        var parentFound = false;
        while (target != null && !parentFound) {
            if (target === this.element.nativeElement) {
                parentFound = true;
            }
            target = target.parentElement;
        }
        if (!parentFound) {
            this.isVisible = false;
            this.dropdownClosed.emit();
        }
    };
    MultiselectDropdown.prototype.getItemStyle = function (option) {
        if (!option.isLabel) {
            return { 'cursor': 'pointer' };
        }
    };
    MultiselectDropdown.prototype.ngOnInit = function () {
        this.settings = Object.assign(this.defaultSettings, this.settings);
        this.texts = Object.assign(this.defaultTexts, this.texts);
        this.title = this.texts.defaultTitle || '';
    };
    MultiselectDropdown.prototype.writeValue = function (value) {
        if (value !== undefined) {
            this.model = value;
        }
    };
    MultiselectDropdown.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
    };
    MultiselectDropdown.prototype.registerOnTouched = function (fn) {
        this.onModelTouched = fn;
    };
    MultiselectDropdown.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    MultiselectDropdown.prototype.ngDoCheck = function () {
        var changes = this.differ.diff(this.model);
        if (changes) {
            this.updateNumSelected();
            this.updateTitle();
        }
    };
    MultiselectDropdown.prototype.validate = function (c) {
        return (this.model && this.model.length) ? null : {
            required: {
                valid: false,
            },
        };
    };
    MultiselectDropdown.prototype.registerOnValidatorChange = function (fn) {
        throw new Error('Method not implemented.');
    };
    MultiselectDropdown.prototype.clearSearch = function (event) {
        event.stopPropagation();
        this.searchFilterText = '';
    };
    MultiselectDropdown.prototype.toggleDropdown = function () {
        this.isVisible = !this.isVisible;
        if (!this.isVisible) {
            this.dropdownClosed.emit();
        }
    };
    MultiselectDropdown.prototype.isSelected = function (option) {
        return this.model && this.model.indexOf(option.id) > -1;
    };
    MultiselectDropdown.prototype.setSelected = function (event, option) {
        if (!this.model) {
            this.model = [];
        }
        var index = this.model.indexOf(option.id);
        if (index > -1) {
            this.model.splice(index, 1);
            this.onRemoved.emit(option.id);
        }
        else {
            if (this.settings.selectionLimit === 0 || (this.settings.selectionLimit && this.model.length < this.settings.selectionLimit)) {
                this.model.push(option.id);
                this.onAdded.emit(option.id);
            }
            else {
                if (this.settings.autoUnselect) {
                    this.model.push(option.id);
                    this.onAdded.emit(option.id);
                    var removedOption = this.model.shift();
                    this.onRemoved.emit(removedOption);
                }
                else {
                    this.selectionLimitReached.emit(this.model.length);
                    return;
                }
            }
        }
        if (this.settings.closeOnSelect) {
            this.toggleDropdown();
        }
        this.onModelChange(this.model);
        this.onModelTouched();
    };
    MultiselectDropdown.prototype.updateNumSelected = function () {
        this.numSelected = this.model && this.model.length || 0;
    };
    MultiselectDropdown.prototype.updateTitle = function () {
        var _this = this;
        if (this.numSelected === 0) {
            this.title = this.texts.defaultTitle || '';
        }
        else if (this.settings.dynamicTitleMaxItems && this.settings.dynamicTitleMaxItems >= this.numSelected) {
            this.title = this.options
                .filter(function (option) {
                return _this.model && _this.model.indexOf(option.id) > -1;
            })
                .map(function (option) { return option.name; })
                .join(', ');
        }
        else if (this.settings.displayAllSelectedText && this.model.length === this.options.length) {
            this.title = this.texts.allSelected || '';
        }
        else {
            this.title = this.numSelected
                + ' '
                + (this.numSelected === 1 ? this.texts.checked : this.texts.checkedPlural);
        }
    };
    MultiselectDropdown.prototype.checkAll = function () {
        var _this = this;
        this.model = this.options
            .map(function (option) {
            if (_this.model.indexOf(option.id) === -1) {
                _this.onAdded.emit(option.id);
            }
            return option.id;
        });
        this.onModelChange(this.model);
        this.onModelTouched();
    };
    MultiselectDropdown.prototype.uncheckAll = function () {
        var _this = this;
        this.model.forEach(function (id) { return _this.onRemoved.emit(id); });
        this.model = [];
        this.onModelChange(this.model);
        this.onModelTouched();
    };
    MultiselectDropdown.prototype.preventCheckboxCheck = function (event, option) {
        if (this.settings.selectionLimit &&
            this.model.length >= this.settings.selectionLimit &&
            this.model.indexOf(option.id) === -1) {
            event.preventDefault();
        }
    };
    return MultiselectDropdown;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], MultiselectDropdown.prototype, "options", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], MultiselectDropdown.prototype, "settings", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], MultiselectDropdown.prototype, "texts", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], MultiselectDropdown.prototype, "disabled", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], MultiselectDropdown.prototype, "selectionLimitReached", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], MultiselectDropdown.prototype, "dropdownClosed", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], MultiselectDropdown.prototype, "onAdded", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], MultiselectDropdown.prototype, "onRemoved", void 0);
__decorate([
    core_1.HostListener('document: click', ['$event.target']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [HTMLElement]),
    __metadata("design:returntype", void 0)
], MultiselectDropdown.prototype, "onClick", null);
MultiselectDropdown = __decorate([
    core_1.Component({
        selector: 'ss-multiselect-dropdown',
        providers: [MULTISELECT_VALUE_ACCESSOR],
        styles: ["\n    a {\n      outline: none !important;\n    }\n  "],
        template: "\n    <div class=\"dropdown\">\n      <button type=\"button\" class=\"dropdown-toggle\" [ngClass]=\"settings.buttonClasses\"\n              (click)=\"toggleDropdown()\" [disabled]=\"disabled\">{{ title }}&nbsp;<span class=\"caret\"></span></button>\n      <ul *ngIf=\"isVisible\" class=\"dropdown-menu\" [class.pull-right]=\"settings.pullRight\" [class.dropdown-menu-right]=\"settings.pullRight\"\n          [style.max-height]=\"settings.maxHeight\" style=\"display: block; height: auto; overflow-y: auto;\">\n        <li class=\"dropdown-item search\" *ngIf=\"settings.enableSearch\">\n          <div class=\"input-group input-group-sm\">\n            <span class=\"input-group-addon\" id=\"sizing-addon3\"><i class=\"fa fa-search\"></i></span>\n            <input type=\"text\" class=\"form-control\" placeholder=\"{{ texts.searchPlaceholder }}\"\n                   aria-describedby=\"sizing-addon3\" [(ngModel)]=\"searchFilterText\" [ngModelOptions]=\"{standalone: true}\">\n            <span class=\"input-group-btn\" *ngIf=\"searchFilterText.length > 0\">\n  \t\t\t    <button class=\"btn btn-default btn-secondary\" type=\"button\" (click)=\"clearSearch($event)\"><i class=\"fa fa-times\"></i></button>\n\t          </span>\n          </div>\n        </li>\n        <li class=\"dropdown-divider divider\" *ngIf=\"settings.enableSearch\"></li>\n        <li class=\"dropdown-item check-control check-control-check\" *ngIf=\"settings.showCheckAll\">\n          <a href=\"javascript:;\" role=\"menuitem\" tabindex=\"-1\" (click)=\"checkAll()\">\n            <span style=\"width: 16px;\"\n              [ngClass]=\"{'glyphicon glyphicon-ok': settings.checkedStyle !== 'fontawesome',\n              'fa fa-check': settings.checkedStyle === 'fontawesome'}\"></span>\n            {{ texts.checkAll }}\n          </a>\n        </li>\n        <li class=\"dropdown-item check-control check-control-uncheck\" *ngIf=\"settings.showUncheckAll\">\n          <a href=\"javascript:;\" role=\"menuitem\" tabindex=\"-1\" (click)=\"uncheckAll()\">\n            <span style=\"width: 16px;\"\n              [ngClass]=\"{'glyphicon glyphicon-remove': settings.checkedStyle !== 'fontawesome',\n              'fa fa-times': settings.checkedStyle === 'fontawesome'}\"></span>\n            {{ texts.uncheckAll }}\n          </a>\n        </li>\n        <li *ngIf=\"settings.showCheckAll || settings.showUncheckAll\" class=\"dropdown-divider divider\"></li>\n        <li class=\"dropdown-item\" [ngStyle]=\"getItemStyle(option)\" *ngFor=\"let option of options | searchFilter:searchFilterText\"\n            (click)=\"!option.isLabel && setSelected($event, option)\" [class.dropdown-header]=\"option.isLabel\">\n          <template [ngIf]=\"option.isLabel\">\n            {{ option.name }}\n          </template>\n          <a *ngIf=\"!option.isLabel\" href=\"javascript:;\" role=\"menuitem\" tabindex=\"-1\">\n            <input *ngIf=\"settings.checkedStyle === 'checkboxes'\" type=\"checkbox\"\n              [checked]=\"isSelected(option)\" (click)=\"preventCheckboxCheck($event, option)\"/>\n            <span *ngIf=\"settings.checkedStyle === 'glyphicon'\" style=\"width: 16px;\"\n                  class=\"glyphicon\" [class.glyphicon-ok]=\"isSelected(option)\"></span>\n            <span *ngIf=\"settings.checkedStyle === 'fontawesome'\" style=\"width: 16px;display: inline-block;\">\n  \t\t\t      <i *ngIf=\"isSelected(option)\" class=\"fa fa-check\" aria-hidden=\"true\"></i>\n  \t\t\t    </span>\n            <span [ngClass]=\"settings.itemClasses\">\n              {{ option.name }}\n            </span>\n          </a>\n        </li>\n      </ul>\n    </div>\n  "
    }),
    __metadata("design:paramtypes", [core_1.ElementRef,
        core_1.IterableDiffers])
], MultiselectDropdown);
exports.MultiselectDropdown = MultiselectDropdown;
var MultiselectDropdownModule = (function () {
    function MultiselectDropdownModule() {
    }
    return MultiselectDropdownModule;
}());
MultiselectDropdownModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, forms_1.FormsModule],
        exports: [MultiselectDropdown, MultiSelectSearchFilter],
        declarations: [MultiselectDropdown, MultiSelectSearchFilter],
    })
], MultiselectDropdownModule);
exports.MultiselectDropdownModule = MultiselectDropdownModule;
//# sourceMappingURL=multiselect-dropdown.js.map