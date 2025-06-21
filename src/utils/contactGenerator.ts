
import { limaDistricts, streets } from '@/data/limaData';
import { salesStages, contactNotes, SEED_CONFIG } from '@/data/seedConstants';
import { generateUniquePhone, generateUniqueEmail, generateUniqueName } from '@/utils/dataGenerators';

export const generateContacts = (userId: string) => {
  const contacts = [];
  const usedPhones = new Set<string>();
  const usedEmails = new Set<string>();
  const usedNames = new Set<string>();
  
  for (let i = 0; i < SEED_CONFIG.CONTACTS_COUNT; i++) {
    const fullName = generateUniqueName(usedNames);
    const [firstName, ...lastNameParts] = fullName.split(' ');
    const lastName = lastNameParts[0];
    
    const district = limaDistricts[Math.floor(Math.random() * limaDistricts.length)];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const phone = generateUniquePhone(usedPhones);
    const email = generateUniqueEmail(firstName, lastName, usedEmails);
    
    contacts.push({
      user_id: userId,
      full_name: fullName,
      email: email,
      phone: phone,
      address: `${street} ${Math.floor(Math.random() * 2000) + 100}`,
      district: district,
      status: ['prospect', 'client'][Math.floor(Math.random() * 2)],
      client_type: ['familiar', 'individual', 'negocio', 'empresa', 'inversionista'][Math.floor(Math.random() * 5)],
      acquisition_source: ['tiktok', 'instagram', 'facebook', 'referido', 'feria-inmobiliaria', 'google', 'whatsapp', 'llamada-fria', 'sitio-web', 'otro'][Math.floor(Math.random() * 10)],
      sales_stage: salesStages[Math.floor(Math.random() * salesStages.length)],
      notes: contactNotes[Math.floor(Math.random() * contactNotes.length)]
    });
  }
  
  return contacts;
};
