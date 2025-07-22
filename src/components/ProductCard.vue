<script setup>
import { ref, computed, nextTick, watch } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update-product", "toggle-stock-visibility", "delete-product"]);

const editing = ref({
  name: false,
  price: false,
  stock: false,
  category: false,
});

const saving = ref({
  name: false,
  price: false,
  stock: false,
  category: false,
});

const errors = ref({
  name: "",
  price: "",
  stock: "",
  category: "",
});

const tempValues = ref({
  name: "",
  price: "",
  stock: "",
  category: "",
});

const inputRefs = ref({
  name: null,
  price: null,
  stock: null,
  category: null,
});

const isHovered = ref(false);
const justSaved = ref({
  name: false,
  price: false,
  stock: false,
  category: false,
});

const categories = [
  "Electronics",
  "Furniture",
  "Kitchen",
  "Office Supplies",
  "Clothing",
  "Books",
  "Sports",
  "Beauty",
  "Automotive",
  "Home & Garden",
];

const stockStatus = computed(() => {
  const stock = props.product.stock;
  if (stock === 0) {
    return {
      text: "Out of Stock",
      color: "bg-red-100 text-red-800 border-red-200",
      pulseColor: "bg-red-500",
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
    };
  } else if (stock <= 10) {
    return {
      text: "Low",
      color: "bg-orange-100 text-orange-800 border-orange-200",
      pulseColor: "bg-orange-400",
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
    };
  } else if (stock <= 20) {
    return {
      text: "Medium",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      pulseColor: "bg-yellow-400",
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
    };
  } else {
    return {
      text: "In Stock",
      color: "bg-green-100 text-green-800 border-green-200",
      pulseColor: "bg-green-500",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    };
  }
});

const formattedPrice = computed(() => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(props.product.price);
});

watch(saving, (newSaving, oldSaving) => {
  for (const field in newSaving) {
    if (oldSaving[field] && !newSaving[field] && !errors.value[field]) {
      justSaved.value[field] = true;
      setTimeout(() => {
        justSaved.value[field] = false;
      }, 2000);
    }
  }
});

const startEditing = async (field) => {
  editing.value[field] = true;
  tempValues.value[field] = props.product[field];
  errors.value[field] = "";

  await nextTick();
  if (inputRefs.value[field]) {
    inputRefs.value[field].focus();
    inputRefs.value[field].select();
  }
};

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
      if (isNaN(value) || parseFloat(value) < 0) {
        return "Price must be a positive number";
      }
      if (parseFloat(value) > 999999.99) {
        return "Price cannot exceed $999,999.99";
      }
      break;
    case "stock":
      if (isNaN(value) || parseInt(value) < 0) {
        return "Stock must be a positive number";
      }
      if (parseInt(value) > 999999) {
        return "Stock cannot exceed 999,999";
      }
      break;
    case "category":
      if (!value || value.trim() === "") {
        return "Category is required";
      }
      break;
  }
  return "";
};

const saveEdit = async (field) => {
  const value = tempValues.value[field];
  errors.value[field] = "";

  const error = validateField(field, value);
  if (error) {
    errors.value[field] = error;
    return;
  }
  saving.value[field] = true;

  try {
    const updatedProduct = { ...props.product };
    if (field === "price") {
      updatedProduct.price = parseFloat(value);
    } else if (field === "stock") {
      updatedProduct.stock = parseInt(value);
    } else {
      updatedProduct[field] = value.trim();
    }

    emit("update-product", updatedProduct);
    editing.value[field] = false;
  } catch (error) {
    errors.value[field] = "Failed to save changes. Please try again.";
  } finally {
    saving.value[field] = false;
  }
};

const cancelEdit = (field) => {
  editing.value[field] = false;
  errors.value[field] = "";
  tempValues.value[field] = props.product[field];
};

const handleKeyPress = (event, field) => {
  if (event.key === "Enter") {
    event.preventDefault();
    saveEdit(field);
  } else if (event.key === "Escape") {
    event.preventDefault();
    cancelEdit(field);
  }
};

const toggleStockVisibility = () => {
  emit("toggle-stock-visibility", props.product._id);
};

const deleteProduct = () => {
  if (confirm(`Are you sure you want to delete "${props.product.name}"?`)) {
    emit("delete-product", props.product._id);
  }
};

let saveTimeout = null;
const handleBlur = (field) => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => {
    if (editing.value[field]) {
      saveEdit(field);
    }
  }, 300);
};
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden ease-out transform"
    :class="{
      'opacity-75 scale-98': loading,
      'hover:shadow-lg hover:-translate-y-1 hover:scale-101': !loading,
      'ring-2 ring-blue-500/20': isHovered,
    }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div
      class="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 opacity-0 transition-opacity duration-500"
      :class="{ 'opacity-100': isHovered }"
    ></div>

    <div
      v-if="loading"
      class="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10"
    >
      <div class="relative">
        <div class="animate-spin rounded-full h-10 w-10 border-3 border-blue-200"></div>
        <div
          class="animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent absolute top-0 left-0"
        ></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-start mb-3 relative z-10">
      <div class="flex items-center space-x-3">
        <div class="relative">
          <span
            class="px-3 py-1.5 text-xs font-medium rounded-full border flex items-center space-x-2 transform"
            :class="[stockStatus.color, isHovered ? 'scale-105 shadow-sm' : 'scale-100']"
          >
            <div v-if="props.product.stock <= 10" class="relative">
              <div class="w-2 h-2 rounded-full" :class="stockStatus.pulseColor"></div>
              <div
                class="absolute inset-0 w-2 h-2 rounded-full"
                :class="stockStatus.pulseColor"
              ></div>
            </div>

            <svg
              class="w-3.5 h-3.5 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="stockStatus.icon"
              ></path>
            </svg>
            <span>{{ stockStatus.text }}</span>
          </span>
        </div>

        <label class="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            :checked="product.stockVisible"
            @change="toggleStockVisibility"
            class="sr-only peer"
          />
          <div
            class="relative w-7 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[0px] after:start-[0px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"
          ></div>
        </label>
      </div>

      <!-- <div class="flex items-center space-x-3">
        <button
          @click="deleteProduct"
          class="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50"
          title="Delete product"
          aria-label="Delete product"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
        </button>
      </div> -->
    </div>

    <div class="mb-3 relative z-10">
      <label class="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
      <Transition name="edit-mode" mode="out-in">
        <div
          v-if="!editing.name"
          key="display"
          @click="startEditing('name')"
          class="cursor-pointer hover:bg-gray-50/80 p-3 rounded-lg group"
          tabindex="0"
          @keydown.enter="startEditing('name')"
          @keydown.space="startEditing('name')"
          role="button"
          aria-label="Edit product name"
        >
          <div class="flex items-center justify-between">
            <span
              class="text-xl font-semibold text-gray-900 group-hover:text-blue-600"
              :class="{ 'text-green-600': justSaved.name }"
            >
              {{ product.name }}
            </span>
            <div class="flex items-center space-x-2">
              <Transition name="success-check">
                <svg
                  v-if="justSaved.name"
                  key="check"
                  class="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </Transition>
              <svg
                class="w-4 h-4 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div key="edit" v-else class="space-y-3">
          <div class="flex items-center space-x-3">
            <input
              ref="inputRefs.name"
              v-model="tempValues.name"
              @keydown="handleKeyPress($event, 'name')"
              @blur="handleBlur('name')"
              type="text"
              maxlength="100"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transform focus:scale-102"
              :class="{ 'border-red-300 focus:ring-red-500 animate-shake': errors.name }"
              :disabled="saving.name"
              placeholder="Enter product name"
            />
            <button
              @click="saveEdit('name')"
              class="text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full hover:bg-green-50"
              :disabled="saving.name"
              title="Save changes"
            >
              <Transition name="spin" mode="out-in">
                <svg
                  v-if="saving.name"
                  key="loading"
                  class="w-5 h-5 animate-spin"
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
                <svg
                  v-else
                  key="check"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </Transition>
            </button>
            <button
              @click="cancelEdit('name')"
              class="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full hover:bg-red-50"
              :disabled="saving.name"
              title="Cancel editing"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <Transition name="error-slide">
            <div
              v-if="errors.name"
              class="text-red-600 text-sm flex items-center space-x-2 bg-red-50 p-2 rounded-lg"
            >
              <svg
                class="w-4 h-4 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                ></path>
              </svg>
              <span>{{ errors.name }}</span>
            </div>
          </Transition>
        </div>
      </Transition>
    </div>

    <div class="mb-2 relative z-10">
      <label class="block text-sm font-medium text-gray-700 mb-2">Price</label>
      <Transition name="edit-mode" mode="out-in">
        <div
          v-if="!editing.price"
          key="display"
          @click="startEditing('price')"
          class="cursor-pointer hover:bg-gray-50/80 p-3 rounded-lg group"
          tabindex="0"
          @keydown.enter="startEditing('price')"
          @keydown.space="startEditing('price')"
          role="button"
          aria-label="Edit price"
        >
          <div class="flex items-center justify-between">
            <span
              class="text-2xl font-bold text-green-600 group-hover:text-green-700"
              :class="{ 'animate-pulse text-green-500': justSaved.price }"
            >
              {{ formattedPrice }}
            </span>
            <div class="flex items-center space-x-2">
              <Transition name="success-check">
                <svg
                  v-if="justSaved.price"
                  key="check"
                  class="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </Transition>
              <svg
                class="w-4 h-4 text-gray-400 group-hover:text-green-500 transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div key="edit" v-else class="space-y-3">
          <div class="flex items-center space-x-3">
            <div class="flex-1 relative">
              <span class="absolute left-4 top-3 text-gray-500 text-lg">$</span>
              <input
                ref="inputRefs.price"
                v-model="tempValues.price"
                @keydown="handleKeyPress($event, 'price')"
                @blur="handleBlur('price')"
                type="number"
                step="0.01"
                min="0"
                max="999999.99"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transform focus:scale-102"
                :class="{ 'border-red-300 focus:ring-red-500 animate-shake': errors.price }"
                :disabled="saving.price"
                placeholder="0.00"
              />
            </div>
            <button
              @click="saveEdit('price')"
              class="text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full hover:bg-green-50"
              :disabled="saving.price"
              title="Save changes"
            >
              <Transition name="spin" mode="out-in">
                <svg
                  v-if="saving.price"
                  key="loading"
                  class="w-5 h-5 animate-spin"
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
                <svg
                  v-else
                  key="check"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </Transition>
            </button>
            <button
              @click="cancelEdit('price')"
              class="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full hover:bg-red-50"
              :disabled="saving.price"
              title="Cancel editing"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <Transition name="error-slide">
            <div
              v-if="errors.price"
              class="text-red-600 text-sm flex items-center space-x-2 bg-red-50 p-2 rounded-lg"
            >
              <svg
                class="w-4 h-4 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                ></path>
              </svg>
              <span>{{ errors.price }}</span>
            </div>
          </Transition>
        </div>
      </Transition>
    </div>

    <div class="mb-2 relative z-10">
      <label class="block text-sm font-medium text-gray-700 mb-2">Stock</label>
      <Transition name="edit-mode" mode="out-in">
        <div
          v-if="!editing.stock"
          key="display"
          @click="startEditing('stock')"
          class="cursor-pointer hover:bg-gray-50/80 p-3 rounded-lg group"
          tabindex="0"
          @keydown.enter="startEditing('stock')"
          @keydown.space="startEditing('stock')"
          role="button"
          aria-label="Edit stock"
        >
          <div class="flex items-center justify-between">
            <span
              class="text-lg font-semibold text-blue-700 group-hover:text-blue-900"
              :class="{ 'animate-pulse text-green-500': justSaved.stock }"
            >
              {{ product.stock }} in stock
            </span>
            <div class="flex items-center space-x-2">
              <Transition name="success-check">
                <svg
                  v-if="justSaved.stock"
                  key="check"
                  class="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </Transition>
              <svg
                class="w-4 h-4 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div key="edit" v-else class="space-y-3">
          <div class="flex items-center space-x-3">
            <input
              ref="inputRefs.stock"
              v-model="tempValues.stock"
              @keydown="handleKeyPress($event, 'stock')"
              @blur="handleBlur('stock')"
              type="number"
              min="0"
              max="999999"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transform focus:scale-102"
              :class="{ 'border-red-300 focus:ring-red-500 animate-shake': errors.stock }"
              :disabled="saving.stock"
              placeholder="Enter stock count"
            />
            <button
              @click="saveEdit('stock')"
              class="text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full hover:bg-green-50"
              :disabled="saving.stock"
              title="Save changes"
            >
              <Transition name="spin" mode="out-in">
                <svg
                  v-if="saving.stock"
                  key="loading"
                  class="w-5 h-5 animate-spin"
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
                <svg
                  v-else
                  key="check"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </Transition>
            </button>
            <button
              @click="cancelEdit('stock')"
              class="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full hover:bg-red-50"
              :disabled="saving.stock"
              title="Cancel editing"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <Transition name="error-slide">
            <div
              v-if="errors.stock"
              class="text-red-600 text-sm flex items-center space-x-2 bg-red-50 p-2 rounded-lg"
            >
              <svg
                class="w-4 h-4 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                ></path>
              </svg>
              <span>{{ errors.stock }}</span>
            </div>
          </Transition>
        </div>
      </Transition>
    </div>

    <div class="mb-2 relative z-10">
      <div class="relative">
        <span
          v-if="!editing.category"
          class="px-3 py-1.5 text-xs font-medium rounded-full border flex items-center space-x-2 bg-purple-100 cursor-pointer hover:bg-purple-200"
          @click="startEditing('category')"
        >
          <span> Category : {{ props.product.category }}</span>
        </span>
        <div v-else class="flex items-center space-x-3">
          <select
            ref="inputRefs.category"
            v-model="tempValues.category"
            @keydown="handleKeyPress($event, 'category')"
            @blur="handleBlur('category')"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            :disabled="saving.category"
          >
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <button
            @click="saveEdit('category')"
            class="text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full hover:bg-green-50"
            :disabled="saving.category"
            title="Save changes"
          >
            <Transition name="spin" mode="out-in">
              <svg
                v-if="saving.category"
                key="loading"
                class="w-5 h-5 animate-spin"
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
              <svg
                v-else
                key="check"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </Transition>
          </button>
          <button
            @click="cancelEdit('category')"
            class="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full hover:bg-red-50"
            :disabled="saving.category"
            title="Cancel editing"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <Transition name="error-slide">
          <div
            v-if="errors.category"
            class="text-red-600 text-sm flex items-center space-x-2 bg-red-50 p-2 rounded-lg mt-2"
          >
            <svg
              class="w-4 h-4 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
            <span>{{ errors.category }}</span>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
