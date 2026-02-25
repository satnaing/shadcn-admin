# KDS Architecture Frontend Specification

This document details the lightweight order endpoint and real-time WebSocket events required to build the Kitchen Display System (KDS) interface.

---

## 1. Initial Load: API Board State

Rather than fetching the heavy paginated endpoints, use the dedicated KDS endpoint which returns the full active board state.

**Endpoint:**
`GET /admin/shops/:shopId/kds`

**Authentication:**
Requires standard `Authorization: Bearer <token>` and `ORG_MANAGE` permissions.

**Logic & Time Constraints:**

- Automatically scopes query to `createdAt` or `scheduledFor` within the last 24 hours.
- Automatically filters strictly for active statuses: `PENDING`, `CONFIRMED`, `PREPARING`, `READY`.
- `COMPLETED` and `CANCELLED` orders are strictly ignored by the API to ensure the board only displays actionable items.

**Response Payload (`200 OK`):**
Returns an object grouped by `OrderStatus`, allowing the frontend to route orders directly into their respective Kanban columns without client-side array sorting.

```json
{
  "PENDING": [],
  "CONFIRMED": [
    {
      "id": "uuid",
      "queueNumber": "105",
      "invoiceCode": "INV-105",
      "status": "CONFIRMED",
      "instructions": "Leave at front door", // Order-level remarks
      "scheduledFor": "2026-02-25T15:00:00.000Z", // Can be null
      "fulfillmentMethodId": "uuid",
      "fulfillmentName": "Pick-up",
      "fulfillmentCategory": "PICK_UP",
      "createdAt": "2026-02-25T14:30:00.000Z",
      "grandTotal": 9.5,
      "subtotal": 12.0,
      "paymentMethodName": "Credit Card",
      "items": [
        {
          "id": "uuid",
          "productId": "uuid",
          "productName": "Latte",
          "quantity": 2,
          "instructions": "Extra hot", // Item-level remarks
          "unitPrice": 4.5,
          "subtotal": 9.0,
          "options": [
            {
              "choiceId": "uuid",
              "optionName": "Oat Milk",
              "quantity": 2,
              "unitPrice": 0.5,
              "subtotal": 1.0
            }
          ]
        }
      ]
    }
  ],
  "PREPARING": [],
  "READY": []
}
```

---

## 2. Real-time Updates: KDS WebSocket

Instead of continuously polling the API, the KDS frontend should maintain a WebSocket connection to receive live order updates.

**Connection Details:**

- **Namespace:** `/kds`
- **Transport:** Socket.io
- **Required Query Param:** `shopId` (This automatically subscribes the socket to the correct branch's room).

**Initialization Example (Client-side):**

```javascript
import { io } from 'socket.io-client';

// Connect directly to the 'kds' namespace and join the shop's room
const socket = io('https://your-api-url.com/kds', {
  query: {
    shopId: 'the-specific-shop-uuid',
  },
});

socket.on('connect', () => {
  console.log('Connected to KDS Real-time Gateway');
});
```

### Supported Events

#### `order.created`

- **When it fires:** A new customer order successfully processes and is saved.
- **Action:** Prepend the payload to the "Pending" or "Confirmed" column in the KDS Kanban board.

```javascript
socket.on('order.created', (newOrder) => {
  console.log('New order received:', newOrder.invoiceCode);
  // Add newOrder to state
});
```

#### `order.cancelled`

- **When it fires:** An admin or customer cancels a live order before completion.
- **Action:** Find the order by `id` in your local state and animate its removal from the active board.

```javascript
socket.on('order.cancelled', (cancelledOrder) => {
  console.log(
    `Order ${cancelledOrder.invoiceCode} cancelled! Removing from board.`,
  );
  // Remove order from state based on cancelledOrder.id
});
```
