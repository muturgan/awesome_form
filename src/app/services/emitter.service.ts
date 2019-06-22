import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IModatInfoPayload, IServerResponce } from '../custom_types';

@Injectable()
export class EmitterService {
    public error$ = new Subject<string>();
    public info$ = new Subject<IModatInfoPayload>();

    public dispatchTimeoutError() {
        this.error$.next('Время ожидания ответа сервера истекло.');
    }

    public dispatchHttpError() {
        this.error$.next('Запрос вернулся с ошибкой.');
    }

    dispatchFetchingSuccess(time: number, code: number, res: IServerResponce | null) {
        this.info$.next({time, code, res,
            text: 'Получен ответ сервера',
        });
    }
}
