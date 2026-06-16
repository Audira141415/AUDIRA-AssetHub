import { prisma } from '@/lib/prisma'

export async function sendTelegramMessage(message: string, chatId?: string) {
  try {
    // 1. Get settings from DB
    const botTokenSetting = await prisma.setting.findUnique({
      where: { key: 'TELEGRAM_BOT_TOKEN' }
    });
    
    const defaultChatIdSetting = await prisma.setting.findUnique({
      where: { key: 'TELEGRAM_DEFAULT_CHAT_ID' }
    });

    const token = botTokenSetting?.value;
    const targetChatId = chatId || defaultChatIdSetting?.value;

    if (!token || !targetChatId) {
      console.log('Telegram integration not configured or chat ID missing.');
      return { success: false, error: 'Not configured' };
    }

    // 2. Send message via Telegram Bot API
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: targetChatId,
        text: message,
        parse_mode: 'HTML', // Allows formatting
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Telegram API Error: ${data.description}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
