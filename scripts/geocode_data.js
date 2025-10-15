// scripts/geocode_data.js
// Usage: node scripts/geocode_data.js
// Reads ../init/data.js, geocodes each item using Nominatim (OpenStreetMap),
// and writes ../init/data_with_coords.js with the same items but
// `location` replaced by a GeoJSON Point: { type: 'Point', coordinates: [lon, lat], place }

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'init', 'data.js');
const outPath = path.join(__dirname, '..', 'init', 'data_with_coords.js');

// Load data.js which uses module.exports = data;
const rawData = require(dataPath);

async function fetchJson(url, opts = {}) {
  // Use global fetch if available (Node 18+), otherwise try node-fetch
  if (typeof fetch !== 'undefined') {
    const res = await fetch(url, opts);
    return res.json();
  } else {
    const nodeFetch = require('node-fetch');
    const res = await nodeFetch(url, opts);
    return res.json();
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  console.log(`Loaded ${rawData.length} entries from ${dataPath}`);
  const out = [];
  for (let i = 0; i < rawData.length; i++) {
    const item = Object.assign({}, rawData[i]);
    const placeQuery = item.location || '';
    const country = item.country || '';
    const q = `${placeQuery}, ${country}`.trim();
    console.log(`[${i + 1}/${rawData.length}] Geocoding: ${q}`);

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`;
      const json = await fetchJson(url, {
        headers: {
          'User-Agent': 'Backend_Project_MigrationScript/1.0 (youremail@example.com)',
          'Accept-Language': 'en'
        }
      });

      if (Array.isArray(json) && json.length > 0) {
        const top = json[0];
        const lat = Number(top.lat);
        const lon = Number(top.lon);
        if (Number.isFinite(lat) && Number.isFinite(lon)) {
          item.location = {
            type: 'Point',
            coordinates: [lon, lat],
            place: placeQuery
          };
          console.log(`  -> ${lat}, ${lon}`);
        } else {
          console.warn('  -> invalid lat/lon, leaving original location string');
          item.location = { type: 'Point', coordinates: [], place: placeQuery };
        }
      } else {
        console.warn('  -> no results, leaving original location string');
        item.location = { type: 'Point', coordinates: [], place: placeQuery };
      }
    } catch (err) {
      console.error('  -> error fetching geocode:', err.message);
      item.location = { type: 'Point', coordinates: [], place: placeQuery };
    }

    out.push(item);

    // Respect Nominatim usage policy: no more than 1 request per second
    if (i < rawData.length - 1) await sleep(1100);
  }

  const fileContent = `// Auto-generated from init/data.js with geocoded coordinates
// Each entry's location is now a GeoJSON Point: { type: 'Point', coordinates: [lon, lat], place }

module.exports = ${JSON.stringify(out, null, 2)};
`;

  fs.writeFileSync(outPath, fileContent, 'utf8');
  console.log(`Wrote ${out.length} entries to ${outPath}`);
})();
