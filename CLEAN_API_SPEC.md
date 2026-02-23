# API Specification

## 1. Admin   Communication

- `POST /admin/announcements`: Create a new announcement
  - Body: `CreateAnnouncementDto`
    - `title`: object, required
    - `content`: object, required
    - `imageUrl`: string
    - `targetAudience`: string, required
    - `priority`: string
- `GET /admin/announcements`: List all announcements
  - Query: `targetAudience` (string)
- `PATCH /admin/announcements/{id}`: Update an announcement
  - Body: `UpdateAnnouncementDto`
    - `title`: object
    - `content`: object
    - `imageUrl`: string
    - `targetAudience`: string
    - `priority`: string
    - `isActive`: boolean
- `DELETE /admin/announcements/{id}`: Delete an announcement
## 2. Admin Analytics

- `GET /admin/analytics/summary`: Get Revenue, Orders, Discount Summary
  - Query: `startDate` (string, required)
  - Query: `endDate` (string, required)
  - Query: `shopId` (string)
  - Query: `groupBy` (string)
- `GET /admin/analytics/sales-chart`: Get Sales Chart Data (Revenue over Time)
  - Query: `startDate` (string, required)
  - Query: `endDate` (string, required)
  - Query: `shopId` (string)
  - Query: `groupBy` (string)
- `GET /admin/analytics/top-products`: Get Top Selling Products
  - Query: `startDate` (string, required)
  - Query: `endDate` (string, required)
  - Query: `shopId` (string)
  - Query: `groupBy` (string)
- `GET /admin/analytics/low-stock`: Get Low Stock Alerts
  - Query: `startDate` (string, required)
  - Query: `endDate` (string, required)
  - Query: `shopId` (string)
  - Query: `groupBy` (string)
## 3. Admin Audit Logs

- `GET /admin/audit-logs`: List Admin Audit Logs
  - Query: `staffId` (string)
  - Query: `targetResource` (string)
  - Query: `startDate` (string)
  - Query: `endDate` (string)
  - Query: `page` (number)
  - Query: `limit` (number)
## 4. Admin Badges

- `POST /admin/badges`: Create a new marketing badge
  - Body: `CreateBadgeDto`
    - `label`: object, required
    - `code`: string, required
    - `color`: string
- `GET /admin/badges`: List all marketing badges
- `PATCH /admin/badges/{id}`: Update a marketing badge
  - Body: `UpdateBadgeDto`
    - `label`: object
    - `code`: string
    - `color`: string
- `DELETE /admin/badges/{id}`: Delete a marketing badge
## 5. Admin Business

- `GET /admin/business`: Get current Business profile
- `PATCH /admin/business`: Update Business profile
  - Body: `UpdateBusinessProfileDto`
    - `name`: Unknown
    - `supportEmail`: string
    - `logoUrl`: string
    - `bannerImageUrl`: string
## 6. Admin Crm

- `GET /admin/customers`: List customers with filtering
  - Query: `search` (string)
  - Query: `status` (string)
  - Query: `page` (number)
  - Query: `limit` (number)
- `GET /admin/customers/{id}`: Get customer details (Loyalty, Orders)
- `PATCH /admin/customers/{id}/status`: Ban or Unban a customer
  - Body: `UpdateCustomerStatusDto`
    - `status`: string, required
    - `reason`: string, required
- `POST /admin/customers/{id}/loyalty/adjust`: Adjust customer loyalty points
  - Body: `AdjustLoyaltyDto`
    - `points`: number, required
    - `reason`: string, required
## 7. Admin Cash Drawers

- `GET /admin/drawers`: List Cash Drawer Sessions (Admin)
  - Query: `shopId` (string, required)
## 8. Admin Categories

- `POST /admin/categories`: Create a new category
  - Body: `CreateCategoryDto`
    - `name`: object, required
    - `imageUrl`: object
    - `slug`: string, required
    - `description`: object
    - `sortOrder`: number
- `GET /admin/categories`: List all categories
- `PATCH /admin/categories/{id}`: Update a category
  - Body: `UpdateCategoryDto`
    - `name`: object
    - `imageUrl`: object
    - `slug`: string
    - `description`: object
    - `sortOrder`: number
- `DELETE /admin/categories/{id}`: Delete a category
## 9. Admin Collections

- `POST /admin/collections`: Create a new collection
  - Body: `CreateCollectionDto`
    - `name`: object, required
    - `slug`: string, required
    - `productIds`: array
    - `bannerUrl`: string
- `GET /admin/collections`: List all collections
- `GET /admin/collections/{id}`: Get collection details
- `PATCH /admin/collections/{id}`: Update a collection
  - Body: `UpdateCollectionDto`
    - `name`: object
    - `slug`: string
    - `productIds`: array
    - `bannerUrl`: string
- `DELETE /admin/collections/{id}`: Delete a collection
## 10. Admin Iam (Roles & Permissions)

- `POST /admin/roles`: Create a new Role
  - Body: `CreateRoleDto`
    - `name`: object, required
    - `slug`: string, required
    - `description`: object
    - `permissionIds`: array, required
- `GET /admin/roles`: List all Roles
- `GET /admin/permissions`: List all System Permissions
## 11. Admin Ingredients

- `POST /admin/ingredients`: Create Ingredient
  - Body: `CreateIngredientDto`
    - `name`: object, required
    - `sku`: string, required
    - `cost`: number, required
    - `unitId`: string, required
- `GET /admin/ingredients`: List Ingredients
- `PATCH /admin/ingredients/{id}`: Update Ingredient
  - Body: `UpdateIngredientDto`
    - `name`: object
    - `sku`: string
    - `cost`: number
    - `unitId`: string
## 12. Admin Marketing (Promotions/Vouchers)

- `POST /admin/promotions`: Create a new Promotion
  - Body: `CreatePromotionDto`
    - `name`: object, required
    - `description`: object
    - `type`: string, required
    - `value`: number, required
    - `scope`: string, required
    - `budgetLimitAmount`: number
    - `isFeatured`: boolean
    - `bannerUrl`: object
    - `sku`: string
    - `startDate`: string
    - `endDate`: string
    - `productIds`: array
    - `categoryIds`: array
    - `collectionIds`: array
    - `includeCategories`: array
    - `includeProducts`: array
    - `excludeCategories`: array
    - `excludeProducts`: array
    - `includeCollections`: array
    - `excludeCollections`: array
    - `strategyType`: string
    - `applicationType`: string
    - `isVoucherRequired`: boolean
    - `code`: string
    - `rewardProductId`: string
    - `rules`: array
    - `actions`: array
- `GET /admin/promotions`: List all Promotions
  - Query: `isFeatured` (string, required)
- `PATCH /admin/promotions/{id}`: Update a Promotion
  - Body: `UpdatePromotionDto`
    - `name`: object
    - `description`: object
    - `type`: string
    - `value`: number
    - `scope`: string
    - `budgetLimitAmount`: number
    - `isFeatured`: boolean
    - `bannerUrl`: object
    - `sku`: string
    - `startDate`: string
    - `endDate`: string
    - `productIds`: array
    - `categoryIds`: array
    - `collectionIds`: array
    - `includeCategories`: array
    - `includeProducts`: array
    - `excludeCategories`: array
    - `excludeProducts`: array
    - `includeCollections`: array
    - `excludeCollections`: array
    - `strategyType`: string
    - `applicationType`: string
    - `isVoucherRequired`: boolean
    - `code`: string
    - `rewardProductId`: string
    - `rules`: array
    - `actions`: array
- `POST /admin/promotions/{id}/generate-vouchers`: Generate batch of Vouchers for a Promotion
  - Body: `GenerateVoucherDto`
    - `promotionId`: string, required
    - `quantity`: number, required
    - `prefix`: string, required
## 13. Admin Media

- `POST /admin/media/upload/product`: Upload a product image
- `POST /admin/media/upload/profile`: Upload a user profile image
- `POST /admin/media/upload/banner`: Upload a banner image
## 14. Admin Mobile Versions

- `GET /admin/mobile-versions`: List mobile app versions
- `POST /admin/mobile-versions`: Publish new mobile app version
  - Body: `CreateMobileVersionDto`
    - `platform`: string, required
    - `version`: string, required
    - `minUsableVersion`: string, required
    - `message`: Unknown, required
    - `updateUrl`: string, required
## 15. Admin Option Groups

- `POST /admin/option-groups`: Create a new global option group
  - Body: `CreateOptionGroupDto`
    - `name`: object, required
    - `sku`: string, required
    - `type`: string, required
    - `minSelect`: number, required
    - `maxSelect`: number, required
    - `choices`: array, required
- `GET /admin/option-groups`: List all global option groups
  - Query: `search` (string, required)
  - Query: `include` (string, required)
- `DELETE /admin/option-groups/{id}`: Delete option group
- `PATCH /admin/option-groups/{id}`: Update global option group
  - Body: `UpdateOptionGroupDto`
    - `name`: object
    - `sku`: string
    - `type`: string
    - `minSelect`: number
    - `maxSelect`: number
- `POST /admin/option-groups/{groupId}/choices`: Add a choice to an option group
  - Body: `CreateOptionChoiceDto`
    - `name`: object, required
    - `sku`: string, required
    - `priceModifier`: number, required
    - `price`: number, required
    - `isDefault`: boolean, required
- `DELETE /admin/option-groups/{groupId}/choices/{choiceId}`: Remove a choice from an option group
- `PATCH /admin/option-groups/{groupId}/choices/{choiceId}`: Update local option choice
  - Body: `UpdateOptionChoiceDto`
    - `name`: object
    - `sku`: string
    - `priceModifier`: number
    - `price`: number
    - `isDefault`: boolean
## 16. Admin Orders

- `GET /admin/orders`: List Orders
  - Query: `page` (number)
  - Query: `limit` (number)
  - Query: `shopId` (string)
  - Query: `status` (string)
  - Query: `startDate` (string)
  - Query: `endDate` (string)
  - Query: `search` (string)
- `GET /admin/orders/{id}`: Get Order Details
- `PATCH /admin/orders/{id}/status`: Update Order Status
  - Body: `UpdateOrderStatusDto`
    - `status`: string, required
- `POST /admin/orders/{id}/cancel`: Cancel Order
  - Body: `CancelOrderDto`
    - `reason`: string, required
    - `inventoryRestock`: boolean
## 17. Admin Products

- `POST /admin/products`: Create a new product
  - Body: `CreateProductDto`
    - `name`: object, required
    - `sku`: string, required
    - `description`: object
    - `price`: Unknown, required
    - `categoryId`: string, required
    - `collectionIds`: array
    - `imageUrl`: object
    - `status`: string
    - `isUnlockable`: boolean
    - `optionGroupIds`: array
    - `recipes`: array
- `GET /admin/products`: Get all products with filters
  - Query: `categoryId` (string)
  - Query: `collectionId` (string)
  - Query: `search` (string)
  - Query: `page` (number)
  - Query: `limit` (number)
- `GET /admin/products/{id}`: Get product details
- `PATCH /admin/products/{id}`: Update a product
  - Body: `UpdateProductDto`
    - `name`: object
    - `sku`: string
    - `description`: object
    - `price`: Unknown
    - `categoryId`: string
    - `collectionIds`: array
    - `imageUrl`: object
    - `status`: string
    - `isUnlockable`: boolean
    - `optionGroupIds`: array
    - `recipes`: array
- `DELETE /admin/products/{id}`: Delete a product (Soft delete if orders exist)
- `POST /admin/products/{id}/option-groups`: Link an existing global option group to this product
  - Body: `LinkOptionGroupDto`
    - `optionGroupId`: string, required
- `DELETE /admin/products/{id}/option-groups/{groupId}`: Unlink an option group from this product
## 18. Admin Recipes

- `POST /admin/recipes`: Add an ingredient to a Product/Option
  - Body: `CreateRecipeDto`
    - `ingredientId`: string, required
    - `quantity`: number, required
    - `productId`: string
    - `optionId`: string
- `DELETE /admin/recipes/{id}`: Remove an ingredient link
- `GET /admin/recipes/product/{productId}`: Get all ingredients for a Product (Direct)
- `GET /admin/recipes/option/{optionId}`: Get all ingredients for an Option Choice
## 19. Admin Reviews

- `GET /admin/reviews`: List shop reviews with filtering
  - Query: `shopId` (string)
  - Query: `rating` (number)
  - Query: `isReplied` (boolean)
  - Query: `page` (number)
  - Query: `limit` (number)
- `POST /admin/reviews/{id}/reply`: Reply to a review
  - Body: `ReplyReviewDto`
    - `replyText`: string, required
- `PATCH /admin/reviews/{id}/visibility`: Update review visibility (Public/Private)
  - Body: `UpdateReviewVisibilityDto`
    - `isPublic`: boolean, required
## 20. Admin Shifts

- `GET /admin/shifts`: List Shifts (Admin)
  - Query: `shopId` (string, required)
  - Query: `staffId` (string, required)
## 21. Admin Shop Configuration

- `GET /admin/shops/{shopId}/config/payment-methods`: List shop payment methods (Global merged with Shop override)
- `PATCH /admin/shops/{shopId}/config/payment-methods/{methodId}`: Update shop payment method status
  - Body: `UpdateShopPaymentDto`
    - `isEnabled`: boolean
    - `sortOrder`: number
- `GET /admin/shops/{shopId}/config/fulfillment-methods`: List shop fulfillment methods
- `PATCH /admin/shops/{shopId}/config/fulfillment-methods/{methodId}`: Update shop fulfillment method status
  - Body: `UpdateShopFulfillmentDto`
    - `isEnabled`: boolean
    - `feePercentage`: number
## 22. Admin Shop Menu

- `POST /admin/shops/{shopId}/menu/products`: Assign global products to a shop (Publish)
  - Body: `AssignProductsDto`
    - `productIds`: array, required
- `GET /admin/shops/{shopId}/menu`: Get shop menu (products with specific pricing)
- `PATCH /admin/shops/{shopId}/menu/status`: Bulk update availability status for shop products
  - Body: `UpdateMenuStatusDto`
    - `productIds`: array, required
    - `status`: boolean, required
- `PATCH /admin/shops/{shopId}/menu/products/{productId}`: Update specific product in shop menu (override price/availability)
  - Body: `UpdateShopProductDto`
    - `isAvailable`: boolean
- `PATCH /admin/shops/{shopId}/menu/choices/{choiceId}`: Update specific option choice in shop menu (override price/availability)
  - Body: `UpdateShopOptionChoiceDto`
    - `price`: number
    - `isAvailable`: boolean
## 23. Admin Shops

- `POST /admin/shops`: Create a new shop
  - Body: `CreateShopDto`
    - `name`: Unknown, required
    - `code`: string, required
    - `description`: Unknown
    - `locationLat`: number
    - `locationLong`: number
    - `openingHours`: Unknown
    - `phoneContacts`: Unknown
- `GET /admin/shops`: List all shops
- `GET /admin/shops/{id}`: Get shop details
- `PATCH /admin/shops/{id}`: Update shop details
  - Body: `UpdateShopDto`
    - `name`: Unknown
    - `code`: string
    - `description`: Unknown
    - `locationLat`: number
    - `locationLong`: number
    - `openingHours`: Unknown
    - `phoneContacts`: Unknown
- `DELETE /admin/shops/{id}`: Soft delete a shop
- `POST /admin/shops/{id}/sync-catalog`: Sync global catalog products to a specific shop
  - Body: `SyncCatalogDto`
    - `productIds`: array
## 24. Admin Staff Management

- `POST /admin/staff`: Create a new Staff/Employee
  - Body: `CreateStaffDto`
    - `username`: string, required
    - `fullName`: string, required
    - `password`: string, required
    - `pin`: string, required
    - `phone`: string, required
    - `globalRoleId`: string
- `GET /admin/staff`: List all Staff
- `POST /admin/staff/{id}/shop-access`: Assign Staff to a Shop
  - Body: `AssignShopAccessDto`
    - `shopId`: string, required
    - `roleId`: string
- `DELETE /admin/staff/{id}/shop-access/{shopId}`: Remove Staff access from a Shop
## 25. Admin Surcharges

- `POST /admin/surcharges`: Create a new surcharge (Tax/Fee)
  - Body: `CreateSurchargeDto`
    - `name`: object, required
    - `value`: number, required
    - `type`: string, required
    - `isTax`: boolean
    - `isActive`: boolean
- `GET /admin/surcharges`: List all surcharges
- `PATCH /admin/surcharges/{id}`: Toggle active status of a surcharge
## 26. Admin Uoms

- `POST /admin/uoms`: Create Unit of Measure
  - Body: `CreateUnitDto`
    - `name`: object, required
    - `symbol`: object, required
    - `baseMultiplier`: number, required
    - `type`: string, required
- `GET /admin/uoms`: List Units of Measure
- `PATCH /admin/uoms/{id}`: Update Unit of Measure
  - Body: `UpdateUnitDto`
    - `name`: object
    - `symbol`: object
    - `baseMultiplier`: number
    - `type`: string
## 27. Cart

- `POST /cart`: Create a new cart
  - Body: `CreateCartDto`
    - `userId`: string, required
    - `shopId`: string, required
    - `items`: array
- `GET /cart`: Get all carts (usually for admin)
- `GET /cart/my-cart`: Get current user cart
- `GET /cart/{id}`: Get a cart by ID
- `PATCH /cart/{id}`: Update a cart
  - Body: `UpdateCartDto`
    - `userId`: string
    - `shopId`: string
    - `items`: array
- `DELETE /cart/{id}`: Delete a cart
- `POST /cart/{id}/items`: Add items to the cart
  - Body: `AddCartItemsDto`
    - `items`: array, required
- `PATCH /cart/items/{itemId}`: Update an item in the cart
  - Body: `UpdateCartItemDto`
    - `quantity`: number
    - `options`: Unknown
    - `instructions`: string
    - `items`: array
- `DELETE /cart/items/{itemId}`: Remove an item from the cart
## 28. Cash Drawer Operations

- `POST /staff/drawer/open`: Open Cash Drawer Session
  - Body: `OpenDrawerDto`
    - `shopId`: string, required
    - `openingBalance`: number, required
    - `note`: string
- `POST /staff/drawer/close`: Close Cash Drawer Session
  - Body: `CloseDrawerDto`
    - `closingBalance`: number, required
    - `note`: string
## 29. Customer Categories

- `GET /customer/categories`: Get all categories
- `GET /customer/categories/{id}/{businessId}`: Get category by ID
## 30. Customer Group

- `POST /customer/group/create`: Create a new group
  - Body: `CreateGroupDto`
    - `shopId`: string
    - `name`: string
    - `description`: string
    - `hostUserId`: string, required
    - `status`: string
    - `guestName`: string
- `GET /customer/group`: 
- `GET /customer/group/{groupId}`: 
- `PATCH /customer/group/{groupId}`: 
  - Body: `UpdateGroupDto`
    - `shopId`: string
    - `name`: string
    - `description`: string
    - `hostUserId`: string
    - `status`: string
    - `guestName`: string
- `DELETE /customer/group/{groupId}`: 
- `POST /customer/group/join`: Join a group
- `POST /customer/group/cart/add-item`: Create a new group item
  - Body: `CreateGroupItemDto`
    - `groupCartId`: string, required
    - `addedByMemberId`: string, required
    - `productId`: string, required
    - `quantity`: number, required
    - `instructions`: string
- `GET /customer/group/cart/items/{groupId}`: Get all items in a group cart
## 31. Customer Orders

- `POST /customer/orders/create`: Create a new order from cart
  - Body: `CreateOrderRequestDto`
    - `cartId`: string, required
    - `fulfillmentMethodId`: string, required
    - `paymentMethodId`: string, required
    - `promotionId`: string
- `GET /customer/orders`: Get all my orders
- `GET /customer/orders/transactions/{tranId}/status`: Check transaction status
- `GET /customer/orders/{id}`: Get myorder details by ID
- `PUT /customer/orders/{id}/pickup`: Mark my order as picked up
- `POST /customer/orders/apply-voucher`: Apply voucher to order
- `POST /customer/orders/remove-voucher`: Remove voucher from order
## 32. Customer Products

- `GET /customer/products`: Get all products available for customers
  - Query: `categoryId` (string)
  - Query: `collectionId` (string)
  - Query: `search` (string)
  - Query: `page` (number)
  - Query: `limit` (number)
- `GET /customer/products/{categoryId}/{businessId}`: Get product details by ID
- `GET /customer/products/detail/{productId}/{businessId}`: Get product by ID
## 33. Customer Promotions

- `GET /customer/promotions`: Get all active promotions for customers
- `GET /customer/promotions/my-vouchers`: Get my vouchers
- `GET /customer/promotions/check-avaible-voucher`: Check available voucher for order
  - Query: `cartId` (string)
## 34. Customer Reviews

- `POST /customer/reviews`: Leave a review for a completed order
  - Body: `CreateReviewDto`
## 35. Customer Shop View

- `GET /customer/shops/{shopId}/menu`: Get shop menu (products with specific pricing)
## 36. Group

- `POST /group/create`: Create a new group
  - Body: `CreateGroupDto`
    - `shopId`: string
    - `name`: string
    - `description`: string
    - `hostUserId`: string, required
    - `status`: string
    - `guestName`: string
- `GET /group`: 
- `GET /group/{idOrToken}`: 
- `PATCH /group/{id}`: 
  - Body: `UpdateGroupDto`
    - `shopId`: string
    - `name`: string
    - `description`: string
    - `hostUserId`: string
    - `status`: string
    - `guestName`: string
- `DELETE /group/{id}`: 
## 37. Health

- `GET /health`: 
## 38. Payments

- `POST /payments/orders/{orderId}/initiate`: Initiate payment for an order
  - Body: `InitiateOrderPaymentDto`
    - `paymentMethodId`: string
    - `methodSlug`: string
    - `paymentOption`: string
    - `returnUrl`: string
    - `successUrl`: string
    - `returnDeeplink`: string
    - `phone`: string
    - `type`: string
- `GET /payments/transactions/{tranId}/status`: Check transaction status
- `GET /payments/options`: Get payment options
- `POST /payments/aba/callback/success`: ABA Payway callback
## 39. Print

- `POST /print/print-label`: Print a label for a product
  - Body: `PrintLabelDto`
    - `productName`: string
    - `sugar`: number
    - `level`: number
## 40. Rbactest

- `GET /rbac-test/global`: 
- `GET /rbac-test/shop-sensitive`: 
- `GET /rbac-test/staff`: 
## 41. Shop Inventory

- `GET /admin/shops/{shopId}/inventory`: List Shop Ingredient Stock
  - Query: `lowStock` (boolean)
- `POST /admin/shops/{shopId}/inventory/adjust`: Adjust Ingredient Stock
  - Body: `AdjustStockDto`
    - `ingredientId`: string, required
    - `quantityChange`: number, required
    - `reason`: string, required
    - `note`: string
- `PATCH /admin/shops/{shopId}/inventory/{ingredientId}`: Update Ingredient Watchlist (Price/Threshold)
  - Body: `UpdateShopIngredientDto`
    - `lowStockThreshold`: number
    - `price`: number
- `POST /admin/shops/{shopId}/inventory/activate`: Activate Shop Ingredients based on available products
## 42. Staff Shifts

- `POST /staff/shifts/start`: Clock In (Start Shift)
  - Body: `StartShiftDto`
    - `shopId`: string, required
    - `shiftRole`: string, required
- `POST /staff/shifts/end`: Clock Out (End Shift)
  - Body: `EndShiftDto`
    - `endedAt`: string
## 43. Users

- `GET /users/profile`: Get current user profile
- `PATCH /users/profile`: Update current user profile
  - Body: `UpdateUserDto`
    - `fullName`: string, required
    - `email`: string
    - `gender`: string
    - `dob`: string
- `GET /users/loyalty-points`: Get current user loyalty points
## 44. Admin Auth

- `POST /admin/auth/login`: Staff login
  - Body: `StaffLoginDto`
    - `username`: string, required
    - `password`: string, required
- `POST /admin/auth/change-password`: Change password
  - Body: `ChangePasswordDto`
    - `oldPassword`: string, required
    - `newPassword`: string, required
- `POST /admin/auth/verify-pin`: Verify PIN
  - Body: `VerifyPinDto`
    - `pin`: string, required
- `POST /admin/auth/change-pin`: Change PIN
  - Body: `ChangePinDto`
    - `newPin`: string, required
- `GET /admin/auth/me`: Get current staff profile and permissions
## 45. Customer Auth

- `POST /customer/auth/otp-request`: Request OTP for phone number
  - Body: `CustomerOtpRequestDto`
    - `phone`: string, required
- `POST /customer/auth/otp-verify`: Verify OTP and return tokens
  - Body: `CustomerOtpVerifyDto`
    - `phone`: string, required
    - `otp`: string, required
    - `deviceId`: string, required
    - `deviceInfo`: DeviceInfoDto, required
- `POST /customer/auth/register-complete`: Complete registration
  - Body: `CustomerRegisterCompleteDto`
    - `registerToken`: string, required
    - `fullName`: string, required
    - `referralCode`: string
- `GET /customer/auth/sessions`: List active sessions
- `DELETE /customer/auth/sessions/{id}`: Revoke session
