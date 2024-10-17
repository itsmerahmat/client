<script lang="ts" setup>
import { RouterLink, useRouter } from 'vue-router'
import { useCurrentUserStore } from '@/stores/current-user.store'
import { ref, onMounted, reactive, watch } from 'vue'
import axiosApi from '@/utils/axios-api'
import Swal from 'sweetalert2'
import EasyDataTable from 'vue3-easy-data-table'
import type { Header, Item, ServerOptions } from 'vue3-easy-data-table'
import defaultAvatar from '@/assets/img/avatars/avatar.jpg'

const store = useCurrentUserStore()
const router = useRouter()

// State for table data and pagination
const items = ref<Item[]>([])
const totalItems = ref(0)
const loading = ref(false)
const serverOptions = reactive<ServerOptions>({
  page: 1,
  rowsPerPage: 10,
  sortBy: '',
  sortType: 'asc'
})

const headers: Header[] = [
  { text: "Image", value: "image" },
  { text: "Name", value: "name", sortable: true },
  { text: "Email", value: "email", sortable: true },
  { text: "Phone", value: "phone" },
  { text: "Role", value: "role" },
  { text: "Actions", value: "actions" },
]

// Function to fetch data from the server
const fetchData = async () => {
  loading.value = true
  try {
    const response = await axiosApi.get('https://api.sobatwisuda.com/public/api/users', {
      params: {
        page: serverOptions.page,
        rowsPerPage: serverOptions.rowsPerPage,
        sortBy: serverOptions.sortBy,
        sortType: serverOptions.sortType
      }
    })
    items.value = response.data.data.rows
    totalItems.value = response.data.data.total
  } catch (error) {
    Swal.fire({
      title: 'Error!',
      text: error.response?.data?.message || 'An error occurred',
      icon: 'error',
      confirmButtonText: 'OK'
    })
  } finally {
    loading.value = false
  }
}

// Watch for changes in serverOptions
watch(serverOptions, (newVal, oldVal) => {
  console.log('serverOptions changed', newVal, oldVal);
  fetchData()
}, { deep: true })

onMounted(() => {
  if (!store.isLogged()) {
    router.push('/login')
  }
  fetchData()
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
      axiosApi.delete(`https://api.sobatwisuda.com/public/api/users/${id}`)
        .then(({ data }) => {
          Swal.fire({
            title: 'Success!',
            text: data.message || 'User has been deleted',
            icon: 'success',
            confirmButtonText: 'OK'
          })
          fetchData() // Refresh data after deletion
        })
        .catch((error) => {
          Swal.fire({
            title: 'Error!',
            text: error.response?.data?.message || 'An error occurred',
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
            <EasyDataTable
              :headers="headers"
              :items="items"
              :server-options="serverOptions"
              :server-items-length="totalItems"
              :loading="loading"
              v-model:server-options="serverOptions"
            >
              <template #item-image="item">
                <img
                  :src="item.image || defaultAvatar"
                  :alt="item.name"
                  class="rounded-circle"
                  width="32"
                  height="32"
                />
              </template>
              <template #item-actions="item">
                <div class="d-flex gap-2">
                  <RouterLink :to="`/users/form/${item.id}`" class="btn btn-sm btn-primary">
                    <i class="bx bx-edit-alt me-1"></i> Edit
                  </RouterLink>
                  <button @click="deleteUser(item.id)" class="btn btn-sm btn-danger">
                    <i class="bx bx-trash me-1"></i> Delete
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
@import "vue3-easy-data-table/dist/style.css";
/* Add any custom styles if needed */
</style>