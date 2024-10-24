<template>
    <div>
      <h1>Todo List</h1>
      <form @submit.prevent="addNewTodo">
        <input v-model="newTodo.title" placeholder="Title" required />
        <input v-model="newTodo.description" placeholder="Description" />
        <button type="submit">Add Todo</button>
      </form>
  
      <ul>
        <li v-for="todo in todos" :key="todo.id">
          <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
          <button @click="toggleComplete(todo)">Toggle Complete</button>
          <button @click="removeTodo(todo.id)">Delete</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { mapState, mapActions } from 'vuex';
  
  export default {
    data() {
      return {
        newTodo: {
          title: '',
          description: '',
        },
      };
    },
    computed: {
      ...mapState('todos', ['todos']),
    },
    methods: {
      ...mapActions('todos', ['fetchTodos', 'addTodo', 'updateTodo', 'deleteTodo']),
      async addNewTodo() {
        if (this.newTodo.title.trim()) {
          await this.addTodo(this.newTodo);
          this.newTodo.title = '';
          this.newTodo.description = '';
        }
      },
      toggleComplete(todo) {
        this.updateTodo({ ...todo, completed: !todo.completed });
      },
      removeTodo(id) {
        this.deleteTodo(id);
      },
    },
    async mounted() {
      await this.fetchTodos();
    },
  };
  </script>
  
  <style scoped>
  .completed {
    text-decoration: line-through;
  }
  </style>