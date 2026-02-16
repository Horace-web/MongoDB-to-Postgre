# MongoDB vers PostgreSQL - Migration Tool

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![TypeORM](https://img.shields.io/badge/TypeORM-0.3.x-orange)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6%2B-brightgreen)

Outil de migration automatisée de MongoDB vers PostgreSQL avec Node.js et TypeORM. Ce projet permet de migrer des données de MongoDB vers PostgreSQL tout en préservant les relations complexes entre les collections.

## 📋 Table des matières
- [Fonctionnalités](#-fonctionnalités)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Arborescence du projet](#-arborescence-du-projet)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Exemple de données](#-exemple-de-données)
- [Dépannage](#-dépannage)
- [Personnalisation](#-personnalisation)
- [Alternatives](#-alternatives)
- [Licence](#-licence)

## ✨ Fonctionnalités

- **Migration automatisée** : Transfert des données de MongoDB vers PostgreSQL
- **Mapping intelligent** : Conversion automatique des types (ObjectId → UUID, dates, etc.)
- **Préservation des relations** : Gestion des clés étrangères et des références entre collections
- **Support des types complexes** : 
  - Documents imbriqués → JSONB
  - Tableaux → Arrays PostgreSQL
  - Relations One-to-Many et Many-to-One
- **Validation des données** : Vérification de l'intégrité après migration
- **Logs détaillés** : Suivi en temps réel de la progression
- **Gestion d'erreurs** : Rapport d'erreurs avec export JSON

## 📦 Prérequis

- **Node.js** 18 ou supérieur
- **PostgreSQL** 15 ou supérieur
- **MongoDB** 6 ou supérieur
- **npm** ou **yarn**

## 🚀 Installation

```bash
# Cloner le projet
git clone <votre-repo>
cd mongodb-to-postgres-migration

# Installer les dépendances
npm install

# Compiler TypeScript
npx tsc
