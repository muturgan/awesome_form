import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TooltipDirective } from 'angular-bootstrap-md';
import { timer } from 'rxjs';
import { debounce, filter } from 'rxjs/operators';
import { RestService } from '../services/rest.service';
import { IOneNestedLevelJson } from '../custom_types';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {

  @ViewChild('methodTooltip') public methodTooltip: TooltipDirective;
  @ViewChild('dataTooltip') public dataTooltip: TooltipDirective;

  public isButtonDisabled = true;
  public isLoading = false;
  public methodTooltipContent = 'Для ввода доступны только латинские буквы';
  public dataTooltipContent = 'Вы ввели невалидную строку формата JSON либо глубина вложенности больше 1';

  public formGroup = new FormGroup({
    methodControl: new FormControl('', Validators.required),
    dataControl: new FormControl('', Validators.required),
    selectControl: new FormControl('', Validators.required),
  });

  constructor (private _restService: RestService) {
    this._restService.fetching$.subscribe(
      () => this.isLoading = !this.isLoading
    );

    this.formGroup.statusChanges.subscribe((status: string) => {
      if (status === 'VALID') {
        this.isButtonDisabled = false;
      } else {
        this.isButtonDisabled = true;
      }
    });

    this.formGroup.controls['methodControl']
      .statusChanges
      .pipe(
        debounce(() => timer(900)),
        filter(status => status !== 'VALID')
      )
      .subscribe(
        () => this._showMethodTooltop()
      );
  }

  public submit(): void {
    const data = this._ejectJson( this.formGroup.controls['dataControl'].value );

    if (!data) {
      return;
    }

    const method = this.formGroup.controls['methodControl'].value;
    const httpMethod = this.formGroup.controls['selectControl'].value;

    this._restService.submit(method, data, httpMethod);

  }

  private _ejectJson(jsonStr: string): IOneNestedLevelJson | null {
    let mistake = false;
    let data: IOneNestedLevelJson = {};

    try {
      data = JSON.parse(jsonStr);

    } catch (e) {
      mistake = true;
    }

    if (!mistake) {
      for (const key in data) {
        if (
          typeof data[key] !== 'string'
          && typeof data[key] !== 'number'
          && typeof data[key] !== 'boolean'
          && data[key] !== null
          && data[key] !== undefined

        ) {
          mistake = true;
          break;
        }
      }
    }

    if (mistake) {
      this.dataTooltip.show();

      setTimeout(() => {
        this.dataTooltip.hide();
      }, 2500);

      return null;
    }

    return data;
  }

  private _showMethodTooltop() {
    if (this.formGroup.controls['methodControl'].value) {
      this.methodTooltip.show();

      setTimeout(() => {
        this.methodTooltip.hide();
      }, 2500);
    }
  }

}
