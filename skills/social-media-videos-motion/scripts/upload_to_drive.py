#!/usr/bin/env python3
"""Upload large files (zips, videos) straight to Google Drive with resumable uploads.

The Google Drive connector can create folders, Docs and Sheets and share them, but it cannot carry
big binary files, so zips go up through the Drive API with the user's own OAuth credentials.

One-time setup (the user does this, never paste credentials into chat):
  1. In Google Cloud Console create a project, enable the Google Drive API, set the OAuth consent screen
     to External and publish it (In production), and create an OAuth client of type "Web application" with
     https://developers.google.com/oauthplayground as an authorised redirect URI.
  2. In the OAuth 2.0 Playground, tick "Use your own OAuth credentials", authorise the scope
     https://www.googleapis.com/auth/drive.file and exchange the code for a refresh token.
  3. Store GDRIVE_CLIENT_ID, GDRIVE_CLIENT_SECRET and GDRIVE_REFRESH_TOKEN as environment secrets
     (Claude Code on the web: environment settings, then Edit). New sessions pick them up.
The drive.file scope only lets this script see files and folders it created itself.

Usage:
  python3 upload_to_drive.py FILE [FILE ...] --folder "Explorazone videos winter 2026-27" [--folder-id ID]
  python3 upload_to_drive.py --check            confirm the credentials work, upload nothing
Prints the Drive link of each file and of the folder.
"""
import argparse
import json
import os
import sys
import time
from pathlib import Path

import requests

API = 'https://www.googleapis.com/drive/v3'
UPLOAD = 'https://www.googleapis.com/upload/drive/v3/files'
CHUNK = 32 * 1024 * 1024  # must be a multiple of 256 KiB
VERIFY = os.environ.get('REQUESTS_CA_BUNDLE') or os.environ.get('SSL_CERT_FILE') or (
    '/root/.ccr/ca-bundle.crt' if Path('/root/.ccr/ca-bundle.crt').exists() else True)


def token():
    need = ['GDRIVE_CLIENT_ID', 'GDRIVE_CLIENT_SECRET', 'GDRIVE_REFRESH_TOKEN']
    missing = [k for k in need if not os.environ.get(k)]
    if missing:
        sys.exit(f'Drive upload is not set up: missing {", ".join(missing)}. See the setup notes at the top of this script.')
    r = requests.post('https://oauth2.googleapis.com/token', verify=VERIFY, timeout=60, data={
        'client_id': os.environ['GDRIVE_CLIENT_ID'], 'client_secret': os.environ['GDRIVE_CLIENT_SECRET'],
        'refresh_token': os.environ['GDRIVE_REFRESH_TOKEN'], 'grant_type': 'refresh_token'})
    if r.status_code != 200:
        sys.exit(f'Google refused the credentials ({r.status_code}): {r.json().get("error_description", r.text[:200])}')
    return r.json()['access_token']


def folder(h, name, parent=None):
    q = f"name = '{name.replace(chr(39), chr(92) + chr(39))}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
    r = requests.get(f'{API}/files', headers=h, verify=VERIFY, timeout=60, params={'q': q, 'fields': 'files(id,webViewLink)', 'spaces': 'drive'})
    r.raise_for_status()
    if r.json()['files']:
        return r.json()['files'][0]
    body = {'name': name, 'mimeType': 'application/vnd.google-apps.folder', **({'parents': [parent]} if parent else {})}
    r = requests.post(f'{API}/files', headers=h, verify=VERIFY, timeout=60, params={'fields': 'id,webViewLink'}, json=body)
    r.raise_for_status()
    return r.json()


def upload(h, path, parent):
    size = path.stat().st_size
    mime = 'application/zip' if path.suffix == '.zip' else 'video/mp4' if path.suffix == '.mp4' else 'application/octet-stream'
    r = requests.post(UPLOAD, headers={**h, 'X-Upload-Content-Type': mime, 'X-Upload-Content-Length': str(size)}, verify=VERIFY, timeout=60,
                      params={'uploadType': 'resumable', 'fields': 'id,name,webViewLink'}, json={'name': path.name, 'parents': [parent]})
    r.raise_for_status()
    session, sent, tries = r.headers['Location'], 0, 0
    with open(path, 'rb') as fh:
        while sent < size:
            fh.seek(sent)
            chunk = fh.read(CHUNK)
            end = sent + len(chunk) - 1
            try:
                r = requests.put(session, data=chunk, verify=VERIFY, timeout=600,
                                 headers={'Content-Length': str(len(chunk)), 'Content-Range': f'bytes {sent}-{end}/{size}'})
            except requests.RequestException:
                r = None
            if r is not None and r.status_code in (200, 201):
                return r.json()
            if r is not None and r.status_code == 308:
                rng = r.headers.get('Range')
                sent = int(rng.split('-')[1]) + 1 if rng else 0
                tries = 0
                print(f'  {path.name}: {sent / size:.0%}', flush=True)
                continue
            tries += 1  # network blip or 5xx: ask Drive how much it has, then carry on
            if tries > 6:
                sys.exit(f'upload of {path.name} kept failing ({r.status_code if r is not None else "network"})')
            time.sleep(2 ** tries)
            s = requests.put(session, headers={'Content-Range': f'bytes */{size}'}, verify=VERIFY, timeout=60)
            if s.status_code in (200, 201):
                return s.json()
            rng = s.headers.get('Range')
            sent = int(rng.split('-')[1]) + 1 if rng else 0
    raise RuntimeError('upload ended without a response')


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('files', nargs='*')
    ap.add_argument('--folder', default='Social media videos')
    ap.add_argument('--folder-id', help='upload into this folder instead (must have been created by this script)')
    ap.add_argument('--check', action='store_true')
    a = ap.parse_args()
    h = {'Authorization': f'Bearer {token()}'}
    if a.check:
        r = requests.get(f'{API}/about', headers=h, verify=VERIFY, timeout=60, params={'fields': 'user(emailAddress)'})
        print('Drive credentials work for', r.json().get('user', {}).get('emailAddress', 'this account'))
        return
    if not a.files:
        sys.exit('nothing to upload')
    dest = {'id': a.folder_id, 'webViewLink': f'https://drive.google.com/drive/folders/{a.folder_id}'} if a.folder_id else folder(h, a.folder)
    out = []
    for f in map(Path, a.files):
        meta = upload(h, f, dest['id'])
        out.append(meta)
        print(f"uploaded {meta['name']}: {meta.get('webViewLink')}")
    print(f"folder: {dest.get('webViewLink')}")
    Path('drive_upload.json').write_text(json.dumps({'folder': dest, 'files': out}, indent=1))


if __name__ == '__main__':
    main()
