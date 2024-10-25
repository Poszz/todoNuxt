<script setup lang="ts">
import { onMounted, ref } from 'vue';
import PocketBase from 'pocketbase';

interface Todo {
  id: string;
  Title: string;
  Description: string;
  Completed: boolean;
  created: string;
  updated: string;
}

const pb = ref<PocketBase | null>(null); 
const currentUser = ref();
const tasks = ref<Todo[]>([]);
const newTask = ref('');
const taskDescription = ref('');
const error = ref('');
const isLoading = ref(true);

// Initialize PocketBase
const initPocketBase = async () => {
  pb.value = new PocketBase('http://127.0.0.1:8090');
  await fetchTodos();
  isLoading.value = false;
};

// Fetch todos from PocketBase
const fetchTodos = async () => {
  if (!pb.value) return;
  error.value = '';
  
  try {
    const records = await pb.value.collection('Todos').getFullList({
      sort: '-created',
    });
    tasks.value = records.map((record: any) => ({
      id: record.id,
      Title: record.Title,
      Description: record.Description,
      Completed: record.Completed,
      created: record.created,
      updated: record.updated,
    }));
  } catch (err: any) {
    error.value = err?.message || 'Failed to fetch todos';
    console.error('Error fetching todos:', err);
  }
};

// Add task to PocketBase
const addTask = async () => {
  if (!pb.value) {
    error.value = 'Database not connected';
    return;
  }
  
  if (!newTask.value.trim()) {
    error.value = 'Title is required';
    return;
  }

  try {
    const data = {
      "Title": newTask.value.trim(),
      "Description": taskDescription.value.trim(),
      "Completed": false
    };

    const record = await pb.value.collection('Todos').create(data);

    tasks.value.unshift({
      id: record.id,
      Title: record.Title,
      Description: record.Description,
      Completed: record.Completed,
      created: record.created,
      updated: record.updated,
    });
    
    newTask.value = '';
    taskDescription.value = '';
    error.value = '';
  } catch (err: any) {
    error.value = err?.message || 'Failed to create todo';
    console.error('Error creating todo:', err);
  }
};

// Toggle task completion
const toggleComplete = async (todo: Todo) => {
  if (!pb.value) return;
  error.value = '';

  try {
    const updated = await pb.value.collection('Todos').update(todo.id, {
      "Completed": !todo.Completed
    });
    
    const index = tasks.value.findIndex((t: Todo) => t.id === todo.id);
    if (index !== -1) {
      tasks.value[index] = {
        ...tasks.value[index],
        Completed: updated.Completed
      };
    }
  } catch (err: any) {
    error.value = err?.message || 'Failed to update todo';
  }
};

// Remove task from PocketBase
const removeTask = async (id: string, index: number) => {
  if (!pb.value) return;
  error.value = '';

  try {
    await pb.value!.collection('Todos').delete(id);
    tasks.value = tasks.value.filter((task: Todo) => task.id !== id);
  } catch (err: any) {
    error.value = err?.message || 'Failed to remove todo';
  }
};

onMounted(async () => {
  await initPocketBase();
});
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout />
    <div class="flex justify-center">
      <Card class="w-[350px] margin-auto">
        <CardHeader>
          <CardTitle>To-Do List</CardTitle>
          <CardDescription>Manage your tasks</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div v-if="isLoading" class="text-center py-4">
            Loading...
          </div>
          
          <div v-else>
            <div v-show="error" class="mb-4 p-2 bg-red-100 text-red-600 rounded" role="alert" data-testid="error-message">
              {{ error }}
            </div>

            <form @submit.prevent="addTask">
              <div class="grid items-center w-full gap-4">
                <div class="flex flex-col space-y-1.5">
                  <Label for="task">Task Title</Label>
                  <Input 
                    id="task" 
                    v-model="newTask" 
                    placeholder="Enter your title" 
                    required
                    data-testid="task-title-input"
                  />
                  
                  <Label for="taskDescription">Task Description</Label>
                  <Input 
                    id="taskDescription" 
                    v-model="taskDescription" 
                    placeholder="Enter your task description" 
                    data-testid="task-description-input"
                  />
                </div>
              </div>
              <Button type="submit" class="mt-4" data-testid="add-task-button">Add Task</Button>
            </form>
            
            <ul class="mt-4" data-testid="todo-list">
              <li 
                v-for="(task, index) in tasks" 
                :key="task.id" 
                class="flex justify-between items-center p-2 mb-2 border rounded"
                :data-testid="'todo-item-' + task.id"
              >
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    :checked="task.Completed"
                    @change="toggleComplete(task)"
                    class="form-checkbox h-4 w-4"
                    :data-testid="'todo-checkbox-' + task.id"
                  />
                  <div :class="{ 'line-through': task.Completed }">
                    <div class="font-medium">{{ task.Title }}</div>
                    <div class="text-sm text-gray-600">{{ task.Description }}</div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  @click="removeTask(task.id, index)"
                  :data-testid="'remove-todo-' + task.id"
                >
                  Remove
                </Button>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>











