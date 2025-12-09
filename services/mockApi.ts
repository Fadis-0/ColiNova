import { Parcel, ParcelStatus, Trip, User, UserRole, Coordinates } from '../types';

// Service Functions




export const updateParcelStatus = async (id: string, status: ParcelStatus): Promise<void> => {
    await new Promise(r => setTimeout(r, 500));
    console.log(`Updated parcel ${id} to ${status}`);
};