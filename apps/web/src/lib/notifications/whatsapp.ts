import { prisma } from '@/lib/prisma'

export async function sendWhatsAppMessage(message: string, phoneNumber?: string) {
  try {
    // 1. Get settings from DB
    const waProviderUrlSetting = await prisma.setting.findUnique({
      where: { key: 'WA_PROVIDER_URL' }
    });
    
    const waApiKeySetting = await prisma.setting.findUnique({
      where: { key: 'WA_API_KEY' }
    });

    const defaultPhoneSetting = await prisma.setting.findUnique({
      where: { key: 'WA_DEFAULT_PHONE' }
    });

    const providerUrl = waProviderUrlSetting?.value;
    const apiKey = waApiKeySetting?.value;
    const targetPhone = phoneNumber || defaultPhoneSetting?.value;

    if (!providerUrl || !apiKey || !targetPhone) {
      console.log('WhatsApp integration not configured or phone number missing.');
      return { success: false, error: 'Not configured' };
    }

    // 2. Send message via WhatsApp Provider
    // Note: The payload format varies by provider (Fonnte, Wablas, Twilio, Meta, etc.)
    // This is a generic webhook implementation. 
    // Example format used here is often compatible with Fonnte/Wablas standard format.
    const response = await fetch(providerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey, // Some providers use API-Key, some use Authorization header
        'API-Key': apiKey 
      },
      body: JSON.stringify({
        target: targetPhone, // standard for Fonnte
        phone: targetPhone,  // standard for Wablas
        to: targetPhone,     // standard for Twilio/Meta
        message: message,
        text: message
      }),
    });

    const textResponse = await response.text();
    let data;
    try {
      data = JSON.parse(textResponse);
    } catch {
      data = { raw: textResponse };
    }
    
    if (!response.ok) {
      throw new Error(`WhatsApp API Error: ${response.statusText} - ${textResponse}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
