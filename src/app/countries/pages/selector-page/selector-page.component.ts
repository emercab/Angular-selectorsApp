import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region } from '../../interfaces/country.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
})
export class SelectorPageComponent implements OnInit {

  private _fb: FormBuilder = inject(FormBuilder)
  private _countriesService: CountriesService = inject(CountriesService)

  public myForm: FormGroup = this._fb.group({
    region: ['', [Validators.required]],
    country: ['', [Validators.required]],
    borders: ['', [Validators.required]],
  })

  ngOnInit(): void {
    this.onRegionChanged()
  }

  get regions(): Region[] {
    return this._countriesService.regions
  }


  onRegionChanged(): void {
    this.myForm.get('region')!.valueChanges
      .subscribe(region => {
        console.log({ region })
      })
  }

}
