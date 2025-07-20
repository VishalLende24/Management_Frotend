# Smart Product Management System

A modern Vue.js application for managing product inventory with authentication, real-time stock tracking, and smart filtering capabilities.

## Features

### 🔐 Authentication System

- **Login Form**: Secure user authentication with email and password
- **Signup Form**: User registration with form validation
- **Session Management**: Persistent login state using localStorage
- **Protected Routes**: Navigation guards for authenticated and guest users

### 🧭 Navigation System

- **Responsive Navigation**: Mobile-friendly navigation bar
- **Dynamic Menu**: Shows different options for authenticated vs guest users
- **Route Protection**: Automatic redirection based on authentication status
- **User Profile**: Access to user information and account settings

### 📊 Product Management

- **Dashboard**: Overview with statistics and product management tools
- **Real-time Analytics**: Stock tracking with visual indicators
- **Smart Filtering**: Filter products by category, price, and stock levels
- **Bulk Upload**: CSV/Excel file import functionality
- **Product Cards**: Detailed product information with edit capabilities

### 🎨 Modern UI/UX

- **Tailwind CSS**: Modern, responsive design system
- **Mobile Responsive**: Works seamlessly on all device sizes
- **Loading States**: Visual feedback for user interactions
- **Error Handling**: User-friendly error messages

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the Frontend-asses directory:

   ```bash
   cd Frontend-asses
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### For New Users

1. Visit the home page to learn about the system
2. Click "Get Started" to create a new account
3. Fill in your details and create your account
4. Start managing your products!

### For Existing Users

1. Click "Sign in" from the home page
2. Enter your email and password
3. Access your dashboard and manage your inventory

### Product Management

- **Add Products**: Use the upload section to add products via CSV/Excel files
- **Filter Products**: Use the advanced filtering options to find specific products
- **Sort Products**: Sort by name, price, or stock levels
- **Edit Products**: Click on product cards to edit details
- **Track Stock**: Monitor stock levels with visual indicators

## Project Structure

```
src/
├── components/
│   ├── LoginForm.vue          # User login component
│   ├── SignupForm.vue         # User registration component
│   ├── Navigation.vue         # Main navigation bar
│   ├── Dashboard.vue          # Main dashboard with product management
│   ├── Profile.vue            # User profile and settings
│   ├── Home.vue              # Landing page for guests
│   ├── ProductList.vue        # Product listing component
│   ├── ProductCard.vue        # Individual product card
│   ├── Filters.vue           # Product filtering component
│   ├── SortDropdown.vue      # Product sorting component
│   └── UploadProducts.vue    # Bulk product upload component
├── router/
│   └── index.js              # Vue Router configuration
├── App.vue                   # Main application component
├── main.js                   # Application entry point
└── style.css                 # Global styles with Tailwind CSS
```

## Authentication Flow

1. **Guest Access**: Users can view the home page and access login/signup forms
2. **Registration**: New users can create accounts with email validation
3. **Login**: Existing users can authenticate with their credentials
4. **Protected Routes**: Authenticated users can access dashboard, profile, and products
5. **Session Persistence**: Login state is maintained across browser sessions
6. **Logout**: Users can log out and return to guest access

## Technologies Used

- **Vue.js 3**: Progressive JavaScript framework
- **Vue Router 4**: Official router for Vue.js
- **Tailwind CSS 4**: Utility-first CSS framework
- **Vite**: Fast build tool and development server
- **Papaparse**: CSV parsing library
- **XLSX**: Excel file processing library

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Adding New Features

1. Create new components in the `src/components/` directory
2. Add routes to `src/router/index.js` if needed
3. Update navigation in `src/components/Navigation.vue`
4. Test authentication guards for new protected routes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
