import { HttpInterceptorFn } from '@angular/common/http';
import { Type } from '@angular/core';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
      
    });
  }
  return next(req);
};
