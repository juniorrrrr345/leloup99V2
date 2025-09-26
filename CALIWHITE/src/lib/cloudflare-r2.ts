// Configuration R2 hardcodée pour CALIWHITE
export const R2_CONFIG = {
  accountId: '7979421604bd07b3bd34d3ed96222512',
  accessKeyId: '82WsPNjX-j0UqZIGAny8b0uEehcHd0X3zMKNIKIN',
  secretAccessKey: '28230e200a3b71e5374e569f8a297eba9aa3fe2e1097fdf26e5d9e340ded709d',
  bucketName: 'boutique-images',
  publicUrl: 'https://pub-b38679a01a274648827751df94818418.r2.dev'
};

export async function uploadToR2(file: File, key: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${R2_CONFIG.accountId}/r2/buckets/${R2_CONFIG.bucketName}/objects/${key}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ijkVhaXCw6LSddIMIMxwPL5CDAWznxip5x9I1bNW`,
      },
      body: file,
    }
  );

  if (!response.ok) {
    throw new Error(`R2 Upload Error: ${response.statusText}`);
  }

  return `${R2_CONFIG.publicUrl}/${key}`;
}