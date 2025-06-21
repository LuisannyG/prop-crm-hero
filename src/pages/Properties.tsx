import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Home, ArrowLeft, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

interface Property {
  id: string;
  title: string;
  description?: string;
  address: string;
  district?: string;
  price?: number;
  property_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  area_m2?: number;
  status: string;
  photo_url?: string;
  created_at: string;
}

const Properties = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    district: '',
    price: '',
    property_type: 'casa',
    bedrooms: '',
    bathrooms: '',
    area_m2: '',
    status: 'available',
    is_studio: false
  });

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las propiedades',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    if (!user) return null;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('property-photos')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('property-photos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: 'Error',
        description: 'No se pudo subir la foto',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      let photoUrl = null;
      if (photoFile) {
        photoUrl = await uploadPhoto(photoFile);
      }

      const propertyData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        bedrooms: formData.is_studio ? null : (formData.bedrooms ? parseInt(formData.bedrooms) : null),
        bathrooms: formData.is_studio ? null : (formData.bathrooms ? parseInt(formData.bathrooms) : null),
        area_m2: formData.area_m2 ? parseFloat(formData.area_m2) : null,
        photo_url: photoUrl || (editingProperty?.photo_url || null),
        user_id: user.id
      };

      if (editingProperty) {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', editingProperty.id);

        if (error) throw error;
        toast({ title: 'Propiedad actualizada exitosamente' });
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([propertyData]);

        if (error) throw error;
        toast({ title: 'Propiedad agregada exitosamente' });
      }

      resetForm();
      fetchProperties();
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la propiedad',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Propiedad eliminada' });
      fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la propiedad',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      address: '',
      district: '',
      price: '',
      property_type: 'casa',
      bedrooms: '',
      bathrooms: '',
      area_m2: '',
      status: 'available',
      is_studio: false
    });
    setPhotoFile(null);
    setIsAddingProperty(false);
    setEditingProperty(null);
  };

  const startEdit = (property: Property) => {
    setFormData({
      title: property.title,
      description: property.description || '',
      address: property.address,
      district: property.district || '',
      price: property.price?.toString() || '',
      property_type: property.property_type || 'casa',
      bedrooms: property.bedrooms?.toString() || '',
      bathrooms: property.bathrooms?.toString() || '',
      area_m2: property.area_m2?.toString() || '',
      status: property.status,
      is_studio: !property.bedrooms && !property.bathrooms
    });
    setEditingProperty(property);
    setIsAddingProperty(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'sold': return 'bg-red-500';
      case 'reserved': return 'bg-yellow-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'No especificado';
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price);
  };

  if (loading) {
    return <div className="p-8">Cargando propiedades...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Propiedades</h1>
          </div>
          <Dialog open={isAddingProperty} onOpenChange={setIsAddingProperty}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddingProperty(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Propiedad
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProperty ? 'Editar Propiedad' : 'Nueva Propiedad'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="address">Dirección *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="district">Distrito *</Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="property_type">Tipo de Propiedad *</Label>
                    <Select value={formData.property_type} onValueChange={(value) => setFormData({...formData, property_type: value})} required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="departamento">Departamento</SelectItem>
                        <SelectItem value="oficina">Oficina</SelectItem>
                        <SelectItem value="terreno">Terreno</SelectItem>
                        <SelectItem value="local">Local Comercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Estado *</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})} required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Disponible</SelectItem>
                        <SelectItem value="sold">Vendida</SelectItem>
                        <SelectItem value="reserved">Reservada</SelectItem>
                        <SelectItem value="inactive">Inactiva</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price">Precio (S/) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="area_m2">Área (m²) *</Label>
                    <Input
                      id="area_m2"
                      type="number"
                      step="0.01"
                      value={formData.area_m2}
                      onChange={(e) => setFormData({...formData, area_m2: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_studio"
                        checked={formData.is_studio}
                        onCheckedChange={(checked) => setFormData({...formData, is_studio: checked as boolean})}
                      />
                      <Label htmlFor="is_studio">Es un monoambiente</Label>
                    </div>
                  </div>
                  {!formData.is_studio && (
                    <>
                      <div>
                        <Label htmlFor="bedrooms">Dormitorios *</Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          value={formData.bedrooms}
                          onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="bathrooms">Baños *</Label>
                        <Input
                          id="bathrooms"
                          type="number"
                          value={formData.bathrooms}
                          onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                          required
                        />
                      </div>
                    </>
                  )}
                  <div className="col-span-2">
                    <Label htmlFor="photo">Foto de la Propiedad</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                        className="flex-1"
                      />
                      {uploading && <span className="text-sm text-gray-500">Subiendo...</span>}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" disabled={uploading}>
                    {editingProperty ? 'Actualizar' : 'Guardar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Propiedades ({properties.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {properties.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No tienes propiedades registradas. ¡Agrega tu primera propiedad!
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Propiedad</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Detalles</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {property.photo_url && (
                            <img
                              src={property.photo_url}
                              alt={property.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <div className="font-medium">{property.title}</div>
                            <div className="text-sm text-gray-500">{property.address}</div>
                            {property.district && (
                              <div className="text-sm text-gray-400">{property.district}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatPrice(property.price)}</TableCell>
                      <TableCell className="capitalize">{property.property_type}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(property.status)}>
                          {property.status === 'available' ? 'Disponible' :
                           property.status === 'sold' ? 'Vendida' :
                           property.status === 'reserved' ? 'Reservada' : 'Inactiva'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {!property.bedrooms && !property.bathrooms ? 'Monoambiente' : (
                            <>
                              {property.bedrooms && `${property.bedrooms} dorm`}
                              {property.bathrooms && ` • ${property.bathrooms} baños`}
                            </>
                          )}
                          {property.area_m2 && ` • ${property.area_m2}m²`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(property)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(property.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Properties;
