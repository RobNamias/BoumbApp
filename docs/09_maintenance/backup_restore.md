# Sauvegarde et Restauration BDD

## 1. Système de Sauvegarde Automatique

Le projet utilise un conteneur dédié (`boumbapp_db_backup`) pour gérer les sauvegardes de la base de données PostgreSQL.

*   **Image** : `prodrigestivill/postgres-backup-local`
*   **Emplacement** : Dossier `./backups` à la racine du projet.
*   **Fréquence** :
    *   Au démarrage des conteneurs (`BACKUP_ON_START=TRUE`).
    *   Tous les jours à minuit (`@daily`).
*   **Rétention** :
    *   Derniers 7 jours.
    *   Dernières 4 semaines.

## 2. Restauration d'une Sauvegarde

Pour restaurer la base de données à partir d'un fichier `.sql.gz` présent dans le dossier `backups`, suivez cette procédure :

1.  **Identifier le fichier** : Notez le nom du fichier à restaurer (ex: `backup_2025-01-05.sql.gz`).
2.  **Arrêter les services dépendants** (optionnel mais recommandé) :
    ```bash
    docker stop boumbapp_backend
    ```
3.  **Lancer la restauration** via le conteneur de backup :
    ```bash
    docker exec boumbapp_db_backup /restore.sh /backups/backup_YYYY-MM-DD.sql.gz
    ```
    *(Remplacez `backup_YYYY-MM-DD.sql.gz` par le nom réel du fichier)*

4.  **Redémarrer le backend** :
    ```bash
    docker start boumbapp_backend
    ```

## 3. Sauvegarde Manuelle Déclenchée

Pour forcer une sauvegarde immédiate sans attendre le planning :

```bash
docker exec boumbapp_db_backup /backup.sh
```

Le fichier sera créé instantanément dans le dossier `backups`.
