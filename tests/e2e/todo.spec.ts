import { test, expect } from '@playwright/test';
import PocketBase from 'pocketbase';
import { ErrorMessage } from 'vee-validate';

const TEST_TODO = {
  Title: 'Test Todo',
  Description: 'Test Description',
  Completed: false
};

test.describe('Todo Application', () => {
  test.beforeAll(async () => {
    const pb = new PocketBase('http://127.0.0.1:8090');
    try {
      const records = await pb.collection('Todos').getFullList();
      for (const record of records) {
        await pb.collection('Todos').delete(record.id);
      }
    } catch (error) {
      console.error('Error during database cleanup:', error);
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the application to load
    await page.waitForSelector('[data-testid="task-title-input"]');
  });

  test('should load the todo application', async ({ page }) => {
    await expect(page.getByText('To-Do List')).toBeVisible();
    await expect(page.getByText('Manage your tasks')).toBeVisible();
  });

  test('should create a new todo', async ({ page }) => {
    // Fill the form
    await page.getByTestId('task-title-input').fill(TEST_TODO.Title);
    await page.getByTestId('task-description-input').fill(TEST_TODO.Description);
    
    // Click the Add Task button
    await page.getByTestId('add-task-button').click();
    
    // Wait for the todo to appear in the list
    await page.waitForSelector(`text=${TEST_TODO.Title}`);
    
    // Verify the todo was added
    await expect(page.getByText(TEST_TODO.Title)).toBeVisible();
    await expect(page.getByText(TEST_TODO.Description)).toBeVisible();
  });

  test('should toggle todo completion', async ({ page }) => {
    // Create a todo first
    await page.getByTestId('task-title-input').fill(TEST_TODO.Title);
    await page.getByTestId('task-description-input').fill(TEST_TODO.Description);
    await page.getByTestId('add-task-button').click();
    
    // Wait for the todo to appear
    await page.waitForSelector(`text=${TEST_TODO.Title}`, { state: 'visible' });
    
    // Find and click the checkbox
    const todoItem = page.locator('[data-testid^="todo-item-"]').first();
    // const todoItem = page.locator('.todo-item').first();
    const todoId = await todoItem.getAttribute('data-testid');
    const checkboxId = todoId?.replace('todo-item-', 'todo-checkbox-');
    // await checkbox.check();

    // click the checkbox
    await page.getByTestId(checkboxId!).click();
    
    // Wait for the state to update
    await page.waitForSelector('.line-through');
    
    // Verify the todo is marked as completed
    await expect(page.getByTestId(checkboxId!)).toBeChecked();  
    // Check for line through  class on title 
    await expect(page.locator('.line-through')).toBeVisible();
  });

  test('should remove a todo', async ({ page }) => {
    // Create a todo first
    // Create a todo first
    await page.getByTestId('task-title-input').fill(TEST_TODO.Title);
    await page.getByTestId('task-description-input').fill(TEST_TODO.Description);
    await page.getByTestId('add-task-button').click();

    //wait for the todo 
    await page.waitForTimeout(100);
    
    // Wait for the todo to appear
    await page.waitForSelector(`text=${TEST_TODO.Title}`, { state: 'visible' });
    
    // Get the first todo item
    const todoItem = page.locator('[data-testid^="todo-item-"]').first();
    const todoId = await todoItem.getAttribute('data-testid');
    const removeButtonId = todoId?.replace('todo-item-', 'remove-todo-');
    
    // Get initial count of todos
    const initialCount = await page.locator('[data-testid^="todo-item-"]').count();
    
    // Click the remove button
    await page.getByTestId(removeButtonId!).click();
    
    // Wait for the item to be removed
    await page.waitForTimeout(1000); // Give more time for the deletion to complete
    
    // Verify the todo was removed
    const finalCount = await page.locator('[data-testid^="todo-item-"]').count();
    expect(finalCount).toBe(initialCount - 1);
  });
    
//   test('should show error for empty title', async ({ page }) => {
// // Make sure the input is empty
// await page.getByTestId('task-title-input').fill('');
// await page.getByTestId('add-task-button').click();

// // Wait for error message to appear
// // await page.waitForSelector('[data-testid="error-message"]',);

// // Get error message using the data-testid
// const errorMessage = await page.getByTestId('error-message');

// // Verify error message content
// await expect(errorMessage).toBeVisible({ timeout: 5000 });
// await expect(errorMessage).toContainText('Title is required',{ timeout: 5000 });

// // Verify no todo was added
// const todos = await page.locator('[data-testid^="todo-item-"]').count();
// expect(todos).toBe(0);
//   });
});