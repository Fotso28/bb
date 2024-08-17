import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  LoadingController, NavController } from '@ionic/angular';
import { showError, showToast } from 'src/app/_lib/lib';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  registerForm!: FormGroup;
  errorMessage!: string;
  constructor(private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private userService: UserService,
    private navCtrl: NavController) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],  
    });
  }

  async onSubmit(){
    if (this.registerForm.valid) {
      const loading = await this.loadingCtrl.create({
        message: 'Connexion en cours...', // Message affiché pendant le chargement
      });

      await loading.present();

      const { telephone, password } = this.registerForm.value;
      this.authService.login(telephone, password).subscribe(
        {
          next: async (response) => {
            await loading.dismiss(); // Masquer le chargement après la réponse du serveur
            this.userService.setActiveUser(response.token);
            showToast("Vous êtes connectés");
            console.log(response)
            // this.navCtrl.navigateRoot('/accueil'); // Redirection vers la page principale
          },
          error: async (error) => {
            await loading.dismiss(); // Masquer le chargement en cas d'erreur
            console.log(error);
            if(error.status == 401){
              showError('Telephone ou mot de passe incorrect');
            }
            this.errorMessage = 'Login failed. Please check your credentials.';
          }
        }
      );
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }
}
