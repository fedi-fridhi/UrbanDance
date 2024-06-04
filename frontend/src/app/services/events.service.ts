import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private apiUrl = 'http://localhost/api'; // Replace with your actual backend API URL

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  addEvent(eventData: any): Observable<any> {
    const url = `${this.apiUrl}/add_event.php`;
    return this.http.post(url, eventData, this.httpOptions);
  }

  getEventById(id: any): Observable<any> {
    const url = `${this.apiUrl}/get_event.php?id=${id}`;
    return this.http.get(url);
  }

  updateEvent(eventData: any): Observable<any> {
    const url = `${this.apiUrl}/update_event.php`;
    return this.http.put(url, eventData, this.httpOptions);
  }
  getAllNextEvents(): Observable<any> {
    const url = `${this.apiUrl}/get_all_next_events.php`;
    return this.http.get(url);
  }
  getAllEvents(): Observable<any> {
    const url = `${this.apiUrl}/get_all_events.php`;
    return this.http.get(url);
  }
  

  deleteEvent(id: number): Observable<any> {
    const url = `${this.apiUrl}/delete_event.php`;
    return this.http.post(url, { id: id }, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
      .pipe(
        tap(_ => console.log('delete event success')),
        catchError(this.handleError('deleteEvent'))
      );
  }
  
  private handleError(operation = 'operation', result?: any) {
    return (error: any): Observable<any> => {
      console.error(`${operation} failed: ${error.message}`); // log to console instead
  
      // Let the app keep running by returning an empty result.
      return of(result);
    };
  }
  
  

  addSubscription(eventId: number, userId: number): Observable<any> {
    const url = `${this.apiUrl}/add_subscription.php`;
    return this.http.post(url, { eventId, userId }, this.httpOptions);
  }

  removeSubscription(eventId: number, userId: number): Observable<any> {
    const url = `${this.apiUrl}/delete_subscription.php`;
    return this.http.post(url, { eventId, userId }, this.httpOptions);
  }
  listMyEvents(userId: number): Observable<any> {
    const url = `${this.apiUrl}/listmyeventsubs.php?userId=${userId}`;
    return this.http.get(url);
  }
  getEventSubscribers(eventId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/getEventSubscribers.php?id=${eventId}`);
  }
  


  isSubscribedToEvent(eventId: number, userId: number): Observable<any> {
    const url = `${this.apiUrl}/issubscribedtoevent.php?eventId=${eventId}&userId=${userId}`;
    return this.http.get(url);
  }
  uploadBanner(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('banner', file, file.name);
  
    const url = `${this.apiUrl}/upload_banner.php`;
    return this.http.post(url, formData); // Note: Don't set 'Content-Type' header when using FormData
  }
  searchCoachByName(coachName: string): Observable<number> {
    const url = `${this.apiUrl}/search_coach.php?name=${encodeURIComponent(coachName)}`;
    return this.http.get(url).pipe(
      map((response: any) => {
        // Assuming the backend returns an object with a 'coachId' property
        return response.coachId;
      })
    );
  }
}
