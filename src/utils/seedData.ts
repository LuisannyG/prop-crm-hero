
import { supabase } from '@/integrations/supabase/client';
import { generateContacts } from '@/utils/contactGenerator';
import { generateProperties } from '@/utils/propertyGenerator';
import { generateReminders } from '@/utils/reminderGenerator';
import { SEED_CONFIG } from '@/data/seedConstants';

// Función principal para sembrar datos
export const seedDatabase = async (userId: string) => {
  try {
    console.log('Iniciando inserción de datos de prueba...');
    
    // Primero eliminar datos existentes del usuario
    console.log('Eliminando datos existentes...');
    
    // Eliminar recordatorios primero (por dependencias)
    await supabase
      .from('reminders')
      .delete()
      .eq('user_id', userId);
    
    // Eliminar contactos
    await supabase
      .from('contacts')
      .delete()
      .eq('user_id', userId);
    
    // Eliminar propiedades
    await supabase
      .from('properties')
      .delete()
      .eq('user_id', userId);
    
    console.log('Datos anteriores eliminados');
    
    // Insertar contactos
    const contactsData = generateContacts(userId);
    const { data: insertedContacts, error: contactsError } = await supabase
      .from('contacts')
      .insert(contactsData)
      .select('id');
    
    if (contactsError) throw contactsError;
    console.log('Contactos insertados:', insertedContacts?.length);
    
    // Insertar propiedades
    const propertiesData = generateProperties(userId);
    const { error: propertiesError } = await supabase
      .from('properties')
      .insert(propertiesData);
    
    if (propertiesError) throw propertiesError;
    console.log('Propiedades insertadas:', propertiesData.length);
    
    // Insertar recordatorios
    const contactIds = insertedContacts?.map(c => c.id) || [];
    const remindersData = generateReminders(userId, contactIds);
    const { error: remindersError } = await supabase
      .from('reminders')
      .insert(remindersData);
    
    if (remindersError) throw remindersError;
    console.log('Recordatorios insertados:', remindersData.length);
    
    return {
      success: true,
      message: 'Datos de prueba insertados correctamente',
      stats: {
        contacts: contactsData.length,
        properties: propertiesData.length,
        reminders: remindersData.length
      }
    };
    
  } catch (error) {
    console.error('Error al insertar datos:', error);
    return {
      success: false,
      error: error,
      message: 'Error al insertar datos de prueba'
    };
  }
};
