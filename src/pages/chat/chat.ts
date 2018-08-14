import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { WBABotService } from '../../_services/wba-bot.service';
import { Content, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Dialogs } from '@ionic-native/dialogs';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { FileUploader } from 'ng2-file-upload';

import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Photo } from '../../_models/Photo';
import { SettingsService } from '../../_services/settings.service';

declare var cordova: any;


@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  query: string;
  botResponse = [];
  messages = [];
  @ViewChild(Content) content: Content;
  matches: string[];
  isRecording: boolean = false;
  showError: boolean = false;
  timeData: any;
  loading: Loading;
  path: any;
  uploader: FileUploader = new FileUploader({});
  lastImage: string = null;
  imgUrl: string;

  constructor(private wbaService: WBABotService,
    private speechRecog: SpeechRecognition,
    private dialogs: Dialogs,
    private cdr: ChangeDetectorRef,
    private tts: TextToSpeech,
    private file: File,
    private filePath: FilePath,
    private fileTransfer: FileTransfer,
    private camera: Camera,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private settingService: SettingsService) {
    this.timeData = Date.now();
  }

  

  GetBotResponse(userQuery: string, input: any, imageUrl: string) {
    this.query = '';
    this.imgUrl = '';
    if (userQuery !== null && userQuery !== "" && userQuery !== undefined) {
      this.botResponse = [];
      this.wbaService.GetBotResponse(userQuery, imageUrl).subscribe(
        (response) => {
          //console.log(response);
          var botMes = (response.botMessage == "") ? ((response.incidentRepository.length !== 0) ? response.incidentRepository : response.botMessage) : response.botMessage;
          if (response.incidentRepository.length !== 0) {
            response.incidentRepository.forEach(mes => {
              this.botResponse.push(mes.number + '  ' + mes.incident);
            });
          }
          if ((this.botResponse.length === 0) && (response.botMessage == "")) {
            this.botResponse.push("I am still learning!");
          }

          if ((botMes != "") && (this.botResponse.length === 0)) {
            this.botResponse.push(botMes);
          }
          this.query = '';
          input.setFocus();
          this.messages.push({
            userMessage: userQuery,
            botMessages: this.botResponse,
            imgUrl: imageUrl,
            createdAt: Date.now()
          });

          if (this.settingService.isTTSEnabled()) {
            this.tts.speak(this.botResponse[0])
            .then(() => console.log('TTS - Success'))
            .catch((reason: any) => console.log(reason));
          }
        },
        (error) => {
          //console.log(error);
          this.showError = true;
          this.query = error;
        }
      );
    }

  }

  StartListening(input: any) {
    this.speechRecog.hasPermission().then(
      (hasPermission: boolean) => {
        if (!hasPermission) {
          this.speechRecog.requestPermission();
        }
      });
    let options = {
      language: 'en-US'
    }
    this.speechRecog.startListening().subscribe(
      matches => {
        this.matches = matches;
        this.cdr.detectChanges();
        this.query = this.matches[0];
        if (this.query !== null || this.query !== '') {
          this.GetBotResponse(this.query, input,'');
        }
      }
    );
    this.isRecording = true;
  }

  OnGetPicture(input: any) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, input);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA, input);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  takePicture(sourceType, input: any) {
    var options = {
      quality: 50,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then(
      (imagePath) => {
        // special handling for Android Library
        if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
          this.filePath.resolveNativePath(imagePath)
            .then(filePath => {
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName(),input);
              
            });
        } else {
          var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName(),input);
          
        }
      }, (error) => {
        this.presentToast('Error while selecting image.');
      }
    )
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName, input: any) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.UploadImage(input);
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public UploadImage(input: any) {
    var url = 'https://wba1-app.azurewebsites.net/api/photos/upload/';

    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);
    this.path = targetPath;
    // File name only
    var filename = this.lastImage;

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: { 'fileName': filename }
    };

    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loading.dismissAll()
      this.presentToast('Image succesful uploaded.');
      const res: Photo = JSON.parse(data.response);
      this.imgUrl = res.url;
      this.GetBotResponse('upload screen shot',input, this.imgUrl);
      
    }, err => {
      this.loading.dismissAll()
      this.presentToast('Error while uploading file.');
    });
    this.lastImage = '';
  }

  scrollToBottom() {
    this.content.scrollToBottom(0);
  }

}
