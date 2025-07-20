<script setup>
import { ref } from "vue";
import AddProductForm from "./AddProductForm.vue";
import UploadProducts from "./UploadProducts.vue";

const emit = defineEmits(["add-product", "add-products", "close"]);

const showSingleForm = ref(false);
const showUploadForm = ref(false);

const showSingleProductForm = () => {
  showSingleForm.value = true;
  showUploadForm.value = false;
};

const showUploadProductsForm = () => {
  showUploadForm.value = true;
  showSingleForm.value = false;
};

const closeAll = () => {
  showSingleForm.value = false;
  showUploadForm.value = false;
  emit("close");
};

const handleAddProduct = (product) => {
  emit("add-product", product);
  closeAll();
};

const handleAddProducts = (products) => {
  emit("add-products", products);
  closeAll();
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-medium text-gray-900">Add Products</h3>
      <button
        @click="closeAll"
        class="text-gray-400 hover:text-gray-600 transition-colors"
        title="Close"
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <div v-if="!showSingleForm && !showUploadForm" class="space-y-4">
      <p class="text-sm text-gray-600 mb-6">
        Choose how you want to add products to your inventory
      </p>

      <button
        @click="showSingleProductForm"
        class="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 group"
      >
        <div class="text-center">
          <svg
            class="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-500 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <h4 class="mt-4 text-lg font-medium text-gray-900 group-hover:text-indigo-700">
            Add Single Product
          </h4>
          <p class="mt-2 text-sm text-gray-500">
            Add one product at a time with detailed information
          </p>
        </div>
      </button>

      <button
        @click="showUploadProductsForm"
        class="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 group"
      >
        <div class="text-center">
          <svg
            class="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-500 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <h4 class="mt-4 text-lg font-medium text-gray-900 group-hover:text-indigo-700">
            Upload CSV/Excel
          </h4>
          <p class="mt-2 text-sm text-gray-500">
            Bulk import multiple products from a CSV or Excel file
          </p>
        </div>
      </button>
    </div>

    <div v-if="showSingleForm">
      <AddProductForm @add-product="handleAddProduct" @close="closeAll" />
    </div>

    <div v-if="showUploadForm">
      <UploadProducts @add-products="handleAddProducts" @close="closeAll" />
    </div>
  </div>
</template>
