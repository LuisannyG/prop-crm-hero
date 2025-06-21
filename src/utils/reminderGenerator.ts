
import { reminderTitles, reminderDescriptions, SEED_CONFIG } from '@/data/seedConstants';
import { generateRandomDate } from '@/utils/dataGenerators';

export const generateReminders = (userId: string, contactIds: string[]) => {
  const reminders = [];
  
  for (let i = 0; i < SEED_CONFIG.REMINDERS_COUNT; i++) {
    const randomDate = generateRandomDate();
    
    reminders.push({
      user_id: userId,
      contact_id: contactIds[Math.floor(Math.random() * contactIds.length)],
      title: reminderTitles[Math.floor(Math.random() * reminderTitles.length)],
      description: reminderDescriptions[Math.floor(Math.random() * reminderDescriptions.length)],
      reminder_date: randomDate.toISOString(),
      priority: ['alta', 'media', 'baja'][Math.floor(Math.random() * 3)],
      status: Math.random() > 0.7 ? 'completado' : 'pendiente'
    });
  }
  
  return reminders;
};
