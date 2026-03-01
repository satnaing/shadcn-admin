# Admin Order Creation API Specification

This document details the technical specification for the Admin Order Creation endpoint, specifically designed for Point of Sale (POS) and administrative order placement.

## 1. Endpoint Overview

- **Method**: `POST`
- **URL**: `/admin/orders/shops/:shopId`
- **Controller**: `AdminOrderController.createOrder`
- **Permission**: `PERMISSIONS.ORDER_CREATE`

## 2. Request Details

### A. Path Parameters

- `shopId`: (String, UUID) The unique identifier of the shop where the order is being placed.

### B. Headers

- `Authorization`: `Bearer <admin_token>` (Requires JWT authentication)

### C. Body Structure (`CreateAdminOrderDto`)

The request body inherits all fields from the standard `CreateOrderDto` while adding admin-specific routing logic.

| Field                   | Type           | Required     | Description                                                           |
| :---------------------- | :------------- | :----------- | :-------------------------------------------------------------------- |
| **Admin Fields**        |                |              |                                                                       |
| `assignToSelf`          | `boolean`      | Optional     | If `true`, the system assigns the order to the admin making the call. |
| `staffId`               | `string(UUID)` | Optional     | Explicitly assign the order to a specific staff member.               |
| **Global Order Fields** |                |              |                                                                       |
| `userId`                | `string(UUID)` | Optional     | The customer ID the order belongs to.                                 |
| `guestInfo`             | `object`       | Optional     | Guest details `{ name, phone }` if no `userId` is provided.           |
| `items`                 | `array`        | **Required** | List of products and options (see below).                             |
| `fulfillmentMethodId`   | `string(UUID)` | **Required** | The ID of the fulfillment method (e.g., Pickup, Dine-in).             |
| `status`                | `string(Enum)` | **Required** | Initial status (e.g., `PENDING`, `CONFIRMED`).                        |
| `invoiceCode`           | `string`       | **Required** | Unique code for the transaction.                                      |
| `queueNumber`           | `integer`      | **Required** | Order sequence number for the day.                                    |
| `instructions`          | `string`       | Optional     | Special instructions for the barista/kitchen.                         |
| `scheduledFor`          | `string(ISO)`  | Optional     | Scheduled time for fulfillment.                                       |

#### `items` Array Structure

Each item in the `items` array follows this structure:

```json
{
  "productId": "uuid",
  "quantity": 1,
  "options": {
    "choiceId": ["choice-uuid-1", "choice-uuid-2"]
  },
  "instructions": "Extra hot"
}
```

## 3. Implementation Logic

1. **Authentication**: The system extracts the admin's `businessId` and `userId` from the JWT token.
2. **Assignment Prioritization**:
   - If `staffId` is provided in the body, the order is assigned to that staff member.
   - Else if `assignToSelf` is `true`, the order is assigned to the admin calling the API.
   - If neither is provided, the order is created without a specific staff assignment (unassigned pos order).
3. **Source Tracking**: The system automatically sets the `source` to `ADMIN_PANEL` (or `POS` depending on implementation context) to differentiate from customer-app orders.
4. **Validation**: Standard validation for product availability, price calculations, and stock deduction is triggered upon creation.

## 4. Response Example

- **Status**: `201 Created`
- **Body**: Returns the full `Order` object including prices, totals, and relations.

```json
{
  "id": "order-uuid",
  "businessId": "business-uuid",
  "shopId": "shop-uuid",
  "userId": "customer-uuid",
  "staffId": "admin-uuid",
  "invoiceCode": "INV-123",
  "grandTotal": 15.50,
  "source": "ADMIN_PANEL",
  "status": "PENDING",
  "createdAt": "2024-12-01T12:00:00Z",
  "items": [...]
}
```
