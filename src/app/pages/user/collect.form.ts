import { Component, OnInit, ViewChild, ElementRef,  } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
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
  //wasteTypes: {key: string, value:string}
  /*wasteTypes = [
    {value: '2,materials', name: 'Papel', checked: null},
    {value: '3,materials', name: 'Plástico', checked: null},
    {value: '101,wastes', name: 'Latas', checked: null},
    {value: '2,materials',name: 'Cartón', checked: null},
    {value: '4,materials', name: 'Vidrio', checked: null},
    {value: '123,wastes', name: 'Tetrapak', checked: null}
  ];*/

  ngOnInit() {
    this.user_data = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      //document: new FormControl(null, Validators.required),
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])),
      email: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])],

      neighborhood: new FormControl(null, Validators.required),
      address: new FormControl('', Validators.required),
      addressDetail: new FormControl('', Validators.required),
      //wasteType: this.formBuilder.array([], [Validators.required]),
      weight: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])),
      //donation: new FormControl(null, Validators.required),
      comment: new FormControl('', Validators.required),
      terms: new FormControl(null, Validators.required),
    });
  }
  //
  onSelectionChange(e, i) {
    const checkboxArrayList: FormArray = this.user_data.get('wasteType') as FormArray;
    if (e.detail.checked) {
      checkboxArrayList.push(new FormControl(e.detail.value));
    }
    else {
      checkboxArrayList.controls.forEach((item: FormControl, index) => {
        if (item.value == e.detail.value) {
          checkboxArrayList.removeAt(index);
          return;
        }
      });
    }
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
    this.user_data.value.latlng = this.map.userPosition ? this.map.userPosition.join(' ') : '';
    //Assign file to send along
    this.utils.collectRequest(this.user_data.value).subscribe(
      (res) => {
        this.session.isLoading = false;
        if (res) {
          this.success = true;
          this.fail = false;
        }
        else {
          this.success = false;
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
    /*const checkboxArrayList: FormArray = this.user_data.get('wasteType') as FormArray;
    checkboxArrayList.controls.forEach((item: FormControl, index) => {
      this.wasteTypes.forEach((type, i) => {
        if (item.value == type.value) {
          this.wasteTypes[i].checked = true;
        }
      });
    });*/
    delete this.fail;
    delete this.success;
  }
}
