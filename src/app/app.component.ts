import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, LoadingController, ToastController, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SigninPage } from '../pages/signin/signin';
import { AuthService } from '../_services/auth.service';
import { ChatPage } from '../pages/chat/chat';
import { SettingsService } from '../_services/settings.service';
import { SettingsPage } from '../pages/settings/settings';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = SigninPage;
  //rootPage:any = ChatPage;
  chatPage:any = ChatPage;
  settingsPage: any = SettingsPage;
  isLoggedIn: boolean;
  @ViewChild('nav') nav: NavController;

  constructor(platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    private menuCtrl: MenuController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private settingService: SettingsService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    this.isLoggedIn = this.authService.loggedIn();
      if(this.isLoggedIn) {
        this.rootPage = this.chatPage;
      }
  }

  onHome() {
    this.nav.setRoot(this.chatPage);
    this.menuCtrl.close();
  }

  onLoad(page: any) {
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }
  onLogOut() {
    const loader = this.loadingCtrl.create({
      content: 'Singing Out'
    });
    const toast = this.toastCtrl.create({
      message: 'Signed Out Successfully',
      duration: 2000
    });
    loader.present();
    this.authService.currentUser = null;
    this.authService.userToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.nav.setRoot(SigninPage);
    this.menuCtrl.close();
    loader.dismiss();
    toast.present();
  }
}

