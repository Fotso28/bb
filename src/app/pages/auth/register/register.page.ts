import { animate, group, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AnimationController, LoadingController, NavController } from '@ionic/angular';
import { showError, showToast } from 'src/app/_lib/lib';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  animations: [
    trigger('slideRight', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        group([
          animate('300ms ease-out', style({ transform: 'translateX(0%)' })),  // Animation du transform
          animate('300ms ease-out', style({ opacity: 1 }))  // Animation de l'opacité
        ])
      ]),
      transition(':leave', [
        group([
          animate('300ms ease-in', style({ transform: 'translateX(-100%)' })),  // Animation du transform
          animate('0ms ease-in', style({ opacity: 0 }))  // Animation de l'opacité
        ])
      ])
    ]),
    trigger('slideLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        group([
          animate('300ms ease-out', style({ transform: 'translateX(0%)' })),  // Animation du transform
          animate('300ms ease-out', style({ opacity: 1 }))  // Animation de l'opacité
        ])
      ]),
      transition(':leave', [
        group([
          animate('300ms ease-in', style({ transform: 'translateX(100%)' })),  // Animation du transform
          animate('0ms ease-in', style({ opacity: 0 }))  // Animation de l'opacité
        ])
      ])
    ])
  ]
})
export class RegisterPage implements OnInit {
  
  registerForm!: FormGroup;
  step: number = 1; // Contrôle l'étape actuelle du formulaire
  errorMessage: string = "";

  constructor(
    private fb: FormBuilder, 
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      localite: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  onNext() {
    if(!!this.registerForm.controls["username"].errors || !!this.registerForm.controls["telephone"].errors){
      const usernameControl = this.registerForm.get("username");
      usernameControl?.markAsTouched({ onlySelf: true });
  
      const telephoneControl = this.registerForm.get("telephone");
      telephoneControl?.markAsTouched({ onlySelf: true });
      return
    }
    this.step = 2; // Passer à l'étape suivante
  }

  onPriview() {
    this.step = 1; // Passer à l'étape suivante
  }

  

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password &&password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
  }

  async onSubmit() {

    if (this.registerForm.invalid) {
      console.log(this.registerForm.controls);
      this.validateAllFormFields(this.registerForm);
      this.navigateUrl();
    }

    if (this.registerForm.valid) {
      const loading = await this.loadingCtrl.create({
        message: 'Inscription en cours...', // Message affiché pendant le chargement
      });

      await loading.present();

      const { username, telephone, localite, password } = this.registerForm.value;
      
      console.log('je suis ici')
      this.authService.register(username, telephone, localite, password).subscribe(
        {
          next: async (response) => {
            await loading.dismiss(); // Masquer le chargement après la réponse du serveur
              // Optionnel: Gérer la réponse de l'inscription, par exemple afficher un message de succès ou rediriger
              this.navCtrl.navigateRoot('/login'); // Redirection vers la page de connexion
              showToast("Compte crée!")
              console.log(response);
            },
            error: async (error) => {
              console.log(error)
              await loading.dismiss(); // Masquer le chargement en cas d'erreur
              if(error.status == 409){
                showError("Cet utilisateur existe déjà")
              }
              if(error.status == 500){
                showError("Echec de connexion")
              }
              this.errorMessage = 'Inscription échouée. Veuillez vérifier vos informations.';
            }
        }
        );
      } else {
        this.errorMessage = 'Veuillez remplir correctement le formulaire.';
      }
    }

  navigateUrl(){
    this.navCtrl.navigateForward('/login', {
      animated: true,
      animationDirection: 'forward', // 'back' pour l'animation inverse
      animation: (baseEl: HTMLElement, opts?: any) => {

        const animationCtrl = new AnimationController();

        const fadeAnimation = animationCtrl
          .create()
          .addElement(opts.enteringEl)
          .duration(500)
          .fromTo('opacity', 0, 1);

        return fadeAnimation;
      },
    });
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  get username(){
    return this.registerForm.get('username')
  }
  get telephone(){
    return this.registerForm.get('telephone')
  }
  get localite(){
    return this.registerForm.get('localite')
  }
  get password(){
    return this.registerForm.get('password')
  }
  get confirmPassword(){
    return this.registerForm.get('confirmPassword')
  }
  
}
