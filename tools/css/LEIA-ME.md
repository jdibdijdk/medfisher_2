# CSS do MedFisher

O site **não** carrega mais o Tailwind pelo navegador (CDN). O CSS é gerado antes e fica no arquivo
`tailwind.css` da raiz, que o `index.html` carrega com `<link>`.

Por que: o Tailwind via CDN reprocessa o documento inteiro a cada mudança na tela (abrir uma janela,
trocar de página…). Como o `index.html` tem mais de 1 MB de JavaScript, isso causava travadas (quase 1 s de
CPU por mudança no computador, bem mais no celular).

## Quando regerar

Sempre que você **adicionar ou trocar classes do Tailwind** no `index.html` (ex.: `rounded-2xl`, `sm:grid-cols-3`)
ou **mexer em `entrada.css`** (estilos `.card`, `.btn`, `.input`, animações…). Se esquecer, a classe nova
simplesmente não terá estilo.

```bash
./tools/css/construir.sh      # instala o tailwindcss na primeira vez e gera ../../tailwind.css
```

Depois faça o commit do `index.html` **junto com** o `tailwind.css` atualizado.

Observações:
- Classes montadas por concatenação de texto (`"bg-" + cor`) não são encontradas; escreva a classe inteira.
- A configuração (cores `brand`, fonte, modo escuro por classe) está em `tailwind.config.js`.
