import { Injectable } from '@angular/core';
import { EmitterService } from './emitter.service';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { timeout, retry } from 'rxjs/operators';
import { IOneNestedLevelJson, IServerResponce } from '../custom_types';
import { baseUrl } from '../constants';

@Injectable()
export class RestService {
    public fetching$ = new Subject<void>();

    constructor( private _http: HttpClient, private _emitterService: EmitterService ) {}

    public submit(method: string, data: IOneNestedLevelJson, httpMethod: 'get' | 'post') {
        this.fetching$.next();

        const start = Number(new Date);

        this._fetch(method, data, httpMethod)
            .pipe(
                timeout(20000),
                retry(3),
            )
            .subscribe(
                res => {
                    const end = Number(new Date);

                    this._emitterService.dispatchFetchingSuccess(
                        end - start,
                        res.status,
                        res.body,
                    );

                    this.fetching$.next();
                },
                err => {
                    if (err.name && err.name === 'TimeoutError') {
                        this._emitterService.dispatchTimeoutError();
                    } else {
                        this._emitterService.dispatchHttpError();
                    }

                    this.fetching$.next();
                },
            );
    }

    private _fetch(method: string, data: IOneNestedLevelJson, httpMethod: 'get' | 'post'): Observable<HttpResponse<IServerResponce>> {
        const params: HttpParams = this._setHttpParams({method, ...data});

        return this._http.request<IServerResponce>(
            httpMethod,
            baseUrl,
            {
                params,
                responseType: 'json',
                observe: 'response',
            }
        );
    }

    private _setHttpParams(params: IOneNestedLevelJson = {}): HttpParams {
        let httpParams: HttpParams = new HttpParams();

        for (const key in params) {
            httpParams = httpParams.append(key, String(params[key]));
        }

        return httpParams;
    }

}
