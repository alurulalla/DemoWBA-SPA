import { Component, OnInit } from '@angular/core';

import { IonicPage, NavController, NavParams, Toggle, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { User } from '../../_models/User';
import { ChatPage } from '../chat/chat';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage implements OnInit {
  registerForm: FormGroup;
  user: User;
  loginData = {
    'email': '',
    'password': ''
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authService: AuthService, private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.CreateRegisterForm();
  }


  CreateRegisterForm() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required]

    }, { validator:  this.passwordMatchValidators});
  }

  passwordMatchValidators(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : { 'mismatch': true};
  }

  onCancel() {
    this.navCtrl.pop();
  }

  onSignUp() {
    const toast = this.toastCtrl.create({
      message: 'Registration Successfull',
      duration: 2000
    });
    const unSuccessfullToast = this.toastCtrl.create({
      message: 'UnSucessfull Registration',
      duration: 2000
    });
    const loader = this.loadingCtrl.create({
      content: 'Creating an account'
    });
    if (this.registerForm.valid) {
      loader.present()
      this.user = Object.assign({}, this.registerForm.value);
      
      console.log(this.user);
      this.authService.register(this.user).subscribe(
        () => {
          console.log('Registration Successfull');
          this.loginData.email = this.user.email;
          this.loginData.password = this.registerForm.get('password').value;
          console.log(this.loginData);
          
          this.authService.login(this.loginData).subscribe(
            (data) => {
              this.navCtrl.setRoot(ChatPage);
            },
            (error) => {
              const toast = this.toastCtrl.create({
                message: 'Login Failed',
                duration: 2000
              });
              toast.present();
            }
          )
          loader.dismiss();
          toast.present();
        },
        (error) => {
          loader.dismiss();
          unSuccessfullToast.present();
          console.log('Regisgtration UnSuccessfull');
        }
      )
    }
  }

}
