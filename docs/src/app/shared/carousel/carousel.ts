/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {
  AfterContentInit,
  Component,
  Directive,
  ElementRef,
  ViewEncapsulation,
  input,
  contentChildren,
  viewChild,
  inject,
} from '@angular/core';
import {FocusableOption, FocusKeyManager} from '@angular/cdk/a11y';
import {LEFT_ARROW, RIGHT_ARROW, TAB} from '@angular/cdk/keycodes';
import {ANIMATION_MODULE_TYPE} from '@angular/platform-browser/animations';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';

@Directive({
  selector: '[carousel-item]',
  host: {
    'role': 'listitem',
    'tabindex': 'tabindex',
  },
})
export class CarouselItem implements FocusableOption {
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  tabindex = '-1';

  focus(): void {
    this.element.nativeElement.focus({preventScroll: true});
  }
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.html',
  styleUrls: ['./carousel.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [MatIconButton, MatIcon],
  host: {
    '[class.docs-animations-disabled]': 'animationsDisabled',
  },
})
export class Carousel implements AfterContentInit {
  readonly ariaLabel = input<string | undefined>(undefined, {alias: 'aria-label'});
  readonly items = contentChildren(CarouselItem);
  readonly list = viewChild.required<ElementRef<HTMLElement>>('list');
  readonly animationsDisabled: boolean;
  position = 0;
  showPrevArrow = false;
  showNextArrow = true;
  index = 0;
  private _keyManager!: FocusKeyManager<CarouselItem>;

  onKeydown({keyCode}: KeyboardEvent) {
    const manager = this._keyManager;
    const previousActiveIndex = manager.activeItemIndex;

    if (keyCode === LEFT_ARROW) {
      manager.setPreviousItemActive();
    } else if (keyCode === RIGHT_ARROW) {
      manager.setNextItemActive();
    } else if (keyCode === TAB && !manager.activeItem) {
      manager.setFirstItemActive();
    }

    if (manager.activeItemIndex != null && manager.activeItemIndex !== previousActiveIndex) {
      this.index = manager.activeItemIndex;
      this._updateItemTabIndices();

      if (this._isOutOfView(this.index)) {
        this._scrollToActiveItem();
      }
    }
  }

  constructor() {
    const animationsModule = inject(ANIMATION_MODULE_TYPE, {optional: true});

    this.animationsDisabled = animationsModule === 'NoopAnimations';
  }

  ngAfterContentInit(): void {
    this._keyManager = new FocusKeyManager<CarouselItem>(this.items());
  }

  /** Goes to the next set of items */
  next() {
    for (let i = this.index; i < this.items().length; i++) {
      if (this._isOutOfView(i)) {
        this.index = i;
        this._scrollToActiveItem();
        break;
      }
    }
  }

  /** Goes to the previous set of items. */
  previous() {
    for (let i = this.index; i > -1; i--) {
      if (this._isOutOfView(i)) {
        this.index = i;
        this._scrollToActiveItem();
        break;
      }
    }
  }

  /** Updates the `tabindex` of each of the items based on their active state. */
  private _updateItemTabIndices() {
    this.items().forEach((item: CarouselItem) => {
      if (this._keyManager != null) {
        item.tabindex = item === this._keyManager.activeItem ? '0' : '-1';
      }
    });
  }

  /** Scrolls an item into the viewport. */
  private _scrollToActiveItem() {
    if (!this._isOutOfView(this.index)) {
      return;
    }

    const itemsArray = this.items();
    let targetItemIndex = this.index;

    // Only shift the carousel by one if we're going forwards. This
    // looks better compared to moving the carousel by an entire page.
    if (this.index > 0 && !this._isOutOfView(this.index - 1)) {
      targetItemIndex = itemsArray.findIndex((_, i) => !this._isOutOfView(i)) + 1;
    }

    this.position = itemsArray[targetItemIndex].element.nativeElement.offsetLeft;
    this.list().nativeElement.style.transform = `translateX(-${this.position}px)`;
    this.showPrevArrow = this.index > 0;
    this.showNextArrow = false;

    for (let i = itemsArray.length - 1; i > -1; i--) {
      if (this._isOutOfView(i, 'end')) {
        this.showNextArrow = true;
        break;
      }
    }
  }

  /** Checks whether an item at a specific index is outside of the viewport. */
  private _isOutOfView(index: number, side?: 'start' | 'end') {
    const {offsetWidth, offsetLeft} = this.items()[index].element.nativeElement;

    if ((!side || side === 'start') && offsetLeft - this.position < 0) {
      return true;
    }

    return (
      (!side || side === 'end') &&
      offsetWidth + offsetLeft - this.position > this.list().nativeElement.clientWidth
    );
  }
}
