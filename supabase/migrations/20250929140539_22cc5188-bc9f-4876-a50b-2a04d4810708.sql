-- Temporarily disable the foreign key constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Insert 20 test users with common Peruvian names
INSERT INTO public.profiles (id, full_name, email, user_type) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Carlos Mendoza Rodriguez', 'carlos.mendoza@gmail.com', 'independent_agent'),
('550e8400-e29b-41d4-a716-446655440002', 'Maria Elena Vargas', 'maria.vargas@gmail.com', 'independent_agent'),
('550e8400-e29b-41d4-a716-446655440003', 'Jose Luis Flores', 'jose.flores@gmail.com', 'independent_agent'),
('550e8400-e29b-41d4-a716-446655440004', 'Ana Patricia Soto', 'ana.soto@gmail.com', 'small_company'),
('550e8400-e29b-41d4-a716-446655440005', 'Roberto Carlos Quispe', 'roberto.quispe@gmail.com', 'independent_agent'),
('550e8400-e29b-41d4-a716-446655440006', 'Lucia Fernanda Torres', 'lucia.torres@gmail.com', 'independent_agent'),
('550e8400-e29b-41d4-a716-446655440007', 'Miguel Angel Huaman', 'miguel.huaman@gmail.com', 'small_company'),
('550e8400-e29b-41d4-a716-446655440008', 'Rosa Maria Castillo', 'rosa.castillo@gmail.com', 'independent_agent'),
('550e8400-e29b-41d4-a716-446655440009', 'Pedro Antonio Mamani', 'pedro.mamani@gmail.com', 'independent_agent'),
('550e8400-e29b-41d4-a716-446655440010', 'Carmen Beatriz Silva', 'carmen.silva@gmail.com', 'small_company'),
('550e8400-e29b-41d4-a716-446655440011', 'Fernando David Gonzales', 'fernando.gonzales@gmail.com', 'independent_agent'),
('550e8400-e29b-41d4-a716-446655440012', 'Gladys Esperanza Rojas', 'gladys.rojas@gmail.com', 'independent_agent'),
('550e8400-e29b-41d4-a716-446655440013', 'Julio Cesar Condori', 'julio.condori@gmail.com', 'independent_agent'),
('550e8400-e29b-41d4-a716-446655440014', 'Milagros del Carmen Perez', 'milagros.perez@gmail.com', 'small_company'),
('550e8400-e29b-41d4-a716-446655440015', 'Enrique Manuel Choque', 'enrique.choque@gmail.com', 'independent_agent'),
('550e8400-e29b-41d4-a716-446655440016', 'Elizabeth Rosario Cruz', 'elizabeth.cruz@gmail.com', 'independent_agent'),
('550e8400-e29b-41d4-a716-446655440017', 'Raul Eduardo Vilca', 'raul.vilca@gmail.com', 'independent_agent'),
('550e8400-e29b-41d4-a716-446655440018', 'Yolanda Mercedes Apaza', 'yolanda.apaza@gmail.com', 'small_company'),
('550e8400-e29b-41d4-a716-446655440019', 'Alberto Francisco Nina', 'alberto.nina@gmail.com', 'independent_agent'),
('550e8400-e29b-41d4-a716-446655440020', 'Sandra Liliana Ccopa', 'sandra.ccopa@gmail.com', 'independent_agent');

-- Note: Foreign key constraint is intentionally removed for test data
-- This allows demo users that don't require authentication