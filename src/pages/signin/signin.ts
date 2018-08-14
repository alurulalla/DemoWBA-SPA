import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../_services/auth.service';
import { SignupPage } from '../signup/signup';
import { ChatPage } from '../chat/chat';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {
  loginForm: FormGroup;
  model: any = {};
  constructor(public navCtrl: NavController, 
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private fb: FormBuilder) {

  }

  ngOnInit() {
    this.CreateLoginForm();
  }

  CreateLoginForm() {
    this.loginForm = this.fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  onLogin() {
    const loader = this.loadingCtrl.create({
      content: 'Logging into your account..'
    });
    loader.present();
    this.authService.login(this.loginForm.value).subscribe(
      (data) => {
        console.log('logged in successfully');
        this.navCtrl.setRoot(ChatPage);
        loader.dismiss();
      },
      (error) => {
        console.log(error);
        loader.dismiss();
        const toast = this.toastCtrl.create({
          message: 'Login Failed',
          duration: 2000
        });
        toast.present();
      }
    )
  }

  onSignUp() {
    this.navCtrl.push(SignupPage);
  }
  

}
