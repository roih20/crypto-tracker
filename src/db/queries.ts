import { getDb } from "./client.ts";

export type CryptoData = {
  crypto: string;
  currency: string;
  price: number;
  trackedAt: string;
};

export const save = async (data: CryptoData[]) => {
  const supabase = getDb();

  const { error } = await supabase.from("crypto_tracer").insert(
    data.map((coin) => ({
      crypto: coin.crypto,
      currency: coin.currency,
      price: coin.price,
      trackedAt: coin.trackedAt,
    })),
  );

  if (error) {
    throw new Error(error.message);
  }
};
