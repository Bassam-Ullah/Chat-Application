import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { mocktoken } from './auth.service.spec';
import { mockUserTenentId } from './chat.service.spec';


@Injectable({
  providedIn: 'root'
})
export class HttpRequestInterceptorMockService implements HttpInterceptor {

  constructor(private injector: Injector) { }
  intercept(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    const BASE_URL = environment.BASE_URL
    const API_URL = environment.API_URL

    if(request.url && request.url.indexOf(API_URL+'auth/token')>-1){
      return of(new HttpResponse({ status: 200, body: mocktoken }));
    }

    if(request.url && request.url.indexOf(BASE_URL+'/userTenantId')>-1){
      return of(new HttpResponse({ status: 200, body: mockUserTenentId }));
    }

    return next.handle(request);
  }
}
