// Utility for generating rich message templates for Telegram and WhatsApp

export type NotificationPlatform = 'telegram' | 'whatsapp';

// Helper for bold text based on platform
const bold = (text: string, platform: NotificationPlatform) => 
  platform === 'telegram' ? `<b>${text}</b>` : `*${text}*`;

// Helper for italic text based on platform
const italic = (text: string, platform: NotificationPlatform) => 
  platform === 'telegram' ? `<i>${text}</i>` : `_${text}_`;

export const NotificationTemplates = {
  
  /**
   * 1. TICKET CREATED
   * Triggered when a new ticket is opened.
   */
  ticketCreated: (
    data: { id: string, title: string, priority: string, description: string, assetTag?: string },
    platform: NotificationPlatform = 'telegram'
  ) => {
    const isCritical = data.priority === 'Critical';
    const icon = isCritical ? '🚨' : '⚠️';
    
    return `${icon} ${bold(`NEW TICKET [${data.priority.toUpperCase()}]`, platform)}

${bold('ID:', platform)} #${data.id}
${bold('Title:', platform)} ${data.title}
${bold('Asset:', platform)} ${data.assetTag || 'N/A'}

${italic('Description:', platform)}
${data.description}

🔗 ${italic('Please check the dashboard for details.', platform)}`;
  },

  /**
   * 2. TICKET RESOLVED
   * Triggered when a ticket status changes to Resolved.
   */
  ticketResolved: (
    data: { id: string, title: string, resolvedBy: string, resolutionNotes?: string },
    platform: NotificationPlatform = 'telegram'
  ) => {
    return `✅ ${bold('TICKET RESOLVED', platform)}

${bold('ID:', platform)} #${data.id}
${bold('Title:', platform)} ${data.title}
${bold('Resolved By:', platform)} ${data.resolvedBy}

${data.resolutionNotes ? `${italic('Notes:', platform)}\n${data.resolutionNotes}` : ''}`;
  },

  /**
   * 3. ASSET STATUS CHANGED (e.g. to Maintenance or Retired)
   * Triggered when an asset changes status.
   */
  assetStatusChanged: (
    data: { tag: string, hostname?: string, oldStatus: string, newStatus: string, user: string },
    platform: NotificationPlatform = 'telegram'
  ) => {
    const icon = data.newStatus === 'Maintenance' ? '🔧' : 'ℹ️';
    return `${icon} ${bold('ASSET STATUS UPDATE', platform)}

${bold('Asset:', platform)} ${data.tag} ${data.hostname ? `(${data.hostname})` : ''}
${bold('Status:', platform)} ${data.oldStatus} ➔ ${data.newStatus}
${bold('Updated By:', platform)} ${data.user}`;
  },

  /**
   * 4. ASSET MOVEMENT
   * Triggered when an asset is moved between locations.
   */
  assetMoved: (
    data: { tag: string, fromLoc: string, toLoc: string, movedBy: string },
    platform: NotificationPlatform = 'telegram'
  ) => {
    return `📦 ${bold('ASSET MOVEMENT', platform)}

${bold('Asset:', platform)} ${data.tag}
${bold('From:', platform)} ${data.fromLoc}
${bold('To:', platform)} ${data.toLoc}
${bold('Moved By:', platform)} ${data.movedBy}`;
  },

  /**
   * 5. WARRANTY EXPIRY ALERT
   * Can be triggered by a daily cron job.
   */
  warrantyExpiry: (
    data: { assets: Array<{tag: string, expiryDate: string}> },
    platform: NotificationPlatform = 'telegram'
  ) => {
    let list = data.assets.map(a => `- ${a.tag} (Expires: ${a.expiryDate})`).join('\n');
    return `⏰ ${bold('WARRANTY EXPIRING SOON', platform)}

The following assets have warranties expiring within 30 days:
${list}

${italic('Please review for renewal or replacement.', platform)}`;
  }
};
