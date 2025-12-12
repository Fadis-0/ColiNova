import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Parcel, Trip } from '../types';
import { login as supabaseLogin, signup as supabaseSignup, signOut, getSession, getProfile, updateProfile } from '../services/auth';
import { supabase } from '../utils/supabase';
import { fetchParcels, fetchTrips, createParcel } from '../services/data';
import * as api from '../services/mockApi';


interface AppContextType {
  user: User | null;
  role: UserRole;
  parcels: Parcel[];
  trips: Trip[];
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, phone: String, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (newRole: UserRole) => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => void;
  refreshData: (currentRole: UserRole, userId?: string) => Promise<void>;
  addParcel: (p: Partial<Parcel>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(UserRole.GUEST);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string, selectedRole: UserRole) => {
    setIsLoading(true);
    try {
      const userData = await supabaseLogin(email, password);
      if (userData?.id) {
        const profile = await getProfile(userData.id);
        if (profile.role !== selectedRole) {
          await updateProfile(userData.id, selectedRole);
          profile.role = selectedRole;
        }
        const userWithRole = { ...userData, role: profile.role, name: profile.name, phone: profile.phone, avatar: profile.avatar_url };
        setUser(userWithRole);
        setRole(profile.role);
        await refreshData(profile.role, userData.id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, phone: string, password: string, selectedRole: UserRole) => {
    setIsLoading(true);
    try {
      const userData = await supabaseSignup(name, email, phone, password, selectedRole);
      if (userData?.id) {
        const profile = await getProfile(userData.id);
        const userWithRole = { ...userData, role: profile.role, name: profile.name, phone: profile.phone, avatar: profile.avatar_url };
        setUser(userWithRole);
        setRole(profile.role);
        await refreshData(profile.role, userData.id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setRole(UserRole.GUEST);
    setParcels([]);
    window.location.hash = '#';
  };

  const switchRole = async (newRole: UserRole) => {
    if (!user) return;
    setIsLoading(true);
    try {
      await updateProfile(user.id, newRole);
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      setRole(newRole);
      await refreshData(newRole, user.id);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserAvatar = (avatarUrl: string) => {
    if (user) {
      const updatedUser = { ...user, avatar: avatarUrl };
      setUser(updatedUser);
    }
  };

  const refreshData = async (currentRole: UserRole, userId?: string) => {
    if (currentRole === UserRole.GUEST || !userId) return;
    setIsLoading(true);
    try {
        const p = await fetchParcels(currentRole, userId);
        setParcels(p);
        const t = await fetchTrips();
        setTrips(t);
    }
    finally {
        setIsLoading(false);
    }
  };

  const addParcel = async (p: Partial<Parcel>) => {
    if (!user) throw new Error("User not authenticated");
    const newP = await createParcel(p, user.id);
    setParcels(prev => [newP, ...prev]);
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getSession();
        if (session?.user) {
          const profile = await getProfile(session.user.id);
          const userWithRole = {
            ...session.user,
            role: profile.role,
            name: profile.name,
            avatar: profile.avatar_url,
          };
          setUser(userWithRole);
          setRole(profile.role);
          await refreshData(profile.role, session.user.id);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        setUser(null);
        setRole(UserRole.GUEST);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
            const profile = await getProfile(session.user.id);
            const userWithRole = {
              ...session.user,
              role: profile.role,
              name: profile.name,
              avatar: profile.avatar_url,
            };
            setUser(userWithRole);
            setRole(profile.role);
            await refreshData(profile.role, session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setRole(UserRole.GUEST);
          setParcels([]);
          setTrips([]);
          window.location.reload();
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AppContext.Provider value={{ user, role, parcels, trips, isLoading, login, register, logout, switchRole, updateUserAvatar, refreshData, addParcel }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};