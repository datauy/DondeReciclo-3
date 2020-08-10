import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-report-form',
  templateUrl: './report.form.html',
  styleUrls: ['./user.page.scss'],
})
export class ReportForm implements OnInit {

  public success: boolean;
  public fail: boolean;

  constructor(
    public formBuilder: FormBuilder,
  ) { }

  user_data: FormGroup;

  ngOnInit() {
    this.user_data = this.formBuilder.group({
      body: new FormControl('', Validators.required),
    });
  }
}
