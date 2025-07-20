<script setup>
import { ref } from "vue";

const props = defineProps({
  sortBy: {
    type: String,
    required: true,
  },
  sortOrder: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update-sort"]);

const isOpen = ref(false);

const sortOptions = [
  { value: "name", label: "Product Name" },
  { value: "price", label: "Price" },
  { value: "stock", label: "Stock Quantity" },
  { value: "category", label: "Category" },
];

const orderOptions = [
  { value: "asc", label: "Ascending", icon: "↑" },
  { value: "desc", label: "Descending", icon: "↓" },
];

const updateSort = (field, value) => {
  console.log("SortDropdown: updateSort called with field:", field, "value:", value);
  const newSortData = {
    sortBy: field === "sortBy" ? value : props.sortBy,
    sortOrder: field === "sortOrder" ? value : props.sortOrder,
  };
  console.log("SortDropdown: emitting update-sort with data:", newSortData);
  emit("update-sort", newSortData);
  closeDropdown();
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const handleClickOutside = (event) => {
  if (!event.target.closest(".sort-dropdown")) {
    closeDropdown();
  }
};

import { onMounted, onUnmounted } from "vue";

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="sort-dropdown relative">
    <button
      @click="toggleDropdown"
      class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
        ></path>
      </svg>
      {{ sortOptions.find((opt) => opt.value === sortBy)?.label }}
      ({{ sortOrder === "asc" ? "↑" : "↓" }})
      <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-60 mt-2 w-57 bg-white rounded-md shadow-lg border border-gray-200 z-10"
    >
      <div class="py-1">
        <div class="px-4 py-2 border-b border-gray-100">
          <h4 class="text-xs font-medium text-gray-500 uppercase tracking-wide">Sort By</h4>
          <div class="space-y-0">
            <button
              v-for="option in sortOptions"
              :key="option.value"
              @click="updateSort('sortBy', option.value)"
              class="w-full text-left px-2 text-sm rounded hover:bg-gray-100 flex items-center justify-between"
              :class="{ 'bg-blue-50 text-blue-700': sortBy === option.value }"
            >
              <span>{{ option.label }}</span>
              <svg
                v-if="sortBy === option.value"
                class="w-4 h-4 text-blue-600"
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
            </button>
          </div>
        </div>

        <div class="px-4 py-1">
          <h4 class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Order</h4>
          <div class="space-y-1">
            <button
              v-for="option in orderOptions"
              :key="option.value"
              @click="updateSort('sortOrder', option.value)"
              class="w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 flex items-center justify-between"
              :class="{ 'bg-blue-50 text-blue-700': sortOrder === option.value }"
            >
              <span>{{ option.label }}</span>
              <div class="flex items-center">
                <span class="mr-1">{{ option.icon }}</span>
                <svg
                  v-if="sortOrder === option.value"
                  class="w-4 h-4 text-blue-600"
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
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
