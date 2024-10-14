<script lang="ts" setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useCurrentUserStore } from '@/stores/current-user.store'
import FormUpload from '@/components/Form/FormUpload.vue'
import { ref, onMounted } from 'vue'
import axiosApi from '@/utils/axios-api'
import Swal from 'sweetalert2'
const router = useRouter()
const store = useCurrentUserStore()
const { params } = useRoute()

const usersModel = ref({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    password: '',
    image: null,
})

const errors = ref({
    name: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    image: '',
})

// sebelum halaman dimuat cek apakah user sudah login atau belum
onMounted(() => {
    if (!store.isLogged()) {
        router.push('/login')
    }

    if (params.id) {
        // fetch data user
        axiosApi.get(`http://localhost:8000/api/users/${params.id}`)
            .then(({ data }) => {
                usersModel.value = data.data
            })
            .catch((error) => {
                Swal.fire({
                    title: 'Error!',
                    text: error.response.data.message || 'An error occurred',
                    icon: 'error',
                    confirmButtonText: 'OK'
                }).then(() => {
                    router.push('/users')
                })
            })
    }
});

const save = async (event: Event) => {
    event.preventDefault()

    errors.value = {
        name: '',
        email: '',
        password: '',
        phone: '',
        role: '',
        image: '',
    }

    try {
        let response;

        // ubah semua value object usersModel menjadi form data
        const formData = new FormData();
        Object.keys(usersModel.value).forEach(key => {
            formData.append(key, usersModel.value[key]);
        });

        // cek jika image adalah string maka hapus key image dari object usersModel
        if (typeof usersModel.value.image === 'string' || usersModel.value.image === null) {
            formData.delete('image');
        }

        if (params.id) {
            // You should send POST and set _method to PATCH
            formData.append('_method', 'PUT');
            response = await axiosApi.post(`http://localhost:8000/api/users/${params.id}`, formData);
        } else {
            response = await axiosApi.post('http://localhost:8000/api/users', formData);
        }

        const { statusCode, message } = response.data;
        if ([200, 201].includes(statusCode)) {
            Swal.fire({
                title: 'Success!',
                text: message,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                router.push('/users');
            });
        }
    } catch (error) {
        console.log(error);

        if (error.response && error.response.data && error.response.data.errors) {
            // Populate errors object with backend validation errors
            Object.keys(error.response.data.errors).forEach(key => {
                if (key in errors.value) {
                    errors.value[key] = error.response.data.errors[key][0];
                }
            });
        } else {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'An error occurred',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }
}

</script>

<template>
    <div class="container-xxl flex-grow-1">
        <h4 class="fw-bold py-3 mb-2"><span class="text-muted fw-light">User /</span> Form</h4>

        <div class="row">
            <div class="col-md-12">
                <div class="card mb-4">
                    <h5 class="card-header">User Details</h5>
                    <!-- Account -->
                    <div class="card-body">
                        <FormUpload v-model="usersModel.image" :error="errors.image" />
                    </div>
                    <hr class="my-0" />
                    <div class="card-body">
                        <div id="formAccountSettings">
                            <div class="row">
                                <div class="mb-3 col-md-6">
                                    <label for="firstName" class="form-label">Name</label>
                                    <input class="form-control" :class="{ 'is-invalid': errors.name }" type="text"
                                        id="firstName" name="firstName" v-model="usersModel.name"
                                        placeholder="Enter name" autofocus />
                                    <div v-if="errors.name" class="invalid-feedback d-block">{{ errors.name }}</div>
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label for="email" class="form-label">E-mail</label>
                                    <input class="form-control" :class="{ 'is-invalid': errors.email }" type="text"
                                        id="email" name="email" v-model="usersModel.email"
                                        placeholder="john.doe@example.com" />
                                    <div v-if="errors.email" class="invalid-feedback d-block">{{ errors.email }}</div>
                                </div>
                                <div class="mb-3 col-md-6" v-if="!params.id">
                                    <label for="password" class="form-label">Password</label>
                                    <input type="password" class="form-control"
                                        :class="{ 'is-invalid': errors.password }" id="password" name="password"
                                        v-model="usersModel.password" placeholder="Enter password" />
                                    <div v-if="errors.password" class="invalid-feedback d-block">{{ errors.password }}
                                    </div>
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label for="phoneNumber" class="form-label">Phone Number</label>
                                    <input type="text" class="form-control" :class="{ 'is-invalid': errors.phone }"
                                        id="phoneNumber" name="phoneNumber" v-model="usersModel.phone"
                                        placeholder="085787943245" />
                                    <div v-if="errors.phone" class="invalid-feedback d-block">{{ errors.phone }}</div>
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label for="language" class="form-label">Role</label>
                                    <select id="language" class="select2 form-select"
                                        :class="{ 'is-invalid': errors.role }" v-model="usersModel.role" disabled>
                                        <option value="" disabled>Select Role</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                    <div v-if="errors.role" class="invalid-feedback d-block">{{ errors.role }}</div>
                                </div>
                            </div>
                            <div class="mt-2 text-end">
                                <RouterLink to="/users" class="btn btn-outline-secondary me-2">
                                    <i class="bx bx-arrow-back me-1"></i>
                                    Back</RouterLink>
                                <button class="btn btn-primary" @click="save">
                                    <i class="bx bx-save me-1"></i>
                                    Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>