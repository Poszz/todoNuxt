import { describe, it, expect, beforeEach, beforeAll, afterEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import App from './app.vue'  // Updated import path

// Mock PocketBase
vi.mock('pocketbase', () => {
  const mockCollection = {
    getFullList: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }

  return {
    default: vi.fn(() => ({
      collection: () => mockCollection
    }))
  }
})

describe('Todo Application', () => {
  let wrapper: VueWrapper
  let pb: any
  
  const mockTodo = {
    id: '1',
    Title: 'Test Todo',
    Description: 'Test Description',
    Completed: false,
    created: '2024-01-01',
    updated: '2024-01-01'
  }

  beforeEach(async () => {
    // Clear all mocks before each test
    vi.clearAllMocks()
    
    // Create a fresh instance of PocketBase mock
    pb = new (await import('pocketbase')).default()
    
    // Mount the component
    wrapper = mount(App, {
      global: {
        stubs: ['NuxtLayout', 'NuxtRouteAnnouncer'],
        components: {
          // If you're using these components from a UI library, you might need to mock or provide them
          Card: {
            template: '<div class="card"><slot></slot></div>'
          },
          CardHeader: {
            template: '<div class="card-header"><slot></slot></div>'
          },
          CardTitle: {
            template: '<div class="card-title"><slot></slot></div>'
          },
          CardDescription: {
            template: '<div class="card-description"><slot></slot></div>'
          },
          CardContent: {
            template: '<div class="card-content"><slot></slot></div>'
          },
          Label: {
            template: '<label><slot></slot></label>'
          },
          Input: {
            template: '<input />'
          },
          Button: {
            template: '<button><slot></slot></button>'
          }
        }
      }
    })

    // Wait for component to mount and initialize
    await nextTick()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render the todo application', () => {
    expect(wrapper.text()).toContain('To-Do List')
    expect(wrapper.text()).toContain('Manage your tasks')
  })

  it('should create a new todo', async () => {
    // Mock the create method to return our mock todo
    const createMock = vi.spyOn(pb.collection('Todos'), 'create')
    createMock.mockResolvedValueOnce(mockTodo)

    // Fill in the form
    await wrapper.find('#task').setValue('Test Todo')
    await wrapper.find('#taskDescription').setValue('Test Description')

    // Submit the form
    await wrapper.find('form').trigger('submit.prevent')
    await nextTick()

    // Verify the create method was called with correct data
    expect(createMock).toHaveBeenCalledWith({
      Title: 'Test Todo',
      Description: 'Test Description',
      Completed: false
    })

    // Wait for the component to update
    await nextTick()

    // Verify the todo appears in the list
    const todoItems = wrapper.findAll('li')
    expect(todoItems.length).toBe(1)
    expect(todoItems[0].text()).toContain('Test Todo')
    expect(todoItems[0].text()).toContain('Test Description')
  })

  it('should toggle todo completion', async () => {
    // Set initial todo in component's data
    await wrapper.setData({
      tasks: [mockTodo]
    })

    // Mock the update method
    const updateMock = vi.spyOn(pb.collection('Todos'), 'update')
    updateMock.mockResolvedValueOnce({
      ...mockTodo,
      Completed: true
    })

    // Find and click the checkbox
    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.setValue(true)

    // Wait for all promises to resolve
    await nextTick()

    // Verify the update method was called correctly
    expect(updateMock).toHaveBeenCalledWith(mockTodo.id, {
      Completed: true
    })
  })

  it('should remove a todo', async () => {
    // Set initial todo in component's data
    await wrapper.setData({
      tasks: [mockTodo]
    })

    // Mock the delete method
    const deleteMock = vi.spyOn(pb.collection('Todos'), 'delete')
    deleteMock.mockResolvedValueOnce(undefined)

    // Find and click the remove button
    const removeButton = wrapper.find('button[variant="outline"]')
    await removeButton.trigger('click')

    // Wait for all promises to resolve
    await nextTick()

    // Verify the delete method was called
    expect(deleteMock).toHaveBeenCalledWith(mockTodo.id)

    // Verify the todo was removed from the list
    const todoItems = wrapper.findAll('li')
    expect(todoItems.length).toBe(0)
  })

  it('should show error for empty title', async () => {
    // Submit form without filling in title
    await wrapper.find('form').trigger('submit.prevent')
    
    // Wait for the component to update
    await nextTick()

    // Verify error message is shown
    const errorMessage = wrapper.find('.bg-red-100')
    expect(errorMessage.text()).toBe('Title is required')
  })
})