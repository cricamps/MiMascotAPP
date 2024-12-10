import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.page.html',
  styleUrls: ['./configuraciones.page.scss'],
})
export class ConfiguracionesPage implements OnInit {

  constructor(private translate: TranslateService) { }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }

  ngOnInit() {
  }

}
