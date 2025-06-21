
import { limaDistricts, streets } from '@/data/limaData';
import { propertyTypes, SEED_CONFIG } from '@/data/seedConstants';
import { getPriceRangeByDistrict } from '@/utils/dataGenerators';

export const generateProperties = (userId: string) => {
  const properties = [];
  
  for (let i = 0; i < SEED_CONFIG.PROPERTIES_COUNT; i++) {
    const district = limaDistricts[Math.floor(Math.random() * limaDistricts.length)];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const bedrooms = propertyType === 'departamento' || propertyType === 'casa' ? Math.floor(Math.random() * 4) + 1 : null;
    const bathrooms = propertyType === 'departamento' || propertyType === 'casa' ? Math.floor(Math.random() * 3) + 1 : null;
    const area = Math.floor(Math.random() * 300) + 50;
    
    const priceRange = getPriceRangeByDistrict(district);
    const price = Math.floor(Math.random() * (priceRange[1] - priceRange[0]) + priceRange[0]);
    
    properties.push({
      user_id: userId,
      title: `${propertyType === 'casa' ? 'Casa' : 
               propertyType === 'departamento' ? 'Departamento' : 
               propertyType === 'oficina' ? 'Oficina' : 
               propertyType === 'local' ? 'Local Comercial' : 'Terreno'} en ${district}`,
      description: `Excelente ${propertyType} ubicado en ${district}, Lima. ${
        bedrooms ? `${bedrooms} dormitorios, ` : ''
      }${bathrooms ? `${bathrooms} baños, ` : ''}${area}m² de área construida.`,
      address: `${street} ${Math.floor(Math.random() * 2000) + 100}, ${district}, Lima`,
      price: price,
      property_type: propertyType,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      area_m2: area,
      status: ['available', 'sold', 'reserved'][Math.floor(Math.random() * 3)]
    });
  }
  
  return properties;
};
