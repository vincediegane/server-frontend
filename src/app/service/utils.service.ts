import { DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { format, parseISO } from 'date-fns';

@Injectable()
export class UtilsService {
  constructor(private readonly router: Router, private readonly nbToastrService: NbToastrService) {}

  formatDecimal(decimal: string, format?: string): string | null {
    const decimalPipe = new DecimalPipe('fr');
    decimal = decimal.replace(',', '.');
    decimal = decimal.replace(/\s/g, '');
    const result = format == null ? decimalPipe.transform(decimal) : decimalPipe.transform(decimal, format);

    return result;
  }

  parseDecimal(value: string | number): number | null {
    if (value !== null) {
      value = '' + value;
      if (value.trim() !== '') {
        value = value.replace(',', '.');
        value = value.replace(/\s/g, '');

        return parseFloat(value);
      }
    }
    return null;
  }

  parseDate(value: Date | string): Date | null {
    return parseDate(value);
  }

  formatDate(value: Date | string, theFormat = 'yyyy-MM-dd'): string | null {
    const dValue = this.parseDate(value);
    return dValue ? format(dValue, theFormat) : null;
  }

  redirectTo(route: string, state = null): void {
    if (state == null) {
      this.router.navigateByUrl(route);
    } else {
      this.router.navigateByUrl(route, { state });
    }
  }

  markFormControlsAsTouched(formGroup: FormGroup): void {
    Object.keys(formGroup?.controls).forEach((field) => formGroup.controls[field].markAllAsTouched());
  }

  displayAlert(message: string, title = null): void {
    this.nbToastrService.show(message, title, {
      status: 'warning',
      duration: 5000,
      // preventDuplicates: true,
      icon: '',
      destroyByClick: true,
      toastClass: title ? 'cb-toast' : 'cb-toast-without-title',
      preventDuplicates:true
    });
  }

  displayInfo(message: string, title = null): void {
    this.nbToastrService.show(message, title, {
      status: 'info',
      duration: 5000,
      icon: '',
      destroyByClick: true,
      toastClass: title ? 'cb-toast' : 'cb-toast-without-title',
      preventDuplicates:true
    });
  }

  displayError(message: string, title: string = '', displayAsHtml = false): void {
    this.nbToastrService.show(message, title, {
      status: 'danger',
      duration: 10000,
      icon: '',
      destroyByClick: true,
      toastClass: title ? 'cb-toast' : 'cb-toast-without-title',
      preventDuplicates:true
    });
    // }
  }

  downloadFile(b64File: string, filename?: string, type = 'application/pdf'): void {
    var byteCharacters = atob(b64File);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var blob = new Uint8Array(byteNumbers);
    const file = new Blob([blob], { type });

    const url = window.URL.createObjectURL(file);

    const element = document.createElement('a');
    element.href = url;
    element.target = '_blank';
    element.download = filename;
    document.body.appendChild(element);
    element.click();

    document.body.removeChild(element);

    // window.open(url, '_blank');
  }

  openFileOnNewTab(b64File: string): void {
    window.open('data:application/pdf,' + escape(b64File));
  }
}

export const isNullOrEmpty = (value: string) => value == null || value.length === 0;

export const parseDate = (value: Date | string) => {
  let sValue: string;
  if (value != null && value instanceof Date) {
    sValue = (value as Date).toISOString();
  } else {
    sValue = value as string;
  }

  return sValue ? parseISO(sValue) : null;
};
