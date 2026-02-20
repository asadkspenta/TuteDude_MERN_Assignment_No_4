# TuteDude_MERN_Assignment_No_4
Laundry Services Web Application with EmailJS Integration

## Features
- Browse available laundry services
- Add/remove services to cart
- View cart with total amount
- Book services with email confirmation via EmailJS

## EmailJS Setup (Required)

To enable email functionality, you need to configure EmailJS:

### Step 1: Create an EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account

### Step 2: Create an Email Service
1. Go to **Email Services** in the dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps
5. Note down the **Service ID** (e.g., `service_abc123`)

### Step 3: Create an Email Template
1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Design your template with these variables:
   - `{{from_name}}` - Customer's full name
   - `{{from_email}}` - Customer's email
   - `{{phone}}` - Customer's phone number
   - `{{order_details}}` - List of ordered services
   - `{{total_amount}}` - Total order amount

**Example Template:**
```
Subject: New Laundry Service Booking from {{from_name}}

New booking received!

Customer Details:
- Name: {{from_name}}
- Email: {{from_email}}
- Phone: {{phone}}

Order Details:
{{order_details}}

Total Amount: {{total_amount}}
```

4. Note down the **Template ID** (e.g., `template_xyz789`)

### Step 4: Get Your Public Key
1. Go to **Account** > **API Keys**
2. Copy your **Public Key**

### Step 5: Update the Code
Open `js/script.js` and replace the placeholder values at the top:

```javascript
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";      // Your public key
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";      // Your service ID
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";    // Your template ID
```

## Running the Application
Simply open `index.html` in a web browser.

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES6+)
- EmailJS for email functionality
- Font Awesome for icons
