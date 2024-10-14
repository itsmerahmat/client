<template>
    <div class="d-flex align-items-start align-items-sm-center gap-4">
        <img :src="previewImage || defaultAvatar" alt="user-avatar" class="d-block rounded border" :class="{ 'border-danger': props.error || validation }"
            height="100" width="100" id="uploadedAvatar" />
        <div class="button-wrapper">
            <label for="upload" class="btn btn-primary me-2 mb-3" tabindex="0">
                <span class="d-none d-sm-block">
                    <i class="bx bx-upload me-1"></i>
                    Upload user photo</span>
                <i class="bx bx-upload d-block d-sm-none"></i>
                <input 
                    type="file" 
                    id="upload" 
                    ref="inputFile"
                    class="account-file-input" 
                    hidden 
                    :accept="accept"
                    @change="fileChange"
                    :disabled="disabled"
                />
            </label>
            <button v-if="model && !disabled" type="button" class="btn btn-outline-secondary account-image-reset mb-3" @click="reset">
                <i class="bx bx-reset d-block d-sm-none"></i>
                <span class="d-none d-sm-block">Reset</span>
            </button>
            <p class="text-muted mb-0">Allowed JPG, GIF or PNG. Max size of 2048K</p>
            <div v-if="props.error || validation" class="d-block invalid-feedback mt-1">
                {{ props.error || validation }}
            </div>
        </div>
    </div>
    <div v-if="invalidFeedback" class="d-block invalid-feedback mt-2">
        {{ invalidFeedback }}
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import defaultAvatar from '@/assets/img/avatars/avatar.jpg';

const props = defineProps<{
    invalidFeedback?: string;
    accept?: string;
    disabled?: boolean;
    maxSize?: number;
    error?: string;
}>();

const inputFile = ref<HTMLInputElement | null>(null);
const previewImage = ref<string | null>(null);
const model = defineModel<File | string | null>();
const validation = ref<string>('');

const accept = props.accept || 'image/png, image/jpeg, image/gif';
const maxSize = props.maxSize || 2048 * 1024; // 2048K in bytes

const updatePreviewImage = (file: File | string | null) => {
    if (file instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    } else if (typeof file === 'string') {
        previewImage.value = file;
    } else {
        previewImage.value = null;
    }
};

watch(() => model.value, updatePreviewImage, { immediate: true });

onMounted(() => {
    updatePreviewImage(model.value);
});

const reset = () => {
    if (inputFile.value) {
        inputFile.value.value = '';
    }
    model.value = null;
    previewImage.value = null;
    validation.value = '';
};

const fileChange = (evt: Event) => {
    
    const target = evt.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
        // cek tipe file
        if (!file.type.includes('image')) {
            validation.value = 'File must be an image';
            reset();
            return;
        }

        model.value = file;
        
        updatePreviewImage(file);
        validation.value = '';
    }
};
</script>

<style scoped>
.account-file-input:focus {
    outline: none;
}
</style>