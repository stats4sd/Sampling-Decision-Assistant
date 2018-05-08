import { trigger, state, style, animate, transition } from '@angular/animations';

// note, define as seperate constants to allow import with aot compile
// http://www.advancesharp.com/blog/1228/angular-5-reusable-animation-with-a-single-file
// https://github.com/angular/angular/issues/12917

export const flyin = [
    trigger('flyin', [
        state('in', style({ transform: 'translateX(0)' })),
        transition('void => in', [
            style({ transform: 'translateX(100%)' }),
            animate(150)
        ]),
        transition('in => void', [
            style({ transform: 'translateX(100%)' }),
            animate(150)
        ])
    ])
];

export const fadein = [
    trigger('fadein', [
        state('in', style({ opacity: '1' })),
        state('out', style({opacity:'0'})),
        transition('void => in', [
            style({ opacity: '0' }),
            animate('200ms ease-in')
        ])
    ])
];

export const expand = [
    trigger('expand',[
        state('expanded',style({height:'*'})),
        transition('void=>expanded',[
            style({height:0}),
            animate(150)
        ]),
        transition('expanded=>void',[
            animate(150,style({height:0}))
        ])
    ])
]

    
   
    // transition('fadein <=> fadeout', [
    //     animate(200)
    // ]),




// export default

//     trigger('animationState', [
//         // fly in and out
//         state('flyIn',
//             style({ transform: 'translateX(0)' }),
//         ),
//         state('fadein', style({ opacity: '1' })),
//         state('fadeout', style({ opacity: '0' })),
//         transition('void => flyIn', [
//             style({ transform: 'translateX(100%)' }),
//             animate(150),
//         ]),
//         transition('flyIn => void', [
//             animate(150, style({ transform: 'translateX(100%)' })),
//         ]),
//         // expand in and out
//         state('expandIn',
//             style({ height: '*' }),
//         ),
//         // expand in animation
//         transition('void => expandIn', [
//             style({ height: 0 }),
//             animate(150),
//         ]),
//         // expand out animation
//         transition('expandIn => void', [
//             animate(150, style({ height: 0 })),
//         ]),
//         transition('void => fadein', [
//             style({ opacity: '0' }), animate('200ms ease-in')
//         ]),
//         transition('fadein <=> fadeout', [
//             animate(200)
//         ]),


//     ])
