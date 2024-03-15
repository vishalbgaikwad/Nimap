import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../app.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CLIENT_RENEG_LIMIT } from 'tls';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {

  products: {
    productId: number,
    productName: string,
    categoryId: number,
    categoryName: string,
  }[] = []
  showAddProduct: boolean = false;
  newProductName: string = '';
  editingProductId: number | null = null;
  catId: number = 0

  isNext: boolean = false
  page: number = 1
  constructor(private activatedRoute: ActivatedRoute, private appService: AppService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(data => {
      this.page = data["page"] || 1
    })
    this.activatedRoute.params.subscribe(
      (params) => {
        this.catId = params['categoryId']
        this.getProducts(params['categoryId'], this.page)
      }
    );

  }

  getProducts(catId: number, page: number) {
    this.appService.getProductsByCategory(catId, { params: { page } }).subscribe((response) => {
      this.isNext = response.isNext
      this.products = response.data
    })
  }
  toggleAddProduct(): void {
    this.showAddProduct = !this.showAddProduct;
  }
  addProduct(): void {
    this.appService.addProduct(this.newProductName, this.catId).subscribe({
      error: () => alert("Cannot add product"),
      next: () => {
        this.newProductName = ""
        this.showAddProduct = false
        this.getProducts(this.catId, this.page)
      }
    })
  }
  toggleEdit(id: number): void {
    this.editingProductId = id
  }

  deleteProduct(id: number): void {
    this.appService.deleteProduct(id).subscribe({
      next: () => this.getProducts(this.catId, this.page),
      error: () => alert("Cannot delete product")
    })
  }

  updateProduct(product: any) {
    this.appService.updateProduct(product.productId, this.newProductName).subscribe(data => {
      this.newProductName = ""
      this.editingProductId = 0
      this.getProducts(this.catId, this.page)
    })
  }

  nextPage() {
    this.page += 1
    this.getProducts(this.catId, this.page)
  }
  prevPage() {
    this.page -= 1
    this.getProducts(this.catId, this.page)
  }
}
