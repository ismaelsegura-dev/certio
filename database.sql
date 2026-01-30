create table lotes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  variedad text not null,
  acidez float not null,
  nota_cata text,
  lat float not null default 0.0,
  lng float not null default 0.0,
  blockchain_hash text,
  precio_certificacion float default 0.15
);
