import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { Note } from '@app/shared/model/notes.model';
import { LoggerService } from '@shared/services/logger.service';
import { assets } from '@env/assets';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  constructor(private http: HttpClient, private logger: LoggerService) {}

  /**
   * Retrieve the notes
   *
   * @returns The NoteList as observable
   */
  getNotes(): Observable<Note[]> {
    this.logger.debug(`Gathering notes from ${assets.length} assets`);

    const observables = [];
    for (const asset of assets) {
      observables.push(this.http.get(asset));
    }

    return forkJoin(observables).pipe(map(this.toNoteList));
  }

  /**
   * Convert an array of any objects to a list of notes
   *
   * @returns The Note list
   */
  toNoteList(jsonArray: any[]): Note[] {
    const list = [];

    for (let i = 0, len = jsonArray.length; i < len; i++) {
      for (const value of Object.values(jsonArray[i])) {
        list.push(value);
      }
    }

    return list;
  }
}
