<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link to="/" class="font-medium text-indigo-600 hover:text-indigo-500">
            sign in to your existing account
          </router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSignup">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                v-model="form.firstName"
                name="firstName"
                type="text"
                required
                @blur="handleFieldBlur('firstName')"
                @input="handleFieldInput('firstName')"
                :class="{
                  'border-red-300 focus:border-red-500 focus:ring-red-500': errors.firstName,
                  'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500':
                    !errors.firstName,
                }"
                class="mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-opacity-50 sm:text-sm"
                placeholder="First Name"
              />
              <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">
                {{ errors.firstName }}
              </p>
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="lastName"
                v-model="form.lastName"
                name="lastName"
                type="text"
                required
                @blur="handleFieldBlur('lastName')"
                @input="handleFieldInput('lastName')"
                :class="{
                  'border-red-300 focus:border-red-500 focus:ring-red-500': errors.lastName,
                  'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500': !errors.lastName,
                }"
                class="mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-opacity-50 sm:text-sm"
                placeholder="Last Name"
              />
              <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              @blur="handleFieldBlur('email')"
              @input="handleFieldInput('email')"
              :class="{
                'border-red-300 focus:border-red-500 focus:ring-red-500': errors.email,
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500': !errors.email,
              }"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-opacity-50 sm:text-sm"
              placeholder="Email address"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700"> Password </label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              @blur="handleFieldBlur('password')"
              @input="handleFieldInput('password')"
              :class="{
                'border-red-300 focus:border-red-500 focus:ring-red-500': errors.password,
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500': !errors.password,
              }"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-opacity-50 sm:text-sm"
              placeholder="Password"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            <p class="mt-1 text-xs text-gray-500">
              Must be at least 6 characters with uppercase, lowercase, and number
            </p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              @blur="handleFieldBlur('confirmPassword')"
              @input="handleFieldInput('confirmPassword')"
              :class="{
                'border-red-300 focus:border-red-500 focus:ring-red-500': errors.confirmPassword,
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500':
                  !errors.confirmPassword,
              }"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-opacity-50 sm:text-sm"
              placeholder="Confirm Password"
            />
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
              {{ errors.confirmPassword }}
            </p>
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="agree-terms"
            v-model="form.agreeTerms"
            name="agree-terms"
            type="checkbox"
            required
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label for="agree-terms" class="ml-2 block text-sm text-gray-900">
            I agree to the
            <a href="#" class="text-indigo-600 hover:text-indigo-500">Terms and Conditions</a>
          </label>
        </div>
        <p v-if="errors.agreeTerms" class="text-sm text-red-600">{{ errors.agreeTerms }}</p>

        <div>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
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
            </span>
            {{ loading ? "Creating account..." : "Create account" }}
          </button>
        </div>

        <div v-if="generalError" class="bg-red-50 border border-red-200 rounded-md p-4">
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
              <p class="text-sm text-red-800">{{ generalError }}</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();
const loading = ref(false);
const generalError = ref("");

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
});

const errors = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeTerms: "",
});

const isFormValid = computed(() => {
  return (
    form.firstName &&
    form.lastName &&
    form.email &&
    form.password &&
    form.confirmPassword &&
    form.agreeTerms &&
    form.password === form.confirmPassword &&
    form.password.length >= 6 &&
    Object.values(errors).every((error) => !error)
  );
});

const validateField = (field, value) => {
  switch (field) {
    case "firstName":
      if (!value || value.trim() === "") {
        return "First name is required";
      }
      if (value.trim().length < 2) {
        return "First name must be at least 2 characters";
      }
      if (value.trim().length > 50) {
        return "First name must not exceed 50 characters";
      }
      break;
    case "lastName":
      if (!value || value.trim() === "") {
        return "Last name is required";
      }
      if (value.trim().length < 2) {
        return "Last name must be at least 2 characters";
      }
      if (value.trim().length > 50) {
        return "Last name must not exceed 50 characters";
      }
      break;
    case "email":
      if (!value || value.trim() === "") {
        return "Email is required";
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please provide a valid email address";
      }
      break;
    case "password":
      if (!value) {
        return "Password is required";
      }
      if (value.length < 6) {
        return "Password must be at least 6 characters long";
      }
      if (value.length > 100) {
        return "Password must not exceed 100 characters";
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
      if (!passwordRegex.test(value)) {
        return "Password must contain at least one lowercase letter, one uppercase letter, and one number";
      }
      break;
    case "confirmPassword":
      if (!value) {
        return "Please confirm your password";
      }
      if (value !== form.password) {
        return "Passwords do not match";
      }
      break;
    case "agreeTerms":
      if (!value) {
        return "You must agree to the terms and conditions";
      }
      break;
  }
  return "";
};

const validateForm = () => {
  let isValid = true;

  errors.firstName = validateField("firstName", form.firstName);
  errors.lastName = validateField("lastName", form.lastName);
  errors.email = validateField("email", form.email);
  errors.password = validateField("password", form.password);
  errors.confirmPassword = validateField("confirmPassword", form.confirmPassword);
  errors.agreeTerms = validateField("agreeTerms", form.agreeTerms);

  Object.values(errors).forEach((error) => {
    if (error) isValid = false;
  });

  return isValid;
};

const clearErrors = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });
  generalError.value = "";
};

const handleFieldBlur = (field) => {
  const value = form[field];
  errors[field] = validateField(field, value);

  if (field === "password" && form.confirmPassword) {
    errors.confirmPassword = validateField("confirmPassword", form.confirmPassword);
  }
};

const handleFieldInput = (field) => {
  if (errors[field]) {
    const value = form[field];
    errors[field] = validateField(field, value);

    if (field === "password" && form.confirmPassword) {
      errors.confirmPassword = validateField("confirmPassword", form.confirmPassword);
    }
  }
};

watch(
  () => form.agreeTerms,
  (newValue) => {
    errors.agreeTerms = validateField("agreeTerms", newValue);
  }
);

const handleSignup = async () => {
  loading.value = true;
  clearErrors();

  if (!validateForm()) {
    loading.value = false;
    return;
  }

  try {
    const response = await api.signup(form.firstName, form.lastName, form.email, form.password);

    console.log("Signup response:", response);
    console.log("Cookies after signup:", document.cookie);

    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", response.data.email);
    localStorage.setItem("userName", `${response.data.firstName} ${response.data.lastName}`);
    localStorage.setItem("userId", response.data._id);
    sessionStorage.setItem("Authorization", response.data.cookie);

    if (window._setAuth) window._setAuth(true);

    router.push("/dashboard");
  } catch (err) {
    console.error("Signup error:", err);

    if (err.message && err.message.includes("Validation")) {
      const validationErrors = err.message.split(", ");
      validationErrors.forEach((error) => {
        if (error.includes("firstName")) {
          errors.firstName = error.replace("firstName: ", "");
        } else if (error.includes("lastName")) {
          errors.lastName = error.replace("lastName: ", "");
        } else if (error.includes("email")) {
          errors.email = error.replace("email: ", "");
        } else if (error.includes("password")) {
          errors.password = error.replace("password: ", "");
        }
      });
    } else if (err.message && err.message.includes("already exists")) {
      errors.email = "This email is already registered";
    } else {
      generalError.value = err.message || "Signup failed. Please try again.";
    }
  } finally {
    loading.value = false;
  }
};
</script>
