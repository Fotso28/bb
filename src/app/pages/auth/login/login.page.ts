import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  LoadingController, NavController } from '@ionic/angular';
import { showError, showToast } from 'src/app/_lib/lib';
import { BdService } from 'src/app/services/-bd.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataInitializationService } from 'src/app/services/data-initialization.service';
import { User } from 'src/app/services/user.service';


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
    private bdSvc: BdService,
    private dataInit: DataInitializationService,
    private navCtrl: NavController) {}

  async ngOnInit() {
    this.registerForm = this.fb.group({
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],  
    });
    console.log("voici les users : ", await this.bdSvc.getActiveUser());
  }

  async onSubmit(){
    if (this.registerForm.valid) {
      const loading = await this.loadingCtrl.create({
        message: 'Connexion en cours...',
        mode: "ios" // Message affiché pendant le chargement
      });

      await loading.present();

      const { telephone, password } = this.registerForm.value;
      this.authService.login(telephone, password).subscribe(
        {
          next: async (response) => {
            let user: User = response as User;
            if(!user || !user.id){
              await loading.dismiss(); // Masquer le chargement après la réponse du serveur
              showError("Utilisateur incorrect");
              return;
            }
            loading.cssClass = "connected";
            console.log(response)
            loading.message = "Chargement des données"
            setTimeout(async ()=>{
              await this.bdSvc.setActiveUser(response);
              await this.bdSvc.loadData();
              await loading.dismiss(); 
              this.navCtrl.navigateRoot('/accueil'); // Redirection vers la page principale
              showToast("Vous êtes connectés");
            }, 2000);
          },
          error: async (error) => {
            await loading.dismiss(); // Masquer le chargement en cas d'erreur
            console.log(error);
            if(error.status == 401 || error.status == 400){
              showError('Telephone ou mot de passe incorrect');
            }
            if(error.status == 0){
              showError('Erreur reseau');
            }
            this.errorMessage = 'Login failed. Please check your credentials.';
          }
        }
      );
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }

  async dropTable(){
    this.bdSvc.DropTables().then(async ()=>{
      await this.dataInit.initializeApp();
      showToast('Table dropped');
    });
  }
}
