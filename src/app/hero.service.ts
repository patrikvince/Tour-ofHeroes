import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'; 

import { Hero } from './heroes/hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = "api/heroes";

  constructor(
    private http: HttpClient,
    private messageService: MessageService
) { }

  getHeroes(): Observable<Hero[]> {
    /*const heroes = of(HEROES);
    this.messageService.add('HeroService: fetched heroes');
    return heroes;*/// with RxJs of() 
    return this.http.get<Hero[]>(this.heroesUrl).pipe(tap(_ => this.log('fetched heroes')), 
      catchError(this.handleError<Hero[]>('getHeroes', []))); //from server with error handling
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    /*const hero = HEROES.find(h => h.id === id)!;
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(hero);*/
    
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(tap(_ => this.log(`fetched hero id=${id}`)),
    catchError(this.handleError<Hero>(`getHero id=${id}`)));
    
  }

  private log(message: string) {
    this.messageService.add(`HeroeService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
    .pipe(tap(_ => this.log(`update hero id=${hero.id}`)), catchError(this.handleError<any>('updateHero')));

  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(tap((newHero: Hero) => 
      this.log(`added hero w/ id=${newHero.id}`)), 
        catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${ id }`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(tap(_ => this.log(`deleted hero id=${ id }`)),
      catchError(this.handleError<Hero>('deleteHero')));
  }

  searchHeros(term: string): Observable<Hero[]> {
    if(!term.trim()) {
      return of([]);
    }
    
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(tap(x => 
      x.length ? this.log(`found heroes matching "${term}"`) : this.log(`no heroes matching "${term}"`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

}
