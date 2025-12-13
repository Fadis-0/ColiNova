CREATE POLICY "Senders and transporters can update parcels"
ON public.parcels FOR UPDATE
TO authenticated
USING (
    (auth.uid() = sender_id AND status = 'PENDING') OR
    (auth.uid() = transporter_id) OR
    (status = 'PENDING' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'TRANSPORTER')
)
WITH CHECK (
    (status = 'MATCHED' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'TRANSPORTER') OR
    (auth.uid() = sender_id) OR
    (auth.uid() = transporter_id)
);
