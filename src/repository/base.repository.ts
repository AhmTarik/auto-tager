import { Injectable, Scope } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';

@Injectable({ scope: Scope.REQUEST })
export class BaseRepository {
  constructor(protected readonly httpService: HttpService) {}

  public get<T>(url: string, config?: AxiosRequestConfig): Observable<T> {
    return this.httpService
      .get<T>(url, config)
      .pipe(map((response) => response.data));
  }
}
