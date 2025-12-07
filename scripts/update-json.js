import "dotenv/config";
import fetch from "node-fetch";
import { writeFile } from "fs/promises";

// Airtable configuration
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_ID = "tbl1ucQlM87KGxyjI"; // Use table ID instead of name

// Debug output
console.log("🔍 Environment Check:");
console.log("AIRTABLE_TOKEN:", AIRTABLE_TOKEN ? "✅ Found" : "❌ Missing");
console.log(
  "AIRTABLE_BASE_ID:",
  AIRTABLE_BASE_ID ? `✅ ${AIRTABLE_BASE_ID}` : "❌ Missing"
);
console.log("AIRTABLE_TABLE_ID:", AIRTABLE_TABLE_ID);
console.log("");

async function fetchAvailabilityData() {
  try {
    console.log("📚 Fetching availability data from Airtable...");

    let allRecords = [];
    let offset = null;

    do {
      let apiUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`;

      if (offset) {
        apiUrl += `?offset=${offset}`;
      }

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Airtable Error Response:", errorText);
        throw new Error(`Airtable API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(`📦 Fetched ${data.records.length} records`);

      allRecords = allRecords.concat(data.records);
      offset = data.offset;
    } while (offset);

    // Write to static directory
    await writeFile(
      "./static/availability.json",
      JSON.stringify(allRecords, null, 2)
    );
    console.log(
      `✅ Exported ${allRecords.length} availability records to static/availability.json`
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

fetchAvailabilityData();
