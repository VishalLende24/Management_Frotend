<template>
  <div class="bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-8xl mx-auto px-4 sm:px-4 lg:px-6 py-2">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-2 text-gray-600">
          Welcome back, {{ userName }}! Manage your inventory with real-time stock tracking and
          smart filters
        </p>
      </div>
    </header>

    <div class="max-w-8xl mx-auto px-1 lg:p-5 py-1">
      <div class="mb-3">
        <button
          @click="showUploadSection = !showUploadSection"
          class="inline-flex items-center px-2 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          {{ showUploadSection ? "Hide Upload" : "Add Products" }}
        </button>
      </div>

      <div v-if="showUploadSection" class="mb-8">
        <AddProductOptions
          @add-product="addProduct"
          @add-products="addProducts"
          @close="showUploadSection = false"
        />
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <Filters
          :filters="filters"
          :products="allProducts"
          :sort-by="sortBy"
          :sort-order="sortOrder"
          @update-filters="filters = $event"
          @update-sort="
            (data) => {
              console.log('Sort update received:', data);
              sortBy = data.sortBy;
              sortOrder = data.sortOrder;
            }
          "
        />
      </div>

      <ProductList
        :products="sortedProducts"
        :loading="loading"
        @update-product="updateProduct"
        @toggle-stock-visibility="toggleStockVisibility"
      />

      <div v-if="totalCount > pageSize" class="flex justify-center items-center mt-8 space-x-2">
        <button
          class="px-3 py-1 rounded border text-sm font-medium bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          Previous
        </button>

        <button
          class="px-3 py-1 rounded border text-sm font-medium bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          Next
        </button>
        <span class="ml-4 text-sm text-gray-500">Page {{ currentPage }} of {{ totalPages }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import api from "../services/api";
import AddProductOptions from "./AddProductOptions.vue";
import Filters from "./Filters.vue";
import ProductList from "./ProductList.vue";

const products = ref([]);
const allProducts = ref([]);
const totalCount = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);

const loading = ref(false);

const filters = ref({
  priceRange: { min: 0, max: 100000 },
  stockRange: { min: 0, max: 100000 },
  categories: [],
  showLowStock: false,
  showOutOfStock: false,
});

const sortBy = ref("name");
const sortOrder = ref("asc");

const showUploadSection = ref(false);

const userName = computed(() => {
  return localStorage.getItem("userName") || localStorage.getItem("userEmail") || "User";
});

const inStockCount = computed(() => {
  return products.value.filter((product) => product.stock > 0).length;
});

const lowStockCount = computed(() => {
  return products.value.filter((product) => product.stock > 0 && product.stock <= 10).length;
});

const outOfStockCount = computed(() => {
  return products.value.filter((product) => product.stock === 0).length;
});

const loadAllProducts = async () => {
  try {
    const response = await api.getProducts({
      page: 1,
      pageSize: 10,
    });
    allProducts.value = response.data;
    console.log("Loaded all products for categories:", allProducts.value.length);
  } catch (error) {
    console.error("Error loading all products for categories:", error);
  }
};

const loadProducts = async () => {
  loading.value = true;
  try {
    console.log("Loading products for page:", currentPage.value, "pageSize:", pageSize.value);
    const response = await api.getProducts({
      ...filters.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
      page: currentPage.value,
      pageSize: pageSize.value,
    });
    console.log("API Response:", response);
    products.value = response.data;
    totalCount.value = response.totalCount;
    currentPage.value = response.currentPage;
    console.log(
      "Updated products:",
      products.value.length,
      "totalCount:",
      totalCount.value,
      "currentPage:",
      currentPage.value
    );
  } catch (error) {
    console.error("Error loading products:", error);
    currentPage.value = 1;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadProducts();
});

const filteredProducts = computed(() => {
  let filtered = [...products.value];

  filtered = filtered.filter(
    (product) =>
      product.price >= filters.value.priceRange.min && product.price <= filters.value.priceRange.max
  );

  filtered = filtered.filter(
    (product) =>
      product.stock >= filters.value.stockRange.min && product.stock <= filters.value.stockRange.max
  );

  if (filters.value.categories.length > 0) {
    filtered = filtered.filter((product) => filters.value.categories.includes(product.category));
  }

  if (filters.value.showLowStock) {
    filtered = filtered.filter((product) => product.stock > 0 && product.stock <= 10);
  }

  if (filters.value.showOutOfStock) {
    filtered = filtered.filter((product) => product.stock === 0);
  }

  return filtered;
});

const sortedProducts = computed(() => {
  const sorted = [...filteredProducts.value];

  sorted.sort((a, b) => {
    let aVal = a[sortBy.value];
    let bVal = b[sortBy.value];

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (sortOrder.value === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  return sorted;
});

const updateProduct = async (updatedProduct) => {
  try {
    
    await api.updateProduct(updatedProduct._id, updatedProduct);
    await loadProducts();
  } catch (error) {
    console.error("Error updating product:", error);
  }
};

const addProducts = async (newProducts) => {
  try {
    const response = await api.bulkCreateProducts(newProducts);
    await loadAllProducts();
    await loadProducts();
    showUploadSection.value = false;

    console.log(`Successfully created ${response.count} products`);
  } catch (error) {
    console.error("Error adding products:", error);
  }
};

const addProduct = async (newProduct) => {
  try {
    await loadAllProducts();
    await loadProducts();
    showUploadSection.value = false;
    console.log("Successfully created product:", newProduct.name);
  } catch (error) {
    console.error("Error adding product:", error);
  }
};

const toggleStockVisibility = (productId) => {
  const product = products.value.find((p) => p._id === productId);
  if (product) {
    product.stockVisible = !product.stockVisible;
    updateProduct(product);
  }
};

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(totalCount.value / pageSize.value));
});

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (current <= 4) {
      for (let i = 2; i <= 6; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push("...");
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push("...");
      pages.push(current - 1);
      pages.push(current);
      pages.push(current + 1);
      pages.push("...");
      pages.push(total);
    }
  }

  return pages;
});

function changePage(page) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return;
  currentPage.value = page;
  loadProducts();
}

watch(pageSize, () => {
  currentPage.value = 1;
  loadProducts();
});

watch(
  filters,
  () => {
    currentPage.value = 1;
    loadProducts();
  },
  { deep: true }
);

watch([sortBy, sortOrder], () => {
  currentPage.value = 1;
  loadProducts();
});

watch(
  products,
  (newProducts) => {
    console.log("Products changed:", newProducts.length, "products");
    if (newProducts.length > 0) {
      console.log("Sample product:", newProducts[0]);
      console.log("Categories in products:", [...new Set(newProducts.map((p) => p.category))]);
    }
  },
  { deep: true }
);
</script>
