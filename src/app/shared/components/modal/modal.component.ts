import { Component, ViewChild } from '@angular/core';
import { EmitterService } from '../../../services/emitter.service';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  @ViewChild('modal') private _modal: ModalDirective;

  public success: boolean;
  public message: string;
  public time: number;
  public code: number;
  public data: Array<[string, string]>;
  public method: string;
  public type: string;

  constructor (private _emitterService: EmitterService) {
    this._emitterService.error$.subscribe(
      message => {
        this.success = false;
        this.message = message;
        this._modal.show();
      }
    );

    this._emitterService.info$.subscribe(
      payload => {
        this.success = true;
        this.message = payload.text;
        this.code = payload.code;
        this.time = payload.time;
        this.method = payload.res ? payload.res.method : '';
        this.type = payload.res ? payload.res.type : '';

        if (payload.res) {
          this.data = Array.isArray(payload.res.data)
            ? payload.res.data
            : Object.entries(payload.res.data);

        } else {
          this.data = [];
        }

        this._modal.show();
      }
    );
  }
}
