// DTP Uganda  -  Demo Data
// Realistic Ugandan trade data for all actor dashboards
// All prices in UGX. All actors are interconnected.

export const MARKET_PRICES = [
  { commodity: "Coffee (Arabica)", buy: 8800, sell: 9200, unit: "kg", trend: 3.2, region: "Eastern", source: "UCDA", updated: "Today 08:30" },
  { commodity: "Coffee (Robusta)", buy: 7100, sell: 7500, unit: "kg", trend: 1.8, region: "Central", source: "UCDA", updated: "Today 08:30" },
  { commodity: "Maize", buy: 950, sell: 1100, unit: "kg", trend: -2.1, region: "Northern", source: "MAAIF", updated: "Today 09:00" },
  { commodity: "Beans (Common)", buy: 2800, sell: 3100, unit: "kg", trend: 0.9, region: "Western", source: "MAAIF", updated: "Today 09:00" },
  { commodity: "Groundnuts", buy: 3800, sell: 4200, unit: "kg", trend: 4.5, region: "Northern", source: "MAAIF", updated: "Today 09:15" },
  { commodity: "Rice (Milled)", buy: 2200, sell: 2600, unit: "kg", trend: 1.2, region: "Eastern", source: "MAAIF", updated: "Today 09:00" },
  { commodity: "Vanilla", buy: 145000, sell: 162000, unit: "kg", trend: 8.3, region: "Central", source: "UCE", updated: "Today 07:45" },
  { commodity: "Cocoa", buy: 8500, sell: 9400, unit: "kg", trend: 5.1, region: "Western", source: "UCE", updated: "Today 07:45" },
  { commodity: "Tea", buy: 480, sell: 520, unit: "kg", trend: -0.8, region: "Western", source: "UTGA", updated: "Today 08:00" },
  { commodity: "Simsim / Sesame", buy: 4200, sell: 4800, unit: "kg", trend: 2.7, region: "Northern", source: "MAAIF", updated: "Today 09:15" },
  { commodity: "Sunflower", buy: 1800, sell: 2100, unit: "kg", trend: 1.5, region: "Eastern", source: "MAAIF", updated: "Today 09:00" },
  { commodity: "Nile Perch (Fresh)", buy: 14000, sell: 17500, unit: "kg", trend: 6.2, region: "Central", source: "UFPEA", updated: "Today 06:00" },
  { commodity: "Tilapia (Fresh)", buy: 8500, sell: 11000, unit: "kg", trend: 3.8, region: "Eastern", source: "UFPEA", updated: "Today 06:00" },
  { commodity: "Tomatoes", buy: 1800, sell: 2400, unit: "kg", trend: -5.3, region: "Central", source: "Kampala Markets", updated: "Today 07:00" },
  { commodity: "Onions", buy: 2200, sell: 2800, unit: "kg", trend: 2.1, region: "Central", source: "Kampala Markets", updated: "Today 07:00" },
  { commodity: "Sweet Potatoes", buy: 600, sell: 850, unit: "kg", trend: -1.4, region: "Western", source: "MAAIF", updated: "Today 09:00" },
  { commodity: "Cassava", buy: 450, sell: 650, unit: "kg", trend: 0.3, region: "Central", source: "MAAIF", updated: "Today 09:00" },
  { commodity: "Cattle (Beef)", buy: 9500, sell: 12000, unit: "kg", trend: 1.9, region: "Western", source: "Mbarara Market", updated: "Today 08:00" },
  { commodity: "Milk (Raw)", buy: 1200, sell: 1500, unit: "litre", trend: 0.7, region: "Western", source: "DDA", updated: "Today 07:30" },
  { commodity: "Honey (Raw)", buy: 18000, sell: 24000, unit: "kg", trend: 3.4, region: "Eastern", source: "UNAAPI", updated: "Today 08:00" },
  { commodity: "Sugarcane", buy: 95, sell: 115, unit: "kg", trend: -0.5, region: "Eastern", source: "USGA", updated: "Today 08:30" },
  { commodity: "Cotton (Lint)", buy: 3200, sell: 3800, unit: "kg", trend: 2.3, region: "Northern", source: "UCDA", updated: "Today 08:30" },
  { commodity: "Fish (Dried)", buy: 22000, sell: 28000, unit: "kg", trend: 4.1, region: "Central", source: "UFPEA", updated: "Today 06:00" },
  { commodity: "Plantain / Matoke", buy: 800, sell: 1100, unit: "bunch", trend: -3.2, region: "Western", source: "Kampala Markets", updated: "Today 07:00" },
  { commodity: "Sugar (Refined)", buy: 2900, sell: 3200, unit: "kg", trend: 0.8, region: "Central", source: "USGA", updated: "Today 08:30" },
  { commodity: "Salt (Iodised)", buy: 550, sell: 650, unit: "kg", trend: 0.2, region: "Central", source: "UNBS", updated: "Today 09:00" },
  { commodity: "Sunflower Oil", buy: 6200, sell: 6800, unit: "litre", trend: 1.5, region: "Central", source: "UNBS", updated: "Today 08:30" },
  { commodity: "Bran (Wheat)", buy: 700, sell: 850, unit: "kg", trend: -0.5, region: "Central", source: "Kampala Mills", updated: "Today 09:00" },
  { commodity: "Maize Flour", buy: 1700, sell: 1900, unit: "kg", trend: -1.2, region: "Central", source: "UNBS", updated: "Today 09:00" },
  { commodity: "Wheat Flour", buy: 2200, sell: 2450, unit: "kg", trend: 0.9, region: "Central", source: "UNBS", updated: "Today 09:00" },
  { commodity: "Sorghum", buy: 1100, sell: 1350, unit: "kg", trend: 2.1, region: "Northern", source: "MAAIF", updated: "Today 09:15" },
  { commodity: "Millet (Finger)", buy: 1400, sell: 1700, unit: "kg", trend: 1.8, region: "Northern", source: "MAAIF", updated: "Today 09:15" },
  { commodity: "Palm Oil (Crude)", buy: 4800, sell: 5400, unit: "litre", trend: 3.2, region: "Central", source: "UCE", updated: "Today 07:45" },
  { commodity: "Cocoa (Fermented)", buy: 8200, sell: 9200, unit: "kg", trend: 5.1, region: "Western", source: "UCE", updated: "Today 07:45" },
  { commodity: "Nile Perch (Fillet)", buy: 28000, sell: 35000, unit: "kg", trend: 7.2, region: "Central", source: "UFPEA", updated: "Today 06:00" },
  { commodity: "Hides and Skins", buy: 18000, sell: 22000, unit: "kg", trend: 2.4, region: "Western", source: "Mbarara Market", updated: "Today 08:00" },
  { commodity: "Timber (Hardwood)", buy: 180000, sell: 220000, unit: "m3", trend: 1.1, region: "Western", source: "NFA", updated: "Today 09:00" },
  { commodity: "Charcoal", buy: 280, sell: 350, unit: "kg", trend: -2.8, region: "Central", source: "Kampala Markets", updated: "Today 07:00" },
  { commodity: "Steel Roofing Sheets", buy: 24000, sell: 28000, unit: "piece", trend: 2.1, region: "Central", source: "UNBS", updated: "Today 09:00" },
  { commodity: "Cement (Portland)", buy: 28000, sell: 32000, unit: "bag", trend: 1.5, region: "Central", source: "UNBS", updated: "Today 09:00" },
  { commodity: "Animal Feed (Poultry)", buy: 1900, sell: 2200, unit: "kg", trend: 1.4, region: "Central", source: "UNBS", updated: "Today 09:00" },
  { commodity: "Soap (Bar)", buy: 3000, sell: 3500, unit: "piece", trend: 0.5, region: "Central", source: "UNBS", updated: "Today 09:00" },
  { commodity: "Leather (Finished)", buy: 75000, sell: 85000, unit: "piece", trend: 2.8, region: "Central", source: "UMA", updated: "Today 09:00" },

];

export const PRICE_HISTORY = {
  "Coffee (Arabica)": {
    week:   [8200, 8350, 8500, 8600, 8700, 8800, 9200],
    month:  [7800, 7900, 8000, 8050, 8100, 8150, 8200, 8250, 8300, 8350, 8400, 8450, 8500, 8550, 8600, 8620, 8650, 8680, 8700, 8720, 8740, 8760, 8780, 8800, 8850, 8900, 8950, 9000, 9100, 9200],
    quarter:[7200, 7300, 7400, 7500, 7600, 7650, 7700, 7750, 7800, 7850, 7900, 7950, 8000, 8100, 8200, 8300, 8400, 8500, 8550, 8600, 8650, 8700, 8750, 8800, 8850, 8900, 8950, 9000, 9100, 9200],
    year:   [6800, 6900, 7000, 7100, 7200, 7400, 7600, 7800, 8000, 8200, 8500, 9200],
        sixmonth:[7000, 7100, 7200, 7300, 7400, 7500, 7600, 7700, 7800, 7900, 8000, 8100, 8200, 8300, 8400, 8500, 8600, 8700, 8800, 8850, 8900, 8950, 9000, 9100, 9200],
  },
  "Coffee (Robusta)": {
    week:   [6800, 6900, 7000, 7050, 7100, 7200, 7500],
    month:  [6400, 6450, 6500, 6550, 6600, 6650, 6700, 6720, 6750, 6780, 6800, 6820, 6850, 6880, 6900, 6920, 6950, 6980, 7000, 7020, 7040, 7060, 7080, 7100, 7150, 7200, 7250, 7300, 7400, 7500],
    quarter:[6000, 6100, 6200, 6300, 6400, 6450, 6500, 6550, 6600, 6650, 6700, 6750, 6800, 6850, 6900, 6950, 7000, 7050, 7100, 7150, 7200, 7250, 7300, 7350, 7400, 7420, 7440, 7460, 7480, 7500],
    year:   [5500, 5700, 5900, 6000, 6200, 6400, 6600, 6700, 6800, 6900, 7200, 7500],
        sixmonth:[5800, 5900, 6000, 6100, 6200, 6300, 6400, 6500, 6600, 6700, 6800, 6900, 7000, 7100, 7200, 7300, 7400, 7500],
  },
  "Maize": {
    week:   [1150, 1100, 1080, 1050, 1020, 980, 950],
    month:  [1400, 1380, 1360, 1340, 1320, 1300, 1280, 1260, 1240, 1220, 1200, 1180, 1160, 1150, 1140, 1130, 1120, 1110, 1100, 1090, 1080, 1070, 1060, 1050, 1030, 1010, 990, 970, 960, 950],
    quarter:[1600, 1580, 1550, 1520, 1500, 1480, 1450, 1420, 1400, 1380, 1350, 1320, 1300, 1280, 1250, 1220, 1200, 1180, 1150, 1120, 1100, 1080, 1050, 1020, 1000, 980, 970, 960, 955, 950],
    year:   [1800, 1700, 1600, 1500, 1400, 1300, 1250, 1200, 1150, 1100, 1000, 950],
        sixmonth:[1600, 1550, 1500, 1450, 1400, 1350, 1300, 1250, 1200, 1150, 1100, 1050, 1020, 990, 970, 960, 955, 950],
  },
  "Vanilla": {
    week:   [132000, 136000, 139000, 141000, 143000, 147000, 162000],
    month:  [120000, 121000, 122000, 123000, 124000, 125000, 126000, 127000, 128000, 129000, 130000, 131000, 132000, 133000, 134000, 135000, 136000, 137000, 138000, 139000, 140000, 141000, 143000, 145000, 147000, 149000, 152000, 155000, 158000, 162000],
    quarter:[100000, 102000, 104000, 106000, 108000, 110000, 112000, 114000, 116000, 118000, 120000, 122000, 124000, 126000, 128000, 130000, 132000, 134000, 136000, 138000, 140000, 142000, 145000, 148000, 150000, 153000, 155000, 158000, 160000, 162000],
    year:   [85000, 90000, 95000, 100000, 105000, 110000, 115000, 120000, 130000, 140000, 152000, 162000],
        sixmonth:[105000, 108000, 112000, 115000, 118000, 122000, 126000, 130000, 135000, 140000, 147000, 155000, 158000, 160000, 162000],
  },
  "Nile Perch (Fresh)": {
    week:   [12500, 13000, 13500, 14000, 14500, 15000, 17500],
    month:  [11000, 11200, 11400, 11600, 11800, 12000, 12200, 12400, 12500, 12600, 12700, 12800, 12900, 13000, 13100, 13200, 13300, 13400, 13500, 13700, 13900, 14100, 14300, 14500, 14800, 15000, 15500, 16000, 16500, 17500],
    quarter:[9000, 9200, 9500, 9800, 10000, 10200, 10500, 10800, 11000, 11200, 11500, 11800, 12000, 12200, 12500, 12800, 13000, 13200, 13500, 13800, 14000, 14500, 15000, 15500, 16000, 16500, 17000, 17200, 17400, 17500],
    year:   [8000, 8500, 9000, 9500, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17500],
        sixmonth:[10000, 10500, 11000, 11500, 12000, 12500, 13000, 13500, 14000, 14500, 15000, 16000, 17000, 17500],
  },
  "Groundnuts": {
    week:   [3600, 3650, 3700, 3750, 3800, 3900, 4200],
    month:  [3200, 3250, 3300, 3350, 3400, 3450, 3500, 3520, 3550, 3580, 3600, 3620, 3650, 3680, 3700, 3720, 3750, 3780, 3800, 3830, 3860, 3890, 3920, 3950, 4000, 4050, 4100, 4150, 4180, 4200],
    quarter:[2800, 2900, 3000, 3100, 3200, 3300, 3400, 3450, 3500, 3550, 3600, 3650, 3700, 3750, 3800, 3850, 3900, 3950, 4000, 4020, 4050, 4080, 4100, 4120, 4150, 4160, 4170, 4180, 4190, 4200],
    year:   [2500, 2700, 2900, 3100, 3300, 3500, 3600, 3700, 3800, 3900, 4100, 4200],
        sixmonth:[3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000, 4100, 4150, 4180, 4200],
  },
  "Beans (Common)": {
    week:   [2600, 2650, 2700, 2750, 2800, 2900, 3100],
    month:  [2400, 2420, 2450, 2480, 2500, 2520, 2550, 2580, 2600, 2620, 2650, 2680, 2700, 2720, 2750, 2770, 2790, 2800, 2820, 2840, 2860, 2880, 2900, 2920, 2950, 2980, 3000, 3030, 3060, 3100],
    quarter:[2000, 2050, 2100, 2150, 2200, 2250, 2300, 2350, 2400, 2450, 2500, 2550, 2600, 2650, 2700, 2750, 2780, 2800, 2840, 2870, 2900, 2930, 2960, 2980, 3000, 3020, 3040, 3060, 3080, 3100],
    year:   [1800, 1900, 2000, 2100, 2200, 2400, 2600, 2700, 2800, 2900, 3000, 3100],
        sixmonth:[2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3050, 3080, 3100],
  },
  "Cattle (Beef)": {
    week:   [9000, 9100, 9200, 9300, 9400, 9450, 9500],
    month:  [8500, 8550, 8600, 8650, 8700, 8750, 8800, 8820, 8850, 8880, 8900, 8920, 8950, 8980, 9000, 9020, 9050, 9080, 9100, 9120, 9150, 9180, 9200, 9250, 9300, 9350, 9400, 9430, 9460, 9500],
    quarter:[7800, 7900, 8000, 8100, 8200, 8300, 8400, 8450, 8500, 8550, 8600, 8650, 8700, 8750, 8800, 8850, 8900, 8950, 9000, 9050, 9100, 9150, 9200, 9250, 9300, 9350, 9400, 9430, 9460, 9500],
    year:   [7000, 7200, 7400, 7600, 7800, 8000, 8200, 8400, 8600, 8800, 9000, 9500],
        sixmonth:[8000, 8100, 8200, 8300, 8400, 8500, 8700, 8900, 9000, 9200, 9400, 9500],
  },
  "Honey (Raw)": {
    week:   [17000, 17200, 17500, 18000, 18500, 19000, 24000],
    month:  [16000, 16100, 16200, 16400, 16600, 16800, 17000, 17200, 17400, 17500, 17600, 17800, 18000, 18200, 18400, 18600, 18800, 19000, 19500, 20000, 20500, 21000, 21500, 22000, 22500, 23000, 23200, 23400, 23700, 24000],
    quarter:[14000, 14200, 14500, 14800, 15000, 15200, 15500, 15800, 16000, 16200, 16500, 16800, 17000, 17200, 17500, 17800, 18000, 18500, 19000, 19500, 20000, 20500, 21000, 21500, 22000, 22500, 23000, 23200, 23600, 24000],
    year:   [12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000, 24000],
        sixmonth:[15000, 15500, 16000, 16500, 17000, 17500, 18000, 19000, 20000, 21000, 22000, 24000],
  },
  "Milk (Raw)": {
    week:   [1150, 1160, 1170, 1180, 1190, 1200, 1500],
    month:  [1100, 1110, 1120, 1130, 1140, 1150, 1160, 1165, 1170, 1175, 1180, 1185, 1190, 1195, 1200, 1210, 1220, 1230, 1240, 1250, 1280, 1300, 1320, 1350, 1380, 1400, 1420, 1450, 1480, 1500],
    quarter:[900, 920, 940, 960, 980, 1000, 1020, 1050, 1080, 1100, 1120, 1140, 1160, 1180, 1200, 1220, 1240, 1260, 1280, 1300, 1320, 1350, 1380, 1400, 1420, 1440, 1460, 1470, 1480, 1500],
    year:   [800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1300, 1400, 1500],
        sixmonth:[1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1480, 1500],
  },
};

export const TRANSACTIONS = [
  // nalwanga_sarah (AGR) sales
  { id: "TXN-2026-0841", date: "2026-05-24", seller: "nalwanga_sarah", sellerName: "Nalwanga Sarah", sellerRole: "AGR", sellerTradeId: "UG-DTP-AGR-14729", buyer: "mbale_hullers", buyerName: "Mbale Coffee Hullers Ltd", buyerRole: "VAP", buyerTradeId: "UG-DTP-VAP-00056", product: "Coffee (Arabica)", quantity: 850, unit: "kg", pricePerUnit: 8800, total: 7480000, status: "completed", district: "Mbale", paymentMethod: "MTN MoMo", reference: "REF-8841234" },
  { id: "TXN-2026-0802", date: "2026-05-18", seller: "nalwanga_sarah", sellerName: "Nalwanga Sarah", sellerRole: "AGR", sellerTradeId: "UG-DTP-AGR-14729", buyer: "kapchorwa_traders", buyerName: "Kapchorwa Coffee Traders", buyerRole: "AGT", buyerTradeId: "UG-DTP-AGT-00088", product: "Coffee (Arabica)", quantity: 1200, unit: "kg", pricePerUnit: 8600, total: 10320000, status: "completed", district: "Mbale", paymentMethod: "MTN MoMo", reference: "REF-8802156" },
  { id: "TXN-2026-0771", date: "2026-05-10", seller: "nalwanga_sarah", sellerName: "Nalwanga Sarah", sellerRole: "AGR", sellerTradeId: "UG-DTP-AGR-14729", buyer: "mbale_hullers", buyerName: "Mbale Coffee Hullers Ltd", buyerRole: "VAP", buyerTradeId: "UG-DTP-VAP-00056", product: "Coffee (Arabica)", quantity: 700, unit: "kg", pricePerUnit: 8500, total: 5950000, status: "completed", district: "Mbale", paymentMethod: "MTN MoMo", reference: "REF-8771098" },
  { id: "TXN-2026-0744", date: "2026-05-03", seller: "nalwanga_sarah", sellerName: "Nalwanga Sarah", sellerRole: "AGR", sellerTradeId: "UG-DTP-AGR-14729", buyer: "kapchorwa_traders", buyerName: "Kapchorwa Coffee Traders", buyerRole: "AGT", buyerTradeId: "UG-DTP-AGT-00088", product: "Coffee (Arabica)", quantity: 950, unit: "kg", pricePerUnit: 8450, total: 8027500, status: "completed", district: "Mbale", paymentMethod: "Airtel Money", reference: "REF-8744021" },
  { id: "TXN-2026-0698", date: "2026-04-22", seller: "nalwanga_sarah", sellerName: "Nalwanga Sarah", sellerRole: "AGR", sellerTradeId: "UG-DTP-AGR-14729", buyer: "mbale_hullers", buyerName: "Mbale Coffee Hullers Ltd", buyerRole: "VAP", buyerTradeId: "UG-DTP-VAP-00056", product: "Coffee (Arabica)", quantity: 1100, unit: "kg", pricePerUnit: 8300, total: 9130000, status: "completed", district: "Mbale", paymentMethod: "MTN MoMo", reference: "REF-8698443" },
  { id: "TXN-2026-0612", date: "2026-04-08", seller: "nalwanga_sarah", sellerName: "Nalwanga Sarah", sellerRole: "AGR", sellerTradeId: "UG-DTP-AGR-14729", buyer: "kapchorwa_traders", buyerName: "Kapchorwa Coffee Traders", buyerRole: "AGT", buyerTradeId: "UG-DTP-AGT-00088", product: "Coffee (Arabica)", quantity: 800, unit: "kg", pricePerUnit: 8200, total: 6560000, status: "completed", district: "Mbale", paymentMethod: "MTN MoMo", reference: "REF-8612887" },
  { id: "TXN-2026-0841B", date: "2026-05-27", seller: "nalwanga_sarah", sellerName: "Nalwanga Sarah", sellerRole: "AGR", sellerTradeId: "UG-DTP-AGR-14729", buyer: "kahawa_exports", buyerName: "Kahawa Exports Uganda", buyerRole: "EXP", buyerTradeId: "UG-DTP-EXP-00034", product: "Coffee (Arabica)", quantity: 500, unit: "kg", pricePerUnit: 9000, total: 4500000, status: "pending_payment", district: "Mbale", paymentMethod: "MTN MoMo", reference: "REF-8841B901" },

  // mbale_hullers (VAP) transactions
  { id: "TXN-2026-0845", date: "2026-05-25", seller: "mbale_hullers", sellerName: "Mbale Coffee Hullers Ltd", sellerRole: "VAP", sellerTradeId: "UG-DTP-VAP-00056", buyer: "kapchorwa_traders", buyerName: "Kapchorwa Coffee Traders", buyerRole: "AGT", buyerTradeId: "UG-DTP-AGT-00088", product: "Coffee (Arabica)", quantity: 3200, unit: "kg", pricePerUnit: 9100, total: 29120000, status: "completed", district: "Mbale", paymentMethod: "Stanbic Bank", reference: "REF-8845221" },
  { id: "TXN-2026-0820", date: "2026-05-20", seller: "mbale_hullers", sellerName: "Mbale Coffee Hullers Ltd", sellerRole: "VAP", sellerTradeId: "UG-DTP-VAP-00056", buyer: "kahawa_exports", buyerName: "Kahawa Exports Uganda", buyerRole: "EXP", buyerTradeId: "UG-DTP-EXP-00034", product: "Coffee (Arabica)", quantity: 5500, unit: "kg", pricePerUnit: 9050, total: 49775000, status: "completed", district: "Mbale", paymentMethod: "Centenary Bank", reference: "REF-8820443" },
  { id: "TXN-2026-0799", date: "2026-05-15", seller: "mbale_hullers", sellerName: "Mbale Coffee Hullers Ltd", sellerRole: "VAP", sellerTradeId: "UG-DTP-VAP-00056", buyer: "volcafe_uganda", buyerName: "Volcafe Uganda Ltd", buyerRole: "BYR", buyerTradeId: "UG-DTP-BYR-00071", product: "Coffee (Arabica)", quantity: 8000, unit: "kg", pricePerUnit: 9000, total: 72000000, status: "completed", district: "Mbale", paymentMethod: "Stanbic Bank", reference: "REF-8799012" },

  // kapchorwa_traders (AGT) transactions
  { id: "TXN-2026-0848", date: "2026-05-26", seller: "kapchorwa_traders", sellerName: "Kapchorwa Coffee Traders", sellerRole: "AGT", sellerTradeId: "UG-DTP-AGT-00088", buyer: "kahawa_exports", buyerName: "Kahawa Exports Uganda", buyerRole: "EXP", buyerTradeId: "UG-DTP-EXP-00034", product: "Coffee (Arabica)", quantity: 12000, unit: "kg", pricePerUnit: 8900, total: 106800000, status: "completed", district: "Kapchorwa", paymentMethod: "Centenary Bank", reference: "REF-8848991" },
  { id: "TXN-2026-0831", date: "2026-05-22", seller: "kapchorwa_traders", sellerName: "Kapchorwa Coffee Traders", sellerRole: "AGT", sellerTradeId: "UG-DTP-AGT-00088", buyer: "volcafe_uganda", buyerName: "Volcafe Uganda Ltd", buyerRole: "BYR", buyerTradeId: "UG-DTP-BYR-00071", product: "Coffee (Arabica)", quantity: 6500, unit: "kg", pricePerUnit: 8850, total: 57525000, status: "completed", district: "Kapchorwa", paymentMethod: "Stanbic Bank", reference: "REF-8831774" },

  // kahawa_exports (EXP) export transactions
  { id: "TXN-2026-0850", date: "2026-05-27", seller: "kahawa_exports", sellerName: "Kahawa Exports Uganda", sellerRole: "EXP", sellerTradeId: "UG-DTP-EXP-00034", buyer: "INTL-DE-HAMBURG-001", buyerName: "Neumann Gruppe GmbH", buyerRole: "INTERNATIONAL", buyerTradeId: "DE-IMPORTER-001", product: "Coffee (Arabica)  -  Parchment", quantity: 40000, unit: "kg", pricePerUnit: 11200, total: 448000000, status: "in_transit", district: "Kampala", paymentMethod: "SWIFT Transfer", reference: "REF-8850-EXPORT" },
  { id: "TXN-2026-0822", date: "2026-05-21", seller: "kahawa_exports", sellerName: "Kahawa Exports Uganda", sellerRole: "EXP", sellerTradeId: "UG-DTP-EXP-00034", buyer: "INTL-NL-AMS-002", buyerName: "Louis Dreyfus Company", buyerRole: "INTERNATIONAL", buyerTradeId: "NL-IMPORTER-002", product: "Coffee (Arabica)  -  Parchment", quantity: 32000, unit: "kg", pricePerUnit: 11000, total: 352000000, status: "completed", district: "Kampala", paymentMethod: "SWIFT Transfer", reference: "REF-8822-EXPORT" },

  // volcafe_uganda (BYR) purchases
  { id: "TXN-2026-0835", date: "2026-05-23", seller: "kapchorwa_traders", sellerName: "Kapchorwa Coffee Traders", sellerRole: "AGT", sellerTradeId: "UG-DTP-AGT-00088", buyer: "volcafe_uganda", buyerName: "Volcafe Uganda Ltd", buyerRole: "BYR", buyerTradeId: "UG-DTP-BYR-00071", product: "Coffee (Robusta)", quantity: 9000, unit: "kg", pricePerUnit: 7200, total: 64800000, status: "completed", district: "Kampala", paymentMethod: "Stanbic Bank", reference: "REF-8835112" },

  // kampala_mills (MFR) transactions
  { id: "TXN-2026-0840", date: "2026-05-24", seller: "kampala_mills", sellerName: "Kampala Mills Limited", sellerRole: "MFR", sellerTradeId: "UG-DTP-MFR-00312", buyer: "nile_traders", buyerName: "Nile Trading Company Ltd", buyerRole: "AGT", buyerTradeId: "UG-DTP-AGT-00201", product: "Maize Flour", quantity: 50000, unit: "kg", pricePerUnit: 1850, total: 92500000, status: "completed", district: "Kampala", paymentMethod: "Centenary Bank", reference: "REF-8840556" },
  { id: "TXN-2026-0815", date: "2026-05-19", seller: "kampala_mills", sellerName: "Kampala Mills Limited", sellerRole: "MFR", sellerTradeId: "UG-DTP-MFR-00312", buyer: "john_musoke", buyerName: "John Musoke", buyerRole: "CSM", buyerTradeId: "UG-CSM-00441", product: "Maize Flour", quantity: 25, unit: "kg", pricePerUnit: 2100, total: 52500, status: "completed", district: "Kampala", paymentMethod: "MTN MoMo", reference: "REF-8815334" },

  // ssekandi_transport (TRP) jobs
  { id: "JOB-2026-0441", date: "2026-05-25", transporter: "ssekandi_transport", transporterName: "Ssekandi Transport Services", transporterTradeId: "UG-DTP-TRP-00019", cargo: "Coffee (Arabica)", quantity: 3200, unit: "kg", origin: "Mbale", destination: "Kampala", distanceKm: 245, ratePerKm: 1800, total: 441000, status: "completed", assignedBy: "mbale_hullers", reference: "JOB-8441-TRP" },
  { id: "JOB-2026-0438", date: "2026-05-22", transporter: "ssekandi_transport", transporterName: "Ssekandi Transport Services", transporterTradeId: "UG-DTP-TRP-00019", cargo: "Coffee (Arabica)", quantity: 5500, unit: "kg", origin: "Mbale", destination: "Kampala", distanceKm: 245, ratePerKm: 1800, total: 441000, status: "completed", assignedBy: "mbale_hullers", reference: "JOB-8438-TRP" },
  { id: "JOB-2026-0445", date: "2026-05-27", transporter: "ssekandi_transport", transporterName: "Ssekandi Transport Services", transporterTradeId: "UG-DTP-TRP-00019", cargo: "Maize Flour", quantity: 20000, unit: "kg", origin: "Kampala", destination: "Gulu", distanceKm: 340, ratePerKm: 1800, total: 612000, status: "in_transit", assignedBy: "kampala_mills", reference: "JOB-8445-TRP" },

  // nile_traders (AGT+IMP+EXP) transactions
  { id: "TXN-2026-0843", date: "2026-05-25", seller: "INTL-KE-NBI-003", sellerName: "Magadi Soda Company", sellerRole: "INTERNATIONAL", sellerTradeId: "KE-SUPPLIER-003", buyer: "nile_traders", buyerName: "Nile Trading Company Ltd", buyerRole: "IMP", buyerTradeId: "UG-DTP-AGT-00201", product: "Industrial Salt", quantity: 80000, unit: "kg", pricePerUnit: 420, total: 33600000, status: "customs_clearance", district: "Kampala", paymentMethod: "Equity Bank", reference: "REF-8843-IMP" },
];

export const LISTINGS = [
  { id: "lst-001", seller: "nalwanga_sarah", sellerName: "Nalwanga Sarah", sellerTradeId: "UG-DTP-AGR-14729", sellerVerified: "NIRA", product: "Coffee (Arabica)", grade: "FAQ", quantity: 2000, unit: "kg", pricePerUnit: 9000, minOrder: 200, district: "Mbale", region: "Eastern", description: "Sun-dried Arabica cherry from Sipi Falls area. Elevation 1800m. Available for immediate collection or arranged transport.", listed: "2026-05-25", expires: "2026-06-25", visibility: "public", status: "active", views: 47 },
  { id: "lst-002", seller: "mbale_hullers", sellerName: "Mbale Coffee Hullers Ltd", sellerTradeId: "UG-DTP-VAP-00056", sellerVerified: "URSB", product: "Coffee (Arabica)", grade: "Parchment Fine", quantity: 15000, unit: "kg", pricePerUnit: 9200, minOrder: 1000, district: "Mbale", region: "Eastern", description: "Wet-processed parchment coffee, hulled and graded. EUDR-traceable batches available. Ready for export.", listed: "2026-05-26", expires: "2026-06-26", visibility: "public", status: "active", views: 134 },
  { id: "lst-003", seller: "kapchorwa_traders", sellerName: "Kapchorwa Coffee Traders", sellerTradeId: "UG-DTP-AGT-00088", sellerVerified: "URSB", product: "Coffee (Arabica)", grade: "Screen 15+", quantity: 25000, unit: "kg", pricePerUnit: 9100, minOrder: 2000, district: "Kapchorwa", region: "Eastern", description: "Aggregated Arabica from Mount Elgon smallholder farmers. Fully traceable to farm level. EUDR documentation available.", listed: "2026-05-24", expires: "2026-06-24", visibility: "public", status: "active", views: 289 },
  { id: "lst-004", seller: "kampala_mills", sellerName: "Kampala Mills Limited", sellerTradeId: "UG-DTP-MFR-00312", sellerVerified: "URSB", product: "Maize Flour", grade: "Fortified Grade A", quantity: 200000, unit: "kg", pricePerUnit: 1900, minOrder: 1000, district: "Kampala", region: "Central", description: "UNBS-certified fortified maize flour. Packaged in 2kg, 5kg, and 50kg bags. Delivery available Kampala radius 80km.", listed: "2026-05-20", expires: "2026-07-20", visibility: "public", status: "active", views: 512 },
  { id: "lst-005", seller: "kampala_mills", sellerName: "Kampala Mills Limited", sellerTradeId: "UG-DTP-MFR-00312", sellerVerified: "URSB", product: "Wheat Flour", grade: "Grade A", quantity: 50000, unit: "kg", pricePerUnit: 2400, minOrder: 500, district: "Kampala", region: "Central", description: "High-gluten wheat flour for bakeries and food processors. UNBS certified.", listed: "2026-05-20", expires: "2026-07-20", visibility: "public", status: "active", views: 198 },
  { id: "lst-006", seller: "nile_traders", sellerName: "Nile Trading Company Ltd", sellerTradeId: "UG-DTP-AGT-00201", sellerVerified: "URA", product: "Maize", grade: "Grade 1", quantity: 80000, unit: "kg", pricePerUnit: 1050, minOrder: 5000, district: "Kampala", region: "Central", description: "Clean, dry maize grain. Moisture content below 13%. Available for immediate delivery.", listed: "2026-05-22", expires: "2026-06-22", visibility: "public", status: "active", views: 376 },
  { id: "lst-007", seller: "nile_traders", sellerName: "Nile Trading Company Ltd", sellerTradeId: "UG-DTP-AGT-00201", sellerVerified: "URA", product: "Beans (Common)", grade: "Grade 1", quantity: 30000, unit: "kg", pricePerUnit: 3000, minOrder: 2000, district: "Kampala", region: "Central", description: "Mixed beans, clean and sorted. Suitable for institutional buyers.", listed: "2026-05-22", expires: "2026-06-22", visibility: "public", status: "active", views: 244 },
  { id: "lst-008", seller: "mbale_hullers", sellerName: "Mbale Coffee Hullers Ltd", sellerTradeId: "UG-DTP-VAP-00056", sellerVerified: "URSB", product: "Coffee (Robusta)", grade: "FAQ", quantity: 8000, unit: "kg", pricePerUnit: 7400, minOrder: 500, district: "Mbale", region: "Eastern", description: "Hulled and cleaned Robusta from Mbale lowlands. Good cup quality. Ready for export or domestic processing.", listed: "2026-05-26", expires: "2026-06-26", visibility: "public", status: "active", views: 88 },
  { id: "lst-009", seller: "kapchorwa_traders", sellerName: "Kapchorwa Coffee Traders", sellerTradeId: "UG-DTP-AGT-00088", sellerVerified: "URSB", product: "Honey (Raw)", grade: "Grade A", quantity: 2000, unit: "kg", pricePerUnit: 22000, minOrder: 50, district: "Kapchorwa", region: "Eastern", description: "Pure raw honey from Mount Elgon beekeepers. Unprocessed, high natural sugar content. Available in 25kg drums.", listed: "2026-05-25", expires: "2026-06-25", visibility: "public", status: "active", views: 312 },
  { id: "lst-010", seller: "nile_traders", sellerName: "Nile Trading Company Ltd", sellerTradeId: "UG-DTP-AGT-00201", sellerVerified: "URA", product: "Maize", grade: "Grade 1", quantity: 120000, unit: "kg", pricePerUnit: 1050, minOrder: 10000, district: "Kampala", region: "Central", description: "Premium Grade 1 maize, moisture below 13%. Sourced from Northern Uganda. Large quantities available for millers and exporters.", listed: "2026-05-23", expires: "2026-06-23", visibility: "public", status: "active", views: 421 },
  { id: "lst-011", seller: "kampala_mills", sellerName: "Kampala Mills Limited", sellerTradeId: "UG-DTP-MFR-00312", sellerVerified: "URSB", product: "Sunflower Oil", grade: "Refined", quantity: 50000, unit: "litre", pricePerUnit: 6800, minOrder: 500, district: "Kampala", region: "Central", description: "UNBS-certified refined sunflower oil. Available in 1L, 5L, and 20L containers. Suitable for retail and institutional buyers.", listed: "2026-05-21", expires: "2026-07-21", visibility: "public", status: "active", views: 267 },
  { id: "lst-012", seller: "nalwanga_sarah", sellerName: "Nalwanga Sarah", sellerTradeId: "UG-DTP-AGR-14729", sellerVerified: "NIRA", product: "Vanilla", grade: "Grade B", quantity: 150, unit: "kg", pricePerUnit: 148000, minOrder: 10, district: "Mbale", region: "Eastern", description: "Cured vanilla beans from Sipi Falls area. 18-20cm length. Moisture content 30%. Limited seasonal supply.", listed: "2026-05-27", expires: "2026-06-27", visibility: "public", status: "active", views: 198 },
  { id: "lst-013", seller: "kapchorwa_traders", sellerName: "Kapchorwa Coffee Traders", sellerTradeId: "UG-DTP-AGT-00088", sellerVerified: "URSB", product: "Groundnuts", grade: "Grade 1 Shelled", quantity: 25000, unit: "kg", pricePerUnit: 4100, minOrder: 1000, district: "Kapchorwa", region: "Eastern", description: "Clean shelled groundnuts, aflatoxin tested. Suitable for processing and export. Certificate of analysis available.", listed: "2026-05-24", expires: "2026-06-24", visibility: "public", status: "active", views: 156 },
  { id: "lst-014", seller: "nile_traders", sellerName: "Nile Trading Company Ltd", sellerTradeId: "UG-DTP-AGT-00201", sellerVerified: "URA", product: "Simsim / Sesame", grade: "Hulled White", quantity: 18000, unit: "kg", pricePerUnit: 4600, minOrder: 2000, district: "Kampala", region: "Central", description: "Export-quality hulled white sesame. Oil content 50%+. Sourced from Northern Uganda. Phytosanitary certificate available.", listed: "2026-05-22", expires: "2026-06-22", visibility: "public", status: "active", views: 203 },
  { id: "lst-015", seller: "mbale_hullers", sellerName: "Mbale Coffee Hullers Ltd", sellerTradeId: "UG-DTP-VAP-00056", sellerVerified: "URSB", product: "Coffee (Arabica)", grade: "AA Screen 18", quantity: 5000, unit: "kg", pricePerUnit: 9800, minOrder: 500, district: "Mbale", region: "Eastern", description: "Top-grade AA screen 18 Arabica. Cup score 84+. EUDR-traceable. Preferred by specialty roasters. Limited stock.", listed: "2026-05-27", expires: "2026-06-27", visibility: "public", status: "active", views: 445 },
  { id: "lst-016", seller: "kampala_mills", sellerName: "Kampala Mills Limited", sellerTradeId: "UG-DTP-MFR-00312", sellerVerified: "URSB", product: "Wheat Flour", grade: "Grade A Fortified", quantity: 80000, unit: "kg", pricePerUnit: 2450, minOrder: 1000, district: "Kampala", region: "Central", description: "Fortified wheat flour with iron and folic acid. UNBS certified. Suitable for bakeries and food manufacturers.", listed: "2026-05-20", expires: "2026-07-20", visibility: "public", status: "active", views: 334 },
  { id: "lst-017", seller: "kampala_mills", sellerName: "Kampala Mills Limited", sellerTradeId: "UG-DTP-MFR-00312", sellerVerified: "URSB", product: "Sunflower Oil", grade: "Refined Grade A", quantity: 45000, unit: "litre", pricePerUnit: 6800, minOrder: 500, district: "Kampala", region: "Central", description: "UNBS-certified refined sunflower oil. Available in 1L, 5L and 20L containers. Suitable for retail and food processing.", listed: "2026-05-21", expires: "2026-07-21", visibility: "public", status: "active", views: 267 },
  { id: "lst-018", seller: "kampala_mills", sellerName: "Kampala Mills Limited", sellerTradeId: "UG-DTP-MFR-00312", sellerVerified: "URSB", product: "Bran", grade: "Wheat Bran", quantity: 30000, unit: "kg", pricePerUnit: 850, minOrder: 2000, district: "Kampala", region: "Central", description: "By-product of wheat milling. High fibre content. Suitable for animal feed and food fortification.", listed: "2026-05-20", expires: "2026-07-20", visibility: "public", status: "active", views: 89 },
  { id: "lst-019", seller: "nile_traders", sellerName: "Nile Trading Company Ltd", sellerTradeId: "UG-DTP-AGT-00201", sellerVerified: "URA", product: "Sugar", grade: "Refined White", quantity: 200000, unit: "kg", pricePerUnit: 3200, minOrder: 5000, district: "Kampala", region: "Central", description: "Refined white sugar from Kakira and Kinyara. Available in 1kg, 2kg and 50kg bags. Wholesale prices available.", listed: "2026-05-23", expires: "2026-06-23", visibility: "public", status: "active", views: 512 },
  { id: "lst-020", seller: "nile_traders", sellerName: "Nile Trading Company Ltd", sellerTradeId: "UG-DTP-AGT-00201", sellerVerified: "URA", product: "Salt", grade: "Iodised", quantity: 100000, unit: "kg", pricePerUnit: 650, minOrder: 5000, district: "Kampala", region: "Central", description: "Iodised table salt, UNBS certified. Available in 500g, 1kg and 25kg bags. Suitable for food processing and retail.", listed: "2026-05-22", expires: "2026-06-22", visibility: "public", status: "active", views: 298 },
  { id: "lst-021", seller: "mbale_hullers", sellerName: "Mbale Coffee Hullers Ltd", sellerTradeId: "UG-DTP-VAP-00056", sellerVerified: "URSB", product: "Rice (Milled)", grade: "Grade A Long Grain", quantity: 40000, unit: "kg", pricePerUnit: 2500, minOrder: 1000, district: "Mbale", region: "Eastern", description: "Milled long grain rice from Eastern Uganda. Clean, no stones. Available in 5kg and 25kg bags.", listed: "2026-05-26", expires: "2026-06-26", visibility: "public", status: "active", views: 178 },
  { id: "lst-022", seller: "kapchorwa_traders", sellerName: "Kapchorwa Coffee Traders", sellerTradeId: "UG-DTP-AGT-00088", sellerVerified: "URSB", product: "Cocoa", grade: "Grade 1 Fermented", quantity: 5000, unit: "kg", pricePerUnit: 9200, minOrder: 500, district: "Kapchorwa", region: "Eastern", description: "Fully fermented and dried Grade 1 cocoa beans from Mount Elgon. Suitable for chocolate manufacturing and export.", listed: "2026-05-25", expires: "2026-06-25", visibility: "public", status: "active", views: 221 },
  { id: "lst-023", seller: "nile_traders", sellerName: "Nile Trading Company Ltd", sellerTradeId: "UG-DTP-AGT-00201", sellerVerified: "URA", product: "Fish (Dried)", grade: "Omena Grade A", quantity: 8000, unit: "kg", pricePerUnit: 26000, minOrder: 200, district: "Kampala", region: "Central", description: "Dried dagaa (omena) from Lake Victoria. High protein content. Suitable for animal feed and human consumption.", listed: "2026-05-24", expires: "2026-06-24", visibility: "public", status: "active", views: 143 },
  { id: "lst-024", seller: "nalwanga_sarah", sellerName: "Nalwanga Sarah", sellerTradeId: "UG-DTP-AGR-14729", sellerVerified: "NIRA", product: "Beans (Common)", grade: "Grade 1", quantity: 5000, unit: "kg", pricePerUnit: 2900, minOrder: 100, district: "Mbale", region: "Eastern", description: "Clean red kidney beans from Mbale. Moisture below 14%. Good for domestic and institutional buyers.", listed: "2026-05-26", expires: "2026-06-26", visibility: "public", status: "active", views: 67 },
  { id: "lst-025", seller: "kapchorwa_traders", sellerName: "Kapchorwa Coffee Traders", sellerTradeId: "UG-DTP-AGT-00088", sellerVerified: "URSB", product: "Sorghum", grade: "Grade 1", quantity: 40000, unit: "kg", pricePerUnit: 1300, minOrder: 2000, district: "Kapchorwa", region: "Eastern", description: "Clean white sorghum sourced from Kapchorwa and Kween districts. Suitable for brewing, milling and animal feed.", listed: "2026-05-23", expires: "2026-06-23", visibility: "public", status: "active", views: 189 },
  { id: "lst-026", seller: "nile_traders", sellerName: "Nile Trading Company Ltd", sellerTradeId: "UG-DTP-AGT-00201", sellerVerified: "URA", product: "Millet (Finger)", grade: "Grade 1", quantity: 25000, unit: "kg", pricePerUnit: 1650, minOrder: 1000, district: "Kampala", region: "Central", description: "Finger millet from Northern Uganda. Clean and dry. Suitable for milling, brewing and nutrition products.", listed: "2026-05-22", expires: "2026-06-22", visibility: "public", status: "active", views: 112 },
  { id: "lst-027", seller: "mbale_hullers", sellerName: "Mbale Coffee Hullers Ltd", sellerTradeId: "UG-DTP-VAP-00056", sellerVerified: "URSB", product: "Nile Perch (Fresh)", grade: "Whole Round", quantity: 3000, unit: "kg", pricePerUnit: 16000, minOrder: 100, district: "Mbale", region: "Eastern", description: "Fresh Nile Perch from Lake Victoria landing sites. Daily fresh stock. Suitable for local processors and exporters.", listed: "2026-05-27", expires: "2026-05-29", visibility: "public", status: "active", views: 334 },
  { id: "lst-028", seller: "kampala_mills", sellerName: "Kampala Mills Limited", sellerTradeId: "UG-DTP-MFR-00312", sellerVerified: "URSB", product: "Maize Flour", grade: "Fortified Grade A", quantity: 500000, unit: "kg", pricePerUnit: 1900, minOrder: 5000, district: "Kampala", region: "Central", description: "UNBS-certified fortified maize flour. Iron and Vitamin A enriched. Available in 1kg, 2kg, 5kg and 50kg packaging. Nationwide delivery.", listed: "2026-05-20", expires: "2026-07-20", visibility: "public", status: "active", views: 678 },
  { id: "lst-029", seller: "nile_traders", sellerName: "Nile Trading Company Ltd", sellerTradeId: "UG-DTP-AGT-00201", sellerVerified: "URA", product: "Cattle (Beef)", grade: "Grade A Live", quantity: 200, unit: "kg", pricePerUnit: 11000, minOrder: 50, district: "Kampala", region: "Central", description: "Grade A beef cattle from Western Uganda. Live weight pricing. Abattoir and butchery supply. Minimum 50kg.", listed: "2026-05-24", expires: "2026-06-24", visibility: "public", status: "active", views: 445 },
  { id: "lst-030", seller: "kapchorwa_traders", sellerName: "Kapchorwa Coffee Traders", sellerTradeId: "UG-DTP-AGT-00088", sellerVerified: "URSB", product: "Tea", grade: "BOP Grade", quantity: 10000, unit: "kg", pricePerUnit: 510, minOrder: 500, district: "Kapchorwa", region: "Eastern", description: "Broken Orange Pekoe grade tea from Kapchorwa estates. Suitable for blending and packaging. UTGA certified.", listed: "2026-05-25", expires: "2026-06-25", visibility: "public", status: "active", views: 92 },
  { id: "lst-031", seller: "nalwanga_sarah", sellerName: "Nalwanga Sarah", sellerTradeId: "UG-DTP-AGR-14729", sellerVerified: "NIRA", product: "Sweet Potatoes", grade: "Orange Flesh", quantity: 8000, unit: "kg", pricePerUnit: 800, minOrder: 200, district: "Mbale", region: "Eastern", description: "Vitamin A-rich orange-flesh sweet potatoes. Good shelf life. Available for fresh market and processing.", listed: "2026-05-26", expires: "2026-06-05", visibility: "public", status: "active", views: 54 },
  { id: "lst-032", seller: "mbale_hullers", sellerName: "Mbale Coffee Hullers Ltd", sellerTradeId: "UG-DTP-VAP-00056", sellerVerified: "URSB", product: "Honey (Raw)", grade: "Grade A Organic", quantity: 1500, unit: "kg", pricePerUnit: 23000, minOrder: 25, district: "Mbale", region: "Eastern", description: "Certified organic raw honey from Mount Elgon. Unprocessed, natural flavour. Available in 500g, 1kg and 25kg drums.", listed: "2026-05-27", expires: "2026-06-27", visibility: "public", status: "active", views: 287 },
  { id: "lst-033", seller: "kampala_mills", sellerName: "Kampala Mills Limited", sellerTradeId: "UG-DTP-MFR-00312", sellerVerified: "URSB", product: "Sugar (Refined)", grade: "White Refined", quantity: 300000, unit: "kg", pricePerUnit: 3100, minOrder: 10000, district: "Kampala", region: "Central", description: "Refined white sugar. Available in 1kg, 2kg and 50kg packaging. Suitable for industrial food processing and retail.", listed: "2026-05-20", expires: "2026-07-20", visibility: "public", status: "active", views: 543 },
  { id: "lst-034", seller: "nile_traders", sellerName: "Nile Trading Company Ltd", sellerTradeId: "UG-DTP-AGT-00201", sellerVerified: "URA", product: "Milk (Raw)", grade: "Grade A Fresh", quantity: 5000, unit: "litre", pricePerUnit: 1400, minOrder: 50, district: "Kampala", region: "Central", description: "Fresh raw milk from Western Uganda dairy farms. Daily collection. Suitable for pasteurisation, yoghurt and cheese production.", listed: "2026-05-27", expires: "2026-05-30", visibility: "public", status: "active", views: 198 },
  { id: "lst-035", seller: "kapchorwa_traders", sellerName: "Kapchorwa Coffee Traders", sellerTradeId: "UG-DTP-AGT-00088", sellerVerified: "URSB", product: "Cotton (Lint)", grade: "Grade A Ginned", quantity: 30000, unit: "kg", pricePerUnit: 3700, minOrder: 2000, district: "Kapchorwa", region: "Eastern", description: "Ginned cotton lint from Northern and Eastern Uganda. Suitable for textile manufacturing and export.", listed: "2026-05-24", expires: "2026-06-24", visibility: "public", status: "active", views: 167 },

  { id: "lst-037", seller: "kampala_mills", sellerName: "Kampala Mills Limited", sellerTradeId: "UG-DTP-MFR-00312", sellerVerified: "URSB", product: "Steel Roofing Sheets", grade: "Gauge 30 Galvanised", quantity: 5000, unit: "piece", pricePerUnit: 28000, minOrder: 50, district: "Kampala", region: "Central", description: "Gauge 30 galvanised steel roofing sheets. 3m and 4m lengths available. Suitable for residential and commercial construction. Nationwide delivery.", listed: "2026-05-20", expires: "2026-07-20", visibility: "public", status: "active", views: 892 },
  { id: "lst-038", seller: "nile_traders", sellerName: "Nile Trading Company Ltd", sellerTradeId: "UG-DTP-AGT-00201", sellerVerified: "URA", product: "Cement", grade: "Portland Grade 42.5", quantity: 10000, unit: "bag", pricePerUnit: 32000, minOrder: 100, district: "Kampala", region: "Central", description: "Portland cement 42.5 grade. 50kg bags. Suitable for all construction works. Direct from manufacturer.", listed: "2026-05-22", expires: "2026-06-22", visibility: "public", status: "active", views: 1243 },
  { id: "lst-039", seller: "kampala_mills", sellerName: "Kampala Mills Limited", sellerTradeId: "UG-DTP-MFR-00312", sellerVerified: "URSB", product: "Plastic Pipes (PVC)", grade: "Class D 4 inch", quantity: 2000, unit: "piece", pricePerUnit: 18500, minOrder: 20, district: "Kampala", region: "Central", description: "UNBS-certified PVC pressure pipes. Class D, 4-inch diameter, 6m lengths. Suitable for water supply and irrigation.", listed: "2026-05-21", expires: "2026-07-21", visibility: "public", status: "active", views: 456 },
  { id: "lst-040", seller: "nile_traders", sellerName: "Nile Trading Company Ltd", sellerTradeId: "UG-DTP-AGT-00201", sellerVerified: "URA", product: "Timber (Hardwood)", grade: "Mahogany Sawn", quantity: 500, unit: "m3", pricePerUnit: 210000, minOrder: 5, district: "Kampala", region: "Central", description: "Legally sourced mahogany timber. NFA licensed. Sawn to various dimensions. Suitable for furniture and construction.", listed: "2026-05-23", expires: "2026-06-23", visibility: "public", status: "active", views: 334 },
  { id: "lst-041", seller: "kapchorwa_traders", sellerName: "Kapchorwa Coffee Traders", sellerTradeId: "UG-DTP-AGT-00088", sellerVerified: "URSB", product: "Charcoal", grade: "Hardwood Premium", quantity: 50000, unit: "kg", pricePerUnit: 320, minOrder: 1000, district: "Kapchorwa", region: "Eastern", description: "Premium hardwood charcoal. Low ash content, high heat value. Suitable for households, restaurants and industrial use.", listed: "2026-05-24", expires: "2026-06-24", visibility: "public", status: "active", views: 567 },
  { id: "lst-042", seller: "kampala_mills", sellerName: "Kampala Mills Limited", sellerTradeId: "UG-DTP-MFR-00312", sellerVerified: "URSB", product: "Leather (Finished)", grade: "Full Grain Bovine", quantity: 2000, unit: "piece", pricePerUnit: 85000, minOrder: 10, district: "Kampala", region: "Central", description: "Full grain bovine leather. Chrome tanned, finished. Suitable for footwear, bags and upholstery manufacturing.", listed: "2026-05-20", expires: "2026-07-20", visibility: "public", status: "active", views: 223 },
  { id: "lst-043", seller: "nile_traders", sellerName: "Nile Trading Company Ltd", sellerTradeId: "UG-DTP-AGT-00201", sellerVerified: "URA", product: "Hides and Skins", grade: "Wet Salted", quantity: 5000, unit: "kg", pricePerUnit: 19000, minOrder: 200, district: "Kampala", region: "Central", description: "Wet salted cattle hides and goat skins. Sourced from certified abattoirs. Suitable for tanneries and leather processors.", listed: "2026-05-22", expires: "2026-06-22", visibility: "public", status: "active", views: 178 },
  { id: "lst-044", seller: "mbale_hullers", sellerName: "Mbale Coffee Hullers Ltd", sellerTradeId: "UG-DTP-VAP-00056", sellerVerified: "URSB", product: "Tilapia (Fresh)", grade: "Whole Round 400g+", quantity: 2000, unit: "kg", pricePerUnit: 10500, minOrder: 50, district: "Mbale", region: "Eastern", description: "Fresh tilapia from Lake Victoria. 400g+ size. Daily fresh stock. Suitable for restaurants, supermarkets and export processors.", listed: "2026-05-27", expires: "2026-05-30", visibility: "public", status: "active", views: 412 },
  { id: "lst-045", seller: "kampala_mills", sellerName: "Kampala Mills Limited", sellerTradeId: "UG-DTP-MFR-00312", sellerVerified: "URSB", product: "Animal Feed (Poultry)", grade: "Broiler Starter", quantity: 100000, unit: "kg", pricePerUnit: 2200, minOrder: 500, district: "Kampala", region: "Central", description: "UNBS-certified broiler starter feed. High protein formulation. Available in 25kg and 50kg bags. Suitable for commercial poultry farms.", listed: "2026-05-20", expires: "2026-07-20", visibility: "public", status: "active", views: 765 },
  { id: "lst-046", seller: "nile_traders", sellerName: "Nile Trading Company Ltd", sellerTradeId: "UG-DTP-AGT-00201", sellerVerified: "URA", product: "Packaging Materials", grade: "PP Woven Bags 50kg", quantity: 50000, unit: "piece", pricePerUnit: 1200, minOrder: 1000, district: "Kampala", region: "Central", description: "Polypropylene woven bags, 50kg capacity. Custom printing available. Suitable for grains, flour, sugar and agricultural produce.", listed: "2026-05-23", expires: "2026-06-23", visibility: "public", status: "active", views: 534 },
  { id: "lst-047", seller: "kampala_mills", sellerName: "Kampala Mills Limited", sellerTradeId: "UG-DTP-MFR-00312", sellerVerified: "URSB", product: "Soap (Bar)", grade: "800g Laundry Bar", quantity: 20000, unit: "piece", pricePerUnit: 3500, minOrder: 200, district: "Kampala", region: "Central", description: "UNBS-certified 800g laundry bar soap. Manufactured from palm oil. Suitable for wholesale distribution.", listed: "2026-05-20", expires: "2026-07-20", visibility: "public", status: "active", views: 389 },
  { id: "lst-048", seller: "kapchorwa_traders", sellerName: "Kapchorwa Coffee Traders", sellerTradeId: "UG-DTP-AGT-00088", sellerVerified: "URSB", product: "Medicinal Plants", grade: "Dried Moringa Leaf", quantity: 500, unit: "kg", pricePerUnit: 12000, minOrder: 10, district: "Kapchorwa", region: "Eastern", description: "Sun-dried moringa oleifera leaves from organic farms. No chemicals used. Suitable for herbal processing and export.", listed: "2026-05-25", expires: "2026-06-25", visibility: "public", status: "active", views: 198 },
  { id: "lst-049", seller: "nile_traders", sellerName: "Nile Trading Company Ltd", sellerTradeId: "UG-DTP-AGT-00201", sellerVerified: "URA", product: "Palm Oil (Crude)", grade: "CPO Grade 1", quantity: 30000, unit: "litre", pricePerUnit: 5200, minOrder: 1000, district: "Kampala", region: "Central", description: "Crude palm oil from Kalangala Island. High FFA below 5%. Suitable for refining and soap manufacturing.", listed: "2026-05-22", expires: "2026-06-22", visibility: "public", status: "active", views: 267 },
  { id: "lst-050", seller: "kampala_mills", sellerName: "Kampala Mills Limited", sellerTradeId: "UG-DTP-MFR-00312", sellerVerified: "URSB", product: "Textiles (Fabric)", grade: "Cotton Print 44 inch", quantity: 10000, unit: "piece", pricePerUnit: 8500, minOrder: 100, district: "Kampala", region: "Central", description: "Cotton print fabric, 44-inch width, 6-yard pieces. Various prints available. Suitable for tailoring, uniforms and retail.", listed: "2026-05-20", expires: "2026-07-20", visibility: "public", status: "active", views: 445 },

  { id: "lst-p001", seller: "kahawa_exports", sellerName: "Kahawa Exports Uganda", sellerTradeId: "UG-DTP-EXP-00034", sellerVerified: "URSB", product: "Coffee (Arabica)", grade: "AA Screen 18 - Specialty", quantity: 20000, unit: "kg", pricePerUnit: 10500, minOrder: 1000, district: "Kampala", region: "Central", description: "Specialty grade AA Arabica. Cup score 87+. EUDR-traceable to farm level. Preferred pricing for verified export buyers only. Not for public listing.", listed: "2026-05-27", expires: "2026-06-27", visibility: "private", status: "active", views: 12 },
  { id: "lst-p002", seller: "nile_traders", sellerName: "Nile Trading Company Ltd", sellerTradeId: "UG-DTP-AGT-00201", sellerVerified: "URA", product: "Gold", grade: "Artisanal 22K", quantity: 50, unit: "kg", pricePerUnit: 280000000, minOrder: 1, district: "Kampala", region: "Central", description: "Artisanal gold, 22 carat. Uganda Revenue Authority export permit held. Available to licensed mineral dealers and exporters only. KYC required.", listed: "2026-05-25", expires: "2026-06-25", visibility: "private", status: "active", views: 3 },
  { id: "lst-p003", seller: "kampala_mills", sellerName: "Kampala Mills Limited", sellerTradeId: "UG-DTP-MFR-00312", sellerVerified: "URSB", product: "Maize Flour", grade: "Bulk Industrial 50kg", quantity: 2000000, unit: "kg", pricePerUnit: 1750, minOrder: 100000, district: "Kampala", region: "Central", description: "Industrial bulk pricing for registered millers and institutional buyers only. Minimum 100 metric tonnes. Private contract pricing, not for public market.", listed: "2026-05-20", expires: "2026-08-20", visibility: "private", status: "active", views: 8 },
  { id: "lst-p004", seller: "kapchorwa_traders", sellerName: "Kapchorwa Coffee Traders", sellerTradeId: "UG-DTP-AGT-00088", sellerVerified: "URSB", product: "Vanilla", grade: "Grade A Export", quantity: 500, unit: "kg", pricePerUnit: 165000, minOrder: 20, district: "Kapchorwa", region: "Eastern", description: "Export grade vanilla beans. Moisture 30%, length 18-22cm. Available to verified exporters and international buyers only. CITES documentation provided.", listed: "2026-05-26", expires: "2026-07-26", visibility: "private", status: "active", views: 6 },
  { id: "lst-p005", seller: "mbale_hullers", sellerName: "Mbale Coffee Hullers Ltd", sellerTradeId: "UG-DTP-VAP-00056", sellerVerified: "URSB", product: "Coffee (Arabica)", grade: "Parchment - Forward Contract", quantity: 50000, unit: "kg", pricePerUnit: 8800, minOrder: 5000, district: "Mbale", region: "Eastern", description: "Forward contract pricing for next harvest. Available to verified buyers with trading history on platform only. Fixed price contract, private arrangement.", listed: "2026-05-27", expires: "2026-09-27", visibility: "private", status: "active", views: 4 },
  { id: "lst-p006", seller: "nile_traders", sellerName: "Nile Trading Company Ltd", sellerTradeId: "UG-DTP-AGT-00201", sellerVerified: "URA", product: "Simsim / Sesame", grade: "Export Grade Hulled", quantity: 200000, unit: "kg", pricePerUnit: 4400, minOrder: 20000, district: "Kampala", region: "Central", description: "Large quantity export-ready sesame. Verified phytosanitary. Bulk pricing for exporters. Private to avoid market price disruption.", listed: "2026-05-22", expires: "2026-06-22", visibility: "private", status: "active", views: 9 },
  { id: "lst-p007", seller: "kahawa_exports", sellerName: "Kahawa Exports Uganda", sellerTradeId: "UG-DTP-EXP-00034", sellerVerified: "URSB", product: "Cocoa", grade: "Fermented Grade 1", quantity: 30000, unit: "kg", pricePerUnit: 9200, minOrder: 2000, district: "Kampala", region: "Central", description: "Fully fermented and dried cocoa beans. EUDR compliant. Available to verified chocolate manufacturers and exporters only.", listed: "2026-05-24", expires: "2026-06-24", visibility: "private", status: "active", views: 7 },
  { id: "lst-036", seller: "kampala_mills", sellerName: "Kampala Mills Limited", sellerTradeId: "UG-DTP-MFR-00312", sellerVerified: "URSB", product: "Salt (Iodised)", grade: "Fine Iodised", quantity: 200000, unit: "kg", pricePerUnit: 620, minOrder: 10000, district: "Kampala", region: "Central", description: "UNBS-certified iodised salt. Fine grain. Available in 500g, 1kg and 25kg bags. Nationwide distribution available.", listed: "2026-05-20", expires: "2026-07-20", visibility: "public", status: "active", views: 312 },
];


export const PURCHASE_REQUESTS = [
  {
    id: "REQ-2026-001",
    listingId: "lst-002",
    product: "Coffee (Arabica)",
    grade: "Parchment Fine",
    quantityRequested: 8000,
    unit: "kg",
    offeredPrice: 9100,
    totalValue: 72800000,
    buyer: "kahawa_exports",
    buyerName: "Kahawa Exports Uganda",
    buyerTradeId: "UG-DTP-EXP-00034",
    buyerVerified: "URSB",
    seller: "mbale_hullers",
    message: "We would like to purchase 8 MT of your parchment coffee for our June export shipment. EUDR documentation required. Payment via Centenary Bank within 3 days of delivery.",
    status: "pending",
    created: "2026-05-29T07:30:00",
    expires: "2026-06-01",
  },
  {
    id: "REQ-2026-002",
    listingId: "lst-003",
    product: "Coffee (Arabica)",
    grade: "Screen 15+",
    quantityRequested: 15000,
    unit: "kg",
    offeredPrice: 8950,
    totalValue: 134250000,
    buyer: "volcafe_uganda",
    buyerName: "Volcafe Uganda Ltd",
    buyerTradeId: "UG-DTP-BYR-00071",
    buyerVerified: "URSB",
    seller: "kapchorwa_traders",
    message: "Interested in 15 MT Screen 15+ for Q2 blending. Can collect from Kapchorwa depot. Payment Stanbic Bank TT within 5 days.",
    status: "pending",
    created: "2026-05-28T14:15:00",
    expires: "2026-05-31",
  },
  {
    id: "REQ-2026-003",
    listingId: "lst-001",
    product: "Coffee (Arabica)",
    grade: "FAQ",
    quantityRequested: 1200,
    unit: "kg",
    offeredPrice: 8800,
    totalValue: 10560000,
    buyer: "mbale_hullers",
    buyerName: "Mbale Coffee Hullers Ltd",
    buyerTradeId: "UG-DTP-VAP-00056",
    buyerVerified: "URSB",
    seller: "nalwanga_sarah",
    message: "We want to buy your FAQ cherries for our next hulling batch. Flexible on collection date. MTN MoMo payment same day.",
    status: "pending",
    created: "2026-05-29T09:00:00",
    expires: "2026-06-02",
  },
  {
    id: "REQ-2026-004",
    listingId: "lst-004",
    product: "Maize Flour",
    grade: "Fortified Grade A",
    quantityRequested: 20000,
    unit: "kg",
    offeredPrice: 1850,
    totalValue: 37000000,
    buyer: "nile_traders",
    buyerName: "Nile Trading Company Ltd",
    buyerTradeId: "UG-DTP-AGT-00201",
    buyerVerified: "URA",
    seller: "kampala_mills",
    message: "Requesting 20 MT fortified maize flour for institutional supply contract. Need UNBS certificate. Centenary Bank payment net 7 days.",
    status: "accepted",
    created: "2026-05-27T11:00:00",
    expires: "2026-05-30",
  },
  {
    id: "REQ-2026-005",
    listingId: "lst-015",
    product: "Coffee (Arabica)",
    grade: "AA Screen 18",
    quantityRequested: 2000,
    unit: "kg",
    offeredPrice: 9600,
    totalValue: 19200000,
    buyer: "kahawa_exports",
    buyerName: "Kahawa Exports Uganda",
    buyerTradeId: "UG-DTP-EXP-00034",
    buyerVerified: "URSB",
    seller: "mbale_hullers",
    message: "Need 2 MT AA Screen 18 for specialty export order. Cup score 84+ required. EUDR traceable. Offer slightly below asking but ready to pay cash on collection.",
    status: "countered",
    counterPrice: 9750,
    counterMessage: "We can offer at UGX 9,750/kg given the specialty grade and limited stock. Payment must be confirmed before collection.",
    created: "2026-05-28T16:30:00",
    expires: "2026-05-31",
  },
  {
    id: "REQ-2026-006",
    listingId: "lst-009",
    product: "Honey (Raw)",
    grade: "Grade A",
    quantityRequested: 500,
    unit: "kg",
    offeredPrice: 21000,
    totalValue: 10500000,
    buyer: "volcafe_uganda",
    buyerName: "Volcafe Uganda Ltd",
    buyerTradeId: "UG-DTP-BYR-00071",
    buyerVerified: "URSB",
    seller: "kapchorwa_traders",
    message: "Interested in 500kg for health food export. Need organic certification documents. Airtel Money payment.",
    status: "declined",
    created: "2026-05-26T10:00:00",
    expires: "2026-05-29",
  },
];

export function getSellerRequests(username) {
  return PURCHASE_REQUESTS.filter(r => r.seller === username);
}

export function getBuyerRequests(username) {
  return PURCHASE_REQUESTS.filter(r => r.buyer === username);
}






// ── Mutable runtime notification store ───────────────────────
const _runtimeNotifs = {};

export function getRuntimeNotifications(username) {
  return _runtimeNotifs[username] || [];
}

export function pushNotification(username, notif) {
  if (!_runtimeNotifs[username]) _runtimeNotifs[username] = [];
  _runtimeNotifs[username].unshift({ ...notif, id: Date.now() + Math.random(), read: false, time: "Just now" });
}

export function markAllRead(username) {
  if (_runtimeNotifs[username]) {
    _runtimeNotifs[username] = _runtimeNotifs[username].map(n => ({...n, read: true}));
  }
}

export function getActorNotificationsFallbackWithRuntime(username, role) {
  const runtime = getRuntimeNotifications(username);
  const fallback = getActorNotificationsFallback(username, role);
  return [...runtime, ...fallback];
}

// ── A8 / A10 - Trust ticks ───────────────────────────────────────────────
// Identity verification (NIRA / URA / URSB / International) is PRIVATE: it is
// shown only on the actor's own profile and to platform admins. The only
// verification signal the public sees is this rating-based trust tick. A green
// tick marks an actor with a sufficient number of strong ratings from unique
// trading partners; everyone else (new actors, or those with few/no ratings)
// shows a gray tick. See spec sections A8.3 and A10.5.
export const TRUST_TICK_GREEN_MIN = 100; // unique 4★+ raters needed for green

// Demo helper: a stable, deterministic rating count per actor. There is no live
// ratings backend yet, so this stands in for "unique raters" until one exists.
export function getSellerRatingCount(key) {
  if (!key) return 0;
  let h = 0;
  for (const ch of String(key)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % 160; // 0–159 → a believable mix of gray and green ticks
}

// Returns the public trust-tick level for an actor: "green" or "gray".
export function getTrustTick(ratingCount = 0) {
  return ratingCount >= TRUST_TICK_GREEN_MIN ? "green" : "gray";
}

export const BUYER_ROLES = ["BYR", "EXP", "MFR", "AGT", "IMP", "CSM", "FBR", "WHS"];

export const ROLE_DEFAULT_CATEGORIES = {
  AGR: ["Food Crops", "Cash Crops"],
  VAP: ["Processed Agricultural Products", "Food Crops", "Cash Crops"],
  MFR: ["Manufactured"],
  AGT: ["Food Crops", "Cash Crops", "Processed Agricultural Products", "Fisheries"],
  EXP: ["Cash Crops", "Food Crops", "Fisheries"],
  IMP: ["Food Crops", "Cash Crops", "Processed Agricultural Products"],
  BYR: ["Food Crops", "Cash Crops", "Processed Agricultural Products", "Fisheries"],
  CSM: ["Food Crops", "Processed Agricultural Products"],
  FBR: ["Cash Crops", "Food Crops", "Processed Agricultural Products", "Fisheries"],
  WHS: ["Food Crops", "Cash Crops", "Processed Agricultural Products", "Manufactured", "Fisheries"],
};

export const BATCHES = [
  { id: "BATCH-VAP-2026-089", actor: "mbale_hullers", tradeId: "UG-DTP-VAP-00056", type: "processing", inputProduct: "Coffee (Arabica) - Cherry", inputQuantity: 18500, inputUnit: "kg", outputProduct: "Coffee (Arabica) - Parchment", outputQuantity: 3700, outputUnit: "kg", conversionRatio: "5:1", processDate: "2026-05-15", facility: "Mbale Central Hulling Station", status: "completed", eudrEligible: true, sourceActors: ["UG-DTP-AGR-14729", "UG-DTP-AGR-22441", "UG-DTP-AGR-09887", "UG-DTP-AGR-31205"], traceability: "full" },
  { id: "BATCH-VAP-2026-090", actor: "mbale_hullers", tradeId: "UG-DTP-VAP-00056", type: "processing", inputProduct: "Coffee (Arabica) - Cherry", inputQuantity: 12000, inputUnit: "kg", outputProduct: "Coffee (Arabica) - Parchment", outputQuantity: 2400, outputUnit: "kg", conversionRatio: "5:1", processDate: "2026-05-22", facility: "Mbale Central Hulling Station", status: "completed", eudrEligible: true, sourceActors: ["UG-DTP-AGR-14729", "UG-DTP-AGR-18823", "UG-DTP-AGR-27991"], traceability: "full" },
  { id: "BATCH-EXP-2026-041", actor: "kahawa_exports", tradeId: "UG-DTP-EXP-00034", type: "export", inputProduct: "Coffee (Arabica) - Parchment", inputQuantity: 40000, inputUnit: "kg", destination: "Hamburg, Germany", buyer: "Neumann Gruppe GmbH", containerRef: "MSCU-7841203-5", portOfExit: "Mombasa", shippingLine: "MSC", eudrDocRef: "EUDR-UG-2026-0841", status: "in_transit", shipDate: "2026-05-20", etaDestination: "2026-06-18", traceability: "full", eudrCompliant: true },
  { id: "BATCH-EXP-2026-038", actor: "kahawa_exports", tradeId: "UG-DTP-EXP-00034", type: "export", inputProduct: "Coffee (Arabica) - Parchment", inputQuantity: 32000, inputUnit: "kg", destination: "Amsterdam, Netherlands", buyer: "Louis Dreyfus Company", containerRef: "HLCU-4412897-2", portOfExit: "Mombasa", shippingLine: "Hapag-Lloyd", eudrDocRef: "EUDR-UG-2026-0838", status: "completed", shipDate: "2026-05-05", etaDestination: "2026-06-01", traceability: "full", eudrCompliant: true },
];

export const EUDR_DOCUMENTS = [
  { id: "EUDR-UG-2026-0841", batchId: "BATCH-EXP-2026-041", status: "submitted", product: "Coffee (Arabica)", quantity: 40000, unit: "kg", euRefNumber: "EU-DDS-2026-UG-0841", submittedDate: "2026-05-19", complianceScore: 98, chainNodes: ["UG-DTP-AGR-14729", "UG-DTP-AGR-22441", "UG-DTP-AGR-09887", "UG-DTP-AGR-31205", "UG-DTP-VAP-00056", "UG-DTP-AGT-00088", "UG-DTP-EXP-00034"], riskLevel: "negligible", verifiedFarmers: 47, totalFarmers: 47, deforestationFree: true },
  { id: "EUDR-UG-2026-0838", batchId: "BATCH-EXP-2026-038", status: "approved", product: "Coffee (Arabica)", quantity: 32000, unit: "kg", euRefNumber: "EU-DDS-2026-UG-0838", submittedDate: "2026-05-03", complianceScore: 96, chainNodes: ["UG-DTP-AGR-18823", "UG-DTP-AGR-27991", "UG-DTP-VAP-00056", "UG-DTP-EXP-00034"], riskLevel: "negligible", verifiedFarmers: 38, totalFarmers: 38, deforestationFree: true },
];

export const VEHICLES = [
  { id: "VEH-001", owner: "ssekandi_transport", tradeId: "UG-DTP-TRP-00019", regNumber: "UAY 456K", type: "Lorry", make: "Isuzu NQR", capacity: 7000, unit: "kg", status: "in_transit", currentJob: "JOB-8445-TRP", goodsTypes: ["General", "Dry Goods"], areas: ["Kampala", "Gulu", "Mbale", "Jinja"] },
  { id: "VEH-002", owner: "ssekandi_transport", tradeId: "UG-DTP-TRP-00019", regNumber: "UBA 892M", type: "Pickup", make: "Toyota Hilux", capacity: 1200, unit: "kg", status: "available", currentJob: null, goodsTypes: ["General", "Perishables"], areas: ["Kampala", "Mbale", "Tororo"] },
  { id: "VEH-003", owner: "ssekandi_transport", tradeId: "UG-DTP-TRP-00019", regNumber: "UAX 101F", type: "Truck", make: "Hino 500", capacity: 12000, unit: "kg", status: "available", currentJob: null, goodsTypes: ["General", "Dry Goods", "Livestock"], areas: ["Kampala", "Mbarara", "Gulu", "Mbale"] },
];

export const NOTIFICATIONS = {
  "nalwanga_sarah": [
    { id: 1, type: "payment", message: "Payment of UGX 7,480,000 received from Mbale Coffee Hullers Ltd", time: "2 hours ago", read: false },
    { id: 2, type: "offer", message: "Kahawa Exports Uganda has made an offer on your listing LST-001", time: "5 hours ago", read: false },
    { id: 3, type: "price", message: "Coffee (Arabica) prices are up 3.2% in Eastern region today", time: "8 hours ago", read: true },
    { id: 4, type: "payment", message: "Payment of UGX 10,320,000 received from Kapchorwa Coffee Traders", time: "9 days ago", read: true },
    { id: 5, type: "rating", message: "Mbale Coffee Hullers Ltd gave you a 5-star rating", time: "12 days ago", read: true },
  ],
  "mbale_hullers": [
    { id: 1, type: "order", message: "New purchase request from Kahawa Exports Uganda  -  8,000 kg Coffee Parchment", time: "1 hour ago", read: false },
    { id: 2, type: "payment", message: "Payment of UGX 49,775,000 received from Kahawa Exports Uganda", time: "7 days ago", read: true },
    { id: 3, type: "batch", message: "Batch BATCH-VAP-2026-090 processing complete. 2,400 kg output.", time: "5 days ago", read: true },
    { id: 4, type: "transport", message: "Ssekandi Transport Services confirmed for delivery to Kampala", time: "6 days ago", read: true },
  ],
  "volcafe_uganda": [
    { id: 1, type: "broadcast", message: "Nalwanga Sarah listed 2,000 kg of Coffee (Arabica) at UGX 9,000/kg. View listing.", time: "10 minutes ago", read: false, listingId: "lst-001" },
    { id: 2, type: "broadcast", message: "Kapchorwa Coffee Traders listed 25,000 kg of Coffee (Arabica) Screen 15+ at UGX 9,100/kg.", time: "1 hour ago", read: false, listingId: "lst-003" },
    { id: 3, type: "order", message: "Your order TXN-2026-0845 has been confirmed. Goods are being prepared.", time: "2 days ago", read: true },
  ],
  "kahawa_exports": [
    { id: 1, type: "eudr", message: "EUDR document EUDR-UG-2026-0841 submitted to EU portal successfully", time: "8 days ago", read: false },
    { id: 2, type: "shipment", message: "Container MSCU-7841203-5 departed Mombasa. ETA Hamburg 18 June", time: "7 days ago", read: false },
    { id: 3, type: "payment", message: "SWIFT transfer EUR 108,000 received from Neumann Gruppe GmbH", time: "6 days ago", read: true },
  ],
  "dtp_admin": [
    { id: 1, type: "registration", message: "New account created: delectu. Profile completion pending.", time: "2 hours ago", read: false },
    { id: 2, type: "registration", message: "vmukisa has completed profile. Trade ID issued: UG-DTP-VAP-87547", time: "4 hours ago", read: false },
    { id: 3, type: "alert", message: "5 new registrations today. 3 pending manual review.", time: "6 hours ago", read: true },
    { id: 4, type: "complaint", message: "New complaint filed against UG-DTP-AGT-00201 (Nile Trading)", time: "1 day ago", read: true },
  ],
};

export const GOV_STATS = {
  totalActors: 12847,
  activeTradeIds: 11203,
  profileIncomplete: 1644,
  totalTransactionValue: 48700000000,
  transactionCount: 94821,
  eudrCompliantBatches: 341,
  eudrPendingBatches: 28,
  exportValue: 18400000000,
  formalizedActors: 11203,
  targetActors: 3000000,
  regionBreakdown: [
    { region: "Central", actors: 4821, value: 22100000000 },
    { region: "Eastern", actors: 3902, value: 14200000000 },
    { region: "Western", actors: 2441, value: 8800000000 },
    { region: "Northern", actors: 1683, value: 3600000000 },
  ],
  topCommodities: [
    { name: "Coffee (Arabica)", volume: 2840000, value: 25600000000, actors: 4821 },
    { name: "Coffee (Robusta)", volume: 1200000, value: 8640000000, actors: 2341 },
    { name: "Maize", volume: 8400000, value: 8820000000, actors: 3102 },
    { name: "Fish (Nile Perch)", volume: 420000, value: 6300000000, actors: 891 },
    { name: "Vanilla", volume: 18000, value: 2880000000, actors: 341 },
  ],
  monthlyRegistrations: [841, 923, 1102, 1341, 1502, 1621],
  monthlyTransactions: [12400, 13800, 15200, 16900, 18200, 18321],
};

export const ADMIN_STATS = {
  totalUsers: 12847,
  activeUsers: 11203,
  pendingApproval: 3,
  profileIncomplete: 1644,
  suspendedAccounts: 4,
  todayRegistrations: 8,
  todayLogins: 342,
  openComplaints: 7,
  resolvedComplaints: 89,
  totalTradeIds: 11203,
  activeTradeIds: 11199,
  frozenTradeIds: 4,
  revokedTradeIds: 2,
  systemHealth: "healthy",
  lastBackup: "Today 03:00",
  uptime: "99.97%",
};

export const COMPLAINTS = [
  { id: "CMP-2026-041", complainant: "kapchorwa_traders", complainantName: "Kapchorwa Coffee Traders", against: "nile_traders", againstName: "Nile Trading Company Ltd", issue: "Late payment  -  18 days overdue on order TXN-2026-0831", status: "open", filed: "2026-05-20", dueDate: "2026-07-19" },
  { id: "CMP-2026-038", complainant: "nalwanga_sarah", complainantName: "Nalwanga Sarah", against: "kapchorwa_traders", againstName: "Kapchorwa Coffee Traders", issue: "Quantity delivered was 50kg short of agreed 950kg", status: "resolved", filed: "2026-05-06", resolved: "2026-05-12" },
];

export const CERTIFICATIONS = [
  { id: "CERT-UNBS-MFR-001", holder: "kampala_mills", holderName: "Kampala Mills Limited", type: "UNBS Certification", standard: "US 35:2019  -  Maize Flour", certNumber: "UNBS/MFR/2024/04421", issuer: "UNBS", issued: "2024-04-15", expires: "2026-04-14", status: "active", products: ["Maize Flour", "Wheat Flour"] },
  { id: "CERT-UNBS-MFR-002", holder: "kampala_mills", holderName: "Kampala Mills Limited", type: "UNBS Certification", standard: "US 49:2019  -  Wheat Flour", certNumber: "UNBS/MFR/2024/04422", issuer: "UNBS", issued: "2024-04-15", expires: "2026-04-14", status: "active", products: ["Wheat Flour"] },
];

// Helper functions
export function getActorTransactions(username) {
  return TRANSACTIONS.filter(t => t.seller === username || t.buyer === username || t.transporter === username);
}

export function getActorListings(username) {
  return LISTINGS.filter(l => l.seller === username);
}

export function getActorNotifications(username) {
  return NOTIFICATIONS[username] || [];
}

export function getActorBatches(username) {
  return BATCHES.filter(b => b.actor === username);
}

export function formatUGX(amount) {
  if (amount >= 1000000000) return `UGX ${(amount / 1000000000).toFixed(1)}B`;
  if (amount >= 1000000) return `UGX ${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `UGX ${(amount / 1000).toFixed(0)}K`;
  return `UGX ${amount.toLocaleString()}`;
}

export function formatNumber(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

const ROLE_DEMO_USERNAMES = {
  AGR: "nalwanga_sarah", VAP: "mbale_hullers", MFR: "kampala_mills",
  AGT: "kapchorwa_traders", EXP: "kahawa_exports", BYR: "volcafe_uganda",
  TRP: "ssekandi_transport", CSM: "john_musoke", IMP: "nile_traders",
  ADMIN: "dtp_admin", GOU: "mtic_analyst", FBR: "neumann_gruppe",
};

export function getActorTransactionsFallback(username, role) {
  const txns = getActorTransactions(username);
  if (txns.length > 0) return txns;
  const fallback = ROLE_DEMO_USERNAMES[role];
  return fallback ? getActorTransactions(fallback) : [];
}

export function getActorListingsFallback(username, role) {
  const listings = getActorListings(username);
  if (listings.length > 0) return listings;
  const fallback = ROLE_DEMO_USERNAMES[role];
  return fallback ? getActorListings(fallback) : [];
}

export function getActorBatchesFallback(username, role) {
  const batches = BATCHES.filter(b => b.actor === username);
  if (batches.length > 0) return batches;
  const fallback = ROLE_DEMO_USERNAMES[role];
  return fallback ? BATCHES.filter(b => b.actor === fallback) : [];
}

export function getActorNotificationsFallback(username, role) {
  const notifs = getActorNotifications(username);
  if (notifs.length > 0) return notifs;
  const fallback = ROLE_DEMO_USERNAMES[role];
  return NOTIFICATIONS[fallback] || [];
}

export const STORES = [
  { id: "UG-DTP-STR-00041", owner: "nalwanga_sarah", name: "Nalwanga Farm Store", type: "Farm Store", district: "Mbale", address: "Sipi Falls Road, Mbale", phone: "0772441829", hours: "Mon-Sat 7am-6pm", status: "active", products: ["Coffee (Arabica)"] },
  { id: "UG-DTP-STR-00088", owner: "kapchorwa_traders", name: "Kapchorwa Main Depot", type: "Depot", district: "Kapchorwa", address: "Market Street, Kapchorwa Town", phone: "0700884421", hours: "Mon-Sat 8am-7pm", status: "active", products: ["Coffee (Arabica)", "Coffee (Robusta)"] },
  { id: "UG-DTP-STR-00089", owner: "kapchorwa_traders", name: "Mbale Collection Point", type: "Buying Station", district: "Mbale", address: "Mbale Industrial Area", phone: "0700884422", hours: "Mon-Fri 8am-5pm", status: "active", products: ["Coffee (Arabica)"] },
  { id: "UG-DTP-STR-00312", owner: "kampala_mills", name: "Kampala Mills Factory Outlet", type: "Factory Outlet", district: "Kampala", address: "Industrial Area, Plot 44, Kampala", phone: "0414334455", hours: "Mon-Fri 8am-5pm", status: "active", products: ["Maize Flour", "Wheat Flour"] },
  { id: "UG-DTP-STR-00056", owner: "mbale_hullers", name: "Mbale Central Hulling Station", type: "Processing Facility", district: "Mbale", address: "Mbale-Tororo Road Km 2", phone: "0782556677", hours: "Mon-Sat 7am-8pm", status: "active", products: ["Coffee (Arabica)"] },
];

export const PRODUCTS_DATA = [
  { id: "PRD-001", owner: "nalwanga_sarah", name: "Coffee (Arabica)", category: "Cash Crops", unit: "kg", stockDeclared: 3500, stockRemaining: 2000, price: 9000, status: "active", visibility: "public", storeId: "UG-DTP-STR-00041", certifications: [], description: "Sun-dried Arabica cherry from Sipi Falls area. Elevation 1800m." },
  { id: "PRD-002", owner: "kapchorwa_traders", name: "Coffee (Arabica)", category: "Cash Crops", unit: "kg", stockDeclared: 30000, stockRemaining: 25000, price: 9100, status: "active", visibility: "public", storeId: "UG-DTP-STR-00088", certifications: ["Screen 15+"], description: "Aggregated Arabica from Mount Elgon smallholder farmers." },
  { id: "PRD-003", owner: "kapchorwa_traders", name: "Coffee (Robusta)", category: "Cash Crops", unit: "kg", stockDeclared: 15000, stockRemaining: 8000, price: 7400, status: "active", visibility: "public", storeId: "UG-DTP-STR-00088", certifications: [], description: "Robusta from Kapchorwa lowlands." },
  { id: "PRD-004", owner: "kampala_mills", name: "Maize Flour", category: "Processed Agricultural Products", unit: "kg", stockDeclared: 200000, stockRemaining: 150000, price: 1900, status: "active", visibility: "public", storeId: "UG-DTP-STR-00312", certifications: ["UNBS US 35:2019"], description: "Fortified Grade A maize flour. Available in 2kg, 5kg, 50kg bags." },
  { id: "PRD-005", owner: "kampala_mills", name: "Wheat Flour", category: "Processed Agricultural Products", unit: "kg", stockDeclared: 80000, stockRemaining: 50000, price: 2400, status: "active", visibility: "public", storeId: "UG-DTP-STR-00312", certifications: ["UNBS US 49:2019"], description: "High-gluten wheat flour for bakeries." },
];

export function getActorStores(username, role) {
  const direct = STORES.filter(s => s.owner === username);
  if (direct.length > 0) return direct;
  const roleMap = { AGR: "nalwanga_sarah", AGT: "kapchorwa_traders", MFR: "kampala_mills", VAP: "mbale_hullers" };
  const fallback = roleMap[role];
  return fallback ? STORES.filter(s => s.owner === fallback) : [];
}

export function getActorProducts(username, role) {
  const direct = PRODUCTS_DATA.filter(p => p.owner === username);
  if (direct.length > 0) return direct;
  const roleMap = { AGR: "nalwanga_sarah", AGT: "kapchorwa_traders", MFR: "kampala_mills", VAP: "mbale_hullers" };
  const fallback = roleMap[role];
  return fallback ? PRODUCTS_DATA.filter(p => p.owner === fallback) : [];
}

export const DISTRICT_DISTANCES = {
  "Mbale-Kampala": 245, "Kampala-Mbale": 245,
  "Mbale-Jinja": 120, "Jinja-Mbale": 120,
  "Mbale-Tororo": 80, "Tororo-Mbale": 80,
  "Kampala-Gulu": 340, "Gulu-Kampala": 340,
  "Kampala-Mbarara": 270, "Mbarara-Kampala": 270,
  "Kampala-Jinja": 80, "Jinja-Kampala": 80,
  "Kampala-Lira": 340, "Lira-Kampala": 340,
  "Mbarara-Kabale": 100, "Kabale-Mbarara": 100,
  "Gulu-Lira": 120, "Lira-Gulu": 120,
  "Kapchorwa-Mbale": 55, "Mbale-Kapchorwa": 55,
};

export function getDistance(origin, destination) {
  const key = `${origin}-${destination}`;
  const reverse = `${destination}-${origin}`;
  return DISTRICT_DISTANCES[key] || DISTRICT_DISTANCES[reverse] || 200;
}

export function getAvailableTransporters(originDistrict, destinationDistrict) {
  return VEHICLES.reduce((acc, v) => {
    const servesRoute = v.areas.some(a =>
      a.toLowerCase().includes((originDistrict || "").toLowerCase()) ||
      (originDistrict || "").toLowerCase().includes(a.toLowerCase())
    ) || v.areas.some(a =>
      a.toLowerCase().includes((destinationDistrict || "").toLowerCase()) ||
      (destinationDistrict || "").toLowerCase().includes(a.toLowerCase())
    );
    if (!servesRoute) return acc;
    const existing = acc.find(t => t.owner === v.owner);
    if (!existing) {
      const dist = getDistance(v.areas[0] || "Kampala", originDistrict || "Kampala");
      const speedKmh = v.type === "Pickup" ? 80 : 60;
      const etaHours = Math.round((dist / speedKmh) * 10) / 10;
      acc.push({
        owner: v.owner,
        tradeId: v.owner === "ssekandi_transport" ? "UG-DTP-TRP-00019" : `UG-DTP-TRP-${v.owner}`,
        name: v.owner === "ssekandi_transport" ? "Ssekandi Transport Services" : v.owner,
        verified: "NIRA",
        vehicles: [v],
        distanceFromPickup: dist,
        etaHours,
        etaLabel: etaHours < 1 ? `${Math.round(etaHours * 60)} mins` : `${etaHours} hrs`,
        rating: 4.8,
        completedJobs: 47,
        status: v.status,
      });
    } else {
      existing.vehicles.push(v);
    }
    return acc;
  }, []);
}
