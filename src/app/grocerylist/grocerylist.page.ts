import {Component} from '@angular/core';
import {NavController, ToastController} from '@ionic/angular';
import {GroceriesService} from '../../services/groceries.service';
import {InputDialogService} from '../../services/input-dialog.service';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';

@Component({
    selector: 'app-grocieries',
    templateUrl: 'grocerylist.page.html',
    styleUrls: ['grocerylist.page.scss']
})
export class GrocerylistPage {

    title = 'Grocery Listz';
    items: object[] = [];
    errorMessage: string;


    constructor(
                public navCtrl: NavController,
                private toastController: ToastController,
                public groceriesService: GroceriesService,
                public inputDialogServices: InputDialogService,
                private socialSharing: SocialSharing) {
        groceriesService.dataChanged$.subscribe((dataChanged: boolean) => {
            this.loadItems();
        });
        this.loadItems();
    }

    // TODO: Determine how this code is called.  Not being triggered.
    ionViewDidLoad() {
        this.loadItems();
    }

    /* UI Operations */

    loadItems() {
        this.groceriesService.getItems().subscribe(
            items => this.items = items,
            error => this.errorMessage = error as any
        );
        return this.items;
    }

    addItem() {
        console.log('Adding new item');
        this.inputDialogServices.presentGroceryItemPrompt();
    }

    editItem(item, index) {
        console.log('Editing ', item);
        this.inputDialogServices.presentGroceryItemPrompt(item, index);
    }

    shareItem(item) {
        console.log('Sharing ', item);
        const msg = 'Grocery Item - Name: ' + item.name + ' - Quantity: ' + item.qty;
        const subject = 'Shared via Grocery App';

        this.socialSharing.share(msg, subject).then(() => {
            this.presentToast('Shared sucessfully!');
        }).catch(() => {
            this.presentToast('Error while sharing ' + item.name);
        });

    }

    removeItem(item, index) {
        console.log('Removing ', item);
        this.presentToast('Removing item: ' + item.name + ' .... ');
        this.groceriesService.removeItem(item);
    }

    async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000,
            position: 'top'
        });
        toast.present();
    }
}
