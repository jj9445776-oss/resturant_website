import { Order, Reservation, RestaurantSettings } from '../types';

export class NotificationService {
  /**
   * Generates a beautifully formatted Pakistani restaurant receipt for WhatsApp
   */
  public static formatOrderWhatsAppMessage(order: Order, settings: RestaurantSettings): string {
    const itemsList = order.items
      .map((item, idx) => `• ${item.quantity}x ${item.product.name} ${item.selectedVariation ? `(${item.selectedVariation.name})` : ''} - PKR ${item.itemTotal.toLocaleString()}`)
      .join('\n');

    const addressText = order.deliveryType === 'delivery' && order.deliveryAddress
      ? `${order.deliveryAddress.streetAddress}, ${order.deliveryAddress.area}, ${order.deliveryAddress.city}`
      : 'Self-Pickup at Restaurant Branch';

    return `✨ *DASTAAN RESTAURANT (داستان) - NEW ORDER CONFIRMATION* ✨\n\n` +
      `🧾 *Order ID:* ${order.orderNumber}\n` +
      `👤 *Customer:* ${order.customerName}\n` +
      `📞 *Phone:* ${order.customerPhone}\n` +
      `🛵 *Type:* ${order.deliveryType === 'delivery' ? 'Royal Doorstep Delivery' : 'Takeaway Pickup'}\n` +
      `📍 *Location:* ${addressText}\n\n` +
      `🍲 *ITEMS ORDERED:*\n${itemsList}\n\n` +
      `💰 *Subtotal:* PKR ${order.subtotal.toLocaleString()}\n` +
      (order.deliveryFee > 0 ? `🛵 *Delivery Fee:* PKR ${order.deliveryFee.toLocaleString()}\n` : '') +
      (order.tax > 0 ? `🏛️ *Tax (PRA/SRB):* PKR ${order.tax.toLocaleString()}\n` : '') +
      (order.discount > 0 ? `🎟️ *Discount:* -PKR ${order.discount.toLocaleString()}\n` : '') +
      `⭐ *TOTAL PAYABLE:* PKR ${order.total.toLocaleString()}\n\n` +
      `💳 *Payment Method:* ${order.paymentMethod.toUpperCase()} (${order.paymentStatus.toUpperCase()})\n` +
      `⏱️ *Estimated Time:* 35–45 minutes\n\n` +
      `Thank you for choosing Dastaan. For inquiries call ${settings.phone}. Shahi Zauq, Aapki Khidmat Mein!`;
  }

  /**
   * Builds click-to-chat URL for customer or admin
   */
  public static getWhatsAppClickToChatUrl(phone: string, text: string): string {
    // Strip non-digits and ensure 92 country code
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '92' + cleaned.substring(1);
    }
    return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
  }

  /**
   * Generates SMS template
   */
  public static formatOrderSMS(order: Order): string {
    return `Dastaan: Order ${order.orderNumber} confirmed for PKR ${order.total.toLocaleString()}. Preparing fresh in kitchen. Track your order live on our portal. Helpline: 0300-1234567`;
  }

  public static formatReservationSMS(res: Reservation): string {
    return `Dastaan: Table ${res.reservationNumber} confirmed for ${res.guests} guests on ${res.date} at ${res.time} (${res.seatingArea}) at Dastaan ${res.branchName}. Welcome to royal dining!`;
  }

  /**
   * Simulates dispatching server-side SMS or WhatsApp API webhook
   */
  public static async dispatchServerNotification(
    type: 'whatsapp' | 'sms',
    recipient: string,
    message: string
  ): Promise<{ success: boolean; messageId: string }> {
    console.log(`[Notification Engine] Dispatched ${type.toUpperCase()} to ${recipient}:`);
    console.log(message);
    return {
      success: true,
      messageId: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    };
  }
}
