import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
})
export class SelectorPageComponent implements OnInit {

  private _fb: FormBuilder = inject(FormBuilder)
  private _countriesService: CountriesService = inject(CountriesService)

  public countriesByRegion: SmallCountry[] = []
  public borders: SmallCountry[] = []

  public myForm: FormGroup = this._fb.group({
    region: ['', [Validators.required]],
    country: ['', [Validators.required]],
    border: ['', [Validators.required]],
  })

  ngOnInit(): void {
    this.onRegionChanged()
    this.onCountryChanged()
  }

  get regions(): Region[] {
    return this._countriesService.regions
  }


  // This method is called when the user selects a region.
  onRegionChanged(): void {
    this.myForm.get('region')!.valueChanges
      .pipe(
        tap( () => this.myForm.get('country')!.reset('') ),
        tap( () => this.borders = [] ),
        switchMap(region => this._countriesService.getCountriesByRegion(region)),
      )
      .subscribe(countries => this.countriesByRegion = countries.sort(
        (a, b) => a.name.localeCompare(b.name))
      )
  }


  // This method is called when the user selects a country.
  onCountryChanged(): void {
    this.myForm.get('country')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('border')!.reset('')),
        filter((code: string) => code.length > 0),
        switchMap(countryCode => this._countriesService.getCountryByCode(countryCode)),
        switchMap(country => this._countriesService.getCountriesBordersByCodes(country.borders)),
      )
      .subscribe(countries => {
        this.borders = countries
      })
  } 

}
