## API Report File for "@angular/cdk_platform"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import * as i0 from '@angular/core';

// @public
export function _getEventTarget<T extends EventTarget>(event: Event): T | null;

// @public
export function _getFocusedElementPierceShadowDom(): HTMLElement | null;

// @public
export function getRtlScrollAxisType(): RtlScrollAxisType;

// @public
export function _getShadowRoot(element: HTMLElement): ShadowRoot | null;

// @public (undocumented)
export function getSupportedInputTypes(): Set<string>;

// @public
export function _isTestEnvironment(): boolean;

// @public
export function normalizePassiveListenerOptions(options: AddEventListenerOptions): AddEventListenerOptions | boolean;

// @public
export class Platform {
    constructor(..._args: unknown[]);
    ANDROID: boolean;
    BLINK: boolean;
    EDGE: boolean;
    FIREFOX: boolean;
    IOS: boolean;
    isBrowser: boolean;
    SAFARI: boolean;
    TRIDENT: boolean;
    WEBKIT: boolean;
    // (undocumented)
    static ɵfac: i0.ɵɵFactoryDeclaration<Platform, never>;
    // (undocumented)
    static ɵprov: i0.ɵɵInjectableDeclaration<Platform>;
}

// @public (undocumented)
export class PlatformModule {
    // (undocumented)
    static ɵfac: i0.ɵɵFactoryDeclaration<PlatformModule, never>;
    // (undocumented)
    static ɵinj: i0.ɵɵInjectorDeclaration<PlatformModule>;
    // (undocumented)
    static ɵmod: i0.ɵɵNgModuleDeclaration<PlatformModule, never, never, never>;
}

// @public
export enum RtlScrollAxisType {
    INVERTED = 2,
    NEGATED = 1,
    NORMAL = 0
}

// @public
export function supportsPassiveEventListeners(): boolean;

// @public
export function supportsScrollBehavior(): boolean;

// @public
export function _supportsShadowDom(): boolean;

// (No @packageDocumentation comment for this package)

```
