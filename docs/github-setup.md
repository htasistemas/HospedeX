# Publicacao no GitHub

Repositorio remoto:

```bash
https://github.com/htasistemas/HospedeX
```

## Primeiro envio

Execute na raiz do projeto:

```bash
git status
git add .
git commit -m "feat: bootstrap HospedeX Network"
git branch -M main
git push -u origin main
```

Se o Git pedir login, use o GitHub CLI, Git Credential Manager ou um Personal Access Token com permissao de escrita no repositorio.

## Comandos de verificacao local

```bash
npm run build
npm run test
```

## GitHub Actions configurado

- `.github/workflows/ci.yml`: roda testes e build em `push`, `pull_request` e execucao manual.
- `.github/workflows/manual-verify-and-push.yml`: workflow manual que testa, compila e commita alteracoes geradas dentro do proprio GitHub Actions.
- `.github/dependabot.yml`: abre PRs semanais para dependencias npm e GitHub Actions.

## Observacao importante

O GitHub Actions nao consegue fazer commit dos arquivos que estao somente na sua maquina. O primeiro `git add`, `git commit` e `git push` precisa ser feito localmente uma vez. Depois disso, os workflows passam a rodar automaticamente no GitHub.
