# Salve Uma

Jogo de música: a cada rodada aparece um ano e 8 músicas lançadas nele, uma por vez, cada uma com a capa do álbum e tocando um trechinho. Um botão de play na capa continua a música ou pausa. Você salva uma e vê quantos por cento das pessoas salvaram cada música.

As categorias são divididas em três grupos:

- **Só Brasil**: Todo o Brasil, Sertanejo, Rap & Funk, MPB & Pop BR, Pagode & Samba, Rock Nacional
- **Só gringa**: Toda a gringa, Pop, Rock, Hip-Hop & R&B, Eletrônica, Latino
- **Misturado**: Brasil x Gringa, Pop BR x Pop gringo, Rock BR x Rock gringo, Rap BR x Rap gringo

## Rodar localmente

```bash
npm install
npm start
# abra http://localhost:3000
```

Sem `DATABASE_URL`, os votos ficam em `data/votes.json`.

## Deploy no Railway

1. Suba esta pasta para um repositório no GitHub.
2. No Railway: **New Project → Deploy from GitHub repo** e escolha o repositório.
3. No mesmo projeto: **New → Database → Add PostgreSQL**.
4. No serviço do app, abra **Variables** e adicione `DATABASE_URL` como referência à variável do Postgres: `${{Postgres.DATABASE_URL}}`.
5. Em **Settings → Networking**, clique em **Generate Domain** para ter o link público.

O Railway detecta o Node sozinho e roda `npm start`. A tabela `votes` é criada automaticamente na primeira inicialização. Para conferir se o app está usando o Postgres, abra `/health`.

## Editar as músicas

Tudo fica em `shared/game.js`, uma música por linha:

```
ano|origem|gênero|artista|título
2011|b|sert|Michel Teló|Ai Se Eu Te Pego
```

- `origem`: `b` = Brasil, `g` = gringa
- gêneros BR: `sert`, `funk`, `pag`, `mpb`, `rocknac`, `rapnac`, `popbr`
- gêneros gringos: `pop`, `rock`, `hip`, `ele`, `lat`

O jogo vai de 1980 em diante. A ideia é que cada ano tenha os 8 maiores hits do gênero (paradas de fim de ano quando existem; nas décadas sem parada, os sucessos mais lembrados). Cada categoria tem 8 músicas em todos os anos do seu intervalo, sem pular ano. Nas categorias juntadas a divisão é fixa: Rap & Funk = 4 + 4 (1992–1993 só rap); MPB & Pop BR = 4 + 4 (8 de MPB até 1982, 8 de Pop BR em 2022–2023). O ano de cada música é o ano em que ela fez sucesso. Cada rodada mostra até 8 músicas, revezando entre os gêneros da categoria; nas misturadas são 4 brasileiras e 4 gringas. Um ano só aparece como rodada quando a categoria tem pelo menos 2 músicas naquele ano. As opções de cada rodada são sorteadas de forma fixa, então todo mundo vê as mesmas e as porcentagens são comparáveis.

Atenção: incluir ou remover músicas de um ano pode mudar as opções daquela rodada. Votos em músicas que saíram da rodada deixam de contar.

## Capas e trechos

As capas e os trechos de 30 s vêm da API pública do Deezer. O arquivo `public/covers.js` guarda, para cada música, o hash da capa e o id da faixa no Deezer. O link do trecho expira depois de algumas horas, então ele é pedido na hora. Quem pede é o próprio navegador de quem joga (JSONP direto no Deezer), porque o Deezer libera cada faixa por país: o servidor no Railway fica nos EUA, onde muita música brasileira não está liberada. Se o Deezer não responder, o navegador usa a rota `/api/preview` do servidor.

A busca do script prefere a gravação que fez sucesso: descarta remix, mix, medley, karaokê, cover e artistas "imitadores", aceita "Radio Edit"/"Single Version", e no sertanejo e no pagode aceita a versão ao vivo quando ela é a mais ouvida. Depois de incluir músicas, rode:

```bash
node scripts/fetch-covers.js        # busca só as músicas sem capa
node scripts/fetch-covers.js --all  # busca tudo de novo
```

O script lista no final as músicas que não encontrou; elas aparecem com as iniciais do artista no lugar da capa.

## API

| Rota | O que faz |
|---|---|
| `GET /api/results?cat=sertanejo` | votos por rodada e por música da categoria |
| `POST /api/vote` `{voterId, roundId, songId}` | registra ou troca o voto e devolve a contagem da rodada |
| `GET /api/top[?cat=...]` | 10 músicas mais salvas |
| `GET /api/preview?ids=a,b,...` | link do trecho de 30 s de até 8 músicas (`null` quando não tem) |
| `GET /health` | status e tipo de armazenamento |

Cada navegador recebe um id anônimo guardado no `localStorage`, com 1 voto por rodada. Há um limite de 90 votos por minuto por IP. Isso segura spam simples, mas não impede alguém determinado de votar várias vezes limpando o navegador. Se precisar de mais segurança, adicione login ou captcha.
