import { Component , OnDestroy } from '@angular/core';
import { ToastController, NavController, NavParams } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {
  public devices: any[] = [];
  scanSubscription: Subscription;
  connectSubscription: Subscription;

  constructor(
    private toastCtrl: ToastController,
    private ble: BLE,
  ) {}

  startScan() {
    this.scanSubscription = this.ble.startScanWithOptions([], { reportDuplicates: false })
      .subscribe( device => {
        console.log('Found a BLE device', device);
        this.devices.push(device);
      });

    setTimeout(() => {
        this.ble.stopScan()
          .then(() => console.log('Scan stopped successfully'))
          .catch(err => console.log('Scan stopped error', err));
      }, 3000);
  }

  connectToDevice(id: string) {
    console.log('Connect to device with id:', id);
    this.connectSubscription = this.ble.connect(id)
      .subscribe((data) => {
        console.log('Connect data', data);
      });
  }

  ngOnDestroy(): void {
    this.connectSubscription.unsubscribe();
    this.scanSubscription.unsubscribe();
  }

}
