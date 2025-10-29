const { CosmosClient } = require('@azure/cosmos');

(async () => {
  const endpoint = process.env.COSMOS_ENDPOINT || '';
  const key = process.env.COSMOS_KEY || '';
  console.log('endpoint env:', endpoint);
  console.log('key length:', key ? key.length : 0);
  console.log('date:', new Date().toUTCString());
  if (!endpoint || !key) {
    console.error('Missing COSMOS_ENDPOINT or COSMOS_KEY');
    process.exit(2);
  }
  try {
    const client = new CosmosClient({ endpoint, key });
    const { resources: dbs } = await client.databases.readAll().fetchAll();
    console.log('OK — databases:', dbs.map(d => d.id));
  } catch (err) {
    console.error('ERROR BODY:', err && err.body ? err.body : err);
    console.error('ERROR HEADERS:', err && err.headers ? err.headers : err);
    // print content-location or x-ms-host if present
    if (err && err.headers) {
      console.error('content-location:', err.headers['content-location'] || err.headers['Content-Location']);
      console.error('x-ms-activity-id:', err.headers['x-ms-activity-id']);
      console.error('date header:', err.headers['date']);
    }
    process.exit(1);
  }
})();