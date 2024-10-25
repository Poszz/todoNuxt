import { test, expect } from '@playwright/test';
import PocketBase from 'pocketbase';

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
    await page.waitForSelector(`text=${TEST_TODO.Title}`);
    
    // Find and click the checkbox
    const todoItem = page.locator('.todo-item').first();
    const checkbox = todoItem.locator('input[type="checkbox"]');
    await checkbox.check();
    
    // Wait for the state to update
    await page.waitForSelector('.line-through');
    
    // Verify the todo is marked as completed
    await expect(checkbox).toBeChecked();
    await expect(page.locator('.line-through')).toBeVisible();
  });

  test('should remove a todo', async ({ page }) => {
    // Create a todo first
    await page.getByTestId('task-title-input').fill(TEST_TODO.Title);
    await page.getByTestId('task-description-input').fill(TEST_TODO.Description);
    await page.getByTestId('add-task-button').click();
    
    // Wait for the todo to appear
    await page.waitForSelector(`text=${TEST_TODO.Title}`);
    
    // Get initial count of todos
    const initialCount = await page.locator('li').count();
    
    // Click the remove button and wait for the item to be removed
    await page.getByRole('button', { name: 'Remove' }).click();
    await page.waitForTimeout(500); // Wait for the removal animation/transition
    
    // Verify the todo was removed
    const finalCount = await page.locator('li').count();
    expect(finalCount).toBe(initialCount - 1);
  });

  test('should show error for empty title', async ({ page }) => {
    // Try to submit without a title
    await page.getByTestId('add-task-button').click();
    
    // Wait for and verify error message
    await page.waitForSelector('[role="alert"]');
    await expect(page.getByText('Title is required')).toBeVisible();
  });
});