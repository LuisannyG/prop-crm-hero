
import { firstNames, lastNames } from '@/data/limaData';

// Generar teléfonos únicos
export const generateUniquePhone = (usedPhones: Set<string>): string => {
  let phone: string;
  do {
    phone = `9${Math.floor(Math.random() * 90000000) + 10000000}`;
  } while (usedPhones.has(phone));
  usedPhones.add(phone);
  return phone;
};

// Generar emails únicos
export const generateUniqueEmail = (firstName: string, lastName: string, usedEmails: Set<string>): string => {
  let email: string;
  let counter = 0;
  do {
    const suffix = counter === 0 ? '' : counter.toString();
    email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${suffix}@gmail.com`;
    counter++;
  } while (usedEmails.has(email));
  usedEmails.add(email);
  return email;
};

// Generar nombres únicos
export const generateUniqueName = (usedNames: Set<string>): string => {
  let fullName: string;
  do {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName1 = lastNames[Math.floor(Math.random() * lastNames.length)];
    const lastName2 = lastNames[Math.floor(Math.random() * lastNames.length)];
    fullName = `${firstName} ${lastName1} ${lastName2}`;
  } while (usedNames.has(fullName));
  usedNames.add(fullName);
  return fullName;
};

// Generar rango de precios según distrito
export const getPriceRangeByDistrict = (district: string): [number, number] => {
  switch (district) {
    case 'San Isidro':
    case 'Miraflores':
    case 'La Molina':
      return [800000, 2000000];
    case 'Surco':
    case 'San Borja':
    case 'Jesús María':
      return [500000, 1500000];
    default:
      return [200000, 800000];
  }
};

// Generar fecha aleatoria
export const generateRandomDate = (daysRange: number = 60): Date => {
  const randomDate = new Date();
  randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * daysRange) - (daysRange / 2));
  return randomDate;
};
