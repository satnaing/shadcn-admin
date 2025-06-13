import { IProduct, IProductVariant } from "@/features/pricing/interface/price.interface";
import { SubscriptionStatusEnum } from "../enum/subscription.enum";

export interface ISubscription {
  _id: string;
  providerId: string;
  providerCustomerId: number;
  orderId: number;
  name: string;
  email: string;
  isPaused: boolean;
  isCancelled: boolean;
  renewsAt: string;
  endsAt: string | null;
  trialEndsAt: string | null;
  productId: string;
  variantId: string;
  billingAnchor: number;
  ownerId: string;
  status: SubscriptionStatusEnum;
  formattedStatus: string;
  createdAt: string;
  updatedAt: string;
  product?: IProduct;
  variant?: IProductVariant;
}

export interface ILsSubscription {
  type: string;
  id: string;
  attributes: {
    store_id: number;
    customer_id: number;
    order_id: number;
    order_item_id: number;
    product_id: number;
    variant_id: number;
    product_name: string;
    variant_name: string;
    user_name: string;
    user_email: string;
    status: string;
    status_formatted: string;
    card_brand: string;
    card_last_four: string;
    pause: null | string;
    cancelled: boolean;
    trial_ends_at: null | string;
    billing_anchor: number;
    first_subscription_item: {
      id: number;
      subscription_id: number;
      price_id: number;
      quantity: number;
      created_at: string;
      updated_at: string;
    };
    urls: {
      update_payment_method: string;
      customer_portal: string;
      customer_portal_update_subscription: string;
    };
    renews_at: string;
    ends_at: null | string;
    created_at: string;
    updated_at: string;
    test_mode: boolean;
  };
}
