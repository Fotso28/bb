import { AnimationController, Animation } from '@ionic/angular';

export const slideWithElementsAnimation = (baseEl: HTMLElement, opts?: any): Animation => {
  const animationCtrl = new AnimationController();

  const isBackDirection = opts.direction === 'back';
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;

  // Animation pour la page entière
  const pageAnimation = animationCtrl
    .create()
    .addElement(enteringEl)
    .duration(500)
    .easing('ease-in-out')
    .fromTo('transform', isBackDirection ? 'translateX(-100%)' : 'translateX(100%)', 'translateX(0%)');

  // Animation pour les éléments de la page (par exemple, le contenu, en-têtes, etc.)
  const elementsAnimation = animationCtrl
    .create()
    .addElement(enteringEl.querySelectorAll('ion-header, ion-content, ion-footer'))
    .duration(500)
    .easing('ease-in-out')
    .fromTo('opacity', 0, 1);

  // Animation pour la page quittant
  const leavingPageAnimation = animationCtrl
    .create()
    .addElement(leavingEl)
    .duration(500)
    .easing('ease-in-out')
    .fromTo('transform', 'translateX(0%)', isBackDirection ? 'translateX(100%)' : 'translateX(-100%)');

  return animationCtrl.create().addAnimation([pageAnimation, elementsAnimation, leavingPageAnimation]);
};
