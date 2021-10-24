import axios from "axios"

export default class TasksService {
    constructor() {
        this.axios_instance = axios.create({
            baseURL: 'http://localhost:8080/',
            withCredentials: true
        })
    }
    async GetTasks(checked) {
        const response = await this.axios_instance.get('/api/tasks/get-tasks', {
            params: { checked }
        })
        return await response.data
    }

    async DeleteTask(id) {
        const response = await this.axios_instance.post('/api/tasks/delete-task', { id })
        return await response.data
    }

    async UpdateTask(task) {
        const response = await this.axios_instance.post('/api/tasks/update-task', {...task})
        return await response.data
    }

    async CreateTask(title, description) {
        const response = await this.axios_instance.post('/api/tasks/create-task', {
            title, description
        })
        return await response.data
    }

    async GetFullInfo(id) {
        const response = await this.axios_instance.get(`/api/tasks/get-full-info/${id}`)
        return await response.data
    }
}
