# GGNetworks Customer Portal

A modern, responsive React application for the GGNetworks wireless access portal. Built with Material-UI, featuring voucher authentication, package purchasing, and real-time payment processing.

## 🚀 Features

### Core Functionality
- **Voucher Authentication**: 6-character code input with auto-navigation
- **Internet Package Purchase**: Four fixed plans with payment integration
- **Real-time Payment Processing**: Transaction state visualization
- **Mobile-First Design**: Fully responsive across all devices
- **Smooth Animations**: Framer Motion powered transitions

### User Experience
- **Auto-connection**: Seamless network session establishment
- **SMS Notifications**: Voucher codes sent via SMS
- **Payment Gateway**: SELCOM integration for local payments
- **Progress Tracking**: Visual feedback for all transaction states

### Technical Features
- **Material-UI**: Modern, accessible component library
- **React Query**: Efficient data fetching and caching
- **Axios**: HTTP client with interceptors and error handling
- **Framer Motion**: Smooth animations and transitions
- **Hot Toast**: User-friendly notifications

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **UI Library**: Material-UI (MUI) v5
- **Styling**: Emotion (CSS-in-JS)
- **HTTP Client**: Axios
- **State Management**: React Query
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Build Tool**: Create React App

## 📦 Installation

1. **Clone the repository**
   ```bash
   cd Frontend/customer_portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:8080/api/v1
   REACT_APP_ENVIRONMENT=development
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── CustomerPortal.js      # Main portal component
│   ├── VoucherAuthentication.js # Voucher input and validation
│   ├── InternetPackages.js    # Package selection and purchase
│   └── Footer.js             # Footer component
├── services/
│   └── api.js               # API configuration and endpoints
├── App.js                   # Main app component with theme
└── index.js                 # Application entry point
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: #1976d2 (GGNetworks brand)
- **Secondary Orange**: #ff6b35 (Accent color)
- **Success Green**: #4caf50
- **Error Red**: #f44336
- **Warning Orange**: #ff9800

### Typography
- **Font Family**: Roboto (Google Fonts)
- **Headings**: 700 weight for emphasis
- **Body Text**: 400 weight for readability

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Inputs**: Clean, modern styling with focus states

## 🔧 Configuration

### API Endpoints
The application connects to the GGNetworks backend API:

- **Base URL**: `http://localhost:8080/api/v1`
- **Voucher Validation**: `/hotspot/validate-voucher`
- **Package Purchase**: `/public/purchase-package`
- **Connection**: `/hotspot/connect`

### Environment Variables
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_ENVIRONMENT`: Development/Production mode

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### NGINX Configuration
```nginx
server {
    listen 80;
    server_name connect.ggnetworks.co.tz;
    
    location / {
        root /var/www/customer-portal;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📱 Mobile Optimization

- **Responsive Design**: Mobile-first approach
- **Touch-Friendly**: Large touch targets
- **Fast Loading**: Optimized bundle size
- **PWA Ready**: Service worker support

## 🔒 Security Features

- **HTTPS Enforcement**: SSL/TLS encryption
- **Input Validation**: Client-side validation
- **XSS Protection**: Sanitized inputs
- **CSRF Protection**: Axios interceptors

## 📊 Performance

- **Lazy Loading**: Component-based code splitting
- **Image Optimization**: WebP format support
- **Caching**: React Query caching strategy
- **Bundle Analysis**: Webpack bundle analyzer

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 📈 Analytics

The application is ready for Google Analytics integration:

```javascript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary to GGNetworks. All rights reserved.

## 📞 Support

For technical support or questions:
- **Email**: support@ggnetworks.co.tz
- **Phone**: +255 742 844 024
- **WhatsApp**: +255 742 844 024

---

**GGNetworks Customer Portal** - Your Gateway to Reliable Internet Connectivity in Tanzania 