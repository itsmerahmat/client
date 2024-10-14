<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import { useCurrentUserStore } from '@/stores/current-user.store'
import { ref, onMounted } from 'vue'
import axiosApi from '@/utils/axios-api'
import Swal from 'sweetalert2'
import EasyDataTable from 'vue3-easy-data-table'
import type { DataTableHeader, DataTableItem, DataTableCellSlot } from 'vue3-easy-data-table'
import defaultAvatar from '@/assets/img/avatars/avatar.jpg'

const store = useCurrentUserStore()

// State untuk menyimpan data user yang akan ditampilkan di datagrid
const items = ref<DataTableItem[]>([])
const headers: DataTableHeader[] = [
    { text: "Image", value: "image" },
    { text: "Name", value: "name" },
    { text: "Email", value: "email" },
    { text: "Phone", value: "phone" },
    { text: "Role", value: "role" },
    { text: "Actions", value: "id" },
]


onMounted(() => {
    if (!store.isLogged()) {
        router.push('/login')
    }

    axiosApi.get('http://localhost:8000/api/users')
        .then(({ data }) => {
            items.value = data.data.rows;
        })
        .catch((error) => {
            Swal.fire({
                title: 'Error!',
                text: error.response.data.message || 'An error occurred',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        })
})

const deleteUser = (id: number) => {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this data!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            axiosApi.delete(`http://localhost:8000/api/users/${id}`)
                .then(({ message }) => {
                    Swal.fire({
                        title: 'Success!',
                        text: message || 'User has been deleted',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    })
                    items.value = items.value.filter((item) => item.id !== id)
                })
                .catch((error) => {
                    Swal.fire({
                        title: 'Error!',
                        text: error.response.data.message || 'An error occurred',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                })
        }
    })
}

</script>

<template>
    <div class="container-xxl flex-grow-1">
        <h4 class="fw-bold py-3 mb-2"><span class="text-muted fw-light"></span>User</h4>

        <div class="row">
            <div class="col-md-12">
                <div class="card mb-4">
                    <div class="card-header justify-content-between d-flex pb-2 pt-3">
                        <h4 class="mt-1">Datagrid User</h4>
                        <RouterLink to="/users/form" class="btn btn-primary" v-if="store.isAdmin">
                            <i class="bx bx-plus me-1"></i>
                            Add
                        </RouterLink>
                    </div>
                    <!-- Datagrid -->
                    <div class="card-body pt-2">
                        <!-- <EasyDataTable :columns="columns" :items="users" /> -->
                        <EasyDataTable :headers="headers" :items="items" alternating
                            :search-field="['name', 'email', 'role']" :search-value="''">
                            <template #item-image="{ image }">
                                <img :src="image || defaultAvatar" alt="user-avatar" class="d-block rounded my-2"
                                    height="100" width="100" />
                            </template>
                            <template #item-id="item">
                                <div class="d-flex gap-2">
                                    <RouterLink class="btn btn-sm btn-warning" :to="`/users/form/${item.id}`">
                                        <i class="bx bx-edit me-1 py-1"></i>
                                    </RouterLink>
                                    <button class="btn btn-sm btn-danger" @click="deleteUser(item.id)">
                                        <i class="bx bx-trash me-1 py-1"></i>
                                    </button>
                                </div>
                            </template>
                        </EasyDataTable>
                    </div>
                    <!-- Datagrid -->
                </div>
            </div>
        </div>
    </div>
</template>

<style>
/* Tambahkan custom style jika dibutuhkan */
@import "vue3-easy-data-table/dist/style.css";
</style>