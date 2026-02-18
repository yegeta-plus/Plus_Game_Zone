
const VAULT_FILENAME = 'plus_zone_vault.json';
const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3/files';
const UPLOAD_API_BASE = 'https://www.googleapis.com/upload/drive/v3/files';

export interface DriveAuthResponse {
  access_token: string;
}

export const requestDriveAccess = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    const client = google.accounts.oauth2.initTokenClient({
      client_id: process.env.GOOGLE_CLIENT_ID || '', // Assumed from environment
      scope: 'https://www.googleapis.com/auth/drive.file',
      callback: (response: DriveAuthResponse) => {
        if (response.access_token) {
          resolve(response.access_token);
        } else {
          reject('Access denied');
        }
      },
    });
    client.requestAccessToken();
  });
};

export const findVaultFile = async (token: string): Promise<string | null> => {
  const q = encodeURIComponent(`name = '${VAULT_FILENAME}' and trashed = false`);
  const response = await fetch(`${DRIVE_API_BASE}?q=${q}&fields=files(id)`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  return data.files?.length > 0 ? data.files[0].id : null;
};

export const downloadVault = async (token: string, fileId: string): Promise<any> => {
  const response = await fetch(`${DRIVE_API_BASE}/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return await response.json();
};

export const uploadVault = async (token: string, data: any, existingFileId?: string | null): Promise<string> => {
  const metadata = {
    name: VAULT_FILENAME,
    mimeType: 'application/json',
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([JSON.stringify(data)], { type: 'application/json' }));

  const url = existingFileId 
    ? `${UPLOAD_API_BASE}/${existingFileId}?uploadType=multipart` 
    : `${UPLOAD_API_BASE}?uploadType=multipart`;
  
  const method = existingFileId ? 'PATCH' : 'POST';

  const response = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body: form
  });

  const result = await response.json();
  return result.id;
};
