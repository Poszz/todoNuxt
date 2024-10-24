<template>

</template>

<script>




// export default {
//     data() {
//         return {
//             newTask: '',
//             tasks: []
//         };
//     },
//     created() {
//         this.fetchTasks();
//     },
//     methods: {
//         async fetchTasks() {
//             try {
//                 const response = await axios.get('http://localhost:8090/api/collections/tasks/records');
//                 this.tasks = response.data.items;
//             } catch (error) {
//                 console.error('Error fetching tasks:', error);
//             }
//         },
//         async addTask() {
//             if (this.newTask.trim() !== '') {
//                 try {
//                     const response = await axios.post('http://localhost:8090/api/collections/tasks/records', {
//                         text: this.newTask,
//                         completed: false
//                     });
//                     this.tasks.push(response.data);
//                     this.newTask = '';
//                 } catch (error) {
//                     console.error('Error adding task:', error);
//                 }
//             }
//         },
//         async updateTask(task) {
//             try {
//                 await axios.patch(`http://localhost:8090/api/collections/tasks/records/${task.id}`, {
//                     completed: task.completed
//                 });
//             } catch (error) {
//                 console.error('Error updating task:', error);
//             }
//         },
//         async removeTask(taskId) {
//             try {
//                 await axios.delete(`http://localhost:8090/api/collections/tasks/records/${taskId}`);
//                 this.tasks = this.tasks.filter(task => task.id !== taskId);
//             } catch (error) {
//                 console.error('Error removing task:', error);
//             }
//         }
//     }
// };
</script>

<style scoped>
.task-list {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.completed {
    text-decoration: line-through;
}

input[type="text"] {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
}

button {
    margin-left: 10px;
}
</style>