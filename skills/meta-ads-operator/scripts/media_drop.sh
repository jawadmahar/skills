#!/usr/bin/env bash
# Temporary public media link for Meta uploads, on a throwaway branch of a GitHub repository.
#
#   bash media_drop.sh push   https://github.com/<owner>/<repo> media-drop-<campaign> FILE...
#   bash media_drop.sh delete https://github.com/<owner>/<repo> media-drop-<campaign>
#
# push makes an orphan branch holding only FILE..., pushes it and prints one raw URL per file
# for ads_creative_upload_media. Only with the director's OK: the files are public while the
# branch exists. delete removes the branch once Meta has the files; if this session may not
# delete branches it prints the page where the director can delete it with one click.
set -euo pipefail

cmd="${1:-}"; repo="${2:-}"; branch="${3:-}"
if [[ -z "$cmd" || -z "$repo" || -z "$branch" ]]; then
  sed -n '2,10p' "$0"; exit 2
fi
slug="${repo#https://github.com/}"; slug="${slug%.git}"; slug="${slug%/}"
case "$branch" in main|master|ccr-*) echo "media_drop: refusing to use branch '$branch'"; exit 2;; esac

push_retry() {
  local n=0
  until git "$@"; do
    n=$((n + 1)); [[ $n -ge 4 ]] && return 1
    sleep $((2 ** n))
  done
}

if [[ "$cmd" == push ]]; then
  shift 3
  [[ $# -gt 0 ]] || { echo "media_drop: no files given"; exit 2; }
  work="$(mktemp -d)"
  git -C "$work" init -q
  git -C "$work" checkout -q --orphan "$branch"
  git -C "$work" config user.name >/dev/null 2>&1 || git -C "$work" config user.name "Media drop"
  git -C "$work" config user.email >/dev/null 2>&1 || git -C "$work" config user.email "media-drop@localhost"
  for f in "$@"; do cp "$f" "$work/"; done
  git -C "$work" add -A
  git -C "$work" commit -q -m "Temporary media for Meta upload. Delete this branch after upload."
  git -C "$work" remote add origin "$repo"
  push_retry -C "$work" push -q -u origin "$branch"
  for f in "$@"; do
    name="$(basename "$f")"
    printf 'https://raw.githubusercontent.com/%s/%s/%s\n' "$slug" "$branch" \
      "$(python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1]))' "$name")"
  done
  rm -rf "$work"
elif [[ "$cmd" == delete ]]; then
  if git push -q "$repo" --delete "$branch" 2>/dev/null; then
    echo "deleted $branch"
  else
    echo "media_drop: this session may not delete branches. Ask the director to delete '$branch' at:"
    echo "  https://github.com/$slug/branches"
    exit 1
  fi
else
  echo "media_drop: unknown command '$cmd' (push or delete)"; exit 2
fi
