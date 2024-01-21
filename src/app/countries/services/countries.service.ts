import { Injectable } from '@angular/core';
import { Region, SmallCountry } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private _regions: Region[] = [
    Region.africa, Region.americas, Region.asia, Region.europe, Region.oceania
  ]

  get regions(): Region[] {
    return [ ...this._regions ]
  }


  getCountriesByRegion(region: Region): SmallCountry[] {
    return []
  }
}
