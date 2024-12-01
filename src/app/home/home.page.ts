
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  posts: { id: number; title: string; body: string }[] = [];
  errorMessage: string | null = null;

  constructor(private apiService: ApiService, private sqliteService: SqliteService) {}

  async ngOnInit() {
    await this.sqliteService.initializeDatabase();
    this.loadPosts();
  }

  async loadPosts() {
    try {
      const data = await this.apiService.fetchPosts().toPromise();
      this.posts = data || [];
      await this.sqliteService.savePosts(this.posts);
    } catch (error) {
      console.error('Error loading posts from API:', error);
      this.errorMessage = 'Failed to load data. Displaying offline content.';
      this.posts = await this.sqliteService.getPosts();
    }
  }
}
