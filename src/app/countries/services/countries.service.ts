import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Country, Region, SmallCountry } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private _regions: Region[] = [
    Region.africa, Region.americas, Region.asia, Region.europe, Region.oceania
  ]
  private _http: HttpClient = inject(HttpClient)
  private _baseUrl: string = 'https://restcountries.com/v3.1'

  get regions(): Region[] {
    return [...this._regions]
  }


  getCountriesByRegion(region: Region): Observable<SmallCountry[]> {
    if (!region) {
      return of([])
    }

    const url: string = `${this._baseUrl}/region/${region}?fields=name,cca3,borders`
    return this._http.get<Country[]>(url)
      .pipe(
        map(countries => countries.map(country => ({
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? []
        }))),
      )
  }


  getCountryByCode(code: string): Observable<SmallCountry> {

    const url: string = `${this._baseUrl}/alpha/${code}?fields=name,cca3,borders`
    return this._http.get<Country>(url)
      .pipe(
        map(country => ({
          name: country.name.common,
          cca3: code,
          borders: country.borders ?? []
        })),
      )
  }


  getCountriesBordersByCodes(borders: string[]): Observable<SmallCountry[]> {
    if (!borders || borders.length === 0) {
      return of([])
    }

    const countriesRequests: Observable<SmallCountry>[] = []
    
    // I create an array of requests, one for each border.
    borders.forEach(code => {
      const request: Observable<SmallCountry> = this.getCountryByCode(code)
      countriesRequests.push(request)
    })

    return combineLatest(countriesRequests)

  }

}
