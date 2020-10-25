import { Component, OnInit, ViewChild, ElementRef,  } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SessionService } from 'src/app/services/session.service';
import { UtilsService } from "src/app/services/utils.service";
import { ActivatedRoute } from '@angular/router';
import { MapService } from "src/app/services/map.service";
//import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-collect-form',
  templateUrl: './collect.form.html',
  styleUrls: ['./user.page.scss'],
})
export class CollectForm implements OnInit {

  public success: boolean;
  public fail: boolean;

  @ViewChild('photo', { static: false }) fileInput: ElementRef;

  constructor(
    public formBuilder: FormBuilder,
    private nav: NavController,
    public session: SessionService,
    public utils: UtilsService,
    private route: ActivatedRoute,
    private map: MapService
    //private camera: Camera
  ) { }
  /*base64Image: string;
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }*/
  user_data: FormGroup;
  subject_id: string;
  progress: number;
  file: Blob;
  is_loading: boolean;
  error: any = {};
  fileType: any = {
    name: "Agregar foto del incidente"
  };

  ngOnInit() {
    this.user_data = this.formBuilder.group({
      address: new FormControl('', Validators.required),
      weight: new FormControl(null, Validators.required),
      comment: new FormControl('', Validators.required),
    });
  }
  /*getCameraPhoto() {
    this.camera.getPicture(this.options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     // Handle error
     console.log(err);
    });
  }*/
  send() {
    this.session.isLoading = true;
    //Subprogram assign
    this.user_data.value.id = this.route.snapshot.params['subprogramID'];
    this.user_data.value.latlng = this.map.userPosition ? this.map.userPosition.join(',') : '';
    //Assign file to send along
    this.utils.collectRequest(this.user_data.value).subscribe(
      (res) => {
        this.session.isLoading = false;
        if (res) {
          this.success = true;
        }
        else {
          this.fail = true;
        }
      },
      () => {
        this.session.isLoading = false;
        this.fail = true;
      }
      /*(event) => {
        if ( event.type === HttpEventType.UploadProgress ) {
          this.progress = Math.round((100 * event.loaded) / event.total);
        }
        if ( event.type === HttpEventType.Response ) {
          console.log(event.body);
          this.session.isLoading = false;
          if (true) {
            this.success = true;
          }
          else {
            this.fail = true;
          }
        }
      }*/
    );
  }
  //
  selectSubject(id) {
    let selected = document.querySelector(".selectable.selected");
    let selection = document.querySelector("#"+id);
    if (selected) {
      selected.classList.remove('selected');
    }
    this.subject_id = id;
    selection.classList.add('selected');
  }
  //
  loadImageFromDevice(event) {
    this.is_loading = true;
    this.fileType = event.target.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(this.fileType);
    reader.onload = () => {
      this.is_loading = false;
      // get the blob of the image:
      this.file = new Blob([new Uint8Array((reader.result as ArrayBuffer))]);
      // create blobURL, such that we could use it in an image element:
      //let blobURL: string = URL.createObjectURL(this.file);
    };
    reader.onerror = (error) => {
      console.log(error);
    };
  }
  //
  goBack() {
    this.nav.back();
  }
  reload() {
    delete this.fail;
    delete this.success;
  }
}
