import { AnimationController } from '@ionic/angular';
import { NavOptions, createAnimation } from '@ionic/core';

const animationCtrl = new AnimationController();

// export interface TransitionOptions extends NavOptions {
//   // progressCallback?: ((ani: Animation | undefined) => void);
//   baseEl: any;
//   enteringEl: HTMLElement;
//   leavingEl: HTMLElement | undefined;
// }

function getIonPageElement(element: HTMLElement) {
  if (element.classList.contains('ion-page')) {
    return element;
  }

  const ionPage = element.querySelector(
    ':scope > .ion-page, :scope > ion-nav, :scope > ion-tabs'
  );
  if (ionPage) {
    return ionPage;
  }

  return element;
}
function getIonHeaderElement(element: HTMLElement) {
  const ionPage = element.querySelector(
    '#header-main > ion-toolbar ion-buttons'
  );
  if (ionPage) {
    return ionPage;
  }

  return element;
}

export const navPage = (_: HTMLElement, opts: any) => {
  const duration = 300;
  const backDirection = opts.direction === 'back';
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;
  const enteringHeaderEl = getIonHeaderElement(enteringEl);
  const enteringHeaderElHeight = enteringHeaderEl.clientHeight;
  console.log(enteringHeaderEl);

  const leavingHeaderEl = getIonHeaderElement(leavingEl);
  const leavingHeaderElHeight = leavingHeaderEl.clientHeight;

  // console.log(typeof('100px'), leavingHeaderElHeight);


  const rootTransition = animationCtrl.create();
  const enterPageTransition = animationCtrl.create();
  const leavingPageTransition = animationCtrl.create();

  const enterHeaderTransition = animationCtrl.create();
  const leavingHeaderTransition = animationCtrl.create();

  enterPageTransition
    .addElement(enteringEl)
    .duration(duration)
    // .fill('both')
    // .beforeRemoveClass('ion-page-invisible')
    .keyframes([
        { offset: 0, opacity: 0 },
        { offset: 0.5, opacity: 0 },
        { offset: 1, opacity: 1 }
      ])
    ;

  leavingPageTransition
    .addElement(enteringEl)
    .duration(duration)
    ;

  enterHeaderTransition
    .addElement(enteringHeaderEl)
    .duration(duration);

  leavingHeaderTransition
    .addElement(leavingHeaderEl)
    .easing('ease-out')
    .duration(duration);

  enterHeaderTransition
    .beforeStyles({
                  // background: 'blue'
                  // height: leavingHeaderElHeight
                })
    .easing('ease-out')
    .keyframes([
        { offset: 0, opacity: 0 },
        { offset: 1, opacity: 1 }
      ])

  leavingHeaderTransition
    .keyframes([
      { offset: 0, opacity: 1, height: `${leavingHeaderElHeight}px`},
      { offset: 0.5, opacity: 0},
      { offset: 1, opacity: 0, height:  `${enteringHeaderElHeight}px`}
    ]);

  rootTransition.addAnimation([
    enterPageTransition,
    leavingPageTransition,
    enterHeaderTransition,
    leavingHeaderTransition,]);

  return rootTransition;
};
