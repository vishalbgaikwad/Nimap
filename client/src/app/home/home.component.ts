import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  categories: { categoryId: number; categoryName: string }[] = [];
  editingCategoryId: number | null = null;
  showAddCategory: boolean = false;
  newCategoryName: string = '';

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.getAllCategory();
  }

  getAllCategory() {
    this.appService.getAllCategories().subscribe((response) => {
      this.categories = response.data;
    });
  }

  toggleAddCategory(): void {
    this.showAddCategory = !this.showAddCategory;
    if (!this.showAddCategory) {
      this.newCategoryName = '';
    }
  }

  addCategory(): void {
    if (this.newCategoryName.trim() !== '') {
      this.appService
        .createCategory(this.newCategoryName)
        .subscribe((response) => {
          this.newCategoryName = '';
          this.showAddCategory = false;
          this.getAllCategory();
        });
    }
  }

  toggleEdit(categoryId: number): void {
    this.editingCategoryId = categoryId;
  }

  updateCategory(category: { categoryId: number; categoryName: string }): void {
    this.appService.updateCategory(category).subscribe((response) => {
      this.editingCategoryId = null;
    });
  }

  deleteCategory(categoryId: number): void {
    this.appService.deleteCategorie(categoryId).subscribe((response) => {
      this.getAllCategory();
    });
  }
}
