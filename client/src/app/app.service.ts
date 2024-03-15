import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public backendUrl = 'http://localhost:1234';

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}/category`);
  }

  createCategory(categoryName: string): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/category`, {
      categoryName,
    });
  }

  updateCategory(category: {
    categoryId: number;
    categoryName: string;
  }): Observable<any> {
    return this.http.put<any>(
      `${this.backendUrl}/category/${category.categoryId}`,
      { categoryName: category.categoryName }
    );
  }

  deleteCategorie(categoryId: number): Observable<any> {
    return this.http.delete<any>(`${this.backendUrl}/category/${categoryId}`);
  }

  getAllProducts(): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}/product`);
  }

  getProductsByCategory(categoryId: number, options? : any): Observable<any> {
    return this.http.get<any>(
      `${this.backendUrl}/product/by-category/${categoryId}`,
      options
    );
  }

  addProduct(productName: string, categoryId: number): Observable<any> {
    return this.http.post<any>(
      `${this.backendUrl}/product/`,
      { productName, categoryId }
    );
  }


  deleteProduct(pid: number): Observable<any> {
    return this.http.delete<any>(
      `${this.backendUrl}/product/${pid}`,
    );
  }

  updateProduct(pid: number, productName: string): Observable<any> {
    return this.http.put<any>(
      `${this.backendUrl}/product/${pid}`,
      { productName }
    );
  }
}
