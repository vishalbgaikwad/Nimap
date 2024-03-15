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
    categoryId: number
  }[] = []
  showAddProduct: boolean = false;
  newProductName: string = '';
  editingProductId: number | null = null;
  catId: number = 0

  constructor(private activatedRoute: ActivatedRoute, private appService: AppService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (params) => {
        this.catId = params['categoryId']
        this.getProducts(params['categoryId'])
      }
    );
  }

  getProducts(catId: number) {
    this.appService.getProductsByCategory(catId).subscribe((response) => {
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
        this.getProducts(this.catId)
      }
    })
  }
  toggleEdit(id: number): void {
    this.editingProductId = id
  }

  deleteProduct(id: number): void {
    this.appService.deleteProduct(id).subscribe({
      next: () => this.getProducts(this.catId),
      error: () => alert("Cannot delete product")
    })
  }

  updateProduct(product: any) {
    console.log(this.newProductName)
    this.appService.updateProduct(product.productId, this.newProductName).subscribe(data => {
      this.newProductName = ""
      this.editingProductId = 0
      this.getProducts(this.catId)
    })
  }
}
