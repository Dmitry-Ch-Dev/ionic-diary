import {Component, Input, OnInit} from '@angular/core';
import {AlertController, PopoverController} from "@ionic/angular";
import {CommonService} from "../shared/common.service";
import {TranslationService} from "../shared/translation-service.service";

@Component({
  selector: 'app-popover-actions',
  templateUrl: './popover-actions.component.html',
  styleUrls: ['./popover-actions.component.scss'],
})
export class PopoverActionsComponent implements OnInit {

  @Input()
  calendarCase;

  constructor(
    private popoverController: PopoverController,
    private alertController: AlertController,
    private commonService: CommonService,
    private translationService: TranslationService
  ) { }

  ngOnInit() {}

  changeCase() {
    this.calendarCase.comeFromCasesManager = true;
    this.commonService.redirectToCasePage(false, this.calendarCase);
    this.popoverController.dismiss();
  }

  deleteCase() {
    this.commonService.deleteCase(this.calendarCase);
    this.commonService.updateCasesManagerPage();
    this.popoverController.dismiss();
  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: this.translationService.phrases['Confirm Action'],
      message: this.translationService.phrases['Are you sure you want to delete this record?'],
      buttons: [
        {
          text: this.translationService.phrases['Yes'],
          handler: () => {
            this.deleteCase();
          }
        }, {
          text: this.translationService.phrases['No'],
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.popoverController.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }
}
