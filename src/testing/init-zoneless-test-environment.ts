import { NgModule, provideZonelessChangeDetection, } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting, } from '@angular/platform-browser/testing';

@NgModule({
  providers: [provideZonelessChangeDetection()],
})
class ZonelessTestingModule {
}

// https://github.com/angular/angular/issues/59201
export function initZonelessTestEnvironment() {
  TestBed.resetTestEnvironment();

  TestBed.initTestEnvironment(
    [BrowserTestingModule, ZonelessTestingModule],
    platformBrowserTesting(),
    { errorOnUnknownElements: true, errorOnUnknownProperties: true, },
  );
}

initZonelessTestEnvironment();
