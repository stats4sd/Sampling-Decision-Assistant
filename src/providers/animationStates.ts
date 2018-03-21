import { trigger, state, style, animate, transition } from '@angular/animations';

/**********notes on animations***********

You see more tutorials and information at: https://angular.io/guide/animation

trigger: custom string that will be assigned to an element to bind correct set of animations
transition: change of state, can be defined by specific strings (e.g myFirstState and mySecondState), or use wildcard * for any state and 'void' for no state (i.e. in ngIf when first entering)
style: any particular style that should be applied to that state that is not defined elsewhere (e.g. how to perceive initial state of an element that has not rendered from ngIf)
        note, you can use css 'transform' to help construct animations like zooming in (transform:'scale(1)' -> transform:'scale(1.5)', or flying out (transform:'translateX(-100%))
animate: defines the animation using 
*/

export default

    trigger('animationState', [
        // fly in and out
        state('flyIn',
            style({ transform: 'translateX(0)' }),
        ),
        state('fadein', style({ opacity: '1' })),
        state('fadeout', style({ opacity: '0' })),
        transition('void => flyIn', [
            style({ transform: 'translateX(100%)' }),
            animate(150),
        ]),
        transition('flyIn => void', [
            animate(150, style({ transform: 'translateX(100%)' })),
        ]),
        // expand in and out
        state('expandIn',
            style({ height: '*' }),
        ),
        // expand in animation
        transition('void => expandIn', [
            style({ height: 0 }),
            animate(150),
        ]),
        // expand out animation
        transition('expandIn => void', [
            animate(150, style({ height: 0 })),
        ]),
        transition('void => fadein', [
            style({ opacity: '0' }), animate('200ms ease-in')
        ]),
        transition('fadein <=> fadeout', [
            animate(200)
        ]),


    ])

        // size and fade
        // transition('* => void', [
        //     style({ height: '*', }),
        //     animate(500, style({ height: 0, opacity: 0 })),
        // ])
