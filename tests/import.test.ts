// // import { describe, it, expect } from 'vitest';
// import { mount } from '@vue/test-utils';
// import App from '../app.vue';

// import { test, expect } from '@playwright/test';
// import PocketBase from 'pocketbase';

// // Test data
// const TEST_TODO = {
//   title: 'Test Todo',
//   description: 'Test Description'
// };

// test.beforeAll(async () => {
//     const pb = new PocketBase('http://127.0.0.1:8090');
//     try {
//       const records = await pb.collection('Todos').getFullList();
//       console.log('Cleaning up existing todos...');
//       for (const record of records) {
//         await pb.collection('Todos').delete(record.id);
//       }
//       console.log('Database cleanup completed');
//     } catch (error) {
//       console.error('Error during database cleanup:', error);
//       throw error; // This will fail the tests if cleanup fails
//     }
//   });

// test.describe('Todo Application', () => {
//   test.beforeEach(async ({ page }) => {
//     // Navigate to the application
//     await page.goto('/');
    
//     // Wait for the card title to be visible to ensure page is loaded
//     await page.waitForSelector('text=To-Do List');
//   });

//   test('should display the todo form', async ({ page }) => {
//     // Check if main elements are visible
//     await expect(page.getByText('To-Do List')).toBeVisible();
//     await expect(page.getByText('Manage your tasks')).toBeVisible();
//     await expect(page.getByLabel('Task Title')).toBeVisible();
//     await expect(page.getByLabel('Task Description')).toBeVisible();
//     await expect(page.getByRole('button', { name: 'Add Task' })).toBeVisible();
//   });

//   test('should create a new todo', async ({ page }) => {
//     // Fill in the todo form
//     await page.getByLabel('Task Title').fill(TEST_TODO.title);
//     await page.getByLabel('Task Description').fill(TEST_TODO.description);
    
//     // Submit the form
//     await page.getByRole('button', { name: 'Add Task' }).click();
    
//     // Verify the todo was added
//     await expect(page.getByText(TEST_TODO.title)).toBeVisible();
//     await expect(page.getByText(TEST_TODO.description)).toBeVisible();
//   });

//   test('should show error when submitting empty title', async ({ page }) => {
//     // Try to submit without a title
//     await page.getByRole('button', { name: 'Add Task' }).click();
    
//     // Verify error message
//     await expect(page.getByText('Title is required')).toBeVisible();
//   });

//   test('should toggle todo completion', async ({ page }) => {
//     // Create a todo first
//     await page.getByLabel('Task Title').fill(TEST_TODO.title);
//     await page.getByLabel('Task Description').fill(TEST_TODO.description);
//     await page.getByRole('button', { name: 'Add Task' }).click();
    
//     // Get the checkbox for the created todo
//     const checkbox = page.locator('input[type="checkbox"]').first();
    
//     // Toggle completion
//     await checkbox.check();
//     await expect(checkbox).toBeChecked();
    
//     // Verify the todo text is struck through
//     const todoText = page.locator('.line-through');
//     await expect(todoText).toBeVisible();
    
//     // Toggle back
//     await checkbox.uncheck();
//     await expect(checkbox).not.toBeChecked();
//   });

//   test('should remove a todo', async ({ page }) => {
//     // Create a todo first
//     await page.getByLabel('Task Title').fill(TEST_TODO.title);
//     await page.getByLabel('Task Description').fill(TEST_TODO.description);
//     await page.getByRole('button', { name: 'Add Task' }).click();
    
//     // Get initial todo count
//     const initialTodos = await page.locator('li').count();
    
//     // Click remove button
//     await page.getByRole('button', { name: 'Remove' }).first().click();
    
//     // Verify todo was removed
//     const finalTodos = await page.locator('li').count();
//     expect(finalTodos).toBe(initialTodos - 1);
//     await expect(page.getByText(TEST_TODO.title)).not.toBeVisible();
//   });

//   test('should persist todos after page reload', async ({ page }) => {
//     // Create a todo
//     await page.getByLabel('Task Title').fill(TEST_TODO.title);
//     await page.getByLabel('Task Description').fill(TEST_TODO.description);
//     await page.getByRole('button', { name: 'Add Task' }).click();
    
//     // Reload the page
//     await page.reload();
    
//     // Verify todo still exists
//     await expect(page.getByText(TEST_TODO.title)).toBeVisible();
//     await expect(page.getByText(TEST_TODO.description)).toBeVisible();
//   });

//   test('should handle offline state', async ({ page }) => {
//     // Simulate offline mode by failing PocketBase requests
//     await page.route('**/api/collections/Todos/**', route => route.abort());
    
//     // Try to create a todo
//     await page.getByLabel('Task Title').fill(TEST_TODO.title);
//     await page.getByLabel('Task Description').fill(TEST_TODO.description);
//     await page.getByRole('button', { name: 'Add Task' }).click();
    
//     // Verify error message
//     await expect(page.locator('.bg-red-100')).toBeVisible();
//   });
// });

// // tests/e2e/pages/todo-page.ts

// import { Page, Locator } from '@playwright/test';

// export class TodoPage {
//   readonly page: Page;
//   readonly titleInput: Locator;
//   readonly descriptionInput: Locator;
//   readonly addButton: Locator;
//   readonly todoList: Locator;

//   constructor(page: Page) {
//     this.page = page;
//     this.titleInput = page.getByLabel('Task Title');
//     this.descriptionInput = page.getByLabel('Task Description');
//     this.addButton = page.getByRole('button', { name: 'Add Task' });
//     this.todoList = page.locator('li');
//   }

//   async goto() {
//     await this.page.goto('/');
//   }

//   async addTodo(title: string, description: string = '') {
//     await this.titleInput.fill(title);
//     await this.descriptionInput.fill(description);
//     await this.addButton.click();
//   }

//   async toggleTodo(index: number) {
//     const checkbox = this.todoList.nth(index).locator('input[type="checkbox"]');
//     await checkbox.click();
//   }

//   async removeTodo(index: number) {
//     await this.todoList.nth(index).getByRole('button', { name: 'Remove' }).click();
//   }

//   async getTodoCount() {
//     return await this.todoList.count();
//   }
// }