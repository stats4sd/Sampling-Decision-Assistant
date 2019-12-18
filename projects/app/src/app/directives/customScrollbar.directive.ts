import { NgModule, Directive, ElementRef } from "@angular/core";
/***************************************************************
 *  This directive can be used to apply the custom scrollbar
 *  one elements with a shadow root
 *  Not currently used (ion-content replaced with page-content),
 *  but retained for reference
 *************************************************************/

const stylesheet = `
@media screen and (max-width: 500px) {
  ::-webkit-scrollbar {
    display: none;
  }
}
::-webkit-scrollbar {
  width: 22px;
  height: 22px;
}
::-webkit-scrollbar-button {
  width: 5px;
  height: 5px;
  display: block;
  background-color: white;
}
::-webkit-scrollbar-button:start {
  background-repeat: no-repeat;
  background-position: center;
}
::-webkit-scrollbar-thumb {
  background: #0080ff;
  border: 2px solid #ffffff;
  border-radius: 20px;
}
::-webkit-scrollbar-thumb:hover {
  background: #0080ff;
}
::-webkit-scrollbar-thumb:active {
  background: #0080ff;
}
::-webkit-scrollbar-track {
  background: #ffffff;
  border: 0px none #ffffff;
  border-radius: 18px;
}
::-webkit-scrollbar-track:hover {
  background: #ffffff;
}
::-webkit-scrollbar-track:active {
  background: #ffffff;
}
::-webkit-scrollbar-corner {
  background: transparent;
}

`;

@Directive({
  selector: "[customScrollbar]"
})
export class CustomScrollbarDirective {
  constructor(el: ElementRef) {
    const base = el.nativeElement.shadowRoot
      ? el.nativeElement.shadowRoot
      : el.nativeElement;
    const styleElmt = base.querySelector("style");

    if (styleElmt) {
      styleElmt.append(stylesheet);
    } else {
      const barStyle = document.createElement("style");
      barStyle.append(stylesheet);
      el.nativeElement.shadowRoot.appendChild(barStyle);
    }
  }
}

@NgModule({
  declarations: [CustomScrollbarDirective],
  exports: [CustomScrollbarDirective]
})
export class CustomScrollbarModule {}
