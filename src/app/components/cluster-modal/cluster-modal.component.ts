import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ClusterContainer } from 'src/app/models/basic_models.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-cluster-modal',
  templateUrl: './cluster-modal.component.html',
  styleUrls: ['./cluster-modal.component.scss'],
})
export class ClusterModalComponent implements OnInit, OnDestroy {
  @Input() ids: number[] = [];
  @Input() count: number;
  containers: ClusterContainer[] = [];
  loading = false;
  loadFailed = false;
  private loadSubscription: Subscription;

  constructor(public modalController: ModalController, private api: ApiService) {}

  ngOnInit() {
    this.loadContainers();
  }

  ngOnDestroy() {
    if (this.loadSubscription) {
      this.loadSubscription.unsubscribe();
    }
  }

  loadContainers() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.loadFailed = false;
    this.loadSubscription = this.api.getClusterContainers(this.ids).subscribe(
      containers => {
        this.containers = containers;
        this.loading = false;
      },
      error => {
        console.error('Error loading cluster containers', error);
        this.loading = false;
        this.loadFailed = true;
      }
    );
  }

  select(container: ClusterContainer) {
    this.modalController.dismiss(container);
  }

  close() {
    this.modalController.dismiss();
  }
}
