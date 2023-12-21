import { Component, OnInit, ViewChild, ElementRef,  } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SessionService } from 'src/app/services/session.service';
import { UtilsService } from "src/app/services/utils.service";
import { ActivatedRoute } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AuthService } from 'src/app/services/auth.service';
//import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-report-form',
  templateUrl: './report.form.html',
  styleUrls: ['./user.page.scss'],
  providers: [InAppBrowser]
})
export class ReportForm implements OnInit {

  public success: boolean;
  public fail: boolean;

  @ViewChild('photo', { static: false }) fileInput: ElementRef;

  constructor(
    public formBuilder: FormBuilder,
    private nav: NavController,
    public session: SessionService,
    public utils: UtilsService,
    private route: ActivatedRoute,
    private iab: InAppBrowser,
    private auth: AuthService,
    
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
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      subject: new FormControl(''),
      comment: new FormControl('', Validators.required),
      photo: new FormControl(null)
    });
    this.auth.loadUserData().then(
      (user) => {
        this.user_data.controls['name'].setValue(user.name);
        this.user_data.controls['email'].setValue(user.email);
        }
    );
  }
  ngAfterViewInit() {
    if ( this.route.snapshot.params['containerID'].includes((',')) ) {
      this.selectSubject('mapa');
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
  //
  goTo(link) {
    this.iab.create(link, '_system');
  }
  report() {
    this.session.isLoading = true;
    Object.keys(this.user_data.controls).forEach( control => {
      if (this.user_data.controls[control].status == 'INVALID' ) {
        this.error[control] = true;
      }
    });
    //Subject assign
    if (!this.subject_id) {
      this.error.subject = true;
    }
    else {
      this.user_data.value.subject = this.subject_id;
    }
    if ( Object.keys(this.error).length ) {
      this.session.isLoading = false;
      return false;
    } 
    //Validates comment
    /*if ( this.user_data.value.comment.length < 10 ) {
      this.error.comment = true;
      this.session.isLoading = false;
      return false;
    }*/
    this.user_data.value.id = this.route.snapshot.params['containerID'];
    //Assign file to send along
    if (this.file) {
      this.user_data.value.file = this.file;
      this.user_data.value.fileType = this.fileType;
    }
    this.utils.createReport(this.user_data.value).subscribe(
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
