/*
Resize component - used to resize passed components horizontally or vertically.
Horizontal resize is the default.
Inputs:
direction - options: 'vertical', 'horizontal'. Default 'horizontal'
collapsed - options: true / false. Default false. Used for components that have expanded and collapsed state
disabled - options true / false. Default false. Useful when displaying sets of elements where only some of the have resize property.

*/

import {
  Component,
  ElementRef,
  Input,
  HostListener,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-resize',
  templateUrl: './resize.component.html',
  styleUrls: ['./resize.component.css']
})
export class ResizeComponent {
  @Input() direction;
  @Input() collapsed;
  @Input() disabled;
  @ViewChild('content') content: ElementRef;

  private heightModel;
  private isMouseDown: boolean;
  private MIN_WIDH = 400;
  private MIN_HEIGHT = 100;
  private keepBelowContent = false;

  private initOffset;
  private initSize;
  private minSize;
  private size;

  constructor(private elementRef: ElementRef) {}

  private contentHeight;

  ngOnInit() {
    if (this.disabled) { return; }

    if (this.direction === 'vertical') {
      this.minSize = this.MIN_HEIGHT;
      this.size = Math.max(this.minSize, this.elementRef.nativeElement.clientHeight);

    } else {
      this.minSize = this.MIN_WIDH;
      this.size = this.elementRef.nativeElement.clientWidth;
    }
  }

  isVertical() {
    return this.direction === 'vertical';
  }

  getWidth() {
    if (this.isVertical()) { return; }
    return this.size
  }

  getHeight() {
    if (this.disabled) { return; }

    if (this.collapsed) {
      return 0;
    } else {
      return this.size;
    }
  }

  getMinHeight() {
    this.contentHeight = this.content.nativeElement.clientHeight;

    if (this.contentHeight <= this.size) {
      this.keepBelowContent = true;

    } else if (this.keepBelowContent === true && this.contentHeight > this.size) {
      this.size = this.contentHeight;
    }
      return Math.min(this.size, this.contentHeight);
  }

  calcSize(currentOffset) {
    return this.initSize + currentOffset - this.initOffset
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e) {
    if (!this.isMouseDown || this.disabled) { return; }
    this.keepBelowContent = false;
    e.preventDefault();

    let offset;
    if (!this.isVertical()) {
      offset = e.clientX;
    } else {
      offset = e.clientY;
    }

    this.size = Math.max(this.minSize, this.calcSize(offset));
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(e) {
    if (this.disabled) { return; }

    if (e.target.className && (e.target.className.includes('spacer') || e.target.className.includes('handle') )) {
      e.stopPropagation();
      this.isMouseDown = true;
      this.initSize = this.size;

      if (!this.isVertical()) {
        this.initOffset = e.clientX;
      } else {
        this.initOffset = e.clientY;
      }
    }
  }

  @HostListener('mouseup')
  mouseStateReset() {
    this.isMouseDown = false;
  }

  @HostListener('mouseleave')
  mouseOptionalReset() {
    if (!this.isVertical()) {
      this.isMouseDown = false;
    }
  }
}
