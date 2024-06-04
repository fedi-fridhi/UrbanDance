import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupesService {

  private apiUrl = 'http://localhost/api'; // Replace with the actual URL of your PHP API

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getAllGroupes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list_groupes.php`);
  }

  createGroupe(groupeData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create_groupe.php`, groupeData, this.httpOptions);
  }

  deleteGroupe(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_groupe.php`, { body: { id: id }, ...this.httpOptions });
  }
  getGroupeById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_group.php`, { params: { id }, ...this.httpOptions });
  }

  updateGroupe(groupeData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update_groupe.php`, groupeData, this.httpOptions);
  }

  addInscription(groupId: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/addG_inscription.php`, { groupId, userId }, this.httpOptions);
  }

  deleteInscription(groupId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteG_inscription.php`, { body: { groupId, userId }, ...this.httpOptions });
  }

  mySubscriptions(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/myG_inscriptions.php`, { params: { userId }, ...this.httpOptions });
  }

  groupeStudents(groupId: number): Observable<any> {
    let params = new HttpParams().set('groupId', groupId.toString());
    return this.http.get<any>(`${this.apiUrl}/groupe_students.php`, { params });
  }
}
