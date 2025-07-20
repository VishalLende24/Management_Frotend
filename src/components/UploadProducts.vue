<script setup>
import { ref } from "vue";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import api from "../services/api";

const emit = defineEmits(["add-products", "close"]);

const isUploading = ref(false);
const dragOver = ref(false);
const uploadError = ref("");
const uploadSuccess = ref("");

const handleDrop = (event) => {
  event.preventDefault();
  dragOver.value = false;

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    processFile(file);
  }
};

const processFile = async (file) => {
  isUploading.value = true;
  uploadError.value = "";
  uploadSuccess.value = "";

  try {
    const fileExtension = file.name.split(".").pop().toLowerCase();
    let products = [];

    if (fileExtension === "csv") {
      products = await parseCSV(file);
    } else if (["xlsx", "xls"].includes(fileExtension)) {
      products = await parseExcel(file);
    } else {
      throw new Error("Unsupported file format. Please upload a CSV or Excel file.");
    }

    if (products.length === 0) {
      throw new Error("No valid products found in the file.");
    }

    const validProducts = validateProducts(products);

    if (validProducts.length === 0) {
      throw new Error("No valid products found after validation.");
    }

    try {
    } catch (validationError) {
      throw new Error(`Validation error: ${validationError.message}`);
    }

    emit("add-products", validProducts);
    uploadSuccess.value = `Successfully imported ${validProducts.length} products!`;
  } catch (error) {
    uploadError.value = error.message;
  } finally {
    isUploading.value = false;
  }
};

const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error("Error parsing CSV file: " + results.errors[0].message));
        } else {
          resolve(results.data);
        }
      },
      error: (error) => {
        reject(new Error("Error reading CSV file: " + error.message));
      },
    });
  });
};

const parseExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) {
          reject(new Error("Excel file must have at least a header row and one data row."));
          return;
        }

        const headers = jsonData[0];
        const products = jsonData.slice(1).map((row) => {
          const product = {};
          headers.forEach((header, index) => {
            product[header] = row[index];
          });
          return product;
        });

        resolve(products);
      } catch (error) {
        reject(new Error("Error parsing Excel file: " + error.message));
      }
    };
    reader.onerror = () => {
      reject(new Error("Error reading Excel file"));
    };
    reader.readAsArrayBuffer(file);
  });
};

const validateProducts = (products) => {
  const validProducts = [];

  products.forEach((product, index) => {
    try {
      if (!product.name || !product.price || !product.stock || !product.category) {
        console.warn(`Skipping product at row ${index + 1}: Missing required fields`);
        return;
      }

      const cleanProduct = {
        name: String(product.name).trim(),
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
        category: String(product.category).trim(),
        stockVisible: true,
      };

      if (cleanProduct.name === "") {
        console.warn(`Skipping product at row ${index + 1}: Empty name`);
        return;
      }

      if (isNaN(cleanProduct.price) || cleanProduct.price < 0) {
        console.warn(`Skipping product at row ${index + 1}: Invalid price`);
        return;
      }

      if (isNaN(cleanProduct.stock) || cleanProduct.stock < 0) {
        console.warn(`Skipping product at row ${index + 1}: Invalid stock`);
        return;
      }

      if (cleanProduct.category === "") {
        console.warn(`Skipping product at row ${index + 1}: Empty category`);
        return;
      }

      validProducts.push(cleanProduct);
    } catch (error) {
      console.warn(`Skipping product at row ${index + 1}: ${error.message}`);
    }
  });

  return validProducts;
};

const handleDragOver = (event) => {
  event.preventDefault();
  dragOver.value = true;
};

const handleDragLeave = (event) => {
  event.preventDefault();
  dragOver.value = false;
};

const clearMessages = () => {
  uploadError.value = "";
  uploadSuccess.value = "";
};

const closeUpload = () => {
  emit("close");
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium text-gray-900">Upload Products</h3>
      <button
        @click="closeUpload"
        class="text-gray-400 hover:text-gray-600 transition-colors"
        title="Close upload section"
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
    <div class="text-center">
      <p class="text-sm text-gray-600 mb-6">
        Upload a CSV or Excel file to bulk import products. The file should have columns: name,
        price, stock, category
      </p>

      <div
        @drop="handleDrop"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        class="border-2 border-dashed rounded-lg p-8 transition-colors"
        :class="dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'"
      >
        <div class="space-y-4">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>

          <div>
            <p class="text-sm text-gray-600">
              <span class="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                <label for="file-upload" class="cursor-pointer"> Click to upload </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  @change="handleFileSelect"
                  class="sr-only"
                />
              </span>
              or drag and drop
            </p>
            <p class="text-xs text-gray-500 mt-1">CSV, XLSX, or XLS files up to 10MB</p>
          </div>
        </div>
      </div>

      <div v-if="isUploading" class="mt-4">
        <div class="flex items-center justify-center space-x-2">
          <svg class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
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
          <span class="text-sm text-gray-600">Processing file...</span>
        </div>
      </div>

      <div v-if="uploadError" class="mt-4">
        <div class="bg-red-50 border border-red-200 rounded-md p-4">
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
              <p class="text-sm text-red-800">{{ uploadError }}</p>
              <button @click="clearMessages" class="text-sm text-red-600 hover:text-red-500 mt-1">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="uploadSuccess" class="mt-4">
        <div class="bg-green-50 border border-green-200 rounded-md p-4">
          <div class="flex">
            <svg
              class="h-5 w-5 text-green-400"
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
            <div class="ml-3">
              <p class="text-sm text-green-800">{{ uploadSuccess }}</p>
              <button
                @click="clearMessages"
                class="text-sm text-green-600 hover:text-green-500 mt-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 text-left">
        <h4 class="text-sm font-medium text-gray-900 mb-2">Expected CSV/Excel Format:</h4>
        <div class="bg-gray-50 rounded-md p-3 text-xs font-mono">
          <div>name,price,stock,category</div>
          <div>Product Name,29.99,10,Electronics</div>
          <div>Another Product,15.50,25,Kitchen</div>
        </div>
      </div>
    </div>
  </div>
</template>
