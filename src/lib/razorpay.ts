import Razorpay from 'razorpay';

let razorpayInstance: Razorpay | null = null;

export function getRazorpayClient(): Razorpay {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.warn('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing. Using placeholders.');
    }

    razorpayInstance = new Razorpay({
      key_id: keyId || 'rzp_test_placeholder',
      key_secret: keySecret || 'placeholder_secret',
    });
  }
  return razorpayInstance;
}

export default getRazorpayClient;
