import axios from "axios";

export default class UserService {
    constructor(auth_data) {
        this.auth_data = auth_data
        this.axios_instance = axios.create({
            baseURL: 'http://localhost:8080/',
            withCredentials: true
        })
    }
    
    async Login() {
        const response = await this.axios_instance.post('/api/users/login', {
            login: this.auth_data.login, password: this.auth_data.password
        })
        return await response.data
    }

    async Register() {
        const response = await this.axios_instance.post('/api/users/register', {
            login: this.auth_data.login, password: this.auth_data.password 
        })
        return await response.data
    }

    async GetUserInfo() {
        const response = await this.axios_instance.get('/api/users/get-user-info')
        return await response.data
    }

    async Logout() {
        const response = await this.axios_instance.post('/api/users/logout')
        return await response.data
    }
}
