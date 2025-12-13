ALTER POLICY "Senders and transporters can update parcels" ON public.parcels
USING (
    (auth.uid() = sender_id AND status = 'PENDING') OR
    (auth.uid() = transporter_id) OR
    (status = 'PENDING' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'TRANSPORTER')
)
WITH CHECK (
    -- If the user is a transporter, they can transition status
    (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'TRANSPORTER' AND
        (
            (old.status = 'PENDING' AND new.status = 'MATCHED' AND auth.uid() = new.transporter_id) OR -- Accepting a parcel
            (old.status = 'MATCHED' AND new.status = 'PICKED_UP' AND auth.uid() = old.transporter_id) OR -- Picking up a parcel
            (old.status = 'PICKED_UP' AND new.status = 'IN_TRANSIT' AND auth.uid() = old.transporter_id) OR -- Starting a trip
            (old.status = 'IN_TRANSIT' AND new.status = 'DELIVERED' AND auth.uid() = old.transporter_id)    -- Delivering a parcel
        )
    ) OR
    -- Sender can still update their own parcels (e.g., description of pending parcel)
    (auth.uid() = sender_id AND old.status = new.status) -- Allow sender to modify non-status fields if they own the parcel
);
