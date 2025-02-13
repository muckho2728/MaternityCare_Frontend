import axios from "axios"
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjZhMGM0MzRmLWI0YjgtNDM0Mi1hOTkxLWIzNDNmMmIwZWUzZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjoxNzM5NDY4MDg4LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MjMxIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzIzMSJ9.ajnCjcFJupzAuC9WUsR0ecsECvAmiAkJdXAKiiRJhTo';

export const getAllUserAPI = () => {


return axios({
    method: 'GET',
    url: `https://maternitycare.azurewebsites.net/api/users`,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || token}`
    }
})
}

export const getUserByIdAPI =(id) => {
return axios({
    method: 'GET',
    url: `https://maternitycare.azurewebsites.net/api/users/${id}`,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || token}`
    }
})
} 

export const updateUserAPI = (id, data) => {
return axios({
    method: 'PUT',
    url: `https://maternitycare.azurewebsites.net/api/users/${id}`,
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || token}`
    },
    data: data
})
}



export const  activeUserAPI = (id) => {
return axios({
    method: 'PUT',
    url: `https://maternitycare.azurewebsites.net/api/users/${id}/activation`,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || token}`
    }
})
}

export const changePasswordByUserIdAPI = (id, data) => {
return axios({
    method: 'PUT',
    url: `https://maternitycare.azurewebsites.net/api/users/${id}/password`,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || token}`
    },
    data: data
})
}