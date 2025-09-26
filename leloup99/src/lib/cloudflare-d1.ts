export const CLOUDFLARE_CONFIG = {
  accountId: '7979421604bd07b3bd34d3ed96222512',
  databaseId: '91056561-162d-47a7-9057-5a30c2834227',
  apiToken: 'ijkVhaXCw6LSddIMIMxwPL5CDAWznxip5x9I1bNW'
};

export async function executeSqlOnD1(sql: string, params: unknown[] = []) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_CONFIG.accountId}/d1/database/${CLOUDFLARE_CONFIG.databaseId}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_CONFIG.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    }
  );

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(`D1 Error: ${JSON.stringify(data.errors)}`);
  }
  
  return data;
}