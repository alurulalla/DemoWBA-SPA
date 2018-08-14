import { Component, ViewChild } from '@angular/core';
import { WBABotService } from '../../_services/wba-bot.service';
import { Content } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  query: string;
  @ViewChild(Content) content: Content;
  messages = [];
  incidents: string = '';
  userQueries = [];
  botResponse = [];

  constructor(private wbaService: WBABotService) {

  }

  SendMessage(userQuery: string) {

  }

  GetBotResponse(userQuery: string,input: any) {
    // this.botResponse = [];
    // this.wbaService.GetBotResponse(userQuery).subscribe(
    //   (response) => {
    //     var botMes = (response.botMessage == "") ? response.incidentRepository : response.botMessage;
    //     if (response.incidentRepository.length !== 0) {

    //       botMes.forEach(mes => {
    //         // this.incidents += mes.number + ' : ' + mes.incident + '.'
    //         this.botResponse.push(mes.number + ' : ' + mes.incident);
    //       });
          
    //     }
    //     this.botResponse.push()
    //     this.messages.push({
    //       botRes: (botMes.length === 0) ? "I am still learning" : (response.incidentRepository.length !== 0) ? this.botResponse : botMes,
    //         userQuery: userQuery
    //     });
    //     this.query = '';
    //     input.setFocus();
    //     console.log(response);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // )
  }

  StartListening(input: any) {

  }

  scrollToBottom(){
    this.content.scrollToBottom(0);
}

}
