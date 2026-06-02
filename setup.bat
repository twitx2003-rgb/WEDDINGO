@echo off
if not exist .env.local (
  copy .env.example .env.local
  echo Created .env.local from template
)
echo Opening .env.local in Notepad...
notepad .env.local
