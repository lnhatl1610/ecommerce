-- Enforce unique phone numbers while allowing multiple NULL values.
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
