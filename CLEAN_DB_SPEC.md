# Database Specification

## 1. Enums

### BusinessStatus

- `PENDING`
- `ACTIVE`
- `SUSPENDED`
- `ARCHIVED`

### UserStatus

- `PENDING`
- `ACTIVE`
- `BANNED`

### ProductStatus

- `DRAFT`
- `ACTIVE`
- `ARCHIVED`

### OptionStatus

- `ACTIVE`
- `ARCHIVED`

### OptionType

- `VARIANT`
- `MODIFIER`
- `ADDON`

### OrderStatus

- `PENDING`
- `CONFIRMED`
- `PREPARING`
- `READY`
- `COMPLETED`
- `CANCELLED`

### FulfillmentCategory

- `DINE_IN`
- `TAKEAWAY`
- `DELIVERY`

### DiscountType

- `FIXED`
- `PERCENTAGE`
- `FIXED_PRICE`

### InventoryPolicy

- `STRICT`
- `FLEXIBLE`
- `NONE`

### SurchargeType

- `PERCENTAGE`
- `FIXED_AMOUNT`

### AuthEventType

- `LOGIN_SUCCESS`
- `LOGIN_FAILED`
- `LOGOUT`
- `TOKEN_REFRESH`
- `PASSWORD_CHANGED`
- `MFA_CHALLENGE_PASSED`
- `MFA_CHALLENGE_FAILED`
- `DEVICE_REVOKED`

### PaymentCategory

- `CASH`
- `QR`
- `CARD`
- `WALLET`
- `BANK_TRANSFER`

### PaymentStatus

- `INITIATED`
- `PENDING_USER_ACTION`
- `SUCCESS`
- `FAILED`
- `REFUNDED`
- `CANCELLED`

### PromotionScope

- `CART`
- `CATEGORY`
- `PRODUCT`
- `MIXED`

### UsageLimitType

- `ACCOUNT`
- `ORDER`
- `GLOBAL`

### ApplicationType

- `AUTOMATIC`
- `PUBLIC`
- `HIDDEN`

### AnnouncementTargetAudience

- `CUSTOMER`
- `STAFF`
- `ALL`

### AnnouncementPriority

- `HIGH`
- `NORMAL`

### NotificationType

- `ORDER_UPDATE`
- `SYSTEM_ALERT`
- `PROMOTION`

### Gender

- `MALE`
- `FEMALE`
- `OTHER`

### InventoryAdjustmentReason

- `WASTE`
- `RESTOCK`
- `CORRECTION`
- `DAMAGE`

## 2. Models

### Org & Access Control

#### Business

- `id`: UUID (PK)
- `name`: Json
- `description`: Json?
- `logoUrl`: String?
- `bannerImageUrl`: Json?
- `supportEmail`: String?
- `status`: BusinessStatus?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### Role

- `id`: UUID (PK)
- `businessId`: UUID (FK)
- `name`: Json
- `slug`: String
- `description`: Json?
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Unique: (businessId, slug)

#### Permission

- `id`: UUID (PK)
- `slug`: String (Unique)
- `requiresPin`: Boolean?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### RolePermission

- `roleId`: UUID (FK)
- `permissionId`: UUID (FK)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- PK: (roleId, permissionId)

#### Staff

- `id`: UUID (PK)
- `businessId`: UUID (FK)
- `globalRoleId`: UUID? (FK)
- `username`: String (Unique)
- `passwordHash`: String
- `fullName`: String?
- `phone`: String
- `profileImageUrl`: String?
- `pinHash`: String?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### Shop

- `id`: UUID (PK)
- `businessId`: UUID (FK)
- `name`: Json
- `code`: String?
- `currencySymbol`: String?
- `description`: Json?
- `imageUrl`: Json?
- `bannerImageUrl`: Json?
- `locationLat`: Decimal?
- `locationLong`: Decimal?
- `openingHours`: Json?
- `phoneContacts`: Json?
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `deletedAt`: DateTime?

#### StaffShopAccess

- `staffId`: UUID (FK)
- `shopId`: UUID (FK)
- `roleId`: UUID? (FK)
- `validFrom`: DateTime?
- `validUntil`: DateTime?
- `createdAt`: DateTime
- `updatedAt`: DateTime
- PK: (staffId, shopId)

#### StaffShift

- `id`: UUID (PK)
- `staffId`: UUID (FK)
- `shopId`: UUID (FK)
- `shiftRole`: String?
- `startTime`: DateTime?
- `endTime`: DateTime?
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Auth & Users

#### User

- `id`: UUID (PK)
- `phone`: String (Unique)
- `fullName`: String?
- `email`: String? (Unique)
- `gender`: Gender?
- `profileImageUrl`: String?
- `status`: UserStatus?
- `dob`: DateTime?
- `referralCode`: String? (Unique)
- `referredByUserId`: UUID? (FK)
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### UserDevice

- `id`: UUID (PK)
- `userId`: UUID (FK)
- `deviceIdHash`: String
- `deviceName`: String?
- `deviceType`: String?
- `deviceModel`: String?
- `deviceOs`: String?
- `osVersion`: String?
- `fcmToken`: String?
- `isTrusted`: Boolean?
- `isBlocked`: Boolean?
- `lastActiveAt`: DateTime?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### UserSession

- `id`: UUID (PK)
- `userId`: UUID (FK)
- `deviceId`: UUID (FK)
- `refreshTokenHash`: String
- `ipAddress`: String?
- `userAgent`: String?
- `expiresAt`: DateTime
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### AccessLog

- `id`: UUID (PK)
- `userId`: UUID? (FK)
- `deviceId`: UUID? (FK)
- `eventType`: AuthEventType
- `ipAddress`: String?
- `geoCountry`: String?
- `geoCity`: String?
- `userAgent`: String?
- `failureReason`: String?
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Catalog & Product

#### Product

- `id`: UUID (PK)
- `businessId`: UUID (FK)
- `sku`: String (Unique)
- `name`: Json
- `description`: Json?
- `imageUrl`: Json?
- `priceGroupId`: UUID (FK)
- `status`: ProductStatus?
- `quantity`: Int
- `isUnlockable`: Boolean
- `inventoryPolicy`: InventoryPolicy
- `version`: Int?
- `categoryId`: UUID (FK)
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### ProductOptionGroup

- `id`: UUID (PK)
- `businessId`: UUID (FK)
- `sku`: String (Unique)
- `name`: Json
- `type`: OptionType
- `minSelect`: Int?
- `maxSelect`: Int?
- `version`: Int?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### ProductOptionChoice

- `id`: UUID (PK)
- `groupId`: UUID (FK)
- `sku`: String (Unique)
- `name`: Json
- `imageUrl`: Json?
- `price`: Decimal?
- `isDefault`: Boolean
- `status`: OptionStatus
- `archivedAt`: DateTime?
- `version`: Int?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### Category

- `id`: UUID (PK)
- `businessId`: UUID (FK)
- `slug`: String
- `description`: Json?
- `name`: Json?
- `imageUrl`: Json?
- `parentId`: UUID? (FK)
- `sortOrder`: Int?
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Unique: (businessId, slug)

#### Collection

- `id`: UUID (PK)
- `businessId`: UUID (FK)
- `name`: Json
- `slug`: String
- `isActive`: Boolean
- `bannerUrl`: Json?
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Unique: (businessId, slug)

#### MarketingBadge

- `id`: UUID (PK)
- `businessId`: UUID (FK)
- `code`: String
- `label`: Json
- `bgColor`: String
- `textColor`: String?
- `imageUrl`: Json?
- `isActive`: Boolean?
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Unique: (businessId, code)

### Shop Specific (Menu)

#### ShopProduct

- `id`: UUID (PK)
- `shopId`: UUID (FK)
- `productId`: UUID (FK)
- `marketingBadgeId`: UUID?
- `isAvailable`: Boolean?
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `version`: Int?
- Unique: (shopId, productId)

#### ShopOptionGroup

- `id`: UUID (PK)
- `shopId`: UUID (FK)
- `groupId`: UUID (FK)
- `isAvailable`: Boolean?
- `minSelectOverride`: Int?
- `maxSelectOverride`: Int?
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `version`: Int?
- Unique: (shopId, groupId)

#### ShopOptionChoice

- `id`: UUID (PK)
- `shopId`: UUID (FK)
- `choiceId`: UUID (FK)
- `price`: Decimal
- `isAvailable`: Boolean?
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `version`: Int?
- Unique: (shopId, choiceId)

#### ShopFulfillmentMethod

- `shopId`: UUID (FK)
- `fulfillmentMethodId`: UUID (FK)
- `isEnabled`: Boolean?
- `feePercentage`: Decimal?
- `createdAt`: DateTime
- `updatedAt`: DateTime
- PK: (shopId, fulfillmentMethodId)

#### ShopProductBadge

- `shopProductId`: UUID (FK)
- `marketingBadgeId`: UUID (FK)
- `displayOrder`: Int?
- `createdAt`: DateTime
- `updatedAt`: DateTime
- PK: (shopProductId, marketingBadgeId)

#### ShopOptionBadge

- `shopOptionChoiceId`: UUID (FK)
- `marketingBadgeId`: UUID (FK)
- `displayOrder`: Int?
- `createdAt`: DateTime
- `updatedAt`: DateTime
- PK: (shopOptionChoiceId, marketingBadgeId)

### Order & Cart

#### Cart

- `id`: UUID (PK)
- `userId`: UUID (FK)
- `shopId`: UUID (FK)
- `version`: Int?
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Unique: (userId, shopId)

#### CartItem

- `id`: UUID (PK)
- `cartId`: UUID (FK)
- `productId`: UUID (FK)
- `quantity`: Int?
- `options`: Json?
- `instructions`: String?
- `version`: Int?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### GroupCart

- `id`: UUID (PK)
- `hostUserId`: UUID (FK)
- `shopId`: UUID (FK)
- `shareLinkToken`: String? (Unique)
- `status`: String?
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `version`: Int?

#### GroupCartMember

- `id`: UUID (PK)
- `groupCartId`: UUID (FK)
- `userId`: UUID (FK)
- `guestName`: String?
- `status`: String?
- `joinedAt`: DateTime
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### GroupCartItem

- `id`: UUID (PK)
- `groupCartId`: UUID (FK)
- `addedByMemberId`: UUID (FK)
- `productId`: UUID (FK)
- `quantity`: Int?
- `options`: Json?
- `instructions`: String?
- `version`: Int?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### Order

- `id`: UUID (PK)
- `businessId`: UUID (FK)
- `shopId`: UUID (FK)
- `userId`: UUID? (FK)
- `guestInfo`: Json?
- `queueNumber`: Int
- `invoiceCode`: String (Unique)
- `status`: OrderStatus
- `fulfillmentMethodId`: UUID (FK)
- `fulfillmentName`: Json?
- `fulfillmentCategory`: FulfillmentCategory?
- `paymentMethodName`: Json?
- `currency`: String
- `subtotal`: Decimal
- `surchargeTotal`: Decimal
- `discountTotal`: Decimal
- `grandTotal`: Decimal
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `confirmedAt`: DateTime?
- `preparationStartedAt`: DateTime?
- `readyAt`: DateTime?
- `completedAt`: DateTime?
- `cancelledAt`: DateTime?

#### OrderParticipant

- `id`: UUID (PK)
- `orderId`: UUID (FK)
- `userId`: UUID? (FK)
- `guestName`: String?
- `isHost`: Boolean
- `joinedAt`: DateTime

#### OrderItem

- `id`: UUID (PK)
- `orderId`: UUID (FK)
- `participantId`: UUID? (FK)
- `productId`: UUID (FK)
- `productSku`: String
- `productName`: Json
- `quantity`: Int
- `unitPrice`: Decimal
- `subtotal`: Decimal
- `discountTotal`: Decimal?
- `grandTotal`: Decimal
- `version`: Int?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### OrderItemOption

- `id`: UUID (PK)
- `orderItemId`: UUID (FK)
- `choiceId`: UUID (FK)
- `optionSku`: String
- `optionName`: Json
- `quantity`: Int
- `unitPrice`: Decimal
- `subtotal`: Decimal
- `discountTotal`: Decimal?
- `grandTotal`: Decimal
- `version`: Int?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### OrderDiscount

- `id`: UUID (PK)
- `orderId`: UUID (FK)
- `promotionId`: UUID (FK)
- `name`: Json?
- `amount`: Decimal?
- `version`: Int?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### OrderItemDiscount

- `id`: UUID (PK)
- `orderItemId`: UUID (FK)
- `promotionId`: UUID (FK)
- `name`: Json?
- `amount`: Decimal?
- `version`: Int?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### OrderItemOptionDiscount

- `id`: UUID (PK)
- `orderItemOptionId`: UUID (FK)
- `promotionId`: UUID (FK)
- `name`: Json?
- `amount`: Decimal?
- `version`: Int?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### OrderSurcharge

- `id`: UUID (PK)
- `orderId`: UUID (FK)
- `surchargeConfigId`: UUID (FK)
- `name`: Json?
- `amount`: Decimal?
- `isTax`: Boolean?
- `version`: Int?
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Finance

#### PaymentMethod

- `id`: UUID (PK)
- `businessId`: UUID? (FK)
- `slug`: String
- `name`: Json
- `description`: Json?
- `logoUrl`: String?
- `category`: PaymentCategory
- `isDigital`: Boolean?
- `publicConfig`: Json?
- `isActive`: Boolean?
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Unique: (businessId, slug)

#### ShopPaymentMethod

- `shopId`: UUID (FK)
- `paymentMethodId`: UUID (FK)
- `isEnabled`: Boolean?
- `sortOrder`: Int?
- `publicConfigOverride`: Json?
- `createdAt`: DateTime
- `updatedAt`: DateTime
- PK: (shopId, paymentMethodId)

#### PaymentTransaction

- `id`: UUID (PK)
- `orderId`: UUID (FK)
- `participantId`: UUID? (FK)
- `paymentMethodId`: UUID (FK)
- `externalTransactionId`: String?
- `externalPaymentUrl`: String?
- `amount`: Decimal
- `currency`: String?
- `status`: PaymentStatus?
- `gatewayResponseSnapshot`: Json?
- `failureReason`: String?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### SurchargeConfig

- `id`: UUID (PK)
- `businessId`: UUID (FK)
- `name`: Json
- `description`: Json?
- `type`: SurchargeType
- `value`: Decimal
- `isTax`: Boolean?
- `isTaxInclusive`: Boolean?
- `isAutoApplied`: Boolean?
- `applyToOrderTypes`: FulfillmentCategory[]
- `isActive`: Boolean?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### CashDrawerSession

- `id`: UUID (PK)
- `shopId`: UUID (FK)
- `openedBy`: UUID (FK)
- `closedBy`: UUID? (FK)
- `openingBalance`: Decimal?
- `closingBalance`: Decimal?
- `cashDifference`: Decimal?
- `startedAt`: DateTime?
- `endedAt`: DateTime?
- `note`: String?
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Inventory

#### Ingredient

- `id`: UUID (PK)
- `businessId`: UUID (FK)
- `name`: Json?
- `unitId`: UUID (FK)
- `sku`: String (Unique)
- `cost`: Decimal?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### ProductRecipe

- `id`: UUID (PK)
- `businessId`: UUID (FK)
- `productId`: UUID? (FK)
- `optionId`: UUID? (FK)
- `ingredientId`: UUID (FK)
- `quantity`: Decimal?
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `deletedAt`: DateTime?

#### ShopIngredient

- `id`: UUID (PK)
- `shopId`: UUID (FK)
- `ingredientId`: UUID (FK)
- `currentStock`: Decimal?
- `price`: Decimal?
- `lowStockThreshold`: Decimal?
- `lastRestockedAt`: DateTime?
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Unique: (shopId, ingredientId)

#### InventoryLog

- `id`: UUID (PK)
- `shopId`: UUID (FK)
- `ingredientId`: UUID (FK)
- `staffId`: UUID?
- `quantityChange`: Decimal
- `reason`: InventoryAdjustmentReason
- `note`: String?
- `createdAt`: DateTime

### Marketing & CRM

#### Promotion

- `id`: UUID (PK)
- `businessId`: UUID (FK)
- `name`: Json?
- `description`: Json?
- `sku`: String?
- `type`: DiscountType
- `value`: Decimal?
- `budgetLimitAmount`: Decimal?
- `totalAmountBurned`: Decimal?
- `scope`: PromotionScope
- `status`: String?
- `startDate`: DateTime?
- `endDate`: DateTime?
- `version`: Int?
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `strategyType`: String?
- `applicationType`: ApplicationType
- `isVoucherRequired`: Boolean
- `code`: String? (Unique)
- `rewardProductId`: UUID? (FK)
- `isGroupOrder`: Boolean?
- `priority`: Int?
- `rules`: Json?
- `actions`: Json?
- `isFeatured`: Boolean
- `bannerUrl`: Json?
- `startTime`: String?
- `endTime`: String?
- `daysOfWeek`: Int[]
- `usageLimitType`: UsageLimitType?
- `usageLimitValue`: Int?

#### UserVoucher

- `id`: UUID (PK)
- `userId`: UUID? (FK)
- `promotionId`: UUID (FK)
- `uniqueCode`: String? (Unique)
- `isRedeemed`: Boolean?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### ReferralReward

- `id`: UUID (PK)
- `businessId`: UUID (FK)
- `referrerId`: UUID (FK)
- `refereeId`: UUID (FK)
- `rewardStatus`: String?
- `rewardAmount`: Decimal?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### UserLoyaltyBalance

- `id`: UUID (PK)
- `userId`: UUID (FK)
- `businessId`: UUID (FK)
- `currentPoints`: Int?
- `lifetimePoints`: Int?
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Unique: (userId, businessId)

#### PromotionUsageLog

- `id`: UUID (PK)
- `promotionId`: UUID (FK)
- `orderId`: UUID (FK)
- `userId`: UUID (FK)
- `discountAmountApplied`: Decimal?
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Communication

#### Announcement

- `id`: UUID (PK)
- `businessId`: UUID (FK)
- `title`: Json
- `content`: Json
- `imageUrl`: String?
- `targetAudience`: AnnouncementTargetAudience
- `priority`: AnnouncementPriority
- `isActive`: Boolean
- `publishedAt`: DateTime
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### Notification

- `id`: UUID (PK)
- `userId`: UUID (FK)
- `title`: Json
- `body`: Json
- `type`: NotificationType
- `metadata`: Json?
- `isRead`: Boolean
- `readAt`: DateTime?
- `createdAt`: DateTime
- `updatedAt`: DateTime

### System

#### MobileAppVersion

- `id`: UUID (PK)
- `platform`: String
- `latestVersion`: String
- `minUsableVersion`: String
- `updateUrl`: String
- `message`: Json?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### FulfillmentMethod

- `id`: UUID (PK)
- `businessId`: UUID? (FK)
- `slug`: String
- `name`: Json
- `imageUrl`: String?
- `category`: FulfillmentCategory
- `isSystem`: Boolean?
- `isActive`: Boolean?
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Unique: (businessId, slug)

#### UnitOfMeasure

- `id`: UUID (PK)
- `businessId`: UUID? (FK)
- `name`: Json
- `symbol`: Json
- `type`: String?
- `baseMultiplier`: Decimal?
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Audit

#### AdminAuditLog

- `id`: UUID (PK)
- `shopId`: UUID? (FK)
- `actorStaffId`: UUID? (FK)
- `authorizedByStaffId`: UUID? (FK)
- `actionType`: String?
- `targetResource`: String?
- `targetId`: UUID?
- `details`: Json?
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Social

#### ShopReview

- `id`: UUID (PK)
- `shopId`: UUID (FK)
- `userId`: UUID (FK)
- `orderId`: UUID (Unique, FK)
- `rating`: Int
- `comment`: String?
- `tags`: String[]
- `replyText`: String?
- `replyAt`: DateTime?
- `isPublic`: Boolean?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### ProductReview

- `id`: UUID (PK)
- `shopReviewId`: UUID (FK)
- `productId`: UUID (FK)
- `rating`: Int
- `comment`: String?
- `createdAt`: DateTime
- `updatedAt`: DateTime

