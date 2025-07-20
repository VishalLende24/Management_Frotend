<script setup>
import { ref, reactive, computed } from "vue";
import api from "../services/api";

const emit = defineEmits(["add-product", "close"]);

const loading = ref(false);
const error = ref("");
const success = ref("");

const categories = [
  "Electronics",
  "Furniture",
  "Kitchen",
  "Clothing",
  "Accessories",
  "Home",
  "Stationery",
];

const form = reactive({
  name: "",
  price: "",
  stock: "",
  category: "",
  stockVisible: true,
});

const errors = reactive({
  name: "",
  price: "",
  stock: "",
  category: "",
});

const isFormValid = computed(() => {
  return (
    form.name.trim() !== "" &&
    form.price !== "" &&
    parseFloat(form.price) >= 0 &&
    form.stock !== "" &&
    parseInt(form.stock) >= 0 &&
    form.category !== ""
  );
});

const validateField = (field, value) => {
  switch (field) {
    case "name":
      if (!value || value.trim() === "") {
        return "Product name is required";
      }
      if (value.trim().length < 2) {
        return "Product name must be at least 2 characters";
      }
      if (value.trim().length > 100) {
        return "Product name must be less than 100 characters";
      }
      break;
    case "price":
      if (!value || value === "") {
        return "Price is required";
      }
      if (isNaN(value) || parseFloat(value) < 0) {
        return "Price must be a positive number";
      }
      if (parseFloat(value) > 999999.99) {
        return "Price cannot exceed $999,999.99";
      }
      break;
    case "stock":
      if (!value || value === "") {
        return "Stock is required";
      }
      if (isNaN(value) || parseInt(value) < 0) {
        return "Stock must be a positive number";
      }
      if (parseInt(value) > 999999) {
        return "Stock cannot exceed 999,999";
      }
      break;
    case "category":
      if (!value || value === "") {
        return "Category is required";
      }
      break;
  }
  return "";
};

const handleBlur = (field) => {
  const value = form[field];
  errors[field] = validateField(field, value);
};

const handleInput = (field) => {
  if (errors[field]) {
    const value = form[field];
    errors[field] = validateField(field, value);
  }
};

const handleSubmit = async () => {
  error.value = "";
  success.value = "";
  let hasErrors = false;
  Object.keys(form).forEach((field) => {
    if (field !== "stockVisible") {
      const fieldError = validateField(field, form[field]);
      errors[field] = fieldError;
      if (fieldError) {
        hasErrors = true;
      }
    }
  });

  if (hasErrors) {
    return;
  }

  loading.value = true;

  try {
    const productData = {
      name: form.name.trim(),
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      category: form.category,
      stockVisible: form.stockVisible,
    };

    const response = await api.createProduct(productData);

    success.value = "Product added successfully!";

    Object.keys(form).forEach((key) => {
      if (key === "stockVisible") {
        form[key] = true;
      } else {
        form[key] = "";
      }
    });

    Object.keys(errors).forEach((key) => {
      errors[key] = "";
    });

    emit("add-product", response.data);

    setTimeout(() => {
      emit("close");
    }, 2000);
  } catch (err) {
    error.value = err.message || "Failed to add product. Please try again.";
  } finally {
    loading.value = false;
  }
};

const closeForm = () => {
  emit("close");
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-medium text-gray-900">Add Single Product</h3>
      <button
        @click="closeForm"
        class="text-gray-400 hover:text-gray-600 transition-colors"
        title="Close form"
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

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
          Product Name <span class="text-red-500">*</span>
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          @blur="handleBlur('name')"
          @input="handleInput('name')"
          :class="{
            'border-red-300 focus:border-red-500 focus:ring-red-500': errors.name,
            'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500': !errors.name,
          }"
          class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-opacity-50 sm:text-sm"
          placeholder="Enter product name"
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
      </div>

      <div>
        <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
          Price <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            id="price"
            v-model="form.price"
            type="number"
            step="0.01"
            min="0"
            @blur="handleBlur('price')"
            @input="handleInput('price')"
            :class="{
              'border-red-300 focus:border-red-500 focus:ring-red-500': errors.price,
              'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500': !errors.price,
            }"
            class="w-full pl-7 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-opacity-50 sm:text-sm"
            placeholder="0.00"
          />
        </div>
        <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price }}</p>
      </div>
      <div>
        <label for="stock" class="block text-sm font-medium text-gray-700 mb-2">
          Stock Quantity <span class="text-red-500">*</span>
        </label>
        <input
          id="stock"
          v-model="form.stock"
          type="number"
          min="0"
          @blur="handleBlur('stock')"
          @input="handleInput('stock')"
          :class="{
            'border-red-300 focus:border-red-500 focus:ring-red-500': errors.stock,
            'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500': !errors.stock,
          }"
          class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-opacity-50 sm:text-sm"
          placeholder="0"
        />
        <p v-if="errors.stock" class="mt-1 text-sm text-red-600">{{ errors.stock }}</p>
      </div>

      <div>
        <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
          Category <span class="text-red-500">*</span>
        </label>
        <select
          id="category"
          v-model="form.category"
          @blur="handleBlur('category')"
          @change="handleInput('category')"
          :class="{
            'border-red-300 focus:border-red-500 focus:ring-red-500': errors.category,
            'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500': !errors.category,
          }"
          class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-opacity-50 sm:text-sm"
        >
          <option value="">Select a category</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        <p v-if="errors.category" class="mt-1 text-sm text-red-600">{{ errors.category }}</p>
      </div>

      <div class="flex items-center">
        <input
          id="stockVisible"
          v-model="form.stockVisible"
          type="checkbox"
          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label for="stockVisible" class="ml-2 block text-sm text-gray-900">
          Show stock quantity to customers
        </label>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div class="ml-3">
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>
        </div>
      </div>

      <div v-if="success" class="bg-green-50 border border-green-200 rounded-md p-4">
        <div class="flex">
          <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <div class="ml-3">
            <p class="text-sm text-green-800">{{ success }}</p>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="closeForm"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            v-if="loading"
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ loading ? "Adding..." : "Add Product" }}
        </button>
      </div>
    </form>
  </div>
</template>
