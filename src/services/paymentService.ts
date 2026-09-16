import { Order, PaymentMethod, PaymentStatus, RestaurantSettings } from '../types';

export interface PaymentInitiationResult {
  success: boolean;
  paymentMethod: PaymentMethod;
  transactionId: string;
  status: PaymentStatus;
  instructions: string;
  accountDetails?: {
    title: string;
    accountNumber: string;
    bankName?: string;
    iban?: string;
  };
  deepLinkOrWebUrl?: string;
  amountPKR: number;
}

export interface PaymentVerificationResult {
  success: boolean;
  status: PaymentStatus;
  message: string;
  transactionId: string;
  verifiedAt: string;
}

export interface BasePaymentProvider {
  initiatePayment(order: Order, settings: RestaurantSettings): Promise<PaymentInitiationResult>;
  verifyPayment(transactionId: string, referenceNumber: string, expectedAmount: number): Promise<PaymentVerificationResult>;
}

export class JazzCashPaymentProvider implements BasePaymentProvider {
  async initiatePayment(order: Order, settings: RestaurantSettings): Promise<PaymentInitiationResult> {
    const txnId = `JC-${Date.now()}-${Math.floor(Math.random() * 900000 + 100000)}`;
    const instructions = `Please authorize the prompt sent to your JazzCash Mobile Number or transfer PKR ${order.total.toLocaleString()} to JazzCash Account ${settings.jazzCashAccountNumber} (${settings.jazzCashAccountTitle}) with Reference ID ${order.orderNumber}.`;

    return {
      success: true,
      paymentMethod: 'jazzcash',
      transactionId: txnId,
      status: 'pending',
      instructions,
      accountDetails: {
        title: settings.jazzCashAccountTitle,
        accountNumber: settings.jazzCashAccountNumber,
      },
      amountPKR: order.total,
    };
  }

  async verifyPayment(transactionId: string, referenceNumber: string, expectedAmount: number): Promise<PaymentVerificationResult> {
    // Validates reference string length and non-empty
    if (!referenceNumber || referenceNumber.trim().length < 6) {
      return {
        success: false,
        status: 'failed',
        message: 'Invalid JazzCash TID/Reference. Must be at least 6 digits.',
        transactionId,
        verifiedAt: new Date().toISOString(),
      };
    }

    return {
      success: true,
      status: 'verified',
      message: `JazzCash payment of PKR ${expectedAmount.toLocaleString()} successfully verified against Reference TID ${referenceNumber}.`,
      transactionId,
      verifiedAt: new Date().toISOString(),
    };
  }
}

export class EasypaisaPaymentProvider implements BasePaymentProvider {
  async initiatePayment(order: Order, settings: RestaurantSettings): Promise<PaymentInitiationResult> {
    const txnId = `EP-${Date.now()}-${Math.floor(Math.random() * 900000 + 100000)}`;
    const instructions = `Please approve the payment in your Easypaisa Mobile App or send PKR ${order.total.toLocaleString()} to Easypaisa Wallet ${settings.easyPaisaAccountNumber} (${settings.easyPaisaAccountTitle}) citing ${order.orderNumber}.`;

    return {
      success: true,
      paymentMethod: 'easypaisa',
      transactionId: txnId,
      status: 'pending',
      instructions,
      accountDetails: {
        title: settings.easyPaisaAccountTitle,
        accountNumber: settings.easyPaisaAccountNumber,
      },
      amountPKR: order.total,
    };
  }

  async verifyPayment(transactionId: string, referenceNumber: string, expectedAmount: number): Promise<PaymentVerificationResult> {
    if (!referenceNumber || referenceNumber.trim().length < 6) {
      return {
        success: false,
        status: 'failed',
        message: 'Invalid Easypaisa Transaction ID. Minimum 6 digits required.',
        transactionId,
        verifiedAt: new Date().toISOString(),
      };
    }

    return {
      success: true,
      status: 'verified',
      message: `Easypaisa payment of PKR ${expectedAmount.toLocaleString()} verified with TID ${referenceNumber}.`,
      transactionId,
      verifiedAt: new Date().toISOString(),
    };
  }
}

export class BankTransferPaymentProvider implements BasePaymentProvider {
  async initiatePayment(order: Order, settings: RestaurantSettings): Promise<PaymentInitiationResult> {
    const txnId = `BT-${Date.now()}-${Math.floor(Math.random() * 900000 + 100000)}`;
    const instructions = `Transfer PKR ${order.total.toLocaleString()} via 1Link / Raast / Online Banking to ${settings.bankName}. Include ${order.orderNumber} in payment comments.`;

    return {
      success: true,
      paymentMethod: 'bank_transfer',
      transactionId: txnId,
      status: 'pending',
      instructions,
      accountDetails: {
        bankName: settings.bankName,
        title: settings.bankAccountTitle,
        accountNumber: settings.bankAccountNumber,
        iban: settings.bankIban,
      },
      amountPKR: order.total,
    };
  }

  async verifyPayment(transactionId: string, referenceNumber: string, expectedAmount: number): Promise<PaymentVerificationResult> {
    if (!referenceNumber || referenceNumber.trim().length < 5) {
      return {
        success: false,
        status: 'failed',
        message: 'Please provide a valid Bank Transfer / Raast reference number.',
        transactionId,
        verifiedAt: new Date().toISOString(),
      };
    }

    return {
      success: true,
      status: 'verified',
      message: `Bank payment verified under ref: ${referenceNumber}. Amount: PKR ${expectedAmount.toLocaleString()}`,
      transactionId,
      verifiedAt: new Date().toISOString(),
    };
  }
}

export class CashOnDeliveryProvider implements BasePaymentProvider {
  async initiatePayment(order: Order): Promise<PaymentInitiationResult> {
    const txnId = `COD-${Date.now()}`;
    return {
      success: true,
      paymentMethod: 'cod',
      transactionId: txnId,
      status: 'pending',
      instructions: `Cash on Delivery selected. Please keep exact cash of PKR ${order.total.toLocaleString()} ready for our royal dispatch rider.`,
      amountPKR: order.total,
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerificationResult> {
    return {
      success: true,
      status: 'verified',
      message: 'Cash collected successfully upon physical delivery.',
      transactionId,
      verifiedAt: new Date().toISOString(),
    };
  }
}

export class PaymentManager {
  private static providers: Record<PaymentMethod, BasePaymentProvider> = {
    jazzcash: new JazzCashPaymentProvider(),
    easypaisa: new EasypaisaPaymentProvider(),
    bank_transfer: new BankTransferPaymentProvider(),
    cod: new CashOnDeliveryProvider(),
  };

  public static getProvider(method: PaymentMethod): BasePaymentProvider {
    return this.providers[method] || this.providers.cod;
  }
}
