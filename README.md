
```markdown
# Help IA – API d’Assistance pour Personnes en Situation de Handicap

Ce projet est une API Express.js utilisant **Google Generative AI (Gemini 2.5 Pro)** pour fournir une assistance personnalisée aux personnes en situation de handicap. Elle propose plusieurs points d'accès pour communiquer avec différents modèles d'IA afin d'aider, informer, ou guider les utilisateurs.

---

## 🚀 Fonctionnalités

- ✨ Génération de texte avec plusieurs configurations d'IA.
- 🧠 Assistant spécialisé pour guider les utilisateurs en situation de handicap.
- 💬 Réponses contextualisées via prompt personnalisé.
- 📥 API de contact pour stocker les informations de l'utilisateur.

---

## 🧪 Technologies utilisées

- Node.js
- Express.js
- body-parser
- cors
- fs
- mime-types
- @google/generative-ai

---

## 📦 Installation

```bash
git clone https://github.com/votre-utilisateur/help-ia.git
```


---

## 🔑 Clés API

Trois clés API différentes sont utilisées pour gérer les coûts et répartir les appels :

- `apiKeyFree`: pour les appels gratuits à faible configuration
- `apiKeyassistant`: pour un assistant dédié
- `apiKey`: pour des prompts avancés et complexes


---

## 📡 Points d'API

### `GET /api/tfa/:message`

Répond à une question simple via le modèle gratuit.

#### Exemple :
```bash
curl http://localhost:3000/api/tfa/Bonjour
```

---

### `POST /api/assistant`

Assistance spécifique aux personnes en situation de handicap pour apprendre à utiliser l'application.

#### Payload JSON :
```json
{
  "prompt": "Comment naviguer dans l'application ?"
}
```

---





