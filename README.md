# Juventude Navegante

Site estático de página única da Juventude Navegante — Associação, uma escola de atletismo sediada em Alcochete.

O projeto usa apenas HTML, CSS e JavaScript, sem frameworks, dependências de execução ou etapa de compilação. Está escrito em português de Portugal e pode ser publicado diretamente no GitHub Pages.

## Atualizações recentes

- O identificador visual usa o logótipo `images/juna_CORES_1-100.jpg` no cabeçalho e como ícone do site.
- A pista SVG apresenta quatro pistas, cor de tartan castanha, área interior de relva e corredores animados.
- O cartão do hero identifica o próximo evento da agenda pelo seu título.
- A paleta combina castanho/bordô, verde, amarelo, laranja, azul-marinho e tons creme.
- Foram adicionados novos planos de treino e uma galeria de fotografias gerida por dados.
- Os eventos da agenda podem ser filtrados por categoria e têm ligação direta ao Google Maps.
- Os contactos incluem telefone, WhatsApp e mapa do Parque do Valbom.
- Foram publicados links reais do Instagram e Facebook no rodapé.
- O formulário experimental de inscrição está desativado; os planos usam formulários externos e códigos QR.

## Estrutura do projeto

```text
juventudeNavegante/
├── index.html              Estrutura, conteúdos e secções da página
├── styles.css              Paleta, componentes, layout e responsividade
├── script.js               Dados da agenda, galeria e interações
├── gallery-data.js         Lista gerada das fotografias da galeria
├── README.md               Documentação do projeto
├── scripts/
│   └── update-gallery.cjs  Gerador da lista de fotografias
└── images/
    ├── juna_CORES_1-100.jpg
    ├── qr-plano-*.png
    ├── logo-fabisan-ouro2.png
    ├── vertical_cor.png
    ├── Alexandra Barrela.jpg
    ├── freguesia Alcochete.jpg
    └── galeria/
        └── .gitkeep
```

O ficheiro `gallery-data.js` é gerado automaticamente. Não deve ser editado manualmente.

## Publicar

Não é necessário executar um processo de build.

### Abrir localmente

Abra `index.html` diretamente no navegador.

### GitHub Pages

1. Em GitHub, abra **Settings → Pages**.
2. Em **Build and deployment**, selecione **Deploy from a branch**.
3. Escolha o ramo `main` e a pasta `(root)`.

Depois da publicação, os ficheiros são servidos diretamente a partir da raiz do repositório.

## Secções da página

| Secção | Pista | Conteúdo |
|---|---|---|
| `#inicio` | — | Hero, chamadas à ação, estatísticas, cronómetro e pista SVG |
| `#quem-somos` | Pista 01 | História, valores e equipa técnica |
| `#galeria` | Pista 02 | Carrossel de fotografias |
| `#agenda` | Pista 03 | Filtros, eventos e horário semanal |
| `#contactos` | Pista 04 | Telefone, WhatsApp, morada e mapa |
| `#inscricoes` | Pista 05 | Planos, formulários externos, códigos QR e perguntas frequentes |

Os elementos de navegação usam `href="#id"` e o atributo `data-scroll` para fazer scroll suave.

## Sistema de design

### Paleta

| Variável | Cor | Uso |
|---|---|---|
| `--orange` | `#FF6B1A` | Botões e destaques |
| `--orange-deep` | `#E4501A` | Estados de hover e sombras |
| `--peach` | `#FFB27A` | Acentos suaves |
| `--blue` | `#1F4FD1` | Elementos secundários |
| `--navy` | `#0B1F44` | Fundos escuros e texto |
| `--ink` | `#091634` | Texto principal |
| `--cream` | `#FFF6EC` | Fundo da página |
| `--sand` | `#F6E7D4` | Cartões e fundos alternados |
| `--muted` | `#5B6683` | Texto secundário |
| `--bordeaux` | `#7D1F31` | Tartan principal da pista |
| `--bordeaux-deep` | `#5B1221` | Tartan mais escuro |
| `--grass` | `#5DBD67` | Relva da pista |
| `--grass-deep` | `#3F8F4E` | Faixas alternadas da relva |
| `--yellow` | `#F3C85A` | Destaques amarelos |
| `--yellow-deep` | `#D4A73A` | Destaques sobre fundos claros |

### Tipografia

| Variável | Fonte |
|---|---|
| `--display` | Bricolage Grotesque |
| `--body` | Manrope |
| `--mono` | Space Mono |

As fontes são carregadas do Google Fonts. Os navegadores usam fontes de sistema como alternativa.

### Responsividade e animações

- O menu muda para um menu móvel em larguras até `860px`.
- Os cartões e grelhas são empilhados em ecrãs estreitos.
- A pista usa SVG, animação `animateMotion` e perspectiva CSS.
- Elementos com `.reveal` entram em animação quando ficam visíveis.
- Os elementos com `data-count` apresentam contadores animados.
- Os acordeões usam transições de `grid-template-rows`.
- `prefers-reduced-motion` reduz ou desliga as animações.

## Interatividade

O `script.js` usa uma IIFE e está organizado pelas seguintes áreas:

| Área | Comportamento |
|---|---|
| Navegação | Menu móvel, scroll suave, barra de progresso e botão “voltar ao topo” |
| Secções | Reveal dos elementos e contadores |
| Hero | Cronómetro ao vivo |
| Agenda | Dados, filtros, expansão dos eventos e links para o Google Maps |
| Galeria | Carrossel, indicadores, teclado, gesto de deslizar e reprodução automática |
| Planos | Alternância mensal/anual, cartões adicionais e seleção de formulários |
| Acordeões | Painéis ligados por `data-toggle` |
| Feedback | Mensagens temporárias com `data-toast` |

### Atributos `data-*`

| Atributo | Exemplo | Efeito |
|---|---|---|
| `data-scroll` | `<a href="#agenda" data-scroll>` | Scroll suave |
| `data-toggle` | `<button data-toggle="faq1">` | Abre ou fecha `#faq1` |
| `data-count` | `<span data-count="60">0</span>` | Contador animado |
| `data-filter` | `<button data-filter="sub-10">` | Filtra a agenda por escalão |
| `data-month` / `data-year` | `<span data-month="18" data-year="180">23</span>` | Preço mensal/anual |
| `data-choose` | `<button data-choose="Competição">` | Mostra o formulário e QR do plano |
| `data-toast` | `<button data-toast="Mensagem">` | Mostra uma mensagem curta |

## Galeria de fotografias

Coloque as imagens em `images/galeria/`. A pasta pode usar imagens JPG, JPEG e PNG.

A partir da raiz do projeto, execute:

```powershell
node scripts\update-gallery.cjs
```

O comando gera `gallery-data.js` com:

- ordenação numérica pelo nome do ficheiro;
- suporte a extensões em maiúsculas;
- texto alternativo criado a partir do nome;
- uma única leitura direta da pasta, sem subpastas.

Depois, publique a pasta `images/galeria/` e o novo `gallery-data.js`.

Se não houver fotografias, a página mostra «Fotografias em breve». Com uma imagem, os controlos ficam ocultos; com duas ou mais, o carrossel funciona em modo automático.

A galeria tem setas, indicadores, botão Pausar/Reproduzir, teclas de direção, gestos de deslizar e reprodução a cada três segundos. Para interromper o avanço temporariamente, o utilizador pode colocar o rato ou o foco sobre a galeria, ou mudar de separador. Falhas ao carregar imagens são anunciadas e suspendem a reprodução dessa fotografia.

Use nomes descritivos, como `01-treino.jpg` e `02-equipa.jpg`, e otimize as imagens antes de publicar.

## Agenda

Os eventos são declarados no array `events`, em `script.js`:

```js
{
  date: "2026-11-14",
  d: "14",
  m: "nov",
  wd: "sáb",
  categories: ["sub-14", "sub-16"],
  title: "Nome do evento",
  place: "Local completo",
  text: "Descrição apresentada ao expandir o evento.",
}
```

`date` usa o formato `AAAA-MM-DD` e determina o ano usado para calcular o próximo evento. Em provas de vários dias, `d` mostra o intervalo e `wd` os dias da semana. O horário só deve ser incluído quando for conhecido; locais por confirmar usam `A definir`.

Escalões suportados em `categories`:

- `sub-10` — Sub-10;
- `sub-12` — Sub-12;
- `sub-14` — Sub-14;
- `sub-15` — Sub-15;
- `sub-16` — Sub-16;
- `sub-18` — Sub-18;
- `sub-20` — Sub-20;
- `sub-23` — Sub-23;
- `seniores` — Séniores;
- `veteranos` — Veteranos.

Um evento pode pertencer a vários escalões. O botão «Tudo» mostra todos os eventos; cada filtro de escalão mostra os eventos associados a esse escalão.
Eventos sem escalão indicado usam `categories: []` e aparecem apenas em «Tudo».

O botão «Ver localização» cria uma pesquisa no Google Maps a partir do campo `place`. Use uma morada completa ou um local inequívoco.

## Planos

Os três planos principais estão sempre visíveis:

| Plano | Valor inicial |
|---|---|
| Escola de Atletismo (2x) | 23 €/mês |
| Competição | 25 €/mês |
| Sócio Navegante | 12 €/ano |

O botão «Ver mais planos» revela:

| Plano adicional | Valor |
|---|---|
| Escola de Atletismo (1x) | 15 €/mês |
| Prescrição de treino online | 20 €/mês |

A prescrição online utiliza ligação direta ao WhatsApp. O plano Escola de Atletismo (1x) usa o mesmo formulário e código QR do plano regular de Escola de Atletismo.

Ao escolher um plano com inscrição externa, o botão abre um painel com:

- ligação ao formulário Google Forms;
- código QR correspondente;
- título do plano selecionado.

O painel é controlado por `planForms`, em `script.js`. Ao alterar o nome ou adicionar um plano, atualize em conjunto:

1. `data-plan` no cartão;
2. `data-choose` no botão;
3. a entrada correspondente em `planForms`.

O seletor mensal/anual está preparado no código e nos atributos dos preços, mas o respetivo interface está comentado em `index.html`.

## Perguntas frequentes

Os FAQ são acordesões controlados por `data-toggle`.

Para adicionar uma nova pergunta, copie um bloco existente e use o mesmo identificador novo em ambos os sítios:

```html
<button data-toggle="faq4">Nova pergunta?</button>
<div class="collapse" id="faq4"><div><p>Resposta.</p></div></div>
```

## Redes sociais

O rodapé contém ligações reais a Instagram e Facebook.

Novas ligações podem usar:

```html
<a class="social" href="https://instagram.com/conta" target="_blank"
   rel="noopener noreferrer" aria-label="Instagram">IG</a>
```

## Formulário experimental

O formulário `#joinForm`, o painel `#success` e o JavaScript/CSS exclusivos estão comentados no código-fonte. Por isso, não são apresentados nem executados.

O fluxo disponível atualmente é o formulário externo associado ao plano selecionado.

Quando reativado, o formulário experimental valida:

- nome;
- email;
- plano;
- consentimento;
- data da sessão.

Os dados seriam validados apenas no navegador e não são enviados para um servidor. Para receber inscrições reais, o formulário teria de ser ligado a um serviço como Formspree, Google Forms ou a uma API própria.

## Acessibilidade

- Documento definido como `lang="pt-PT"`.
- Navegação principal e secundária identificadas por `aria-label`.
- Botões de menu e acordeões incluem `aria-expanded` e `aria-controls`.
- Elementos do carrossel incluem nomes acessíveis, estado atual e anúncio de mudanças.
- Navegação móvel fechável com a tecla `Esc`.
- Foco visível com `:focus-visible`.
- Estados ativos e mensagens utilizam atributos ARIA.
- Animações adaptadas para `prefers-reduced-motion`.
