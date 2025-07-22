<script setup>
import { computed } from "vue";
import SortDropdown from "./SortDropdown.vue";

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
  products: {
    type: Array,
    required: true,
  },
  sortBy: {
    type: String,
    default: "name",
  },
  sortOrder: {
    type: String,
    default: "asc",
  },
});

const emit = defineEmits(["update-filters", "update-sort"]);

const priceRange = computed(() => {
  if (props.products.length === 0) return { min: 0, max: 1000000 };
  const prices = props.products.map((p) => p.price);
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
});

const stockRange = computed(() => {
  if (props.products.length === 0) return { min: 0, max: 1000000 };
  const stocks = props.products.map((p) => p.stock);
  return {
    min: Math.min(...stocks),
    max: Math.max(...stocks),
  };
});

const availableCategories = computed(() => {
  console.log("Filters component - products length:", props.products.length);

  if (props.products.length === 0) {
    const fallbackCategories = [
      "Electronics",
      "Furniture",
      "Kitchen",
      "Clothing",
      "Accessories",
      "Stationery",
      "Health",
      "Footwear",
    ];
    console.log("Using fallback categories:", fallbackCategories);
    return fallbackCategories;
  }

  const allCategories = [...new Set(props.products.map((p) => p.category))];
  console.log("All available categories from products:", allCategories);

  if (allCategories.length === 0 || allCategories.every((cat) => !cat)) {
    const fallbackCategories = ["Electronics", "Furniture", "Kitchen", "Clothing", "Home"];
    console.log("No categories found in products, using fallback:", fallbackCategories);
    return fallbackCategories;
  }

  return allCategories.sort();
});

const updateFilters = (updates) => {
  emit("update-filters", { ...props.filters, ...updates });
};

const updatePriceRange = (field, value) => {
  const newRange = { ...props.filters.priceRange, [field]: parseFloat(value) || 0 };
  updateFilters({ priceRange: newRange });
};

const updateStockRange = (field, value) => {
  const newRange = { ...props.filters.stockRange, [field]: parseInt(value) || 0 };
  updateFilters({ stockRange: newRange });
};

const toggleCategory = (category) => {
  const categories = props.filters.categories.includes(category)
    ? props.filters.categories.filter((c) => c !== category)
    : [...props.filters.categories, category];
  updateFilters({ categories });
};

const toggleLowStock = () => {
  updateFilters({ showLowStock: !props.filters.showLowStock });
};

const toggleOutOfStock = () => {
  updateFilters({ showOutOfStock: !props.filters.showOutOfStock });
};

const clearAllFilters = () => {
  emit("update-filters", {
    priceRange: { min: 0, max: 2000 },
    stockRange: { min: 0, max: 100 },
    categories: [],
    showLowStock: false,
    showOutOfStock: false,
  });
};
</script>

<template>
  <div class="space-y-1">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Filters</h3>
      <button
        @click="clearAllFilters"
        class="text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        Clear all
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Price Range</label>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-xs text-gray-500 mb-1">Min Price</label>
            <div class="relative">
              <span class="absolute left-3 top-2 text-gray-500 text-sm">$</span>
              <input
                :value="filters.priceRange.min"
                @input="updatePriceRange('min', $event.target.value)"
                type="number"
                :min="priceRange.min"
                :max="filters.priceRange.max"
                step="0.01"
                class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Max Price</label>
            <div class="relative">
              <span class="absolute left-3 top-2 text-gray-500 text-sm">$</span>
              <input
                :value="filters.priceRange.max"
                @input="updatePriceRange('max', $event.target.value)"
                type="number"
                :min="filters.priceRange.min"
                :max="priceRange.max"
                step="0.01"
                class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Stock Range</label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-xs text-gray-500 mb-1">Min Stock</label>
            <input
              :value="filters.stockRange.min"
              @input="updateStockRange('min', $event.target.value)"
              type="number"
              :min="stockRange.min"
              :max="filters.stockRange.max"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Max Stock</label>
            <input
              :value="filters.stockRange.max"
              @input="updateStockRange('max', $event.target.value)"
              type="number"
              :min="filters.stockRange.min"
              :max="stockRange.max"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Categories ({{ availableCategories.length }} available)
        </label>
        <div class="space-y-2 max-h-32 overflow-y-auto">
          <div v-if="availableCategories.length === 0" class="text-sm text-gray-500">
            No categories available
          </div>
          <label
            v-for="category in availableCategories"
            :key="category"
            class="flex items-center cursor-pointer"
          >
            <input
              :checked="filters.categories.includes(category)"
              @change="toggleCategory(category)"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700">{{ category }}</span>
          </label>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Quick Filters</label>
        <div class="space-y-2">
          <label class="flex items-center cursor-pointer">
            <input
              :checked="filters.showLowStock"
              @change="toggleLowStock"
              type="checkbox"
              class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700">Show Low Stock Only (≤ 10 units)</span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input
              :checked="filters.showOutOfStock"
              @change="toggleOutOfStock"
              type="checkbox"
              class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700">Show Out of Stock Only (0 units)</span>
          </label>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Sort By</label>
        <SortDropdown
          :sort-by="sortBy"
          :sort-order="sortOrder"
          @update-sort="
            (data) => {
              console.log('Filters: received sort update:', data);
              emit('update-sort', data);
            }
          "
        />
      </div>
    </div>
  </div>
</template>
