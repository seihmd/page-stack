module.exports = {
  "env": {
    "browser": true,
    "node": true
  },
  "extends": [
    "airbnb-base",
    "prettier"
  ],
  "plugins": ["prettier"],
  "parserOptions": {
    "parser": "babel-eslint",
    "sourceType": "module",
    "allowImportExportEverywhere": true,
    "codeFrame": false
  },
  "rules": {
    "no-unused-vars": ["error", {
      "args": "none"
    }],
    "prettier/prettier": ["error", {
      "singleQuote": true
    }]
  }
}
