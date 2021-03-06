import { Component, OnInit } from '@angular/core';
import {Events, NavController} from "@ionic/angular";
import {AppSettings} from "../models/app-settings";
import {CommonService} from "../shared/common.service";

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.page.html',
  styleUrls: ['./settings-page.page.scss'],
})
export class SettingsPagePage implements OnInit {

  notificationsEnabled:boolean = true;
  soundsEnabled:boolean = false;
  language:string = 'English';
  badgesOn:boolean = true;

  oldSettings: AppSettings = {};

  constructor(
    private navCtrl: NavController,
    private eventEmitter: Events,
    private commonSerice: CommonService
  ) { }

  ngOnInit() {
    if (
      this.commonSerice &&
      this.commonSerice.appSettings
    ) {
      this.notificationsEnabled = this.commonSerice.appSettings.notificationsEnabled;
      this.soundsEnabled = this.commonSerice.appSettings.soundsEnabled;
      this.badgesOn = this.commonSerice.appSettings.badgesOn;
      this.language = this.commonSerice.language;

      this.oldSettings = Object.assign({}, this.commonSerice.appSettings);
    }
  }

  saveSettings() {
    let appSettings = new AppSettings(
      this.notificationsEnabled,
      this.soundsEnabled,
      this.language,
      this.badgesOn
    );
    this.commonSerice.saveSettings(appSettings);

    if (this.oldSettings.chosenLanguage != this.language) {
      this.eventEmitter.publish('change language');
    }

    if (this.notificationsEnabled != this.oldSettings.notificationsEnabled) {
      if (this.notificationsEnabled) {
        this.commonSerice.scheduleAllNotifications();
      } else {
        this.commonSerice.deleteAllNotifications();
      }
    }

    if (this.badgesOn != this.oldSettings.badgesOn) {
      this.commonSerice.switchBadgesMode();
    }

    this.oldSettings = appSettings;
    this.goBack();
  }

  goBack() {
    let url = 'home';
    this.navCtrl.navigateBack(url, {
      animated: true,
      animationDirection: 'back'
    });
  }
}
