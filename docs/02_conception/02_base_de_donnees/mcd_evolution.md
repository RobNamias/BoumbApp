# Modèle Conceptuel de Données (Évolutions)

Ce document contient le code DBML représentant la structure cible de la base de données (V2+), incluant les fonctionnalités sociales et communautaires.

## Code DBML (Pour dbdiagram.io)

```dbml
// --- GESTION UTILISATEURS (Évolutions) ---
Table app_user {
  id uuid [pk]
  email varchar [unique, not null]
  password varchar [not null]
  username varchar [unique, not null]
  roles json [not null]
  preferences jsonb
  
  // Nouveaux champs V2
  bio text
  avatar_path varchar
  social_links jsonb [note: "Ex: [{'network': 'soundcloud', 'url': '...'}]"]
  is_verified boolean
  last_login datetime  
  created_at datetime [not null]
  updated_at datetime
}

// --- GESTION PROJETS (Évolutions) ---
Table app_project {
  id uuid [pk]
  name varchar [not null]
  owner_id uuid [ref: > app_user.id]
  is_public boolean [default: false]
  
  // Nouveaux champs V2 (Social & Découverte)
  cover_path varchar
  tags jsonb [note: "Ex: ['Techno', '128BPM']"]
  fork_from_id uuid [ref: > app_project.id, note: "Self-reference for Remixes"]
  likes_count int [default: 0]
  plays_count int [default: 0]
  description text
  
  created_at datetime [not null]
  updated_at datetime
}

Table app_project_version {
  id uuid [pk]
  project_id uuid [ref: > app_project.id]
  version_number int [not null]
  data jsonb [note: "Full DAW State"]
  created_at datetime [not null]
}

// Nouvelle Table de Jointure (Likes)
Table app_project_like {
  user_id uuid [ref: > app_user.id]
  project_id uuid [ref: > app_project.id]
  created_at datetime
  
  indexes {
    (user_id, project_id) [pk]
  }
}

// --- BIBLIOTHÈQUE SONORE (Évolutions) ---
Table app_sample {
  id uuid [pk]
  name varchar [not null]
  file_path varchar [not null]
  category varchar [not null]
  owner_id uuid [ref: > app_user.id]
  duration float
  
  // Partage
  is_public boolean [default: false]
  downloads_count int [default: 0]
  tags jsonb
  license varchar
  
  created_at datetime
}

Table app_synth_preset {
  id uuid [pk]
  name varchar [not null]
  synth_type varchar [not null]
  parameters jsonb [not null]
  owner_id uuid [ref: > app_user.id]
  
  // Partage
  is_public boolean [default: false]
  downloads_count int [default: 0]
  tags jsonb
  license varchar
}
```
