# Payment Method Management API Specification (v1)

This specification documents the administrative API for managing Global/Business-level payment methods.

## Base Configuration

- **Base URL**: `/api/v1/admin/payment-methods`
- **Authentication**: `Bearer <JWT_TOKEN>`
- **Required Permission**: `org:payment:manage`

---

## 1. List All Payment Methods

Retrieves a list of all payment methods available to the organization.

- **Method**: `GET`
- **Path**: `/`

### Response

```json
[
  {
    "id": "uuid-v7",
    "businessId": "uuid-v7",
    "slug": "aba-payway",
    "name": { "en": "ABA PayWay", "km": "អេប៊ីអេ ផេវេ" },
    "description": {
      "en": "Pay with ABA Bank",
      "km": "បង់ប្រាក់ជាមួយធនាគារ អេប៊ីអេ"
    },
    "logoUrl": "https://example.com/aba-logo.png",
    "category": "QR",
    "isDigital": true,
    "publicConfig": {},
    "isActive": true,
    "createdAt": "2024-03-10T00:00:00Z",
    "updatedAt": "2024-03-10T00:00:00Z"
  }
]
```

---

## 2. Get Payment Method by ID

Retrieves details of a specific payment method.

- **Method**: `GET`
- **Path**: `/:id`

---

## 3. Create Payment Method

Registers a new payment method globally.

- **Method**: `POST`
- **Path**: `/`
- **Request Body**:

```json
{
  "slug": "stripe-card",
  "name": { "en": "Stripe Card", "km": "ប័ណ្ណ Stripe" },
  "description": { "en": "International cards", "km": "ប័ណ្ណអន្តរជាតិ" },
  "logoUrl": "https://example.com/stripe.png",
  "category": "CARD",
  "isDigital": true,
  "isActive": true
}
```

---

## 4. Update Payment Method

Modifies an existing payment method (e.g., to turn it on or off).

- **Method**: `PATCH`
- **Path**: `/:id`
- **Request Body** (Partial Update):

```json
{
  "isActive": false,
  "name": { "en": "Updated Name" }
}
```

---

## Data Models

### Enums: `PaymentCategory`

- `CASH`
- `QR`
- `CARD`
- `WALLET`
- `BANK_TRANSFER`
- `MANUAL_TRANSFER`

### JSON Objects: `name`, `description`

These are localization objects where the key is the language code (e.g., `en`, `km`) and the value is the translated string.

---

## Error Handling

The API follows standard NestJS error responses:

- `401 Unauthorized`: Missing or invalid JWT.
- `403 Forbidden`: Insufficient permissions.
- `404 Not Found`: Invalid payment method ID.
- `400 Bad Request`: Validation failure (check `message` for array of constraints).
