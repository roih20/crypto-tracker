import { save, type CryptoData } from "../db/queries.ts";

const cryptoTracker = async (coins: string[]): Promise<CryptoData[]> => {
  const url = `https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=${coins.join(",")}&precision=2`;
  const key = process.env.COIN_GECKO_API_KEY;

  if (!key) {
    throw new Error("API Key missing");
  }

  const response = await fetch(url, {
    headers: {
      "x-cg-demo-api-key": key,
    },
  });

  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }

  const coinsList: CryptoData[] = [];
  const coinData = await response.json();

  for (const coin in coinData) {
    coinsList.push({
      crypto: coin,
      currency: "USD",
      price: coinData[coin].usd,
      trackedAt: new Date().toISOString(),
    });
  }

  return coinsList;
};

const main = async () => {
  console.log("Starting currency tracker...\n");
  console.log("Fetching data from CoinGecko API...\n");
  const coins = ["bitcoin", "ethereum", "solana"];

  try {
    const coinsData = await cryptoTracker(coins);
    coinsData.forEach(printCoinData);
    console.log("Saving data to the database...\n");
    await save(coinsData);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in tracker:", error.message);
    }
  }
};

function printCoinData({ crypto, price, trackedAt, currency }: CryptoData) {
  console.log(`Tracking ${crypto}...\n`);
  console.log(`Crypto:      ${crypto}`);
  console.log(`Currency:    ${currency}`);
  console.log(`Price:       $${price.toFixed(2)}`);
  console.log(`Tracked At:  ${trackedAt}\n`);
}

main();
