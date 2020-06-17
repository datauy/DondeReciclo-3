import { AnimationController } from '@ionic/angular';
import { NavOptions, createAnimation } from '@ionic/core';

const animationCtrl = new AnimationController();

// export interface TransitionOptions extends NavOptions {
//   // progressCallback?: ((ani: Animation | undefined) => void);
//   baseEl: any;
//   enteringEl: HTMLElement;
//   leavingEl: HTMLElement | undefined;
// }

function getIonContentElement(element: HTMLElement) {
  const ionPage = element.querySelector(
    '.ion-page ion-content'
  );
  console.log(ionPage);

  if (ionPage) {
    return ionPage;
  }

  return element;

}
function getIonHeaderElement(element: HTMLElement) {
  const ionPage = element.querySelector(
    '.ion-page #header-main ion-toolbar ion-buttons'
  );
  console.log(ionPage);
  if (ionPage) {
    return ionPage;
  }

  return element;
}

export function navPage(_: HTMLElement, opts: any) {
  const duration = 300;
  const backDirection = opts.direction === 'back';
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;

  // get the header elements to animate
  const enteringHeaderEl = getIonHeaderElement(enteringEl);
  const enteringHeaderElHeight = enteringHeaderEl.clientHeight;
  const leavingHeaderEl = getIonHeaderElement(leavingEl);
  const leavingHeaderElHeight = leavingHeaderEl.clientHeight;

  // console.log(enteringHeaderEl, leavingHeaderEl);
  console.log(enteringHeaderElHeight, leavingHeaderElHeight);

  // get the content to animate
  const enteringContentEl = getIonContentElement(enteringEl);
  const leavingContentEl = getIonContentElement(leavingEl);

  // console.log(enteringContentEl, leavingContentEl)

  const rootTransition = animationCtrl.create();

  const enterPageTransition = animationCtrl.create();
  // const leavingPageTransition = animationCtrl.create();

  const enterContentTransition = animationCtrl.create();
  const leavingContentTransition = animationCtrl.create();

  const enterHeaderTransition = animationCtrl.create();
  const leavingHeaderTransition = animationCtrl.create();

  enterPageTransition
    .duration(duration)
    .addElement(enteringEl)
    // .beforeRemoveClass('ion-page-invisible')

  enterContentTransition
    .duration(duration)
    .addElement(enteringContentEl)
    // .fill('both')
    .beforeStyles({opacity: 1})
    // .keyframes([
    //     { offset: 0, opacity: 0 },
    //     { offset: 0.8, opacity: 0 },
    //     { offset: 1, opacity: 1 }
    //   ])
    ;

  leavingContentTransition
    .duration(duration)
    .addElement(leavingContentEl)
    .keyframes([
        { offset: 0, opacity: 1 },
        // { offset: 0.8, opacity: 1 },
        { offset: 1, opacity: 0 }
      ])
    ;

  enterHeaderTransition
    .addElement(enteringHeaderEl)
    .duration(duration)
    .easing('ease-out')
    // .keyframes([
    //     { offset: 0, opacity: 0 },
    //     // { offset: 0.8, opacity: 0 },
    //     { offset: 1, opacity: 1 }
    //   ])

  leavingHeaderTransition
    .addElement(leavingHeaderEl)
    .easing('ease-out')
    .duration(duration)
    .keyframes([
      // { offset: 0, opacity: 1, transform: 'translateY(0)'},
      // { offset: 0.5, opacity: 1, transform: 'translateY(-120px)'},
      // { offset: 1, opacity: 0}
      { offset: 0, opacity: 1, height: `${leavingHeaderElHeight}px`},
      { offset: 0.8, opacity: 1},
      { offset: 1, opacity: 0, height:  `${enteringHeaderElHeight}px`}
    ]);

  rootTransition.addAnimation([
    enterPageTransition,
    leavingHeaderTransition,
    leavingContentTransition,
    enterHeaderTransition,
    enterContentTransition,]);

  return rootTransition;
};
