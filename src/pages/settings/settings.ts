import { Component } from '@angular/core';
import { SettingsService } from '../../_services/settings.service';
import { Toggle } from 'ionic-angular';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(private settingService: SettingsService) {}

  onToggle(toggle: Toggle) {
    this.settingService.setBackground(toggle.checked);
  }

  checkTTSEnabled() {
    return this.settingService.isTTSEnabled();
  }

}
