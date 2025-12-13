import { supabase } from '../utils/supabase';
import { UserRole, Parcel, Trip } from '../types';

export const fetchParcels = async (role: UserRole, userId?: string): Promise<Parcel[]> => {
  let query = supabase.from('parcels').select('*');

  if (role === UserRole.SENDER && userId) {
    query = query.eq('sender_id', userId);
  } else if (role === UserRole.TRANSPORTER) {
    // Transporters can see pending parcels, or parcels they are assigned to
    query = query.or(`status.eq.PENDING,transporter_id.eq.${userId}`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching parcels:', error);
    throw error;
  }

  return data as Parcel[];
};

export const fetchTrips = async (): Promise<Trip[]> => {
  const { data, error } = await supabase.from('trips').select('*').order('departure_date', { ascending: true });

  if (error) {
    console.error('Error fetching trips:', error);
    throw error;
  }

  return data as Trip[];
};

export const createParcel = async (parcel: Partial<Parcel>, senderId: string): Promise<Parcel> => {
  const { data, error } = await supabase
    .from('parcels')
    .insert([{ ...parcel, sender_id: senderId }])
    .select()
    .single();

  if (error) {
    console.error('Error creating parcel:', error);
    throw error;
  }

  return data as Parcel;
};

export const uploadParcelImage = async (file: File): Promise<string> => {
  const filePath = `public/${Date.now()}-${file.name}`;
  
  const { error: uploadError } = await supabase.storage
    .from('parcel_images')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('parcel_images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const updateParcelStatus = async (id: string, status: string): Promise<void> => {
    const { error } = await supabase.from('parcels').update({ status }).eq('id', id);
    if (error) {
        console.error('Error updating parcel status:', error);
        throw error;
    }
}

export const createTrip = async (trip: Partial<Trip>): Promise<Trip> => {
  const { data, error } = await supabase
    .from('trips')
    .insert([trip])
    .select()
    .single();

  if (error) {
    console.error('Error creating trip:', error);
    throw error;
  }

  return data as Trip;
};

export const deleteTrip = async (tripId: number): Promise<void> => {
  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', tripId);

  if (error) {
    console.error('Error deleting trip:', error);
    throw error;
  }
};

export const assignTransporter = async (parcelId: string, transporterId: string): Promise<Parcel> => {
  console.log('Assigning transporter in DB:', { parcelId, transporterId });
  const { data, error } = await supabase
    .from('parcels')
    .update({ transporter_id: transporterId, status: 'MATCHED' })
    .eq('id', parcelId)
    .select()
    .single();

  if (error) {
    console.error('Error assigning transporter:', error);
    throw error;
  }
  console.log('Transporter assigned successfully in DB', data);
  return data as Parcel;
};

export const assignTripToParcel = async (parcelId: string, tripId: string): Promise<void> => {
  const { error } = await supabase
    .from('parcels')
    .update({ trip_id: tripId, status: 'MATCHED' })
    .eq('id', parcelId);

  if (error) {
    console.error('Error assigning trip to parcel:', error);
    throw error;
  }
};

export const fetchParcelByTrackingCode = async (trackingCode: string): Promise<Parcel | null> => {
  const { data, error } = await supabase
    .from('parcels')
    .select('*')
    .eq('tracking_code', trackingCode)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // PostgREST error for "No rows found"
      return null;
    }
    console.error('Error fetching parcel by tracking code:', error);
    throw error;
  }

  return data as Parcel | null;
};