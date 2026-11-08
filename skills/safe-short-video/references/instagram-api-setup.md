# Instagram API setup (optional)

Only needed if you want Claude to publish Reels for you. Posting by hand in the Instagram app or Meta Business Suite needs none of this, and is always fine.

Meta changes its screens often. If a step below does not match what you see, follow Meta's current documentation for "Instagram Platform, Content Publishing" and keep the same principles: your own app, the fewest permissions, a token kept in a password manager.

## What you need

- An Instagram **Business or Creator** account for the business, linked to its Facebook Page.
- A Meta developer app **owned by your own Meta Business portfolio**, using **Facebook Login for Business**. Meta only allows Reel uploads from local files (resumable upload) for apps that use Facebook Login for Business.
- Permissions: `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`. Nothing else.

While the app stays in development mode, it can publish to accounts whose owners have a role on the app, which is all you need for your own businesses. App Review is only needed to post for other people.

## Getting a token safely

Preferred: a **system user** in Meta Business Suite (Business settings > Users > System users), given access to only the one app and the one Instagram account, with a token limited to the four permissions above. This token does not expire, so treat it like a password.

Alternative: a long-lived user token (lasts about 60 days) from the Graph API Explorer, exchanged for a long-lived one.

Store the token in your password manager. Never paste it into chat, email, a spreadsheet, the storyboard or any file in a repository.

## Finding the Instagram user ID

In the Graph API Explorer, with your token selected, run:

```
GET /me/accounts?fields=name,instagram_business_account
```

The `instagram_business_account.id` for the right Page is your `IG_USER_ID` (a long number).

## Setting them for one terminal session

macOS or Linux:

```bash
export IG_USER_ID='17841400000000000'
read -rs IG_ACCESS_TOKEN && export IG_ACCESS_TOKEN   # paste, then press Enter; nothing is shown
```

Windows PowerShell:

```powershell
$env:IG_USER_ID = '17841400000000000'
$env:IG_ACCESS_TOKEN = Read-Host -MaskInput 'Token'
```

They disappear when the terminal closes. Optional: `IG_GRAPH_API_VERSION` (default `v26.0`).

## How the publisher protects you

- Dry run unless you pass `--confirm-publish` with the approval code of the exact file you reviewed.
- Talks only to `graph.facebook.com` and `rupload.facebook.com`.
- Sends the token in a request header, never in a URL, and never prints it.
- Writes `final.published.json` after posting and refuses to post the same file again.
- Meta allows a limited number of API-published posts per account per 24 hours. If you hit it, wait.

## If a token leaks

In Meta Business Suite, revoke the system user token (or remove the app's access in Facebook settings > Business integrations), then generate a new one.
