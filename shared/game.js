/*
 * Salva Uma — dados e regras do jogo.
 * Este arquivo roda no navegador (window.Game) e no servidor (require).
 *
 * COMO EDITAR A LISTA: uma música por linha, no formato
 *   ano|origem|gênero|artista|título
 * origem: b = Brasil, g = gringa
 * gêneros BR:     sert, funk, pag, mpb, rocknac, rapnac, popbr
 * gêneros gringa: pop, rock, hip, ele, lat
 * Um ano só vira rodada quando tem pelo menos 2 músicas na categoria.
 * Cada rodada mostra até 8 músicas (nas categorias de um gênero só, exatamente 8),
 * sempre as mesmas para todo mundo.
 */
(function (root) {
  const SONGS_RAW = `
1977|b|sert|Milionário & José Rico|Estrada da Vida
1977|b|sert|Milionário & José Rico|Bebida Não Cura Paixão
1977|b|sert|Milionário & José Rico|Migalhas de Amor
1977|b|sert|Milionário & José Rico|Doce Ilusão
1977|b|sert|Milionário & José Rico|Destino Cruel
1977|b|sert|Chitãozinho & Xororó|Querida
1977|b|sert|Trio Parada Dura|Boi Tufão
1977|b|sert|Trio Parada Dura|Casa da Avenida
1978|b|sert|Trio Parada Dura|Homem de Pedra
1978|b|sert|Trio Parada Dura|Cruz Pesada
1978|b|sert|Trio Parada Dura|Espinho na Cama
1978|b|sert|Trio Parada Dura|O Carro e a Faculdade
1978|b|sert|Matogrosso & Mathias|Pedaço de Minha Vida
1978|b|sert|Milionário & José Rico|Rei Sem Trono
1978|b|sert|Renato Teixeira|Romaria
1978|b|sert|Duduca & Dalvan|Pirâmide do Amor
1979|b|sert|Chitãozinho & Xororó|60 Dias Apaixonado
1979|b|sert|Chitãozinho & Xororó|Cama de Casal
1979|b|sert|Chitãozinho & Xororó|Tudo Está Desarrumado
1979|b|sert|Chitãozinho & Xororó|Nosso Filho Com Quem Vai Ficar
1979|b|sert|Chitãozinho & Xororó|Tarde Demais
1979|b|sert|Milionário & José Rico|Realidade
1979|b|sert|Duduca & Dalvan|Quem Sou Eu
1979|b|sert|Tião Carreiro & Pardinho|Golpe de Mestre
1980|b|sert|Trio Parada Dura|Blusa Vermelha
1980|b|sert|Trio Parada Dura|Sincero Amor
1980|b|sert|Trio Parada Dura|Avião das Nove
1980|b|sert|João Mineiro & Marciano|Esta Noite Como Lembrança
1980|b|sert|Pena Branca & Xavantinho|Cálix Bento
1980|b|sert|Pena Branca & Xavantinho|Velha Morada
1980|b|sert|Milionário & José Rico|Amor Dividido
1980|b|sert|Chitãozinho & Xororó|Ninguém Quis Dormir
1981|b|sert|Chitãozinho & Xororó|Amante Amada
1981|b|sert|Chitãozinho & Xororó|Aguenta Coração
1981|b|sert|Chitãozinho & Xororó|Vida e Saudade
1981|b|sert|Trio Parada Dura|Último Adeus
1981|b|sert|Trio Parada Dura|Fuscão Preto
1981|b|sert|Trio Parada Dura|Arapuca
1981|b|sert|Milionário & José Rico|Escravo do Amor
1981|b|sert|Milionário & José Rico|Oração do Sertanejo
1982|b|sert|Chitãozinho & Xororó|Fio de Cabelo
1982|b|sert|Trio Parada Dura|Luz da Minha Vida
1982|b|sert|Trio Parada Dura|Bicho Bom É Mulher
1982|b|sert|Milionário & José Rico|Tribunal do Amor
1982|b|sert|Milionário & José Rico|Triste Lição
1982|b|sert|Milionário & José Rico|Mãe de Leite
1982|b|sert|Almir Sater|Trem do Pantanal
1982|b|sert|Chitãozinho & Xororó|Somos Apaixonados
1983|b|sert|Trio Parada Dura|Alto Astral
1983|b|sert|Trio Parada Dura|Telefone Mudo
1983|b|sert|Trio Parada Dura|Folia de Reis
1983|b|sert|Trio Parada Dura|Panela Velha
1983|b|sert|João Mineiro & Marciano|Viciado em Você
1983|b|sert|João Mineiro & Marciano|As Paredes Azuis
1983|b|sert|Chitãozinho & Xororó|Ela Fez Minha Cabeça
1983|b|sert|Chitãozinho & Xororó|Obras de Poeta (Os Passarinhos)
1984|b|sert|Chitãozinho & Xororó|Amante
1984|b|sert|Chitãozinho & Xororó|Amor Proibido
1984|b|sert|Trio Parada Dura|Barco de Papel
1984|b|sert|Trio Parada Dura|Biquíni Bordô
1984|b|sert|Trio Parada Dura|O Doutor e a Empregada
1984|b|sert|Matogrosso & Mathias|24 Horas de Amor
1984|b|sert|Duduca & Dalvan|Espinheira
1984|b|sert|Chrystian & Ralf|Noite de Tortura
1985|b|sert|Chitãozinho & Xororó|Matriz ou Filial
1985|b|sert|Chitãozinho & Xororó|Ela Chora, Chora
1985|b|sert|Chitãozinho & Xororó|Pago Dobrado
1985|b|sert|Trio Parada Dura|As Andorinhas
1985|b|sert|Trio Parada Dura|Passa Lá
1985|b|sert|Matogrosso & Mathias|De Igual pra Igual
1985|b|sert|João Paulo & Daniel|Desejo de Amar
1985|b|sert|Chrystian & Ralf|Camisa Manchada
1986|b|sert|Chitãozinho & Xororó|Coração Quebrado
1986|b|sert|Chitãozinho & Xororó|Estrada
1986|b|sert|Chitãozinho & Xororó|Não Desligue o Rádio
1986|b|sert|Chitãozinho & Xororó|Se Deus Me Ouvisse
1986|b|sert|João Mineiro & Marciano|Seu Amor Ainda É Tudo
1986|b|sert|Roberta Miranda|A Majestade, o Sabiá
1986|b|sert|Matogrosso & Mathias|Eu Te Preciso
1986|b|sert|Duduca & Dalvan|Massa Falida
1987|b|sert|Chitãozinho & Xororó|Fogão de Lenha
1987|b|sert|Chitãozinho & Xororó|Terra Tombada
1987|b|sert|Chitãozinho & Xororó|Meu Disfarce
1987|b|sert|Trio Parada Dura|Me Mata de Uma Vez
1987|b|sert|Trio Parada Dura|Bobeou... A Gente Pimba
1987|b|sert|Pena Branca & Xavantinho|Cuitelinho
1987|b|sert|Pena Branca & Xavantinho|Vaca Estrela e Boi Fubá
1987|b|sert|Roberta Miranda|Vá Com Deus
1988|b|sert|Chitãozinho & Xororó|Pé na Estrada
1988|b|sert|Chitãozinho & Xororó|Falando às Paredes
1988|b|sert|Chitãozinho & Xororó|A Mais Bonita das Noites
1988|b|sert|Gian & Giovani|Amante Anônimo
1988|b|sert|Gian & Giovani|Espuma da Cerveja
1988|b|sert|Gian & Giovani|Você em Minha Vida
1988|b|sert|Roberta Miranda|Dói
1988|b|sert|Pena Branca & Xavantinho|Mulheres da Terra
1989|b|sert|Leandro & Leonardo|Entre Tapas e Beijos
1989|b|sert|Chitãozinho & Xororó|Nuvem de Lágrimas
1989|b|sert|Chitãozinho & Xororó|No Rancho Fundo
1989|b|sert|Chitãozinho & Xororó|Faz Um Ano
1989|b|sert|Chitãozinho & Xororó|Nascemos Pra Cantar
1989|b|sert|Chitãozinho & Xororó|De Coração Pra Coração
1989|b|sert|Leandro & Leonardo|Solidão
1989|b|sert|Almir Sater|Rasta Bonito
1990|b|sert|Chitãozinho & Xororó|Evidências
1990|b|sert|Leandro & Leonardo|Pense em Mim
1990|b|sert|Chitãozinho & Xororó|Página Virada
1990|b|sert|Chitãozinho & Xororó|Somos Assim
1990|b|sert|Almir Sater|Chalana
1990|b|sert|Matogrosso & Mathias|Ponto de Chegada
1990|b|sert|Matogrosso & Mathias|Na Hora do Adeus
1990|b|sert|Gian & Giovani|Nem Dormindo Consigo Te Esquecer
1991|b|sert|Zezé Di Camargo & Luciano|É o Amor
1991|b|sert|Leandro & Leonardo|Desculpe, Mas Eu Vou Chorar
1991|b|sert|Chitãozinho & Xororó|Cowboy do Asfalto
1991|b|sert|Chitãozinho & Xororó|Foge de Mim
1991|b|sert|Zezé Di Camargo & Luciano|Quem Sou Eu Sem Ela
1991|b|sert|Leandro & Leonardo|Não Aprendi a Dizer Adeus
1991|b|sert|Leandro & Leonardo|Paz na Cama
1991|b|sert|Matogrosso & Mathias|Sorte Tem Quem Acredita Nela
1992|b|sert|Chitãozinho & Xororó|Planeta Azul
1992|b|sert|Chitãozinho & Xororó|Brincar de Ser Feliz
1992|b|sert|Leandro & Leonardo|Esta Noite Foi Maravilhosa
1992|b|sert|Leandro & Leonardo|Temporal de Amor
1992|b|sert|Zezé Di Camargo & Luciano|Coração Está em Pedaços
1992|b|sert|Zezé Di Camargo & Luciano|Muda de Vida
1992|b|sert|Gian & Giovani|Não Dá Pra Te Esquecer
1992|b|sert|Roberta Miranda|Sol da Minha Vida
1993|b|sert|Leandro & Leonardo|Mexe Mexe
1993|b|sert|Zezé Di Camargo & Luciano|Saudade Bandida
1993|b|sert|Zezé Di Camargo & Luciano|Cama de Capim
1993|b|sert|João Paulo & Daniel|Só Dá Você na Minha Vida
1993|b|sert|João Paulo & Daniel|Malícia de Mulher
1993|b|sert|Chitãozinho & Xororó|Pensando em Minha Amada
1993|b|sert|Gian & Giovani|Sai Dessa Coração
1993|b|sert|Gian & Giovani|Meu Coração Só Quer Você
1994|b|sert|Leandro & Leonardo|Dor de Amor Não Tem Jeito
1994|b|sert|Chitãozinho & Xororó|Vá Pro Inferno Com Seu Amor
1994|b|sert|Chitãozinho & Xororó|Pode Ser Pra Valer
1994|b|sert|Chitãozinho & Xororó|Ela Não Vai Mais Chorar
1994|b|sert|Zezé Di Camargo & Luciano|Tudo de Novo
1994|b|sert|Zezé Di Camargo & Luciano|Salva Meu Coração
1994|b|sert|Zezé Di Camargo & Luciano|Vem Cuidar de Mim
1994|b|sert|Matogrosso & Mathias|Cabelo Loiro
1995|b|sert|Leandro & Leonardo|Festa de Rodeio
1995|b|sert|Leandro & Leonardo|Eu Juro
1995|b|sert|Zezé Di Camargo & Luciano|Você Vai Ver
1995|b|sert|Zezé Di Camargo & Luciano|Pão de Mel
1995|b|sert|Chitãozinho & Xororó|Bailão de Peão
1995|b|sert|Chitãozinho & Xororó|Um Homem Quando Ama
1995|b|sert|Gian & Giovani|O Que É Que a Gente Não Faz Por Amor
1995|b|sert|Bruno & Marrone|Favo de Mel
1996|b|sert|Zezé Di Camargo & Luciano|No Dia em Que Eu Saí de Casa
1996|b|sert|Leandro & Leonardo|Doce Mistério
1996|b|sert|Leandro & Leonardo|Eu Sou Desejo, Você É Paixão
1996|b|sert|Leandro & Leonardo|Horizonte Azul
1996|b|sert|Zezé Di Camargo & Luciano|Sem Medo de Ser Feliz
1996|b|sert|Chitãozinho & Xororó|Feito Eu
1996|b|sert|Chrystian & Ralf|Minha Gioconda
1996|b|sert|Guilherme & Santiago|Valeu Esperar
1997|b|sert|João Paulo & Daniel|Estou Apaixonado
1997|b|sert|Leandro & Leonardo|Cerveja
1997|b|sert|João Paulo & Daniel|Te Amo Cada Vez Mais
1997|b|sert|Rionegro & Solimões|Peão Apaixonado
1997|b|sert|Chitãozinho & Xororó|É Disso Que o Velho Gosta
1997|b|sert|Gian & Giovani|Não Vivo Sem Você
1997|b|sert|Zezé Di Camargo & Luciano|Sorriso Bonito
1997|b|sert|Bruno & Marrone|Acorrentado em Você
1998|b|sert|Rick & Renner|Ela É Demais
1998|b|sert|Leandro & Leonardo|Um Sonhador
1998|b|sert|Chitãozinho & Xororó|Deixei de Ser Cowboy Por Ela
1998|b|sert|Chitãozinho & Xororó|Na Aba do Meu Chapéu
1998|b|sert|Daniel|Adoro Amar Você
1998|b|sert|Daniel|Declaração de Amor
1998|b|sert|Rionegro & Solimões|De São Paulo a Belém
1998|b|sert|Zezé Di Camargo & Luciano|Cada Volta É um Recomeço
1999|b|sert|Leonardo|Mentira Que Virou Paixão
1999|b|sert|Daniel|Vou Levando a Vida
1999|b|sert|Chitãozinho & Xororó|Alô
1999|b|sert|Chitãozinho & Xororó|Ai, Maria
1999|b|sert|Zezé Di Camargo & Luciano|Dois Corações e Uma História
1999|b|sert|Matogrosso & Mathias|Pele de Maçã
1999|b|sert|Bruno & Marrone|Vida Vazia
1999|b|sert|Rionegro & Solimões|Bate o Pé
2000|b|sert|Leonardo|Deixaria Tudo
2000|b|sert|Leonardo|Quero Colo
2000|b|sert|Daniel|Quando o Coração Se Apaixona
2000|b|sert|Daniel|Seus Beijos
2000|b|sert|Zezé Di Camargo & Luciano|Da Boca pra Fora
2000|b|sert|Zezé Di Camargo & Luciano|Amor Selvagem
2000|b|sert|Bruno & Marrone|Por Um Minuto
2000|b|sert|Gian & Giovani|A Verdade Veio à Tona
2001|b|sert|Bruno & Marrone|Dormi na Praça
2001|b|sert|Leonardo|Todas as Coisas do Mundo
2001|b|sert|Leonardo|Cristal Quebrado
2001|b|sert|Rick & Renner|Filha
2001|b|sert|Zezé Di Camargo & Luciano|O Que É Que Eu Faço?
2001|b|sert|Zezé Di Camargo & Luciano|Dou a Vida Por Um Beijo
2001|b|sert|Chitãozinho & Xororó|Deslizes
2001|b|sert|Guilherme & Santiago|Vai Sobrar Mulher
2002|b|sert|Edson & Hudson|Azul
2002|b|sert|Leonardo|Te Amo Demais
2002|b|sert|Leonardo|A Distância
2002|b|sert|Daniel|Um Homem Apaixonado
2002|b|sert|Zezé Di Camargo & Luciano|A Ferro e Fogo
2002|b|sert|Rick & Renner|Só Pensando em Você
2002|b|sert|Chitãozinho & Xororó|Causa Perdida
2002|b|sert|Bruno & Marrone|Bijuteria
2003|b|sert|Zezé Di Camargo & Luciano|Pra Mudar a Minha Vida
2003|b|sert|Zezé Di Camargo & Luciano|Preciso de Um Tempo
2003|b|sert|Leonardo|Brincadeira Tem Hora
2003|b|sert|Leonardo|Tudo Me Lembra Você
2003|b|sert|Matogrosso & Mathias|Tentei Te Esquecer
2003|b|sert|Gian & Giovani|O Trem É Bão
2003|b|sert|Bruno & Marrone|Ligação Urbana
2003|b|sert|Chitãozinho & Xororó|Frete
2004|b|sert|Chitãozinho & Xororó|Sinônimos
2004|b|sert|Chitãozinho & Xororó|Aqui o Sistema É Bruto
2004|b|sert|Bruno & Marrone|Inevitável
2004|b|sert|Zezé Di Camargo & Luciano|Eu Amo
2004|b|sert|Daniel|Jogado na Rua
2004|b|sert|Daniel|Os Amantes
2004|b|sert|Guilherme & Santiago|Chovendo Estrelas
2004|b|sert|Leonardo|Vai e Vem
2005|b|sert|César Menotti & Fabiano|Leilão
2005|b|sert|César Menotti & Fabiano|Caso Marcado
2005|b|sert|Zezé Di Camargo & Luciano|Fui Eu
2005|b|sert|Zezé Di Camargo & Luciano|Agora Aguenta Nóis
2005|b|sert|Bruno & Marrone|Choram as Rosas
2005|b|sert|Bruno & Marrone|Quer Casar Comigo?
2005|b|sert|Edson & Hudson|Galera Coração
2005|b|sert|Guilherme & Santiago|É pra Sempre Te Amar
2006|b|sert|Bruno & Marrone|Por Um Gole a Mais
2006|b|sert|Bruno & Marrone|Recaída
2006|b|sert|Chitãozinho & Xororó|Vida Marvada
2006|b|sert|Daniel|Homem Maduro
2006|b|sert|Zezé Di Camargo & Luciano|Diz Pro Meu Olhar
2006|b|sert|Guilherme & Santiago|ABCDE
2006|b|sert|Leonardo|Lembranças
2006|b|sert|Victor & Leo|Sinto Falta de Você
2007|b|sert|Victor & Leo|Fada
2007|b|sert|Victor & Leo|Vida Boa
2007|b|sert|Bruno & Marrone|Pra Não Morrer de Amor
2007|b|sert|Leonardo|Idas e Voltas
2007|b|sert|Jorge & Mateus|Querendo Te Amar
2007|b|sert|César Menotti & Fabiano|Caso Por Acaso
2007|b|sert|Guilherme & Santiago|Quem Disse Adeus Foi Você
2007|b|sert|Zezé Di Camargo & Luciano|Olha Eu Aí
2008|b|sert|Victor & Leo|Borboletas
2008|b|sert|Victor & Leo|Deus e Eu no Sertão
2008|b|sert|Victor & Leo|Amigo Apaixonado
2008|b|sert|Jorge & Mateus|Castigo
2008|b|sert|Jorge & Mateus|De Tanto Te Querer
2008|b|sert|César Menotti & Fabiano|Ciumenta
2008|b|sert|Leonardo|A Fila Anda
2008|b|sert|Daniel|Difícil Não Falar de Amor
2009|b|sert|João Bosco & Vinícius|Chora, Me Liga
2009|b|sert|Luan Santana|Meteoro
2009|b|sert|Jorge & Mateus|Pode Chorar
2009|b|sert|Paula Fernandes|Pássaro de Fogo
2009|b|sert|Victor & Leo|Nada Normal
2009|b|sert|Luan Santana|Tô de Cara
2009|b|sert|Michel Teló|Ei, Psiu! Beijo Me Liga
2009|b|sert|Jorge & Mateus|O Mundo É Tão Pequeno
2010|b|sert|Luan Santana|Você Não Sabe o Que É Amor
2010|b|sert|Michel Teló|Fugidinha
2010|b|sert|Fernando & Sorocaba|Paga Pau
2010|b|sert|Jorge & Mateus|Amo Noite e Dia
2010|b|sert|Luan Santana|Sinais
2010|b|sert|Luan Santana|Adrenalina
2010|b|sert|Victor & Leo|Boa Sorte Pra Você
2010|b|sert|Gusttavo Lima feat. Jorge & Mateus|Inventor dos Amores
2011|b|sert|Michel Teló|Ai Se Eu Te Pego
2011|b|sert|Gusttavo Lima|Balada (Tchê Tcherere Tchê Tchê)
2011|b|sert|Luan Santana|Amar Não É Pecado
2011|b|sert|Luan Santana feat. Ivete Sangalo|Química do Amor
2011|b|sert|Michel Teló|Humilde Residência
2011|b|sert|Jorge & Mateus|Seu Astral
2011|b|sert|Victor & Leo|Água de Oceano
2011|b|sert|Paula Fernandes feat. Victor & Leo|Não Precisa
2012|b|sert|Gusttavo Lima|Gatinha Assanhada
2012|b|sert|Munhoz & Mariano|Camaro Amarelo
2012|b|sert|Luan Santana|Você de Mim Não Sai
2012|b|sert|Michel Teló|Bara Bará Bere Berê
2012|b|sert|Gusttavo Lima|Fazer Beber
2012|b|sert|Jorge & Mateus|Duas Metades
2012|b|sert|Matheus & Kauan|Sete Mares
2012|b|sert|Victor & Leo|Lágrimas
2013|b|sert|Luan Santana|Te Esperando
2013|b|sert|Jorge & Mateus|Logo Eu
2013|b|sert|Henrique & Diego|Suíte 14
2013|b|sert|Luan Santana|Garotas Não Merecem Chorar
2013|b|sert|Henrique & Juliano|Recaídas
2013|b|sert|Gusttavo Lima|Diz Pra Mim
2013|b|sert|Michel Teló|Amiga da Minha Irmã
2013|b|sert|Matheus & Kauan|Mundo Paralelo
2014|b|sert|Lucas Lucco|Mozão
2014|b|sert|Cristiano Araújo|Hoje Eu Tô Terrível
2014|b|sert|Marcos & Belutti|Domingo de Manhã
2014|b|sert|Henrique & Juliano|Até Você Voltar
2014|b|sert|Luan Santana|Cê Topa?
2014|b|sert|Jorge & Mateus|Calma
2014|b|sert|Gusttavo Lima|Tô Solto na Night
2014|b|sert|Gusttavo Lima|Se É pra Beber Eu Bebo
2015|b|sert|Matheus & Kauan|Que Sorte a Nossa
2015|b|sert|Jorge & Mateus|Os Anjos Cantam
2015|b|sert|Henrique & Juliano|Cuida Bem Dela
2015|b|sert|Luan Santana|Escreve Aí
2015|b|sert|Marília Mendonça|Sentimento Louco
2015|b|sert|Matheus & Kauan|A Rosa e o Beija-Flor
2015|b|sert|Gusttavo Lima|Você Não Me Conhece
2015|b|sert|Henrique & Juliano feat. Marília Mendonça|Impasse
2016|b|sert|Marília Mendonça|Infiel
2016|b|sert|Maiara & Maraisa|10%
2016|b|sert|Henrique & Juliano|Na Hora da Raiva
2016|b|sert|Jorge & Mateus|Sosseguei
2016|b|sert|Maiara & Maraisa|Medo Bobo
2016|b|sert|Marília Mendonça|Eu Sei de Cor
2016|b|sert|Henrique & Juliano feat. Marília Mendonça|Flor e o Beija-Flor
2016|b|sert|Zé Neto & Cristiano|Seu Polícia
2017|b|sert|Simone & Simaria feat. Anitta|Loka
2017|b|sert|Henrique & Juliano|Vidinha de Balada
2017|b|sert|Marília Mendonça|Amante Não Tem Lar
2017|b|sert|Maiara & Maraisa|Sorte Que Cê Beija Bem
2017|b|sert|Marília Mendonça|De Quem É a Culpa?
2017|b|sert|Luan Santana|Acordando o Prédio
2017|b|sert|Simone & Simaria|Regime Fechado
2017|b|sert|Henrique & Juliano|Aquela Pessoa
2018|b|sert|Gusttavo Lima|Apelido Carinhoso
2018|b|sert|Zé Neto & Cristiano|Notificação Preferida
2018|b|sert|Marília Mendonça|Ciumeira
2018|b|sert|Luan Santana feat. Jorge & Mateus|Sofazinho
2018|b|sert|Matheus & Kauan|Tô Com Moral No Céu
2018|b|sert|Maiara & Maraisa|Quem Ensinou Fui Eu
2018|b|sert|Gusttavo Lima|Zé da Recaída
2018|b|sert|Marília Mendonça|Ausência
2019|b|sert|Marília Mendonça|Supera
2019|b|sert|Zé Neto & Cristiano|Largado às Traças
2019|b|sert|Jorge & Mateus|Propaganda
2019|b|sert|Matheus & Kauan feat. Marília Mendonça|Vou Ter Que Superar
2019|b|sert|Gusttavo Lima|Cem Mil
2019|b|sert|Luan Santana feat. MC Kekel|Vingança
2019|b|sert|Marília Mendonça|Bem Pior Que Eu
2019|b|sert|João Gustavo & Murilo|Lençol Dobrado
2020|b|sert|Marília Mendonça & Maiara & Maraisa|Todo Mundo Vai Sofrer
2020|b|sert|Henrique & Juliano|Liberdade Provisória
2020|b|sert|Zé Neto & Cristiano|Bebi Minha Bicicleta
2020|b|sert|Marília Mendonça|Graveto
2020|b|sert|Jorge & Mateus|Lance Individual
2020|b|sert|Gusttavo Lima|A Gente Fez Amor
2020|b|sert|Marília Mendonça & Maiara & Maraisa|Quero Você do Jeito Que Quiser
2020|b|sert|Matheus & Kauan|Litrão
2021|b|sert|Marília Mendonça & Maiara & Maraisa|Esqueça-me Se For Capaz
2021|b|sert|Gusttavo Lima|Desejo Imortal
2021|b|sert|Israel & Rodolffo|Batom de Cereja
2021|b|sert|Henrique & Juliano|Arranhão
2021|b|sert|Marília Mendonça|Troca de Calçada
2021|b|sert|Luan Santana|Morena
2021|b|sert|Simone & Simaria feat. Zé Felipe|Vontade de Morder
2021|b|sert|Jorge & Mateus|Molhando o Volante
2022|b|sert|Ana Castela, Melody & DJ Chris no Beat|Pipoco
2022|b|sert|Marília Mendonça|Leão
2022|b|sert|Hugo & Guilherme feat. Marília Mendonça|Mal Feito
2022|b|sert|Israel & Rodolffo feat. Ana Castela|Bombonzinho
2022|b|sert|Gustavo Mioto feat. Mari Fernandez|Eu Gosto Assim
2022|b|sert|Ana Castela|Boiadeira
2022|b|sert|Luan Santana|Abalo Emocional
2022|b|sert|Gusttavo Lima|Bloqueado
2023|b|sert|Ana Castela|Nosso Quadro
2023|b|sert|Simone Mendes|Erro Gostoso
2023|b|sert|Gusttavo Lima|Canudinho
2023|b|sert|Zé Neto & Cristiano|Oi Balde
2023|b|sert|Guilherme & Benuto feat. Simone Mendes|Manda um Oi
2023|b|sert|Ana Castela|Solteiro Forçado
2023|b|sert|Henrique & Juliano|Traumatizei
2023|b|sert|Clayton & Romário feat. Luan Santana|Namorando ou Não
2024|b|sert|Henrique & Juliano|Última Saudade
2024|b|sert|Felipe & Rodrigo|Gosta de Rua
2024|b|sert|Lauana Prado|Escrito nas Estrelas
2024|b|sert|Gusttavo Lima feat. Bruno & Marrone|Relação Errada
2024|b|sert|Simone Mendes|Dois Tristes
2024|b|sert|Murilo Huff|Anestesiado
2024|b|sert|Hugo & Guilherme|Vazou na Braquiara
2024|b|sert|Manu & Simone Mendes|Daqui Pra Sempre

1983|b|popbr|Ritchie|Menina Veneno
1983|b|popbr|Lulu Santos|Como uma Onda
1983|b|popbr|Ritchie|A Vida Tem Dessas Coisas
1983|b|popbr|Ritchie|Pelo Interfone
1983|b|popbr|Lulu Santos|O Ritmo do Momento
1983|b|popbr|Roupa Nova|Anjo
1983|b|popbr|Roupa Nova|Sensual
1983|b|popbr|A Turma do Balão Mágico|Superfantástico
1984|b|popbr|Roupa Nova|Whisky a Go-Go
1984|b|popbr|Marina Lima|Fullgás
1984|b|popbr|Lulu Santos|Tudo Azul
1984|b|popbr|Lulu Santos|O Último Romântico
1984|b|popbr|A Turma do Balão Mágico & Roberto Carlos|É Tão Lindo
1984|b|popbr|Biafra|Sonho de Ícaro
1985|b|popbr|Roupa Nova|Dona
1985|b|popbr|Roupa Nova|Linda Demais
1985|b|popbr|Roupa Nova|Tímida
1985|b|popbr|Lulu Santos|Normal
1985|b|popbr|Trem da Alegria|Uni, Duni, Tê
1985|b|popbr|Trem da Alegria|Dona Felicidade
1985|b|popbr|Dominó|Companheiro
1985|b|popbr|Metrô|Beat Acelerado
1986|b|popbr|Xuxa|Doce Mel (Bom Estar com Você)
1986|b|popbr|Xuxa|Quem Qué Pão?
1986|b|popbr|Xuxa|Amiguinha Xuxa
1986|b|popbr|Trem da Alegria|He-Man
1986|b|popbr|Trem da Alegria|Fera Nenen
1986|b|popbr|Dominó|Guerreiros
1986|b|popbr|Dominó|Amor e Música
1987|b|popbr|Roupa Nova|Volta pra Mim
1987|b|popbr|Roupa Nova|De Volta pro Futuro
1987|b|popbr|Rosana|O Amor e o Poder
1987|b|popbr|Marina Lima|Virgem
1987|b|popbr|Xuxa|Quem Quiser Que Conte Outra
1987|b|popbr|Xuxa|Beijinho, Beijinho (Tchau, Tchau)
1987|b|popbr|Trem da Alegria|Thundercats
1987|b|popbr|Dominó|Manequim
1988|b|popbr|Xuxa|Ilariê
1988|b|popbr|Lulu Santos|Toda Forma de Amor
1988|b|popbr|Xuxa|Brincar de Índio
1988|b|popbr|Angélica|Vou de Táxi
1988|b|popbr|Roupa Nova|Meu Universo É Você
1988|b|popbr|Roupa Nova|Vício
1988|b|popbr|Trem da Alegria|Iô-Iô
1988|b|popbr|Dominó|Com Todos Menos Comigo
1989|b|popbr|Xuxa|Tindolelê
1989|b|popbr|Xuxa|Milagre da Vida
1989|b|popbr|Xuxa|Remelexuxa
1989|b|popbr|Trem da Alegria|Jaspion-Changeman
1989|b|popbr|Trem da Alegria|Pula Corda
1989|b|popbr|Marina Lima|À Francesa
1990|b|popbr|Fernanda Abreu|A Noite
1990|b|popbr|Fernanda Abreu|SLA Radical Dance Disco Club
1990|b|popbr|Xuxa|Lua de Cristal
1990|b|popbr|Xuxa|Hoje É Dia de Folia
1990|b|popbr|Roupa Nova|Coração Pirata
1990|b|popbr|Roupa Nova|Amo em Silêncio
1990|b|popbr|Dominó|Felicidade Já
1990|b|popbr|Dominó|Maria
1991|b|popbr|Sandy & Junior|Aniversário do Tatu
1991|b|popbr|Sandy & Junior|Maria Chiquinha
1991|b|popbr|Xuxa|Dança do Coco
1991|b|popbr|Xuxa|O Xou da Xuxa Começou
1991|b|popbr|Trem da Alegria|Tartaruga Ninja
1991|b|popbr|Trem da Alegria|O Lobisomem
1992|b|popbr|Fernanda Abreu|Rio 40 Graus
1992|b|popbr|Fernanda Abreu|Hello Baby
1992|b|popbr|Sandy & Junior|Sábado à Noite
1992|b|popbr|Sandy & Junior|A Resposta da Mariquinha
1992|b|popbr|Xuxa|A Vida É uma Festa
1992|b|popbr|Dominó|Sem Compromisso
1993|b|popbr|Sandy & Junior|Tô Ligado em Você
1993|b|popbr|Sandy & Junior|Primeiro Amor
1993|b|popbr|Sandy & Junior|Splish Splash
1993|b|popbr|Xuxa|Corrente do Amor
1993|b|popbr|Xuxa & José Augusto|Querer É Poder
1993|b|popbr|Roupa Nova|De Volta ao Começo
1994|b|popbr|Roupa Nova|A Viagem
1994|b|popbr|Roupa Nova|Os Corações Não São Iguais
1994|b|popbr|Lulu Santos|Assim Caminha a Humanidade
1994|b|popbr|Sandy & Junior|Dance, Dance, Dance
1994|b|popbr|Xuxa|É de Chocolate
1994|b|popbr|Latino|Me Leva
1994|b|popbr|Latino|Só Você
1995|b|popbr|Sandy & Junior|Vai Ter que Rebolar
1995|b|popbr|Sandy & Junior|Sonho Real
1995|b|popbr|Fernanda Abreu|Veneno da Lata
1995|b|popbr|Fernanda Abreu|Garota Sangue Bom
1995|b|popbr|Cidade Negra|Onde Você Mora?
1995|b|popbr|Xuxa|Salada Mista
1996|b|popbr|Sandy & Junior|Dig-Dig-Joy
1996|b|popbr|Sandy & Junior|Não Ter
1996|b|popbr|Xuxa|Tô de Bem com a Vida
1996|b|popbr|Xuxa|Xuxaxé
1996|b|popbr|Roupa Nova|Amar É...
1996|b|popbr|Dominó|Salsa & Merengue
1997|b|popbr|Sandy & Junior|Inesquecível
1997|b|popbr|Sandy & Junior|Eu Acho que Pirei
1997|b|popbr|Fernanda Abreu|Kátia Flávia, a Godiva do Irajá
1997|b|popbr|Fernanda Abreu|Um Amor, Um Lugar
1997|b|popbr|Xuxa|Libera Geral
1997|b|popbr|Roupa Nova|De Ninguém
1997|b|popbr|Dominó|Baila Baila Comigo
1998|b|popbr|Xuxa|Pelotão da Xuxa
1998|b|popbr|Xuxa|Profecias
1998|b|popbr|Fat Family|Jeito Sexy
1998|b|popbr|Paula Toller|Oito Anos
1999|b|popbr|Sandy & Junior|As Quatro Estações
1999|b|popbr|Sandy & Junior|Aprender a Amar
1999|b|popbr|Sandy & Junior|Vamô Pulá!
1999|b|popbr|Dominó|Vem Falar de Amor
1999|b|popbr|Xuxa|Só o Nosso Amor
1999|b|popbr|Roupa Nova|Agora Sim
1999|b|popbr|Roupa Nova|Bem Maior
2000|b|popbr|KLB|A Dor Desse Amor
2000|b|popbr|KLB|Ela Não Está Aqui
2000|b|popbr|KLB|Por Que Tem Que Ser Assim?
2000|b|popbr|Wanessa Camargo|O Amor Não Deixa
2000|b|popbr|Wanessa Camargo|Apaixonada por Você
2000|b|popbr|Wanessa Camargo|Eu Posso Te Sentir
2000|b|popbr|Fernanda Abreu|Baile da Pesada
2000|b|popbr|Fernanda Abreu|Paisagem de Amor
2001|b|popbr|Kelly Key|Baba
2001|b|popbr|Kelly Key|Escondido
2001|b|popbr|Kelly Key|Cachorrinho
2001|b|popbr|Sandy & Junior|A Gente Dá Certo
2001|b|popbr|Sandy & Junior|Quando Você Passa (Turu Turu)
2001|b|popbr|KLB|Minha Timidez
2001|b|popbr|KLB|Te Amar Ainda Mais
2001|b|popbr|Wanessa Camargo|Eu Quero Ser o Seu Amor
2002|b|popbr|Rouge|Ragatanga
2002|b|popbr|Rouge|Não Dá pra Resistir
2002|b|popbr|Sandy & Junior|Love Never Fails
2002|b|popbr|Sandy & Junior|Super-Herói (Não É Fácil)
2002|b|popbr|Wanessa Camargo|Um Dia... Meu Primeiro Amor
2002|b|popbr|Wanessa Camargo|Sem Querer
2002|b|popbr|KLB|A Cada Dez Palavras
2003|b|popbr|Sandy & Junior|Desperdiçou
2003|b|popbr|Sandy & Junior|Você pra Sempre (Inveja)
2003|b|popbr|Kelly Key|Adoleta
2003|b|popbr|Kelly Key|Chic, Chic
2003|b|popbr|Rouge|Brilha La Luna
2003|b|popbr|Rouge|Um Anjo Veio Me Falar
2003|b|popbr|Luka|Tô Nem Aí
2003|b|popbr|Felipe Dylon|Musa do Verão
2004|b|popbr|Latino|Festa no Apê
2004|b|popbr|Latino|Renata
2004|b|popbr|Wanessa Camargo|Me Engana que Eu Gosto
2004|b|popbr|KLB|A Ilha
2004|b|popbr|Kelly Key|Por Causa de Você
2004|b|popbr|Fernanda Abreu|Eu Vou Torcer
2005|b|popbr|Wanessa Camargo|Amor, Amor
2005|b|popbr|Wanessa Camargo|Não Resisto a Nós Dois
2005|b|popbr|Kelly Key|Escuta Aqui Rapaz
2005|b|popbr|Kelly Key|Barbie Girl
2005|b|popbr|KLB|Um Anjo
2005|b|popbr|KLB|Não Vou Chorar
2006|b|popbr|Sandy & Junior|Estranho Jeito de Amar
2006|b|popbr|Sandy & Junior|Discutível Perfeição
2006|b|popbr|Sandy & Junior|Abri os Olhos
2006|b|popbr|Kelly Key|Pegue e Puxe
2006|b|popbr|Kelly Key|Shake Boom
2007|b|popbr|Wanessa Camargo|Não Tô Pronta pra Perdoar
2007|b|popbr|Kelly Key|Você É o Cara
2007|b|popbr|KLB|Todo Azul do Mar
2007|b|popbr|KLB|Menina Linda
2007|b|popbr|Danni Carlos|Coisas Que Eu Sei
2008|b|popbr|Wanessa Camargo|Me Abrace
2008|b|popbr|Kelly Key|Super Poderosa
2008|b|popbr|Latino|Amigo Fura-Olho
2008|b|popbr|Latino|Selinho na Boca
2008|b|popbr|KLB|Amor de Verdade
2009|b|popbr|Wanessa feat. Ja Rule|Fly
2009|b|popbr|Wanessa|Não Me Leve a Mal
2009|b|popbr|Restart|Levo Comigo
2009|b|popbr|Cine|Garota Radical
2009|b|popbr|Cine|Se Você Quiser
2010|b|popbr|Manu Gavassi|Garoto Errado
2010|b|popbr|Sandy|Pés Cansados
2010|b|popbr|Sandy|Quem Eu Sou
2010|b|popbr|Restart|Pra Você Lembrar
2010|b|popbr|Cine|As Cores
2010|b|popbr|Cine|A Usurpadora
2011|b|popbr|Manu Gavassi|Planos Impossíveis
2011|b|popbr|Cine|#Emchoque
2011|b|popbr|Restart|Menina Estranha
2011|b|popbr|Wanessa|Sticky Dough
2011|b|popbr|Wanessa|DNA
2012|b|popbr|Anitta|Menina Má
2012|b|popbr|Anitta|Meiga e Abusada
2012|b|popbr|Cine|Nunca Ninguém Morreu de Amor
2012|b|popbr|Banda Uó|Shake de Amor
2013|b|popbr|Anitta|Show das Poderosas
2013|b|popbr|Anitta|Não Para
2013|b|popbr|Anitta|Zen
2013|b|popbr|Manu Gavassi|Clichê Adolescente
2013|b|popbr|Sandy|Aquela dos 30
2013|b|popbr|Ivete Sangalo|Tempo de Alegria
2013|b|popbr|Restart|Renascer
2014|b|popbr|Anitta|Blá Blá Blá
2014|b|popbr|Anitta feat. Projota|Cobertor
2014|b|popbr|Anitta|Na Batida
2014|b|popbr|Anitta|Ritmo Perfeito
2014|b|popbr|Manu Gavassi|Esse Amor Tão Errado
2015|b|popbr|Anitta|Bang
2015|b|popbr|Anitta|Deixa Ele Sofrer
2015|b|popbr|Anitta feat. MC Guimê|No Meu Talento
2015|b|popbr|Manu Gavassi|Camiseta
2016|b|popbr|Iza|Quem Sabe Sou Eu
2016|b|popbr|Anitta feat. Maluma|Sim ou Não
2016|b|popbr|Sandy feat. Tiago Iorc|Me Espera
2016|b|popbr|Manu Gavassi|Direção
2016|b|popbr|Wanessa Camargo|Coração Embriagado
2017|b|popbr|Anitta|Vai Malandra
2017|b|popbr|Pabllo Vittar|K.O.
2017|b|popbr|Vitor Kley|O Sol
2017|b|popbr|Anitta|Paradinha
2017|b|popbr|Pabllo Vittar|Indestrutível
2017|b|popbr|Manu Gavassi|Hipnose
2018|b|popbr|Melim|Ouvi Dizer
2018|b|popbr|Jão|Vou Morrer Sozinho
2018|b|popbr|Iza|Dona de Mim
2018|b|popbr|Iza feat. Marcelo Falcão|Pesadão
2018|b|popbr|Anitta|Indecente
2018|b|popbr|Manu Gavassi|Me Beija
2019|b|popbr|Anitta feat. Marília Mendonça|Some Que Ele Vem Atrás
2019|b|popbr|Luísa Sonza & Pabllo Vittar|Garupa
2019|b|popbr|Anitta & Vitão|Complicado
2019|b|popbr|Anitta & Melim|Meu Mel
2019|b|popbr|Anitta, Lexa & Luísa Sonza feat. MC Rebecca|Combatchy
2020|b|popbr|Luísa Sonza, Pabllo Vittar & Anitta|Modo Turbo
2020|b|popbr|Luísa Sonza|Braba
2020|b|popbr|Giulia Be|Menina Solta
2020|b|popbr|Pabllo Vittar|Amor de Que
2020|b|popbr|Vitor Kley & Samuel Rosa|A Tal Canção pra Lua
2020|b|popbr|Manu Gavassi|Áudio de Desculpas
2021|b|popbr|Anitta|Girl from Rio
2021|b|popbr|Luísa Sonza|Penhasco
2021|b|popbr|Marina Sena|Por Supuesto
2021|b|popbr|Gloria Groove|Bonekinha
2021|b|popbr|Marina Sena|Me Toca
2021|b|popbr|Iza|Gueto
2022|b|popbr|Anitta|Envolver
2022|b|popbr|Gloria Groove|Vermelho
2022|b|popbr|Anitta|Boys Don't Cry
2022|b|popbr|Jão|Idiota
2022|b|popbr|Iza|Fé
2022|b|popbr|Gloria Groove|A Queda
2022|b|popbr|Luísa Sonza|Cachorrinhas
2022|b|popbr|Jovem Dionisio|Acorda Pedrinho
2023|b|popbr|Luísa Sonza|Chico
2023|b|popbr|Jão & Anitta|Pilantra
2023|b|popbr|Jão|Me Lambe
2023|b|popbr|Iza & MC Carol|Fé nas Maluca
2023|b|popbr|Pabllo Vittar & Gloria Groove|Ameianoite
2023|b|popbr|Marina Sena|Tudo pra Amar Você
2023|b|popbr|Luísa Sonza|Campo de Morango
2023|b|popbr|Ludmilla|Sintomas de Prazer

1969|b|mpb|Jorge Ben|País Tropical
1969|b|mpb|Caetano Veloso|Atrás do Trio Elétrico
1969|b|mpb|Gilberto Gil|Aquele Abraço
1969|b|mpb|Paulinho da Viola|Sinal Fechado
1969|b|mpb|Jorge Ben & Toquinho|Que Maravilha
1969|b|mpb|Gal Costa|Meu Nome É Gal
1969|b|mpb|Caetano Veloso|Irene
1969|b|mpb|Jorge Ben|Charles, Anjo 45
1970|b|mpb|Tim Maia|Azul da Cor do Mar
1970|b|mpb|Tim Maia|Primavera
1970|b|mpb|Chico Buarque|Apesar de Você
1970|b|mpb|Paulinho da Viola|Foi um Rio Que Passou em Minha Vida
1970|b|mpb|Milton Nascimento|Para Lennon e McCartney
1970|b|mpb|Novos Baianos|Ferro na Boneca
1970|b|mpb|Ivan Lins|O Amor É o Meu País
1970|b|mpb|Jorge Ben|Oba, Lá Vem Ela
1971|b|mpb|Chico Buarque|Construção
1971|b|mpb|Caetano Veloso|London, London
1971|b|mpb|Chico Buarque|Deus Lhe Pague
1971|b|mpb|Elis Regina|Madalena
1971|b|mpb|Gal Costa|Vapor Barato
1971|b|mpb|Tim Maia|Não Quero Dinheiro (Só Quero Amar)
1971|b|mpb|Toquinho & Vinicius|Tarde em Itapuã
1971|b|mpb|Antônio Carlos & Jocáfi|Você Abusou
1972|b|mpb|Jorge Ben|Taj Mahal
1972|b|mpb|Novos Baianos|Preta Pretinha
1972|b|mpb|Lô Borges|O Trem Azul
1972|b|mpb|Milton Nascimento|Cais
1972|b|mpb|Gilberto Gil|Expresso 2222
1972|b|mpb|Novos Baianos|Acabou Chorare
1972|b|mpb|Jorge Ben|Fio Maravilha
1972|b|mpb|Elis Regina|Atrás da Porta
1973|b|mpb|Fagner|Canteiros
1973|b|mpb|Tim Maia|Réu Confesso
1973|b|mpb|Tim Maia|Gostava Tanto de Você
1973|b|mpb|Chico Buarque|Tatuagem
1973|b|mpb|Elis Regina|Folhas Secas
1973|b|mpb|Luiz Melodia|Pérola Negra
1973|b|mpb|Gal Costa|Índia
1973|b|mpb|Clara Nunes|Tristeza Pé no Chão
1974|b|mpb|Elis Regina & Tom Jobim|Águas de Março
1974|b|mpb|Elis Regina & Tom Jobim|Só Tinha de Ser com Você
1974|b|mpb|Chico Buarque|Acorda Amor
1974|b|mpb|Jorge Ben|Os Alquimistas Estão Chegando
1974|b|mpb|Jorge Ben|Errare Humanum Est
1974|b|mpb|Gal Costa|Barato Total
1974|b|mpb|Ednardo|Pavão Mysteriozo
1974|b|mpb|Clara Nunes|Conto de Areia
1975|b|mpb|Caetano Veloso|Qualquer Coisa
1975|b|mpb|Gilberto Gil|Refazenda
1975|b|mpb|Milton Nascimento|Fé Cega, Faca Amolada
1975|b|mpb|Benito di Paula|Charlie Brown
1975|b|mpb|Gilberto Gil|Jeca Total
1975|b|mpb|Milton Nascimento|Paula e Bebeto
1975|b|mpb|Jorge Ben|Jorge da Capadócia
1975|b|mpb|Tim Maia|Imunização Racional (Que Beleza)
1976|b|mpb|Elis Regina|Como Nossos Pais
1976|b|mpb|Djavan|Flor de Lis
1976|b|mpb|Belchior|Apenas um Rapaz Latino-Americano
1976|b|mpb|Belchior|Velha Roupa Colorida
1976|b|mpb|Chico Buarque|O Que Será (À Flor da Terra)
1976|b|mpb|Chico Buarque|Meu Caro Amigo
1976|b|mpb|Elis Regina|Fascinação
1976|b|mpb|Jorge Ben|Ponta de Lança Africano (Umbabarauma)
1977|b|mpb|Caetano Veloso|Odara
1977|b|mpb|Caetano Veloso|Tigresa
1977|b|mpb|Gilberto Gil|Refavela
1977|b|mpb|Gilberto Gil|Babá Alapalá
1977|b|mpb|Elis Regina|Romaria
1977|b|mpb|Belchior|Coração Selvagem
1977|b|mpb|Clara Nunes|As Forças da Natureza
1977|b|mpb|Guilherme Arantes|Amanhã
1978|b|mpb|Caetano Veloso|Sampa
1978|b|mpb|Caetano Veloso|Terra
1978|b|mpb|Milton Nascimento|Maria Maria
1978|b|mpb|Chico Buarque & Milton Nascimento|Cálice
1978|b|mpb|Gal Costa|Folhetim
1978|b|mpb|Maria Bethânia & Gal Costa|Sonho Meu
1978|b|mpb|Tim Maia|Sossego
1978|b|mpb|Beto Guedes|Amor de Índio
1979|b|mpb|Gilberto Gil|Realce
1979|b|mpb|Gilberto Gil|Toda Menina Baiana
1979|b|mpb|Elis Regina|O Bêbado e a Equilibrista
1979|b|mpb|Caetano Veloso|Oração ao Tempo
1979|b|mpb|Chico Buarque|Geni e o Zepelim
1979|b|mpb|Milton Nascimento|Canção da América
1979|b|mpb|Beto Guedes|Sol de Primavera
1979|b|mpb|Simone|Começar de Novo
1980|b|mpb|Djavan|Meu Bem Querer
1980|b|mpb|Chico Buarque|Vida
1980|b|mpb|Chico Buarque|Bye Bye, Brasil
1980|b|mpb|Ivan Lins|Novo Tempo
1980|b|mpb|Milton Nascimento|Sentinela
1980|b|mpb|Clara Nunes|Morena de Angola
1980|b|mpb|Elis Regina|Aprendendo a Jogar
1980|b|mpb|Oswaldo Montenegro|Bandolins
1981|b|mpb|Caetano Veloso|Rapte-me Camaleoa
1981|b|mpb|Gilberto Gil|Palco
1981|b|mpb|Gilberto Gil|A Gente Precisa Ver o Luar
1981|b|mpb|Djavan|Seduzir
1981|b|mpb|Guilherme Arantes|Planeta Água
1981|b|mpb|Gal Costa|Festa do Interior
1981|b|mpb|Gal Costa|Meu Bem, Meu Mal
1981|b|mpb|Ney Matogrosso|Homem com H
1982|b|mpb|Gilberto Gil|Drão
1982|b|mpb|Djavan|Sina
1982|b|mpb|Gilberto Gil|Andar com Fé
1982|b|mpb|Caetano Veloso|Queixa
1982|b|mpb|Caetano Veloso|Trem das Cores
1982|b|mpb|Gal Costa|Azul
1982|b|mpb|Djavan|Samurai
1982|b|mpb|Sandra de Sá|Olhos Coloridos
1983|b|mpb|Tim Maia|Me Dê Motivo
1983|b|mpb|Tim Maia|O Descobridor dos Sete Mares
1983|b|mpb|Toquinho|Aquarela
1983|b|mpb|Milton Nascimento|Coração de Estudante
1983|b|mpb|Caetano Veloso|Eclipse Oculto
1983|b|mpb|Alceu Valença|Anunciação
1983|b|mpb|Pepeu Gomes|Masculino e Feminino
1984|b|mpb|Caetano Veloso|O Quereres
1984|b|mpb|Caetano Veloso|Podres Poderes
1984|b|mpb|Djavan|Lilás
1984|b|mpb|Djavan|Esquinas
1984|b|mpb|Gilberto Gil|Vamos Fugir
1984|b|mpb|Chico Buarque|Vai Passar
1984|b|mpb|Gal Costa|Chuva de Prata
1984|b|mpb|Gal Costa|Nada Mais (Lately)
1985|b|mpb|Gal Costa & Caetano Veloso|Sorte
1985|b|mpb|Gal Costa & Tim Maia|Um Dia de Domingo
1985|b|mpb|Elba Ramalho|De Volta pro Aconchego
1985|b|mpb|Milton Nascimento|Encontros e Despedidas
1985|b|mpb|Guilherme Arantes|Cheia de Charme
1985|b|mpb|Tetê Espíndola|Escrito nas Estrelas
1985|b|mpb|Gal Costa|Bem-Bom
1986|b|mpb|Tim Maia|Do Leme ao Pontal
1986|b|mpb|Tim Maia|Telefone
1986|b|mpb|Caetano Veloso|Totalmente Demais
1986|b|mpb|Zizi Possi|Perigo
1986|b|mpb|Ivan Lins|Vitoriosa
1986|b|mpb|Marina Lima|Pra Começar
1987|b|mpb|Caetano Veloso|Eu Sou Neguinha?
1987|b|mpb|Caetano Veloso|Vamo Comer
1987|b|mpb|Chico Buarque|Todo o Sentimento
1987|b|mpb|Chico Buarque|Estação Derradeira
1987|b|mpb|Tom Jobim|Passarim
1987|b|mpb|Djavan|Soweto
1987|b|mpb|Djavan|Me Leve
1987|b|mpb|Djavan|Dou-Não-Dou
1988|b|mpb|Gonzaguinha|É
1988|b|mpb|Sandra de Sá|Bye Bye Tristeza
1988|b|mpb|14 Bis|Bola de Meia, Bola de Gude
1988|b|mpb|Gal Costa|Brasil
1988|b|mpb|Gal Costa|Me Faz Bem
1988|b|mpb|Ed Motta & Conexão Japeri|Manuel
1988|b|popbr|Lulu Santos|A Cura
1989|b|mpb|Djavan|Oceano
1989|b|mpb|Marisa Monte|Bem Que Se Quis
1989|b|mpb|Marisa Monte|Comida
1989|b|mpb|Marisa Monte|Preciso Me Encontrar
1989|b|mpb|Caetano Veloso|O Estrangeiro
1989|b|mpb|Chico Buarque|Morro Dois Irmãos
1989|b|mpb|Gilberto Gil|O Eterno Deus Mu Dança
1989|b|mpb|Fafá de Belém|Coração do Agreste
1990|b|mpb|Jorge Ben Jor|W/Brasil (Chama o Síndico)
1990|b|mpb|Gal Costa|Nua Ideia (Leila XII)
1990|b|mpb|Adriana Calcanhotto|Naquela Estação
1990|b|mpb|Fafá de Belém|Nuvem de Lágrimas
1991|b|mpb|Marisa Monte|Beija Eu
1991|b|mpb|Marisa Monte & Ed Motta|Ainda Lembro
1991|b|mpb|Marisa Monte|Volte para o Seu Lar
1991|b|mpb|Caetano Veloso|Fora da Ordem
1991|b|mpb|Caetano Veloso|Circuladô de Fulô
1991|b|mpb|Gilberto Gil|Parabolicamará
1991|b|mpb|Fagner|Borbulhas de Amor
1992|b|mpb|Djavan|Se...
1992|b|mpb|Djavan|Linha do Equador
1992|b|mpb|Adriana Calcanhotto|Senhas
1992|b|mpb|Adriana Calcanhotto|Mentiras
1992|b|mpb|Adriana Calcanhotto|Esquadros
1992|b|mpb|Gal Costa|Canta Brasil
1993|b|mpb|Caetano Veloso & Gilberto Gil|Haiti
1993|b|mpb|Caetano Veloso & Gilberto Gil|Desde Que o Samba É Samba
1993|b|mpb|Caetano Veloso & Gilberto Gil|Nossa Gente (Avisa Lá)
1993|b|mpb|Chico Buarque|Paratodos
1993|b|mpb|Chico Buarque|Futuros Amantes
1993|b|mpb|Chico Buarque|Pivete
1994|b|mpb|Marisa Monte|Segue o Seco
1994|b|mpb|Marisa Monte|Na Estrada
1994|b|mpb|Marisa Monte|Ao Meu Redor
1994|b|mpb|Marisa Monte|Dança da Solidão
1994|b|mpb|Zélia Duncan|Nos Lençóis Desse Reggae
1994|b|mpb|Caetano Veloso|Fina Estampa
1995|b|mpb|Chico César|Mama África
1995|b|mpb|Simone|Então É Natal
1995|b|mpb|Martinho da Vila|Devagar, Devagarinho
1995|b|mpb|Chico Buarque|Uma Palavra
1996|b|mpb|Zélia Duncan|Catedral
1996|b|mpb|Djavan|Nem um Dia
1996|b|mpb|Djavan|Malásia
1996|b|mpb|Chico César|À Primeira Vista
1996|b|mpb|Paulinho da Viola|Bebadosamba
1996|b|mpb|Carlinhos Brown|A Namorada
1997|b|mpb|Caetano Veloso|Livros
1997|b|mpb|Caetano Veloso|Não Enche
1997|b|mpb|Gilberto Gil|Pela Internet
1997|b|mpb|Gilberto Gil|Quanta
1997|b|mpb|Lenine|Hoje Eu Quero Sair Só
1997|b|mpb|Zeca Baleiro|Salão de Beleza
1997|b|mpb|Zeca Baleiro|Bandeira
1998|b|mpb|Djavan|Eu Te Devoro
1998|b|mpb|Caetano Veloso|Sozinho
1998|b|mpb|Chico Buarque|A Ostra e o Vento
1998|b|mpb|Chico Buarque|Iracema Voou
1998|b|mpb|Adriana Calcanhotto|Vambora
1998|b|mpb|Gal Costa|Pra Você
1999|b|mpb|Ana Carolina|Garganta
1999|b|mpb|Cássia Eller|O Segundo Sol
1999|b|mpb|Cássia Eller|Gatas Extraordinárias
1999|b|mpb|Lenine|Paciência
1999|b|mpb|Lenine|Jack Soul Brasileiro
1999|b|mpb|Maria Bethânia|A Força Que Nunca Seca
1999|b|mpb|Djavan|Acelerou
1999|b|mpb|Nana Caymmi|Suave Veneno
2000|b|mpb|Marisa Monte|Amor I Love You
2000|b|mpb|Marisa Monte|Não Vá Embora
2000|b|mpb|Marisa Monte|Gentileza
2000|b|mpb|Gilberto Gil|Esperando na Janela
2000|b|mpb|Adriana Calcanhotto|Devolva-me
2000|b|mpb|Caetano Veloso|Sou Seu Sabiá
2000|b|mpb|Caetano Veloso|Zera a Reza
2000|b|mpb|Bebel Gilberto|Samba da Bênção
2001|b|mpb|Ana Carolina|Quem de Nós Dois
2001|b|mpb|Seu Jorge|Carolina
2001|b|mpb|Djavan|Milagreiro
2001|b|mpb|Nana Caymmi|Saudade de Amar
2001|b|mpb|Zélia Duncan|Alma
2002|b|mpb|Tribalistas|Já Sei Namorar
2002|b|mpb|Tribalistas|Velha Infância
2002|b|mpb|Tribalistas|Passe em Casa
2002|b|mpb|Vanessa da Mata|Não Me Deixe Só
2002|b|mpb|Milton Nascimento & Maria Rita|Tristesse
2002|b|mpb|Caetano Veloso & Jorge Mautner|Todo Errado
2003|b|mpb|Maria Rita|A Festa
2003|b|mpb|Maria Rita|Cara Valente
2003|b|mpb|Maria Rita|Encontros e Despedidas
2003|b|mpb|Ana Carolina|Encostar na Tua
2003|b|mpb|Caetano Veloso|Você Não Me Ensinou a Te Esquecer
2004|b|mpb|Vanessa da Mata|Ai, Ai, Ai
2004|b|mpb|Lenine|Ninguém Faz Idéia
2004|b|mpb|Arnaldo Antunes|Saiba
2004|b|mpb|Seu Jorge|Life on Mars?
2005|b|mpb|Ana Carolina & Seu Jorge|É Isso Aí
2005|b|mpb|Maria Rita|Caminho das Águas
2005|b|mpb|Maria Rita|Recado
2005|b|mpb|Céu|Malemolência
2005|b|mpb|Gal Costa|Mar e Sol
2006|b|mpb|Marisa Monte|Infinito Particular
2006|b|mpb|Marisa Monte|Vilarejo
2006|b|mpb|Marisa Monte|O Bonde do Dom
2006|b|mpb|Caetano Veloso|Odeio
2006|b|mpb|Caetano Veloso|Não Me Arrependo
2006|b|mpb|Ana Carolina|Rosas
2006|b|mpb|Chico Buarque|Ela Faz Cinema
2006|b|mpb|Arnaldo Antunes|Para Lá
2007|b|mpb|Vanessa da Mata & Ben Harper|Boa Sorte / Good Luck
2007|b|mpb|Seu Jorge|Burguesinha
2007|b|mpb|Vanessa da Mata|Amado
2007|b|mpb|Seu Jorge|Mina do Condomínio
2007|b|mpb|Maria Rita|Tá Perdoado
2007|b|mpb|Djavan|Delírio dos Mortais
2007|b|mpb|Jorge Vercillo|Ela Une Todas as Coisas
2008|b|mpb|Mallu Magalhães|Tchubaruba
2008|b|mpb|Mallu Magalhães|J1
2008|b|mpb|Marcelo Camelo & Mallu Magalhães|Janta
2008|b|mpb|Gilberto Gil|Banda Larga Cordel
2008|b|mpb|Lenine|Martelo Bigorna
2009|b|mpb|Maria Gadú|Shimbalaiê
2009|b|mpb|Maria Gadú|Bela Flor
2009|b|mpb|Maria Gadú|Dona Cila
2009|b|mpb|Céu|Cangote
2009|b|mpb|Caetano Veloso|A Cor Amarela
2009|b|mpb|Maria Bethânia|Tua
2010|b|mpb|Marcelo Jeneci|Felicidade
2010|b|mpb|Marcelo Jeneci|Pra Sonhar
2010|b|mpb|Marcelo Jeneci|Feito pra Acabar
2010|b|mpb|Tulipa Ruiz|Efêmera
2011|b|mpb|Marisa Monte|Ainda Bem
2011|b|mpb|Marisa Monte|Depois
2011|b|mpb|Chico Buarque|Querido Diário
2011|b|mpb|Chico Buarque|Sinhá
2011|b|mpb|Seu Jorge|Amiga da Minha Mulher
2011|b|mpb|Seu Jorge|A Doida
2011|b|mpb|Lenine|Amor É pra Quem Ama
2011|b|mpb|Adriana Calcanhotto|Mais Perfumado
2012|b|mpb|Caetano Veloso|Um Abraçaço
2012|b|mpb|Caetano Veloso|A Bossa Nova É Foda
2012|b|mpb|Djavan|Bangalô
2012|b|mpb|Gilberto Gil|Eu Descobri
2013|b|mpb|Clarice Falcão|Oitavo Andar
2013|b|mpb|Clarice Falcão|Macaé
2013|b|mpb|Ana Carolina|Combustível
2013|b|mpb|Zeca Baleiro|Calma Aí, Coração
2014|b|mpb|Banda do Mar|Mais Ninguém
2014|b|mpb|Vanessa da Mata|Segue o Som
2014|b|mpb|Bebel Gilberto|Tudo
2014|b|mpb|Diogo Nogueira & Hamilton de Holanda|Bossa Negra
2015|b|mpb|Tiago Iorc|Amei Te Ver
2015|b|mpb|Elza Soares|A Mulher do Fim do Mundo
2015|b|mpb|Elza Soares|Maria da Vila Matilde
2015|b|mpb|Djavan|Vidas pra Contar
2015|b|mpb|Liniker|Zero
2015|b|mpb|Gal Costa|Estratosférica
2016|b|mpb|Anavitória|Trevo (Tu)
2016|b|mpb|Ana Vilela|Trem-Bala
2016|b|mpb|Anavitória|Agora Eu Quero Ir
2016|b|mpb|Céu|Varanda Suspensa
2016|b|mpb|Silva feat. Marisa Monte|Noturna (Nada de Novo na Noite)
2017|b|mpb|Tribalistas|Diáspora
2017|b|mpb|Tribalistas|Aliança
2017|b|mpb|Chico Buarque|Tua Cantiga
2017|b|mpb|Chico Buarque|As Caravanas
2017|b|mpb|Mallu Magalhães|Você Não Presta
2017|b|mpb|Xenia França|Pra Que Me Chamas?
2017|b|mpb|Tim Bernardes|Recomeçar
2017|b|mpb|Zeca Veloso|Todo Homem
2018|b|mpb|Elza Soares|O Que Se Cala
2018|b|mpb|Elza Soares|Banho
2018|b|mpb|Silva & Anitta|Fica Tudo Bem
2018|b|mpb|Gilberto Gil|OK OK OK
2019|b|mpb|Tiago Iorc|Desconstrução
2019|b|mpb|Criolo|Etérea
2019|b|mpb|Elza Soares & BaianaSystem feat. Virgínia Rodrigues|Libertação
2019|b|mpb|Anavitória & Nando Reis|Pra Você Guardei o Amor
2020|b|mpb|João Bosco|Abricó-de-Macaco
2020|b|mpb|Chico Chico & João Mantuano|A Cidade
2020|b|mpb|Luedji Luna|Bom Mesmo É Estar Debaixo D'Água
2020|b|mpb|Nando Reis|Espera a Primavera
2021|b|mpb|Marisa Monte|Calma
2021|b|mpb|Liniker|Baby 95
2021|b|mpb|Marisa Monte|Portas
2021|b|mpb|Caetano Veloso|Meu Coco
2021|b|mpb|Anavitória & Lenine|Lisboa
2021|b|mpb|Marisa Monte feat. Jorge Drexler|Vento Sardo

1973|b|rocknac|Secos & Molhados|Sangue Latino
1973|b|rocknac|Raul Seixas|Ouro de Tolo
1973|b|rocknac|Secos & Molhados|O Vira
1973|b|rocknac|Secos & Molhados|Rosa de Hiroshima
1973|b|rocknac|Secos & Molhados|Primavera nos Dentes
1973|b|rocknac|Raul Seixas|Metamorfose Ambulante
1973|b|rocknac|Raul Seixas|Mosca na Sopa
1973|b|rocknac|Raul Seixas|Al Capone
1974|b|rocknac|Raul Seixas|Gita
1974|b|rocknac|Raul Seixas|Sociedade Alternativa
1974|b|rocknac|Raul Seixas|Medo da Chuva
1974|b|rocknac|Raul Seixas|Trem das Sete
1974|b|rocknac|Raul Seixas|As Aventuras de Raul Seixas na Cidade de Thor
1974|b|rocknac|Secos & Molhados|Flores Astrais
1974|b|rocknac|Os Mutantes|Tudo Foi Feito pelo Sol
1974|b|rocknac|Rita Lee & Tutti Frutti|Atrás do Porto Tem uma Cidade
1975|b|rocknac|Rita Lee|Ovelha Negra
1975|b|rocknac|Rita Lee & Tutti Frutti|Agora Só Falta Você
1975|b|rocknac|Rita Lee & Tutti Frutti|Esse Tal de Roque Enrow
1975|b|rocknac|Raul Seixas|Tente Outra Vez
1975|b|rocknac|Raul Seixas|Rock do Diabo
1975|b|rocknac|Raul Seixas|Eu Sou Egoísta
1975|b|rocknac|O Terço|Hey Amigo
1975|b|rocknac|O Terço|Criaturas da Noite
1976|b|rocknac|Raul Seixas|Eu Nasci Há Dez Mil Anos Atrás
1976|b|rocknac|Raul Seixas|Meu Amigo Pedro
1976|b|rocknac|Raul Seixas|Canto para Minha Morte
1976|b|rocknac|Raul Seixas|Quando Você Crescer
1976|b|rocknac|Raul Seixas|Ave Maria da Rua
1976|b|rocknac|Raul Seixas|Eu Também Vou Reclamar
1976|b|rocknac|Rita Lee|Arrombou a Festa
1976|b|rocknac|Rita Lee|Coisas da Vida
1977|b|rocknac|Raul Seixas|Maluco Beleza
1977|b|rocknac|Raul Seixas|O Dia em que a Terra Parou
1977|b|rocknac|Raul Seixas|Sapato 36
1977|b|rocknac|Raul Seixas|No Fundo do Quintal da Escola
1977|b|rocknac|Raul Seixas|Que Luz É Essa
1977|b|rocknac|Raul Seixas|Tapanacara
1977|b|rocknac|Raul Seixas|Tu És o MDC da Minha Vida
1977|b|rocknac|Raul Seixas|Eu Quero Mesmo
1978|b|rocknac|Rita Lee|Jardins da Babilônia
1978|b|rocknac|Rita Lee|Miss Brasil 2000
1978|b|rocknac|Rita Lee|Agora É Moda
1978|b|rocknac|Raul Seixas|Mata Virgem
1978|b|rocknac|Raul Seixas|As Profecias
1978|b|rocknac|Raul Seixas|Conserve Seu Medo
1978|b|rocknac|Erasmo Carlos|Pelas Esquinas de Ipanema
1978|b|rocknac|Erasmo Carlos|Panorama Ecológico
1979|b|rocknac|Rita Lee|Mania de Você
1979|b|rocknac|Rita Lee|Chega Mais
1979|b|rocknac|Rita Lee|Doce Vampiro
1979|b|rocknac|Rita Lee|Papai Me Empresta o Carro
1979|b|rocknac|Rita Lee|Corre-Corre
1979|b|rocknac|Raul Seixas|Por Quem os Sinos Dobram
1979|b|rocknac|Raul Seixas|Movido a Álcool
1979|b|rocknac|Raul Seixas|Diamante de Mendigo
1980|b|rocknac|Rita Lee|Lança Perfume
1980|b|rocknac|Rita Lee|Baila Comigo
1980|b|rocknac|Rita Lee|Caso Sério
1980|b|rocknac|Rita Lee|Orra Meu
1980|b|rocknac|Rita Lee|Nem Luxo, Nem Lixo
1980|b|rocknac|Raul Seixas|Aluga-se
1980|b|rocknac|Raul Seixas|Abre-te Sésamo
1980|b|rocknac|Raul Seixas|Rock das Aranha
1981|b|rocknac|Rita Lee|Saúde
1981|b|rocknac|Rita Lee|Mutante
1981|b|rocknac|Rita Lee|Banho de Espuma
1981|b|rocknac|Rita Lee|Tatibitati
1981|b|rocknac|Gang 90 & Absurdettes|Perdidos na Selva
1981|b|rocknac|Erasmo Carlos|Mulher (Sexo Frágil)
1981|b|rocknac|Erasmo Carlos|Pega na Mentira
1981|b|rocknac|Camisa de Vênus|Meu Primo Zé
1982|b|rocknac|Blitz|Você Não Soube Me Amar
1982|b|rocknac|Blitz|Mais uma de Amor (Geme Geme)
1982|b|rocknac|Lulu Santos|Tempos Modernos
1982|b|rocknac|Lulu Santos|Tesouros da Juventude
1982|b|rocknac|Barão Vermelho|Down em Mim
1982|b|rocknac|Barão Vermelho|Todo o Amor Que Houver Nessa Vida
1982|b|rocknac|Rita Lee|Flagra
1982|b|rocknac|Rita Lee|Cor de Rosa Choque
1983|b|rocknac|Barão Vermelho|Pro Dia Nascer Feliz
1983|b|rocknac|Ultraje a Rigor|Inútil
1983|b|rocknac|Ultraje a Rigor|Mim Quer Tocar
1983|b|rocknac|Os Paralamas do Sucesso|Vital e Sua Moto
1983|b|rocknac|Os Paralamas do Sucesso|Cinema Mudo
1983|b|rocknac|Blitz|A Dois Passos do Paraíso
1983|b|rocknac|Raul Seixas|Carimbador Maluco
1983|b|rocknac|Kid Abelha|Pintura Íntima
1984|b|rocknac|Kid Abelha|Como Eu Quero
1984|b|rocknac|Titãs|Sonífera Ilha
1984|b|rocknac|Barão Vermelho|Bete Balanço
1984|b|rocknac|Os Paralamas do Sucesso|Óculos
1984|b|rocknac|Os Paralamas do Sucesso|Meu Erro
1984|b|rocknac|Kid Abelha|Fixação
1984|b|rocknac|Lulu Santos|Certas Coisas
1984|b|rocknac|Barão Vermelho|Maior Abandonado
1985|b|rocknac|Legião Urbana|Será
1985|b|rocknac|Ultraje a Rigor|Nós Vamos Invadir Sua Praia
1985|b|rocknac|RPM|Olhar 43
1985|b|rocknac|Cazuza|Exagerado
1985|b|rocknac|Legião Urbana|Ainda É Cedo
1985|b|rocknac|Legião Urbana|Geração Coca-Cola
1985|b|rocknac|RPM|Rádio Pirata
1985|b|rocknac|Kid Abelha|Lágrimas e Chuva
1986|b|rocknac|Legião Urbana|Tempo Perdido
1986|b|rocknac|Legião Urbana|Eduardo e Mônica
1986|b|rocknac|Os Paralamas do Sucesso|Alagados
1986|b|rocknac|Titãs|Polícia
1986|b|rocknac|Titãs|Homem Primata
1986|b|rocknac|Capital Inicial|Música Urbana
1986|b|rocknac|Legião Urbana|Índios
1986|b|rocknac|Engenheiros do Hawaii|Toda Forma de Poder
1987|b|rocknac|Titãs|Comida
1987|b|rocknac|Legião Urbana|Faroeste Caboclo
1987|b|rocknac|Engenheiros do Hawaii|Infinita Highway
1987|b|rocknac|Legião Urbana|Que País É Este
1987|b|rocknac|Legião Urbana|Angra dos Reis
1987|b|rocknac|Titãs|Lugar Nenhum
1987|b|rocknac|Engenheiros do Hawaii|Terra de Gigantes
1987|b|rocknac|Nenhum de Nós|Camila, Camila
1988|b|rocknac|Cazuza|Ideologia
1988|b|rocknac|Cazuza|Brasil
1988|b|rocknac|Cazuza|O Tempo Não Para
1988|b|rocknac|Cazuza|Faz Parte do Meu Show
1988|b|rocknac|Engenheiros do Hawaii|Somos Quem Podemos Ser
1988|b|rocknac|Os Paralamas do Sucesso|Quase um Segundo
1988|b|rocknac|Os Paralamas do Sucesso|Uns Dias
1988|b|rocknac|Barão Vermelho|Pense e Dance
1989|b|rocknac|Legião Urbana|Pais e Filhos
1989|b|rocknac|Legião Urbana|Há Tempos
1989|b|rocknac|Legião Urbana|Quando o Sol Bater na Janela do Teu Quarto
1989|b|rocknac|Titãs|Flores
1989|b|rocknac|Nenhum de Nós|O Astronauta de Mármore
1989|b|rocknac|Os Paralamas do Sucesso|Lanterna dos Afogados
1989|b|rocknac|Os Paralamas do Sucesso|Perplexo
1989|b|rocknac|Cazuza|Burguesia
1990|b|rocknac|Engenheiros do Hawaii|O Papa É Pop
1990|b|rocknac|Engenheiros do Hawaii|Pra Ser Sincero
1990|b|rocknac|Engenheiros do Hawaii|Era um Garoto que Como Eu Amava os Beatles e os Rolling Stones
1990|b|rocknac|Engenheiros do Hawaii|Exército de Um Homem Só
1990|b|rocknac|Barão Vermelho|O Poeta Está Vivo
1990|b|rocknac|Rita Lee|Perto do Fogo
1990|b|rocknac|Cássia Eller|Por Enquanto
1990|b|rocknac|Inimigos do Rei|Uma Barata Chamada Kafka
1991|b|rocknac|Legião Urbana|Vento no Litoral
1991|b|rocknac|Legião Urbana|Teatro dos Vampiros
1991|b|rocknac|Legião Urbana|O Mundo Anda Tão Complicado
1991|b|rocknac|Legião Urbana|Metal Contra as Nuvens
1991|b|rocknac|Kid Abelha|Grand Hotel
1991|b|rocknac|Engenheiros do Hawaii|Ninguém = Ninguém
1991|b|rocknac|Engenheiros do Hawaii|Piano Bar
1991|b|rocknac|Titãs|Saia de Mim
1992|b|rocknac|Barão Vermelho|Pedra, Flor e Espinho
1992|b|rocknac|Barão Vermelho|Supermercados da Vida
1992|b|rocknac|Engenheiros do Hawaii|Ando Só
1992|b|rocknac|Engenheiros do Hawaii|Parabólica
1992|b|rocknac|Engenheiros do Hawaii|Pampa no Walkman
1992|b|rocknac|Lulu Santos|Apenas Mais uma de Amor
1992|b|rocknac|Cássia Eller|O Marginal
1992|b|rocknac|Skank|In(dig)nação
1993|b|rocknac|Skank|Jackie Tequila
1993|b|rocknac|Legião Urbana|Perfeição
1993|b|rocknac|Legião Urbana|Giz
1993|b|rocknac|Legião Urbana|Vamos Fazer um Filme
1993|b|rocknac|Titãs|Será Que É Isso Que Eu Necessito?
1993|b|rocknac|Sepultura|Refuse/Resist
1993|b|rocknac|Sepultura|Territory
1993|b|rocknac|Skank|Tanto (I Want You)
1994|b|rocknac|Cássia Eller|Malandragem
1994|b|rocknac|Raimundos|Puteiro em João Pessoa
1994|b|rocknac|Raimundos|Palhas do Coqueiro
1994|b|rocknac|Skank|Te Ver
1994|b|rocknac|Skank|É Proibido Fumar
1994|b|rocknac|Skank|Pacato Cidadão
1994|b|rocknac|Chico Science & Nação Zumbi|A Praieira
1994|b|rocknac|Chico Science & Nação Zumbi|Da Lama ao Caos
1995|b|rocknac|Mamonas Assassinas|Pelados em Santos
1995|b|rocknac|Raimundos|Selim
1995|b|rocknac|Mamonas Assassinas|Vira-Vira
1995|b|rocknac|Mamonas Assassinas|Robocop Gay
1995|b|rocknac|Mamonas Assassinas|Chopis Centis
1995|b|rocknac|Mamonas Assassinas|1406
1995|b|rocknac|Raimundos|Eu Quero Ver o Oco
1995|b|rocknac|Os Paralamas do Sucesso|Uma Brasileira
1996|b|rocknac|Skank|Garota Nacional
1996|b|rocknac|Skank|Tão Seu
1996|b|rocknac|Sepultura|Roots Bloody Roots
1996|b|rocknac|Sepultura|Ratamahatta
1996|b|rocknac|Chico Science & Nação Zumbi|Manguetown
1996|b|rocknac|Chico Science & Nação Zumbi|Maracatu Atômico
1996|b|rocknac|O Rappa|Pescador de Ilusões
1996|b|rocknac|Jota Quest|Encontrar Alguém
1997|b|rocknac|Charlie Brown Jr.|Proibida pra Mim
1997|b|rocknac|Skank|É uma Partida de Futebol
1997|b|rocknac|Titãs|Os Cegos do Castelo
1997|b|rocknac|Titãs|Pra Dizer Adeus
1997|b|rocknac|Raimundos|Andar na Pedra
1997|b|rocknac|Raimundos|O Pão da Minha Prima
1997|b|rocknac|Virgulóides|Bagulho no Bumba
1997|b|rocknac|Charlie Brown Jr.|Tudo Que Ela Gosta de Escutar
1998|b|rocknac|Skank|Resposta
1998|b|rocknac|Skank|Mandrake e os Cubanos
1998|b|rocknac|Skank|Saideira
1998|b|rocknac|Titãs|É Preciso Saber Viver
1998|b|rocknac|Barão Vermelho|Puro Êxtase
1998|b|rocknac|Jota Quest|As Dores do Mundo
1998|b|rocknac|Jota Quest|Sempre Assim
1998|b|rocknac|Os Paralamas do Sucesso|Ela Disse Adeus
1999|b|rocknac|O Rappa|Minha Alma (A Paz Que Eu Não Quero)
1999|b|rocknac|Los Hermanos|Anna Júlia
1999|b|rocknac|Raimundos|Mulher de Fases
1999|b|rocknac|O Rappa|Me Deixa
1999|b|rocknac|O Rappa|O Que Sobrou do Céu
1999|b|rocknac|Charlie Brown Jr.|Zóio de Lula
1999|b|rocknac|Raimundos|A Mais Pedida
1999|b|rocknac|Los Hermanos|Primavera
2000|b|rocknac|Jota Quest|Fácil
2000|b|rocknac|Capital Inicial|Primeiros Erros (Chove)
2000|b|rocknac|Capital Inicial|Natasha
2000|b|rocknac|Capital Inicial|À Sua Maneira
2000|b|rocknac|Charlie Brown Jr. feat. Negra Li|Não É Sério
2000|b|rocknac|Skank|Três Lados
2000|b|rocknac|Skank|Balada do Amor Inabalável
2000|b|rocknac|Rita Lee|Pagu
2001|b|rocknac|Titãs|Epitáfio
2001|b|rocknac|Charlie Brown Jr.|Lugar ao Sol
2001|b|rocknac|Cássia Eller|Relicário
2001|b|rocknac|Cássia Eller|Vá Morar com o Diabo
2001|b|rocknac|Los Hermanos|Todo Carnaval Tem Seu Fim
2001|b|rocknac|Los Hermanos|A Flor
2001|b|rocknac|CPM 22|Tarde de Outubro
2001|b|rocknac|Titãs|Isso
2002|b|rocknac|Jota Quest|Só Hoje
2002|b|rocknac|Jota Quest|Do Seu Lado
2002|b|rocknac|CPM 22|Não Sei Viver Sem Ter Você
2002|b|rocknac|CPM 22|Regina Let's Go
2002|b|rocknac|Detonautas Roque Clube|Outro Lugar
2002|b|rocknac|Detonautas Roque Clube|Quando o Sol Se For
2002|b|rocknac|Capital Inicial|Quatro Vezes Você
2002|b|rocknac|Charlie Brown Jr.|Vícios e Virtudes
2003|b|rocknac|Pitty|Máscara
2003|b|rocknac|Los Hermanos|O Vencedor
2003|b|rocknac|Skank|Vou Deixar
2003|b|rocknac|Pitty|Admirável Chip Novo
2003|b|rocknac|Pitty|Teto de Vidro
2003|b|rocknac|Skank|Dois Rios
2003|b|rocknac|O Rappa|Rodo Cotidiano
2003|b|rocknac|Los Hermanos|Cara Estranho
2004|b|rocknac|Charlie Brown Jr.|Papo Reto
2004|b|rocknac|Charlie Brown Jr.|Champanhe e Água Benta
2004|b|rocknac|Pitty|Equalize
2004|b|rocknac|Pitty|Semana que Vem
2004|b|rocknac|Skank|Vamos Fugir
2004|b|rocknac|Skank|Acima do Sol
2004|b|rocknac|Detonautas Roque Clube|Olhos Certos
2004|b|rocknac|Ira! feat. Pitty|Eu Quero Sempre Mais
2005|b|rocknac|CPM 22|Um Minuto para o Fim do Mundo
2005|b|rocknac|Pitty|Na Sua Estante
2005|b|rocknac|Pitty|Memórias
2005|b|rocknac|Pitty|Déjà Vu
2005|b|rocknac|Los Hermanos|O Vento
2005|b|rocknac|Los Hermanos|Morena
2005|b|rocknac|Charlie Brown Jr.|Ela Vai Voltar (Todos os Defeitos de uma Mulher Perfeita)
2005|b|rocknac|Jota Quest|Além do Horizonte
2006|b|rocknac|NX Zero|Razões e Emoções
2006|b|rocknac|NX Zero|Além de Mim
2006|b|rocknac|Skank|Uma Canção É pra Isso
2006|b|rocknac|Skank|Mil Acasos
2006|b|rocknac|Fresno|Quebre as Correntes
2006|b|rocknac|CSS|Off the Hook
2006|b|rocknac|Moptop|O Rock Acabou
2006|b|rocknac|Cachorro Grande|Sinceramente
2007|b|rocknac|NX Zero|Pela Última Vez
2007|b|rocknac|NX Zero|Apenas Mais uma de Amor
2007|b|rocknac|Capital Inicial|Depois da Meia-Noite
2007|b|rocknac|Capital Inicial|Eu Nunca Disse Adeus
2007|b|rocknac|Pitty|Pulsos
2007|b|rocknac|Charlie Brown Jr.|Dona do Meu Pensamento
2007|b|rocknac|Detonautas Roque Clube|O Dia Que Não Terminou
2007|b|rocknac|Cachorro Grande|Você Não Sabe o Que Perdeu
2008|b|rocknac|Skank|Ainda Gosto Dela
2008|b|rocknac|NX Zero|Cedo ou Tarde
2008|b|rocknac|NX Zero|Daqui pra Frente
2008|b|rocknac|Fresno|Uma Música
2008|b|rocknac|Fresno|Desde Quando Você Se Foi
2008|b|rocknac|O Rappa|Monstro Invisível
2008|b|rocknac|Jota Quest|La Plata
2008|b|rocknac|Strike|Paraíso Proibido
2009|b|rocknac|Pitty|Me Adora
2009|b|rocknac|Charlie Brown Jr.|Só os Loucos Sabem
2009|b|rocknac|Pitty|Desconstruindo Amélia
2009|b|rocknac|NX Zero|Só Rezo
2009|b|rocknac|Skank|Sutilmente
2009|b|rocknac|Restart|Recomeçar
2009|b|rocknac|Charlie Brown Jr.|Me Encontra
2009|b|rocknac|Charlie Brown Jr.|Pontes Indestrutíveis

1992|b|rapnac|Gabriel o Pensador|Tô Feliz (Matei o Presidente)
1992|b|rapnac|Racionais MC's|Voz Ativa
1992|b|rapnac|Racionais MC's|Negro Limitado
1992|b|rapnac|Thaíde & DJ Hum|Nada Pode Me Parar
1992|b|rapnac|RZO|Pobre no Brasil Só Leva Chute
1993|b|rapnac|Racionais MC's|Fim de Semana no Parque
1993|b|rapnac|Gabriel o Pensador|Lôraburra
1993|b|rapnac|Racionais MC's|Homem na Estrada
1993|b|rapnac|Racionais MC's|Mano na Porta do Bar
1993|b|rapnac|Gabriel o Pensador|Retrato de um Playboy
1993|b|rapnac|Gabriel o Pensador|175 Nada Especial
1993|b|rapnac|Câmbio Negro|Sub-Raça
1993|b|rapnac|Gabriel o Pensador|Lavagem Cerebral
1994|b|rapnac|Athalyba e a Firma|Política
1994|b|rapnac|RPW|Pule ou Empurre
1994|b|rapnac|Visão de Rua|Confidências de uma Presidiária
1994|b|rapnac|Sistema Negro|Cada um por Si
1994|b|rapnac|Sistema Negro|Bem-vindos ao Inferno
1995|b|rapnac|Gabriel o Pensador|Estudo Errado
1995|b|rapnac|Gabriel o Pensador|Rabo de Saia
1995|b|rapnac|Gabriel o Pensador|Pega Ladrão
1995|b|rapnac|Planet Hemp|Legalize Já
1995|b|rapnac|Planet Hemp|Mantenha o Respeito
1995|b|rapnac|Planet Hemp|Phunky Buddha
1995|b|rapnac|Planet Hemp|Dig Dig Dig (Hempa)
1995|b|rapnac|Planet Hemp|A Culpa É de Quem?
1996|b|rapnac|Thaíde & DJ Hum|Sr. Tempo Bom
1996|b|rapnac|Thaíde & DJ Hum|Preste Atenção
1996|b|rapnac|Thaíde & DJ Hum|Afro Brasileiro
1996|b|rapnac|GOG|Periferia Segue Sangrando
1996|b|rapnac|GOG|E Se Esse Som Estourar
1996|b|rapnac|Pavilhão 9|Vietnan
1997|b|rapnac|Racionais MC's|Diário de um Detento
1997|b|rapnac|Racionais MC's|Capítulo 4, Versículo 3
1997|b|rapnac|Gabriel o Pensador|Cachimbo da Paz
1997|b|rapnac|Racionais MC's|Fórmula Mágica da Paz
1997|b|rapnac|Racionais MC's|Periferia É Periferia (Em Qualquer Lugar)
1997|b|rapnac|Racionais MC's|Mágico de Oz
1997|b|rapnac|Racionais MC's|Jorge da Capadócia
1997|b|rapnac|Gabriel o Pensador|Pátria que Me Pariu
1998|b|rapnac|Marcelo D2|Eu Tiro É Onda
1998|b|rapnac|Marcelo D2|1967
1998|b|rapnac|DMN|H.Aço
1998|b|rapnac|DJ Jamaika|Tô Só Observando
1998|b|rapnac|DJ Jamaika|Dando Trabalho pros Anjos
1998|b|rapnac|Consciência X Atual|Herói sem Medalha
1998|b|rapnac|Apocalipse 16|Arrependa-se
1998|b|rapnac|Pavilhão 9|Se Deus Vier, Que Venha Armado
1999|b|rapnac|MV Bill|Traficando Informação
1999|b|rapnac|MV Bill|Soldado do Morro
1999|b|rapnac|Facção Central|Isso Aqui É uma Guerra
1999|b|rapnac|Facção Central|Minha Voz Está no Ar
1999|b|rapnac|RZO|O Trem
1999|b|rapnac|Xis|Us Mano e as Mina
1999|b|rapnac|Detentos do Rap|Condições de Sobreviver
1999|b|rapnac|Gabriel o Pensador|Cachorrada
2000|b|rapnac|Sabotage|Rap É Compromisso
2000|b|rapnac|Sabotage|No Brooklin
2000|b|rapnac|Sabotage|Na Zona Sul
2000|b|rapnac|Planet Hemp|Contexto
2000|b|rapnac|Planet Hemp|Ex-Quadrilha da Fumaça
2000|b|rapnac|GOG|Brasil com P
2000|b|rapnac|MV Bill|A Noite
2000|b|rapnac|Marcelo D2|Vai Vendo
2001|b|rapnac|Sabotage|Um Bom Lugar
2001|b|rapnac|Gabriel o Pensador|Até Quando?
2001|b|rapnac|Gabriel o Pensador|Se Liga Aí
2001|b|rapnac|Gabriel o Pensador|Tem Alguém Aí?
2001|b|rapnac|Xis|Chapa o Côco
2001|b|rapnac|De Leve|Largado
2001|b|rapnac|Rappin' Hood|Sou Negrão
2001|b|rapnac|Rappin' Hood|Vida Bandida (Culpa da Situação)
2002|b|rapnac|Racionais MC's|Negro Drama
2002|b|rapnac|Racionais MC's|Vida Loka, Pt. 2
2002|b|rapnac|Racionais MC's|Vida Loka, Pt. 1
2002|b|rapnac|Racionais MC's|Jesus Chorou
2002|b|rapnac|Racionais MC's|Da Ponte pra Cá
2002|b|rapnac|Racionais MC's|A Vítima
2002|b|rapnac|Racionais MC's|Eu Sou 157
2002|b|rapnac|MV Bill|Só Deus Pode Me Julgar
2003|b|rapnac|Marcelo D2|Qual É?
2003|b|rapnac|Marcelo D2|À Procura da Batida Perfeita
2003|b|rapnac|Marcelo D2|A Maldição do Samba
2003|b|rapnac|Visão de Rua|A Noiva do Thock
2003|b|rapnac|Gabriel o Pensador|Tás a Ver?
2003|b|rapnac|Gabriel o Pensador|Racismo É Burrice
2003|b|rapnac|Gabriel o Pensador|Mandei Avisar
2003|b|rapnac|Gabriel o Pensador|Retrato de um Playboy - Parte II
2004|b|rapnac|Marcelo D2|Loadeando
2004|b|rapnac|GOG|O Amor Venceu a Guerra
2004|b|rapnac|A Família|Castelo de Madeira
2004|b|rapnac|Black Alien|Babylon by Gus
2004|b|rapnac|Black Alien|Coração do Meu Mundo
2004|b|rapnac|Black Alien|Mister Niterói
2004|b|rapnac|Black Alien|Como Eu Te Quero
2004|b|rapnac|Helião & Negra Li|O Rap Não Tem Pra Ninguém
2005|b|rapnac|Inquérito|Mais Louco Que U Barato!
2005|b|rapnac|Gabriel o Pensador|Palavras Repetidas
2005|b|rapnac|Gabriel o Pensador|Rap do Feio
2005|b|rapnac|Gabriel o Pensador|Sorria
2005|b|rapnac|Gabriel o Pensador|Cavaleiro Andante
2005|b|rapnac|Gabriel o Pensador|Tudo na Mente
2005|b|rapnac|Gabriel o Pensador|Sem Neurose
2005|b|rapnac|Marcelo D2|CB (Sangue Bom)
2006|b|rapnac|MV Bill|O Bagulho É Doido
2006|b|rapnac|MV Bill & Kmila CDD|Estilo Vagabundo
2006|b|rapnac|MV Bill|Língua de Tamanduá
2006|b|rapnac|MV Bill|Preto em Movimento
2006|b|rapnac|Marcelo D2|Gueto
2006|b|rapnac|Criolo Doido|É o Teste
2006|b|rapnac|Criolo Doido|Ainda Há Tempo
2006|b|rapnac|Negra Li|Você Vai Estar na Minha
2007|b|rapnac|Marcelo D2|Meu Samba É Assim
2007|b|rapnac|Marcelo D2|Dor de Verdade
2007|b|rapnac|Marcelo D2|That's What I Got
2007|b|rapnac|Marcelo D2|Falador
2008|b|rapnac|Kamau|A Quem Possa Interessar
2008|b|rapnac|Emicida|Triunfo
2008|b|rapnac|Marcelo D2|Fala Sério!
2008|b|rapnac|Marcelo D2|Desabafo
2008|b|rapnac|Gabriel o Pensador|Deixa Quieto
2009|b|rapnac|Emicida|E.M.I.C.I.D.A.
2009|b|rapnac|Filipe Ret|Asfalto do Catete
2009|b|rapnac|MV Bill & Kmila CDD|O Bonde Não Para
2009|b|rapnac|Marcelo D2|Ela Disse
2009|b|rapnac|Marcelo D2|Pode Acreditar (Meu Laiá Laiá)
2009|b|rapnac|Gabriel o Pensador|Tudo Certo
2009|b|rapnac|Rashid|Hora de Acordar
2009|b|rapnac|Flora Matos|Pretin
2010|b|rapnac|Emicida|Avua Besouro
2010|b|rapnac|Criolo|Grajauex
2010|b|rapnac|Criolo|Subirusdoistiozin
2010|b|rapnac|Criolo|Cálice
2010|b|rapnac|MV Bill|Corrente
2010|b|rapnac|Gabriel o Pensador|Nunca Serão
2010|b|rapnac|Emicida|Rinha (Já Ouviu Falar?)
2011|b|rapnac|Criolo|Não Existe Amor em SP
2011|b|rapnac|Criolo|Mariô
2011|b|rapnac|Criolo|Lion Man
2011|b|rapnac|Criolo|Freguês da Meia-Noite
2011|b|rapnac|Emicida|Rua Augusta
2011|b|rapnac|Emicida|Então Toma!
2011|b|rapnac|Emicida, Projota & Rashid|Nova Ordem
2011|b|rapnac|Karol Conká|Boa Noite
2012|b|rapnac|Racionais MC's|Mil Faces de um Homem Leal (Marighella)
2012|b|rapnac|Emicida|Zica, Vai Lá
2012|b|rapnac|Emicida|Dedo na Ferida
2012|b|rapnac|Filipe Ret|Neurótico de Guerra
2012|b|rapnac|Cone Crew Diretoria|Chama os Mulekes
2012|b|rapnac|Projota|Desci a Ladeira
2012|b|rapnac|Rashid|Quero Ver Segurar
2012|b|rapnac|Gabriel o Pensador|Linhas Tortas
2013|b|rapnac|Emicida|Levanta e Anda
2013|b|rapnac|Emicida feat. Pitty|Hoje Cedo
2013|b|rapnac|Emicida feat. Dona Jacira|Crisântemo
2013|b|rapnac|Emicida|Zoião
2013|b|rapnac|Emicida & Criolo|Demorô
2013|b|rapnac|Edi Rock feat. Seu Jorge|That's My Way
2013|b|rapnac|Karol Conká|Gandaia
2013|b|rapnac|Marcelo D2|Está Chegando a Hora (Abre Alas)
2014|b|rapnac|Racionais MC's|Quanto Vale o Show?
2014|b|rapnac|Racionais MC's|Eu Compro
2014|b|rapnac|Racionais MC's|Preto Zica
2014|b|rapnac|Racionais MC's|Finado Neguin
2014|b|rapnac|Racionais MC's|Cores & Valores
2014|b|rapnac|Criolo|Convoque Seu Buda
2014|b|rapnac|Criolo|Duas de Cinco
2014|b|rapnac|Karol Conká feat. Tropkillaz|Tombei
2015|b|rapnac|Emicida feat. J. Ghetto|Boa Esperança
2015|b|rapnac|Emicida feat. Vanessa da Mata|Passarinhos
2015|b|rapnac|Karol Conká|É o Poder
2015|b|rapnac|Filipe Ret|Invicto
2015|b|rapnac|Filipe Ret|Chefe do Crime Perfeito
2015|b|rapnac|Criolo feat. Tulipa Ruiz|Cartão de Visita
2015|b|rapnac|Emicida|Baiana
2015|b|rapnac|Filipe Ret|Isso Que É Vida
2016|b|rapnac|Baco Exu do Blues|Sujismundo
2016|b|rapnac|Baco Exu do Blues|999
2016|b|rapnac|Emicida|Mandume
2016|b|rapnac|Emicida|Mãe
2016|b|rapnac|Emicida|Madagascar
2016|b|rapnac|Rincon Sapiência|Ponta de Lança (Verso Livre)
2016|b|rapnac|Karol Conká|Maracutaia
2016|b|rapnac|Gabriel o Pensador|Fé na Luta
2017|b|rapnac|Djonga|Olho de Tigre
2017|b|rapnac|Baco Exu do Blues|Te Amo Disgraça
2017|b|rapnac|Djonga|Esquimó
2017|b|rapnac|Djonga|Geminiano
2017|b|rapnac|Emicida|Pantera Negra
2017|b|rapnac|Djonga|O Mundo É Nosso
2017|b|rapnac|Karol Conká|Lalá
2017|b|rapnac|Matuê|Anos Luz
2018|b|rapnac|Baco Exu do Blues|Bluesman
2018|b|rapnac|Baco Exu do Blues|Me Desculpa Jay-Z
2018|b|rapnac|Baco Exu do Blues|Girassóis de Van Gogh
2018|b|rapnac|Djonga|Junho de 94
2018|b|rapnac|Djonga|Ufa
2018|b|rapnac|Filipe Ret|Louco Pra Voltar
2018|b|rapnac|Matuê|Banco
2018|b|rapnac|Filipe Ret|A Libertina
2019|b|rapnac|Emicida, Majur & Pabllo Vittar|AmarElo
2019|b|rapnac|Emicida|Principia
2019|b|rapnac|Emicida feat. Marcos Valle & Thiago Ventura|Pequenas Alegrias da Vida Adulta
2019|b|rapnac|Matuê|Kenny G
2019|b|rapnac|Baco Exu do Blues|Paris
2019|b|rapnac|Djonga|Hat-Trick
2019|b|rapnac|Filipe Ret|Sessão do Descarrego
2019|b|rapnac|Djonga|Bença
2020|b|rapnac|Matuê|Máquina do Tempo
2020|b|rapnac|Matuê|777-666
2020|b|rapnac|Matuê|Gorilla Roxo
2020|b|rapnac|Matuê|É Sal
2020|b|rapnac|Matuê & Teto|M4
2020|b|rapnac|Baco Exu do Blues|Tommie Smith
2020|b|rapnac|Baco Exu do Blues|Mate Todos Eles
2020|b|rapnac|Filipe Ret|Cidade dos Anjos
2021|b|rapnac|L7NNON & Os Hawaianos|Desenrola, Bate, Joga de Ladin
2021|b|rapnac|Matuê, Teto & WIU|Vampiro
2021|b|rapnac|Matuê|Groupies
2021|b|rapnac|Filipe Ret|Corte Americano
2021|b|rapnac|Filipe Ret|Me Sinto Abençoado
2021|b|rapnac|Karol Conká|Dilúvio
2021|b|rapnac|Djonga|Suíte 14
2021|b|rapnac|Criolo|Fellini
2022|b|rapnac|Xamã, Gustah & Neo Beats|Malvadão 3
2022|b|rapnac|Baco Exu do Blues|Gotham é Aqui
2022|b|rapnac|Baco Exu do Blues & Luísa Sonza|Hotel Caro
2022|b|rapnac|Matuê|Flow Espacial
2022|b|rapnac|Filipe Ret|Tudo Nosso
2022|b|rapnac|Filipe Ret|Melhor Agora
2022|b|rapnac|Filipe Ret|Sonho dos Cria
2022|b|rapnac|Djonga|Mil Motivos
2023|b|rapnac|Veigh|Novo Balanço
2023|b|rapnac|Matuê|Quer Voar
2023|b|rapnac|Matuê feat. Rich the Kid|Conexões de Máfia
2023|b|rapnac|Matuê|Filho da Noite
2023|b|rapnac|Xamã, Gabriel o Pensador & Lulu Santos|Cachimbo da Paz 2
2023|b|rapnac|Filipe Ret|Deus Perdoa
2023|b|rapnac|Filipe Ret|Amor Livre
2023|b|rapnac|Filipe Ret|Ritmo do Crime

1994|b|funk|Big Rap & Luciano|Rap do Bonde
1994|b|funk|MC Markynhos & MC Dollores|Rap da Diferença
1994|b|funk|Grupo Geração|Rap do Surfista
1994|b|funk|SD Boys|Menina (Venha pra Mim)
1994|b|funk|Mike Dee|Sinto Saudade
1994|b|funk|Copacabana Beat|Mel da Sua Boca
1994|b|funk|Grupo Geração|Rap do Rio
1994|b|funk|Mr. Catra|Vida na Cadeia
1995|b|funk|Cidinho & Doca|Rap da Felicidade
1995|b|funk|MC Bob Rum|Rap do Silva
1995|b|funk|MC Júnior & MC Leonardo|Rap das Armas
1995|b|funk|MC Júnior & MC Leonardo|Endereço dos Bailes
1995|b|funk|William & Duda|Rap do Borel
1995|b|funk|MC Danda & Taffarel|Rap do Festival
1995|b|funk|MC Marcinho|Rap do Solitário
1995|b|funk|Claudinho & Buchecha|Rap do Salgueiro
1996|b|funk|Claudinho & Buchecha|Só Love
1996|b|funk|Claudinho & Buchecha|Conquista
1996|b|funk|Claudinho & Buchecha|Nosso Sonho
1996|b|funk|Claudinho & Buchecha|Tempos Modernos
1996|b|funk|Claudinho & Buchecha|Chance
1996|b|funk|Claudinho & Buchecha|Pra Lembrar de Você
1996|b|funk|Claudinho & Buchecha|Temperamental
1996|b|funk|MC Marcinho|Garota Nota 100
1997|b|funk|Claudinho & Buchecha|Quero Te Encontrar
1997|b|funk|Claudinho & Buchecha|Meu Compromisso
1997|b|funk|Claudinho & Buchecha|Uma Noite e 1/2
1997|b|funk|Claudinho & Buchecha|Toda Linda
1997|b|funk|Claudinho & Buchecha|A Forma
1997|b|funk|Claudinho & Buchecha|Rap da União
1997|b|funk|Claudinho & Buchecha|Diretriz
1997|b|funk|MC Marcinho & MC Cacau|Porque Te Amo
1998|b|funk|Amilcka & Chocolate|Som de Preto
1998|b|funk|Claudinho & Buchecha|Enquanto Eu Viver
1998|b|funk|Claudinho & Buchecha|Xereta
1998|b|funk|Claudinho & Buchecha|Nosso Romance
1998|b|funk|Claudinho & Buchecha|Carma Chinês
1998|b|funk|Claudinho & Buchecha|Lilás
1998|b|funk|Cidinho & Doca|Rap Bonde da CDD
1998|b|funk|MC Marcinho|Princesa
1999|b|funk|Pepê & Neném|Mania de Você
1999|b|funk|Pepê & Neném|Mais Uma Vez
1999|b|funk|Pepê & Neném|Me Apaixonei Por Você
1999|b|funk|MC Marcinho|Motivos da Vida
1999|b|funk|MC Marcinho|Escrito Pras Princesas
1999|b|funk|Claudinho & Buchecha|Coisa de Cinema
1999|b|funk|Claudinho & Buchecha|Carro Velho
1999|b|funk|Claudinho & Buchecha|Lindo Balão Azul
2000|b|funk|Pepê & Neném|Nada Me Faz Esquecer
2000|b|funk|Pepê & Neném|Esperando Pra Te Amar
2000|b|funk|Claudinho & Buchecha|Berreco
2000|b|funk|Claudinho & Buchecha|Destino
2000|b|funk|Claudinho & Buchecha|Minha Tara
2000|b|funk|Claudinho & Buchecha|Vinho Tinto
2000|b|funk|Claudinho & Buchecha|Funk Doido
2000|b|funk|Bonde do Tigrão|Sai do Chão
2001|b|funk|Bonde do Tigrão|Cerol na Mão
2001|b|funk|MC Marcinho|Glamurosa
2001|b|funk|Bonde do Tigrão|Tchu Tchuca
2001|b|funk|Bonde do Tigrão|O Baile Todo (Só as Cachorras)
2001|b|funk|Bonde do Tigrão|Caçador do Tchutchuquinha
2001|b|funk|De Falla|Popozuda Rock 'n' Roll
2001|b|funk|Claudinho & Buchecha|Males
2001|b|funk|Pepê & Neném|Saudade do Seu Amor
2002|b|funk|Claudinho & Buchecha|Fico Assim Sem Você
2002|b|funk|Claudinho & Buchecha|Gostosa
2002|b|funk|Claudinho & Buchecha|Vamos Dançar
2002|b|funk|Claudinho & Buchecha|Bonde da Zoeira
2002|b|funk|Claudinho & Buchecha|Deusa Negra
2002|b|funk|Bonde do Tigrão|Estátua (Morto, Vivo)
2002|b|funk|Bonde do Tigrão|Pega o Bonde e Vem
2002|b|funk|Bonde do Tigrão|Blackout
2003|b|funk|MC Serginho & Lacraia|Eguinha Pocotó
2003|b|funk|MC Serginho & Lacraia|Vai Serginho
2003|b|funk|MC Serginho & Lacraia|Vai Lacraia
2003|b|funk|MC Marcinho|Catucar
2003|b|rapnac|Facção Central|Eu Não Pedi pra Nascer
2003|b|funk|MC Marcinho|Quero Seu Amor
2003|b|funk|MC Marcinho|Funk da Antiga
2003|b|funk|MC Marcinho|Zona Oeste
2004|b|funk|Tati Quebra Barraco|Boladona
2004|b|funk|Deize Tigrona|Injeção
2004|b|funk|Tati Quebra Barraco|Dako é Bom
2004|b|funk|Tati Quebra Barraco|Se Marcar
2004|b|funk|Tati Quebra Barraco|Kabo Kaki
2004|b|funk|Bonde do Tigrão|Tia Rocha, Tia Tocha
2004|b|funk|Bola de Fogo|Atoladinha
2004|b|funk|Tati Quebra Barraco|Tapinha Atrás, Tapinha na Frente
2005|b|funk|MC Pé de Pano|Ela Tá Querendo Aparecer
2005|b|funk|Tati Quebra Barraco|Sou Feia Mais Tô na Moda
2005|b|funk|Tati Quebra Barraco feat. Bonde do Tigrão|Orgia
2005|b|funk|Bonde do Tigrão|Twister Treme Tudo
2005|b|funk|Deize Tigrona|Miniatura de Lulu
2005|b|funk|MC Sapão|Diretoria
2005|b|funk|Dennis DJ|Joga a Perereca
2005|b|funk|Perlla|Tremendo Vacilão
2006|b|funk|MC Leozinho|Ela Só Pensa em Beijar
2006|b|funk|MC Leozinho|O Show
2006|b|funk|Mr. Catra|Adultério
2006|b|funk|Perlla|Totalmente Demais
2006|b|funk|Perlla|Eu Vou
2006|b|funk|MC Sapão|Tô Tranquilão
2006|b|funk|Tati Quebra Barraco|Satisfação
2006|b|funk|Bonde do Rolê|Office Boy
2007|b|funk|MC Leozinho|Sente a Pegada
2007|b|funk|MC Leozinho|Negro Gato
2007|b|funk|Gaiola das Popozudas|Late Que Eu Tô Passando
2007|b|funk|Gaiola das Popozudas|Agora Tô Solteira
2007|b|funk|Bonde do Rolê|Solta o Frango
2007|b|funk|Bonde do Rolê|Marina Gasolina
2007|b|funk|Perlla feat. Belo|Depois do Amor
2007|b|funk|Perlla|Carrapato
2008|b|funk|MC Créu|Dança do Créu
2008|b|funk|Mulher Melancia|Velocidade 6
2008|b|funk|Mulher Melancia|Solteira Sim, Sozinha Nunca
2008|b|funk|Mc Buiu|Aquecimento das Panteras
2008|b|funk|MC Marcinho|Favorita
2008|b|funk|Deize Tigrona|Garota Chapa Quente
2008|b|funk|MC Backdi & MC Bio G3|Bonde da Juju
2008|b|funk|Perlla|Menina Chapa-Quente
2009|b|funk|Naldo Benny|Na Veia
2009|b|funk|Buchecha|Romântico
2009|b|funk|Gaiola das Popozudas|Quero Te Dar
2009|b|funk|Mc Koringa|Kika no Calcanhar
2009|b|funk|Valesca Popozuda|Bebida Que Pisca
2009|b|funk|Tati Quebra Barraco|Sucessar
2009|b|funk|Mulher Filé|Eu Viro Celebridade
2009|b|funk|MC Daleste|Bonde dos Menor
2010|b|funk|Os Avassaladores|Sou Foda
2010|b|funk|Buchecha|Muito Prazer
2010|b|funk|Perlla|Rindo à Toa
2010|b|funk|Bonde do Tigrão|Prisioneira
2010|b|funk|Mulher Filé|Estaladinha
2010|b|funk|Mc Koringa|Dança Sensual
2010|b|funk|Gaiola das Popozudas|My Pussy É o Poder
2010|b|funk|MC Smith|Vida Bandida
2011|b|funk|MC Boy do Charmes|Megane
2011|b|funk|MC Guimê|Tá Patrão
2011|b|funk|MC Carol|Jorginho Me Empresta a 12
2011|b|funk|MC Carol|Minha Vó Tá Maluca
2011|b|funk|Naldo Benny|Meu Corpo Quer Você
2011|b|funk|Mulher Filé|Príncipe Encantado
2011|b|funk|Buchecha|Fogo de Palha
2011|b|funk|MC Marcinho|Tudo É Festa
2012|b|funk|MC Guimê|Plaque de 100
2012|b|funk|Nego do Borel|Os Caras do Momento
2012|b|funk|Bonde das Maravilhas feat. Nego do Borel|Brincadeira das Maravilhas
2012|b|funk|MC Boy do Charmes|Onde Eu Chego Paro Tudo
2012|b|funk|MC Rodolfinho|Como É Bom Ser Vida Loka
2012|b|funk|Naldo Benny|Se Joga
2012|b|funk|Naldo Benny|Amor de Chocolate
2012|b|funk|Valesca Popozuda feat. Mr. Catra|Mama
2013|b|funk|Bonde das Maravilhas|Quadradinho de Oito
2013|b|funk|Valesca Popozuda|Beijinho no Ombro
2013|b|funk|MC Federado e os Leleks|Passinho do Volante (Ah Lelek Lek Lek)
2013|b|funk|MC Gui|O Bonde Passou
2013|b|funk|MC Daleste|São Paulo
2013|b|funk|MC Guimê|Na Pista Eu Arraso
2013|b|funk|MC Marcelly|Bigode Grosso
2013|b|funk|Bonde das Maravilhas|Aquecimento das Maravilhas
2014|b|funk|MC Guimê feat. Emicida|País do Futebol
2014|b|funk|Ludmilla|Hoje
2014|b|funk|MC Crash|Passinho do Romano
2014|b|funk|Valesca Popozuda|Eu Sou a Diva Que Você Quer Copiar
2014|b|funk|MC Gui|Sonhar
2014|b|funk|MC Gui feat. MC Pocahontas|Rainha do Baile
2014|b|funk|Ludmilla|Sem Querer
2014|b|funk|Nego do Borel|Diamante da Lama
2015|b|funk|MC João|Baile de Favela
2015|b|funk|MC Bin Laden|Tá Tranquilo, Tá Favorável
2015|b|funk|MC Delano|Na Ponta Ela Fica
2015|b|funk|Ludmilla|Te Ensinei Certin
2015|b|funk|MC Livinho|Perigosa
2015|b|funk|Valesca Popozuda|Sou Dessas
2015|b|funk|MC Pedrinho|Dom Dom Dom
2015|b|funk|Nego do Borel|Não Me Deixe Sozinho
2016|b|funk|MC Kevinho|Olha a Explosão
2016|b|funk|MC Livinho|Cheia de Marra
2016|b|funk|MC Zaac & Jerry|Bumbum Granada
2016|b|funk|MC G15|Deu Onda
2016|b|funk|Dennis DJ feat. MC Nandinho & MC Nego Bam|Malandramente
2016|b|funk|Ludmilla|Bom
2016|b|funk|MC Livinho|Tudo de Bom
2016|b|funk|Pocah|Perdendo a Linha
2017|b|funk|MC Fioti|Bum Bum Tam Tam
2017|b|funk|MC Zaac & Jerry Smith|Vai Embrazando
2017|b|funk|MC Kevinho|Rabiola
2017|b|funk|MC Kevinho|Tô Apaixonado Nessa Mina
2017|b|funk|MC Livinho|Fazer Falta
2017|b|funk|MC Kevinho & Léo Santana|Encaixa
2017|b|funk|Ludmilla|Cheguei
2017|b|funk|MC Kevinho|Turutum
2018|b|funk|Kevin o Chris|Eu Vou pro Baile da Gaiola
2018|b|funk|MC Loma e as Gêmeas Lacração|Envolvimento
2018|b|funk|Ludmilla|Solta a Batida
2018|b|funk|MC Kevinho|Papum
2018|b|funk|MC Kevinho & MC Kekel|O Bebê
2018|b|funk|Nego do Borel & DJ Rennan da Penha|Me Solta
2018|b|funk|Dani Russo feat. Naiara Azevedo & MC Pocahontas|Oh Quem Voltou
2018|b|funk|Dennis DJ & MC Kevinho|Agora É Tudo Meu
2019|b|funk|Kevin o Chris|Vamos pra Gaiola
2019|b|funk|Ludmilla|Verdinha
2019|b|funk|Kevin o Chris|Ela É do Tipo
2019|b|funk|MC Niack|Oh Juliana
2019|b|funk|Dadá Boladão feat. Tati Zaqui & OIK|Surtada
2019|b|funk|Ludmilla feat. Anitta|Favela Chegou
2019|b|funk|MC Kevinho|Facilita
2019|b|funk|Kevin o Chris feat. Pocah|Resenha Lá em Casa
2020|b|funk|Ludmilla|Rainha da Favela
2020|b|funk|Ludmilla|Cobra Venenosa
2020|b|funk|Pedro Sampaio|Galopa
2020|b|funk|Pedro Sampaio feat. Lexa|Chama Ela
2020|b|funk|Kevin o Chris feat. Ferrugem|Romance Proibido
2020|b|funk|Bonde das Maravilhas|Sou Maravilha
2020|b|funk|Pocah|Depois da Quarentena
2020|b|funk|WC no Beat feat. Ludmilla|Sem Limites
2021|b|funk|Pedro Sampaio|Sentadão
2021|b|funk|Ludmilla|Socadona
2021|b|funk|Kevin o Chris feat. Dilsinho|Saudade Né
2021|b|funk|Kevin o Chris|Tipo Gin (E Ela Tá Movimentando)
2021|b|funk|Dennis DJ feat. Ludmilla & Xamã|Deixa de Onda
2021|b|funk|Pocah|Eu Viciei
2021|b|funk|Pocah|Nem On Nem Off
2021|b|funk|Bonde das Maravilhas|Round 6
2022|b|funk|DJ LK da Escócia|Tubarão Te Amo
2022|b|funk|Anitta & Pedro Sampaio|No Chão Novinha
2022|b|funk|Ludmilla|Maldivas
2022|b|funk|Ludmilla|Tic Tac
2022|b|funk|Kevin o Chris|Incendeia
2022|b|funk|Bonde das Maravilhas|As Mais Gostosas do Baile
2022|b|funk|Pocah|Movimenta
2022|b|funk|Pocah|Ainda
2023|b|funk|Pedro Sampaio & MC Pedrinho|Dançarina
2023|b|funk|Dennis & MC Kevin o Chris|Tá OK
2023|b|funk|Bibi Babydoll & DJ Brunin XM|Automotivo Bibi Fogosa
2023|b|funk|Kevin o Chris & MC Caja|Papin
2023|b|funk|Ludmilla|Sou Má
2023|b|funk|Ludmilla|Nasci Pra Vencer
2023|b|funk|Pocah|Barulhinho
2023|b|funk|Kevin o Chris & DJ NK da Serra|Faz um Vuk Vuk

1974|b|pag|Martinho da Vila|Canta, Canta, Minha Gente
1974|b|pag|Martinho da Vila|Disritmia
1974|b|pag|Clara Nunes|Alvorecer
1974|b|pag|Clara Nunes|Menino Deus
1974|b|pag|Cartola|Alvorada
1974|b|pag|Cartola|O Sol Nascerá
1974|b|pag|Cartola|Acontece
1974|b|pag|Beth Carvalho|1800 Colinas
1975|b|pag|Alcione|Não Deixe o Samba Morrer
1975|b|pag|Clara Nunes|O Mar Serenou
1975|b|pag|Alcione|O Surdo
1975|b|pag|Clara Nunes|A Deusa dos Orixás
1975|b|pag|Agepê|Moro Onde Não Mora Ninguém
1975|b|pag|Paulinho da Viola|Argumento
1975|b|pag|Paulinho da Viola|Amor à Natureza
1975|b|pag|Roberto Ribeiro|Estrela de Madureira
1976|b|pag|Cartola|O Mundo É um Moinho
1976|b|pag|Cartola|As Rosas Não Falam
1976|b|pag|Cartola|Peito Vazio
1976|b|pag|Cartola|Preciso Me Encontrar
1976|b|pag|Clara Nunes|Canto das Três Raças
1976|b|pag|Clara Nunes|Fuzuê
1976|b|pag|Roberto Ribeiro|Acreditar
1976|b|pag|Paulinho da Viola|Vela no Breu
1977|b|pag|Beth Carvalho|Saco de Feijão
1977|b|pag|Beth Carvalho|Olho por Olho
1977|b|pag|João Nogueira|Espelho
1977|b|pag|Clara Nunes|Coisa da Antiga
1977|b|pag|Clara Nunes|P.C.J. (Partido Clementina de Jesus)
1977|b|pag|Alcione|Pandeiro É Meu Nome
1977|b|pag|Luiz Ayrão|Os Amantes
1977|b|pag|Candeia|Luz da Inspiração
1978|b|pag|Beth Carvalho|Vou Festejar
1978|b|pag|Beth Carvalho|Goiabada Cascão
1978|b|pag|Clara Nunes|Guerreira
1978|b|pag|Clara Nunes|Moeda
1978|b|pag|Alcione|Sufoco
1978|b|pag|Paulinho da Viola|Coração Leviano
1978|b|pag|Roberto Ribeiro|Todo Menino É um Rei
1978|b|pag|Roberto Ribeiro|Meu Drama
1979|b|pag|Beth Carvalho|Coisinha do Pai
1979|b|pag|Beth Carvalho|Pedi ao Céu
1979|b|pag|Beth Carvalho|Senhora Rezadeira
1979|b|pag|Clara Nunes|Feira de Mangaio
1979|b|pag|Clara Nunes|Banho de Manjericão
1979|b|pag|Alcione|Gostoso Veneno
1979|b|pag|Alcione|Rio Antigo
1979|b|pag|Roberto Ribeiro|Vazio
1980|b|pag|João Nogueira|Poder da Criação
1980|b|pag|Fundo de Quintal|Prazer da Serrinha
1980|b|pag|Fundo de Quintal|Bar da Esquina
1980|b|pag|Alcione|E Vamos à Luta
1980|b|pag|Beth Carvalho|A Chuva Cai
1980|b|pag|Roberto Ribeiro|Só Chora Quem Ama
1980|b|pag|Leci Brandão|Essa Tal Criatura
1980|b|pag|Benito di Paula|Pagode da Pesada
1981|b|pag|Clara Nunes|Portela na Avenida
1981|b|pag|Clara Nunes|Deixa Clarear
1981|b|pag|Clara Nunes|Viola de Penedo
1981|b|pag|Martinho da Vila|Ex-Amor
1981|b|pag|Paulinho da Viola|Onde a Dor Não Tem Razão
1981|b|pag|João Nogueira|O Homem dos 40
1981|b|pag|Dona Ivone Lara|Sorriso Negro
1981|b|pag|Almir Guineto|Mordomia
1982|b|pag|Clara Nunes|Nação
1982|b|pag|Clara Nunes|Serrinha
1982|b|pag|Beth Carvalho|Traço de União
1982|b|pag|Paulinho da Viola|Rumo dos Ventos
1982|b|pag|Almir Guineto|Mel de Marimbondo
1982|b|pag|Clara Nunes|Ijexá (Filhos de Gandhi)
1982|b|pag|Alcione|Nega Mina
1982|b|pag|Bezerra da Silva|Vizinha Faladeira
1983|b|pag|Beth Carvalho|Firme e Forte
1983|b|pag|Beth Carvalho|Camarão que Dorme a Onda Leva
1983|b|pag|Beth Carvalho|Suor no Rosto
1983|b|pag|Paulinho da Viola|Mais Quem Disse Que Eu Te Esqueço
1983|b|pag|Alcione|Um Ser de Luz
1983|b|pag|Fundo de Quintal|Caciqueando
1983|b|pag|Fundo de Quintal|Canto de Rainha
1983|b|pag|Bezerra da Silva|Pai Véio 171
1984|b|pag|Agepê|Deixa Eu Te Amar
1984|b|pag|Fundo de Quintal|Seja Sambista Também
1984|b|pag|Fundo de Quintal|Castelo de Cera
1984|b|pag|Beth Carvalho|Coração Feliz
1984|b|pag|Beth Carvalho|Toque de Malícia
1984|b|pag|Bezerra da Silva|Defunto Caguete
1984|b|pag|Bezerra da Silva|O Rei da Cocada Preta
1984|b|pag|Fundo de Quintal|Parei
1985|b|pag|Leci Brandão|Zé do Caroço
1985|b|pag|Almir Guineto|Insensato Destino
1985|b|pag|Almir Guineto|Jibóia
1985|b|pag|Zeca Pagodinho|Bagaço da Laranja
1985|b|pag|Fundo de Quintal|Divina Luz (Clareou)
1985|b|pag|Fundo de Quintal|Ópio
1985|b|pag|Roberto Ribeiro|Corrente de Aço
1985|b|pag|Alcione|Mesa de Bar
1986|b|pag|Zeca Pagodinho|Judia de Mim
1986|b|pag|Zeca Pagodinho|Coração em Desalinho
1986|b|pag|Zeca Pagodinho|SPC
1986|b|pag|Jorge Aragão|Coisa de Pele
1986|b|pag|Alcione|Garoto Maroto
1986|b|pag|Fundo de Quintal|O Mapa da Mina
1986|b|pag|Bezerra da Silva|Malandragem Dá um Tempo
1986|b|pag|Almir Guineto|Caxambu
1987|b|pag|Zeca Pagodinho|Maneiras
1987|b|pag|Zeca Pagodinho|Patota de Cosme
1987|b|pag|Jovelina Pérola Negra|Luz do Repente
1987|b|pag|Jovelina Pérola Negra|Sonho Juvenil (Garoto Zona Sul)
1987|b|pag|Fundo de Quintal|Do Fundo do Nosso Quintal
1987|b|pag|Alcione|Meu Vício É Você
1987|b|pag|Bezerra da Silva|A Semente
1987|b|pag|Almir Guineto|Perfume de Champagne
1988|b|pag|Fundo de Quintal|O Show Tem Que Continuar
1988|b|pag|Martinho da Vila|Kizomba, Festa da Raça
1988|b|pag|Bezerra da Silva|Candidato Caô Caô
1988|b|pag|Zeca Pagodinho|Jeito Moleque
1988|b|pag|Zeca Pagodinho|Feira do Acari
1988|b|pag|Fundo de Quintal|A Oitava Cor
1988|b|pag|Fundo de Quintal|Lua Cheia
1988|b|pag|Alcione|Ouro e Cobre
1989|b|pag|Paulinho da Viola|Eu Canto Samba
1989|b|pag|Beth Carvalho|Saudades da Guanabara
1989|b|pag|Zeca Pagodinho|Boêmio Feliz
1989|b|pag|Zeca Pagodinho|Minta Meu Sonho
1989|b|pag|Zeca Pagodinho|Pinta de Lord
1989|b|pag|Fundo de Quintal|Ciranda do Povo
1989|b|pag|Fundo de Quintal|Miudinho, Meu Bem, Miudinho
1989|b|pag|Bezerra da Silva|Se Não Fosse o Samba
1990|b|pag|Zeca Pagodinho|Mania da Gente
1990|b|pag|Zeca Pagodinho|Lavadeira
1990|b|pag|Bezerra da Silva|Quando o Morcego Doar Sangue
1990|b|pag|Bezerra da Silva|Eu Não Sou Santo
1990|b|pag|Alcione|Quando a Saudade Bater
1990|b|pag|Alcione|Dona Zica e Dona Neuma
1990|b|pag|Jorge Aragão|Papel de Pão
1990|b|pag|Jorge Aragão|A Seu Favor
1991|b|pag|Raça Negra|Cheia de Manias
1991|b|pag|Raça Negra|Quero Ver Você Chorar
1991|b|pag|Raça Negra|Caroline
1991|b|pag|Zeca Pagodinho|Pixote
1991|b|pag|Zeca Pagodinho|Samba no Chão
1991|b|pag|Fundo de Quintal|É Aí Que Quebra a Rocha
1991|b|pag|Fundo de Quintal|Lucidez
1991|b|pag|Martinho da Vila|Vai Meu Samba
1992|b|pag|Raça Negra|Cigana
1992|b|pag|Raça Negra|Jeito Felino
1992|b|pag|Raça Negra|Pensando em Você
1992|b|pag|João Nogueira|Além do Espelho
1992|b|pag|Jorge Aragão|Identidade
1992|b|pag|Zeca Pagodinho|Vai com Deus
1992|b|pag|Exaltasamba|Quero Sentir de Novo
1992|b|pag|Katinguelê|Um Doce Sabor
1993|b|pag|Só Pra Contrariar|Que Se Chama Amor
1993|b|pag|Só Pra Contrariar|A Barata
1993|b|pag|Só Pra Contrariar|Domingo
1993|b|pag|Fundo de Quintal|A Batucada dos Nossos Tantãs
1993|b|pag|Raça Negra|Estou Mal
1993|b|pag|Art Popular|Canto da Razão
1993|b|pag|Negritude Júnior|Conto de Fadas
1993|b|pag|Zeca Pagodinho|Alô Mundo
1994|b|pag|Molejo|Caçamba
1994|b|pag|Só Pra Contrariar|Essa Tal Liberdade
1994|b|pag|Só Pra Contrariar|É Bom Demais
1994|b|pag|Raça Negra|Me Leva Junto com Você
1994|b|pag|Raça Negra|Te Quero Comigo
1994|b|pag|Negritude Júnior|Beijo Geladinho
1994|b|pag|Negritude Júnior|Olhos Vermelhos
1994|b|pag|Exaltasamba|24 Horas de Amor
1995|b|pag|Raça Negra|É Tarde Demais
1995|b|pag|Martinho da Vila|Mulheres
1995|b|pag|Só Pra Contrariar|Tão Só
1995|b|pag|Só Pra Contrariar|Te Amar Sem Medo
1995|b|pag|Negritude Júnior|Cohab City
1995|b|pag|Negritude Júnior|Absoluta
1995|b|pag|Art Popular|Bom Bocado
1995|b|pag|Zeca Pagodinho|Samba pras Moças
1996|b|pag|Molejo|Cilada
1996|b|pag|Só Pra Contrariar|Dói Demais
1996|b|pag|Negritude Júnior|Tanajura
1996|b|pag|Negritude Júnior|Você Faz Falta
1996|b|pag|Art Popular|Temporal
1996|b|pag|Art Popular|Pimpolho
1996|b|pag|Exaltasamba|Telegrama
1996|b|pag|Exaltasamba|Luz do Desejo
1997|b|pag|Só Pra Contrariar|Mineirinho
1997|b|pag|Art Popular|Agamamou
1997|b|pag|Só Pra Contrariar|Depois do Prazer
1997|b|pag|Negritude Júnior|Que Dure Para Sempre
1997|b|pag|Exaltasamba|Caixinha de Felicidade
1997|b|pag|Os Travessos|Quando a Gente Ama
1997|b|pag|Molejo|Brincadeira de Criança
1997|b|pag|Zeca Pagodinho|Faixa Amarela
1998|b|pag|Só Pra Contrariar|Quando É Amor
1998|b|pag|Só Pra Contrariar|Tá Por Fora
1998|b|pag|Katinguelê|Inaraí
1998|b|pag|Exaltasamba|Me Apaixonei pela Pessoa Errada
1998|b|pag|Molejo|Samba Rock do Molejão
1998|b|pag|Molejo|Vem Zoar
1998|b|pag|Art Popular|Requebrabum
1998|b|pag|Zeca Pagodinho|Vai Vadiar
1999|b|pag|Só Pra Contrariar|Sai da Minha Aba
1999|b|pag|Só Pra Contrariar|Interfone
1999|b|pag|Só Pra Contrariar|Machuca Demais
1999|b|pag|Jorge Aragão|Moleque Atrevido
1999|b|pag|Jorge Aragão|Eu e Você Sempre
1999|b|pag|Soweto|Farol das Estrelas
1999|b|pag|Fundo de Quintal|Chega pra Sambar
1999|b|pag|Raça Negra|Deus Me Livre
2000|b|pag|Belo|Desafio
2000|b|pag|Belo|Tua Boca
2000|b|pag|Só Pra Contrariar|Não Chora
2000|b|pag|Revelação|Na Palma da Mão
2000|b|pag|Os Travessos|Tô Te Filmando (Sorria)
2000|b|pag|Soweto|Amor Demais
2000|b|pag|Exaltasamba|Mega Star
2000|b|pag|Zeca Pagodinho|Água da Minha Sede
2001|b|pag|Revelação|Virou Religião
2001|b|pag|Revelação|Esqueci de Te Esquecer
2001|b|pag|Exaltasamba feat. Zeca Pagodinho|Choro de Alegria
2001|b|pag|Os Travessos|Vou Te Procurar
2001|b|pag|Só Pra Contrariar|Teu Olhar
2001|b|pag|Só Pra Contrariar|Vem Me Livrar Desse Abandono
2001|b|pag|Fundo de Quintal|Papo de Samba
2001|b|pag|Turma do Pagode|Fato Consumado
2002|b|pag|Zeca Pagodinho|Deixa a Vida Me Levar
2002|b|pag|Revelação|Deixa Acontecer
2002|b|pag|Revelação|Grades do Coração
2002|b|pag|Revelação|Coração Radiante
2002|b|pag|Revelação|Poder de Sedução
2002|b|pag|Revelação|Só Me Dá Prazer
2002|b|pag|Art Popular|Terra Louca
2002|b|pag|Só Pra Contrariar feat. Caetano Veloso|Final Feliz
2003|b|pag|Revelação|Preciso Te Amar
2003|b|pag|Revelação|Essência da Paixão
2003|b|pag|Exaltasamba|Estrela
2003|b|pag|Só Pra Contrariar|Minha Fantasia
2003|b|pag|Só Pra Contrariar|A Rede
2003|b|pag|Só Pra Contrariar|Reconciliação
2003|b|pag|Bezerra da Silva|Meu Bom Juiz
2003|b|pag|Fundo de Quintal|Festa pra Comunidade
2004|b|pag|Revelação|Talvez
2004|b|pag|Revelação|Jogo de Sedução
2004|b|pag|Revelação|Altas Horas
2004|b|pag|Revelação|Horizonte de Emoção
2004|b|pag|Só Pra Contrariar|Ela É Jogo Duro
2004|b|pag|Só Pra Contrariar|Do Jeito Q' Eu Gosto
2004|b|pag|Alcione|Faz uma Loucura por Mim
2004|b|pag|Jeito Moleque|Eu Nunca Amei Assim
2005|b|pag|Exaltasamba|Inconformado
2005|b|pag|Revelação|Compasso do Amor
2005|b|pag|Revelação|Verdadeira Paixão
2005|b|pag|Alcione|Meu Ébano
2005|b|pag|Zeca Pagodinho|Pra São Jorge
2005|b|pag|Zeca Pagodinho|Ninguém Merece
2005|b|pag|Zeca Pagodinho|O Pai Coruja
2005|b|pag|Jeito Moleque|Me Faz Feliz
2006|b|pag|Revelação|Velocidade da Luz
2006|b|pag|Exaltasamba|Faz Falta
2006|b|pag|Sorriso Maroto|É Diferente
2006|b|pag|Sorriso Maroto|Futuro Prometido
2006|b|pag|Sorriso Maroto|Tenho Medo
2006|b|pag|Sorriso Maroto|Promessas
2006|b|pag|Sorriso Maroto|Meu Plano
2006|b|pag|Sorriso Maroto|Pega Essa
2007|b|pag|Revelação|Baixa Essa Guarda
2007|b|pag|Revelação|A Pureza da Flor
2007|b|pag|Revelação|Capaz de Tudo
2007|b|pag|Grupo Bom Gosto|Camará
2007|b|pag|Grupo Bom Gosto|Ninguém É Dono de Ninguém
2007|b|pag|Grupo Bom Gosto|O Amor Chegou
2007|b|pag|Sorriso Maroto|Não Tem Perdão
2007|b|pag|Arlindo Cruz|Meu Lugar
2008|b|pag|Exaltasamba|Livre pra Voar
2008|b|pag|Sorriso Maroto|Assim Você Mata o Papai
2008|b|pag|Zeca Pagodinho|Ogum
2008|b|pag|Zeca Pagodinho|Então Leva
2008|b|pag|Zeca Pagodinho|Uma Prova de Amor
2008|b|pag|Revelação|Aventureiro
2008|b|pag|Exaltasamba|Valeu
2008|b|pag|Alexandre Pires|Pode Chorar
2009|b|pag|Revelação|Tá Escrito
2009|b|pag|Revelação|Ajoelhou Tem Que Rezar
2009|b|pag|Revelação|Só Depois
2009|b|pag|Sorriso Maroto|E Agora Nós?
2009|b|pag|Sorriso Maroto|Sinais
2009|b|pag|Turma do Pagode feat. Péricles|Esse Adeus
2009|b|pag|Turma do Pagode feat. Leci Brandão|Vai com Deus
2009|b|pag|Exaltasamba|Abandonado
2010|b|pag|Exaltasamba|Tá Vendo Aquela Lua
2010|b|pag|Revelação|Coração Blindado
2010|b|pag|Revelação|Saudade do Amor
2010|b|pag|Turma do Pagode|Camisa 10
2010|b|pag|Turma do Pagode|Toma Jeito Coração
2010|b|pag|Turma do Pagode|Já Virou Rotina
2010|b|pag|Alexandre Pires feat. Seu Jorge|Eu Sou o Samba
2010|b|pag|Alexandre Pires|Quem É Você
2011|b|pag|Thiaguinho|Buquê de Flores
2011|b|pag|Revelação|Trilha do Amor
2011|b|pag|Revelação|Bomba Relógio
2011|b|pag|Revelação|Pai
2011|b|pag|Turma do Pagode|Lancinho
2011|b|pag|Grupo Bom Gosto|Deixa Eu Cantar Meu Samba
2011|b|pag|Ferrugem|Meu Bem
2011|b|pag|Arlindo Cruz|Pelo Litoral
2012|b|pag|Thiaguinho|Ousadia e Alegria
2012|b|pag|Thiaguinho|Sou o Cara pra Você
2012|b|pag|Thiaguinho|Ainda Bem
2012|b|pag|Péricles|Amei
2012|b|pag|Péricles|Linguagem dos Olhos
2012|b|pag|Revelação|Filho da Simplicidade
2012|b|pag|Revelação|Só Vai de Camarote
2012|b|pag|Mumuzinho|Curto Circuito
2013|b|pag|Thiaguinho|Desencana
2013|b|pag|Thiaguinho|As Aparências Enganam
2013|b|pag|Thiaguinho|Será Que É Amor
2013|b|pag|Péricles feat. Luan Santana|Cuidado Cupido
2013|b|pag|Péricles|Se Eu Largar o Freio
2013|b|pag|Revelação|Fala Baixinho (Shiii)
2013|b|pag|Revelação|Mulher Traída
2013|b|pag|Sorriso Maroto|Fofinha Delícia
2014|b|pag|Péricles|Até Que Durou
2014|b|pag|Thiaguinho|Caraca, Muleke!
2014|b|pag|Thiaguinho|Sem Você a Vida É Tão Sem Graça
2014|b|pag|Péricles & Xande de Pilares|Êta Amor
2014|b|pag|Péricles|Final de Tarde
2014|b|pag|Dilsinho|Já Que Você Não Me Quer Mais
2014|b|pag|Dilsinho|A Vingança
2014|b|pag|Ferrugem|Climatizar
2015|b|pag|Péricles|Erro Meu
2015|b|pag|Péricles|Feito pra Durar
2015|b|pag|Thiaguinho feat. Rodriguinho|Pra Que Viver Nesse Mundo
2015|b|pag|Thiaguinho|Hey, Mundo!
2015|b|pag|Belo|Porta Aberta
2015|b|pag|Belo|Tatuagem
2015|b|pag|Dilsinho|Se Quiser
2015|b|pag|Mumuzinho|Fulminante
2016|b|pag|Thiaguinho|Cancún
2016|b|pag|Thiaguinho|Vamo Que Vamo
2016|b|pag|Thiaguinho|Fotos Antigas
2016|b|pag|Dilsinho|Trovão
2016|b|pag|Dilsinho|Refém
2016|b|pag|Sorriso Maroto|Dependente
2016|b|pag|Exaltasamba|Pé na Porta
2016|b|pag|Péricles|Lembranças de Nós Dois
2017|b|pag|Ferrugem|Pra Você Acreditar
2017|b|pag|Dilsinho|Péssimo Negócio
2017|b|pag|Thiaguinho feat. Ludmilla|Só Vem!
2017|b|pag|Thiaguinho|Já Fui de Você
2017|b|pag|Péricles|Costumes Iguais
2017|b|pag|Ferrugem|Eu Sou Feliz Assim
2017|b|pag|Sorriso Maroto|Anjos Guardiões de Amor
2017|b|pag|Dilsinho|Piquenique
2018|b|pag|Thiaguinho|Acredito no Amor
2018|b|pag|Thiaguinho|Ponto Fraco
2018|b|pag|Péricles|Logo de Manhã
2018|b|pag|Dilsinho|12 Horas
2018|b|pag|Dilsinho feat. Ivete Sangalo|Ioiô
2018|b|pag|Ferrugem|Pirata e Tesouro
2018|b|pag|Ferrugem|Sinto Sua Falta
2018|b|pag|Mumuzinho|Eu Mereço Ser Feliz
2019|b|pag|Thiaguinho|Domingando
2019|b|pag|Thiaguinho|Deixa Tudo Como Tá
2019|b|pag|Péricles|Hoje Tem
2019|b|pag|Péricles feat. Thiaguinho|No Fundo dos Meus Olhos
2019|b|pag|Dilsinho|Controle Remoto
2019|b|pag|Dilsinho|Onze e Pouquinho
2019|b|pag|Ferrugem|Chopp Garotinho
2019|b|pag|Menos É Mais|Vai Me Dando Corda
2020|b|pag|Thiaguinho|Era Uma Vez
2020|b|pag|Thiaguinho|A Fila Anda
2020|b|pag|Péricles|Tô Achando Que É Amor
2020|b|pag|Dilsinho|Deixa pra Amanhã
2020|b|pag|Menos É Mais|Recaída
2020|b|pag|Menos É Mais|Adorei
2020|b|pag|Ludmilla|Amor Difícil
2020|b|pag|Mumuzinho|Mantra
2021|b|pag|Menos É Mais|Melhor Eu Ir
2021|b|pag|Menos É Mais & Matheus Fernandes|Lapada Dela
2021|b|pag|Menos É Mais|Pagando Mal com Mal
2021|b|pag|Péricles|Eu Odeio Te Amar
2021|b|pag|Dilsinho|Porre
2021|b|pag|Dilsinho|Vizinha
2021|b|pag|Mumuzinho|Tomara
2021|b|pag|Ludmilla|Não É Por Maldade

1976|g|pop|ABBA|Dancing Queen
1976|g|pop|Elton John & Kiki Dee|Don't Go Breaking My Heart
1976|g|pop|Wings|Silly Love Songs
1976|g|pop|Bee Gees|You Should Be Dancing
1976|g|pop|ABBA|Fernando
1976|g|pop|Boney M.|Daddy Cool
1976|g|pop|Starland Vocal Band|Afternoon Delight
1976|g|pop|Andrea True Connection|More, More, More
1977|g|pop|Bee Gees|Stayin' Alive
1977|g|pop|Donna Summer|I Feel Love
1977|g|pop|Debby Boone|You Light Up My Life
1977|g|pop|Bee Gees|How Deep Is Your Love
1977|g|pop|Andy Gibb|I Just Want to Be Your Everything
1977|g|pop|ABBA|Knowing Me, Knowing You
1977|g|pop|Boney M.|Ma Baker
1977|g|pop|ABBA|The Name of the Game
1978|g|pop|Gloria Gaynor|I Will Survive
1978|g|pop|Bee Gees|Night Fever
1978|g|pop|John Travolta & Olivia Newton-John|You're the One That I Want
1978|g|pop|Olivia Newton-John|Hopelessly Devoted to You
1978|g|pop|Village People|Y.M.C.A.
1978|g|pop|Boney M.|Rivers of Babylon
1978|g|pop|Andy Gibb|Shadow Dancing
1978|g|pop|ABBA|Take a Chance on Me
1979|g|pop|Michael Jackson|Don't Stop 'Til You Get Enough
1979|g|pop|Village People|In the Navy
1979|g|pop|ABBA|Gimme! Gimme! Gimme! (A Man After Midnight)
1979|g|pop|Donna Summer|Hot Stuff
1979|g|pop|Boney M.|Hooray! Hooray! It's a Holi-Holiday
1979|g|pop|Bee Gees|Tragedy
1979|g|pop|ABBA|Chiquitita
1979|g|pop|Patrick Hernandez|Born to Be Alive
1980|g|pop|Olivia Newton-John & Electric Light Orchestra|Xanadu
1980|g|pop|Olivia Newton-John|Magic
1980|g|pop|Christopher Cross|Sailing
1980|g|pop|ABBA|The Winner Takes It All
1980|g|pop|Lipps Inc.|Funkytown
1980|g|pop|Irene Cara|Fame
1980|g|pop|Barbra Streisand|Woman in Love
1980|g|pop|ABBA|Super Trouper
1981|g|pop|Kim Carnes|Bette Davis Eyes
1981|g|pop|Olivia Newton-John|Physical
1981|g|pop|Sheena Easton|For Your Eyes Only
1981|g|pop|Sheena Easton|Morning Train (Nine to Five)
1981|g|pop|Soft Cell|Tainted Love
1981|g|pop|The Human League|Don't You Want Me
1981|g|pop|ABBA|One of Us
1981|g|pop|Christopher Cross|Arthur's Theme (Best That You Can Do)
1982|g|pop|Daryl Hall & John Oates|Maneater
1982|g|pop|Paul McCartney & Stevie Wonder|Ebony and Ivory
1982|g|pop|Dexys Midnight Runners|Come On Eileen
1982|g|pop|Toni Basil|Mickey
1982|g|pop|Joe Cocker & Jennifer Warnes|Up Where We Belong
1982|g|pop|Culture Club|Do You Really Want to Hurt Me
1982|g|pop|Duran Duran|Hungry Like the Wolf
1982|g|pop|Laura Branigan|Gloria
1983|g|pop|Michael Jackson|Billie Jean
1983|g|pop|Cyndi Lauper|Girls Just Want to Have Fun
1983|g|pop|Irene Cara|Flashdance... What a Feeling
1983|g|pop|Culture Club|Karma Chameleon
1983|g|pop|Bonnie Tyler|Total Eclipse of the Heart
1983|g|pop|Madonna|Holiday
1983|g|pop|Eurythmics|Sweet Dreams (Are Made of This)
1983|g|pop|Spandau Ballet|True
1984|g|pop|Madonna|Like a Virgin
1984|g|pop|Wham!|Wake Me Up Before You Go-Go
1984|g|pop|Wham!|Last Christmas
1984|g|pop|Cyndi Lauper|Time After Time
1984|g|pop|Madonna|Borderline
1984|g|pop|Band Aid|Do They Know It's Christmas?
1984|g|pop|George Michael|Careless Whisper
1984|g|pop|Tina Turner|What's Love Got to Do with It
1985|g|pop|a-ha|Take On Me
1985|g|pop|Tears for Fears|Everybody Wants to Rule the World
1985|g|pop|USA for Africa|We Are the World
1985|g|pop|Madonna|Into the Groove
1985|g|pop|Paul Young|Every Time You Go Away
1985|g|pop|Madonna|Material Girl
1985|g|pop|Phil Collins|One More Night
1985|g|pop|Jennifer Rush|The Power of Love
1986|g|pop|Madonna|Papa Don't Preach
1986|g|pop|Madonna|Live to Tell
1986|g|pop|Whitney Houston|Greatest Love of All
1986|g|pop|Berlin|Take My Breath Away
1986|g|pop|Bananarama|Venus
1986|g|pop|Cyndi Lauper|True Colors
1986|g|pop|Patti LaBelle & Michael McDonald|On My Own
1986|g|pop|The Bangles|Walk Like an Egyptian
1987|g|pop|Whitney Houston|I Wanna Dance with Somebody
1987|g|pop|Michael Jackson|Bad
1987|g|pop|Rick Astley|Never Gonna Give You Up
1987|g|pop|George Michael|Faith
1987|g|pop|Madonna|La Isla Bonita
1987|g|pop|Belinda Carlisle|Heaven Is a Place on Earth
1987|g|pop|Bill Medley & Jennifer Warnes|(I've Had) The Time of My Life
1987|g|pop|Pet Shop Boys|It's a Sin
1988|g|pop|Kylie Minogue|I Should Be So Lucky
1988|g|pop|Rick Astley|Together Forever
1988|g|pop|George Michael|Father Figure
1988|g|pop|Debbie Gibson|Foolish Beat
1988|g|pop|Michael Jackson|Man in the Mirror
1988|g|pop|Whitney Houston|One Moment in Time
1988|g|pop|Bobby McFerrin|Don't Worry, Be Happy
1988|g|pop|Phil Collins|A Groovy Kind of Love
1989|g|pop|Madonna|Like a Prayer
1989|g|pop|Madonna|Express Yourself
1989|g|pop|Paula Abdul|Forever Your Girl
1989|g|pop|Roxette|The Look
1989|g|pop|Bette Midler|Wind Beneath My Wings
1989|g|pop|Milli Vanilli|Girl I'm Gonna Miss You
1989|g|pop|Richard Marx|Right Here Waiting
1989|g|pop|Cher|If I Could Turn Back Time
1990|g|pop|Madonna|Vogue
1990|g|pop|Sinéad O'Connor|Nothing Compares 2 U
1990|g|pop|Kylie Minogue|Better the Devil You Know
1990|g|pop|Roxette|It Must Have Been Love
1990|g|pop|Wilson Phillips|Hold On
1990|g|pop|Janet Jackson|Escapade
1990|g|pop|Bette Midler|From a Distance
1990|g|pop|Whitney Houston|I'm Your Baby Tonight
1991|g|pop|Michael Jackson|Black or White
1991|g|pop|Mariah Carey|Emotions
1991|g|pop|Paula Abdul|Rush Rush
1991|g|pop|Roxette|Joyride
1991|g|pop|Amy Grant|Baby Baby
1991|g|pop|Cher|The Shoop Shoop Song (It's in His Kiss)
1991|g|pop|Mariah Carey|Someday
1991|g|pop|Seal|Crazy
1992|g|pop|Whitney Houston|I Will Always Love You
1992|g|pop|Madonna|This Used to Be My Playground
1992|g|pop|Céline Dion & Peabo Bryson|Beauty and the Beast
1992|g|pop|Shakespears Sister|Stay
1992|g|pop|Vanessa Williams|Save the Best for Last
1992|g|pop|Mariah Carey|I'll Be There
1992|g|pop|Michael Jackson|Remember the Time
1992|g|pop|Charles & Eddie|Would I Lie to You?
1993|g|pop|Ace of Base|The Sign
1993|g|pop|Mariah Carey|Dreamlover
1993|g|pop|Mariah Carey|Hero
1993|g|pop|Gabrielle|Dreams
1993|g|pop|Take That|Pray
1993|g|pop|Whitney Houston|I Have Nothing
1993|g|pop|UB40|Can't Help Falling in Love
1993|g|pop|Take That|Babe
1994|g|pop|Mariah Carey|All I Want for Christmas Is You
1994|g|pop|Céline Dion|The Power of Love
1994|g|pop|Ace of Base|Don't Turn Around
1994|g|pop|Wet Wet Wet|Love Is All Around
1994|g|pop|Elton John|Can You Feel the Love Tonight
1994|g|pop|Mariah Carey|Without You
1994|g|pop|Lisa Loeb|Stay (I Missed You)
1994|g|pop|Madonna|Take a Bow
1995|g|pop|Take That|Back for Good
1995|g|pop|Mariah Carey|Fantasy
1995|g|pop|Mariah Carey & Boyz II Men|One Sweet Day
1995|g|pop|Michael Jackson|You Are Not Alone
1995|g|pop|Seal|Kiss from a Rose
1995|g|pop|Whitney Houston|Exhale (Shoop Shoop)
1995|g|pop|Michael Jackson|Earth Song
1995|g|pop|Madonna|You'll See
1996|g|pop|Spice Girls|Wannabe
1996|g|pop|Céline Dion|Because You Loved Me
1996|g|pop|Céline Dion|It's All Coming Back to Me Now
1996|g|pop|Spice Girls|Say You'll Be There
1996|g|pop|Mariah Carey|Always Be My Baby
1996|g|pop|George Michael|Jesus to a Child
1996|g|pop|Gina G|Ooh Aah... Just a Little Bit
1996|g|pop|Spice Girls|2 Become 1
1997|g|pop|Backstreet Boys|Everybody (Backstreet's Back)
1997|g|pop|Hanson|MMMBop
1997|g|pop|Céline Dion|My Heart Will Go On
1997|g|pop|Spice Girls|Spice Up Your Life
1997|g|pop|Elton John|Candle in the Wind 1997
1997|g|pop|Aqua|Barbie Girl
1997|g|pop|Savage Garden|Truly Madly Deeply
1997|g|pop|Backstreet Boys|As Long as You Love Me
1998|g|pop|Britney Spears|...Baby One More Time
1998|g|pop|Cher|Believe
1998|g|pop|Madonna|Frozen
1998|g|pop|Madonna|Ray of Light
1998|g|pop|Robbie Williams|Millennium
1998|g|pop|*NSYNC|Tearin' Up My Heart
1998|g|pop|B*Witched|C'est la Vie
1998|g|pop|Spice Girls|Goodbye
1999|g|pop|Backstreet Boys|I Want It That Way
1999|g|pop|Britney Spears|Sometimes
1999|g|pop|Christina Aguilera|Genie in a Bottle
1999|g|pop|Westlife|Swear It Again
1999|g|pop|Westlife|Flying Without Wings
1999|g|pop|Backstreet Boys|Larger than Life
1999|g|pop|Savage Garden|I Knew I Loved You
1999|g|pop|S Club 7|Bring It All Back
2000|g|pop|*NSYNC|Bye Bye Bye
2000|g|pop|Britney Spears|Oops!... I Did It Again
2000|g|pop|Christina Aguilera|Come On Over Baby (All I Want Is You)
2000|g|pop|Madonna|Music
2000|g|pop|Britney Spears|Lucky
2000|g|pop|Westlife|My Love
2000|g|pop|Robbie Williams|Rock DJ
2000|g|pop|Backstreet Boys|Shape of My Heart
2001|g|pop|Kylie Minogue|Can't Get You Out of My Head
2001|g|pop|*NSYNC|Pop
2001|g|pop|Britney Spears|I'm a Slave 4 U
2001|g|pop|Robbie Williams & Nicole Kidman|Somethin' Stupid
2001|g|pop|S Club 7|Don't Stop Movin'
2001|g|pop|Geri Halliwell|It's Raining Men
2001|g|pop|Westlife|Uptown Girl
2001|g|pop|Atomic Kitten|Whole Again
2002|g|pop|Avril Lavigne|Complicated
2002|g|pop|Avril Lavigne|Sk8er Boi
2002|g|pop|Justin Timberlake|Like I Love You
2002|g|pop|Justin Timberlake|Cry Me a River
2002|g|pop|Christina Aguilera|Dirrty
2002|g|pop|Vanessa Carlton|A Thousand Miles
2002|g|pop|Pink|Just Like a Pill
2002|g|pop|Kelly Clarkson|A Moment Like This
2003|g|pop|Kelly Clarkson|Miss Independent
2003|g|pop|Britney Spears feat. Madonna|Me Against the Music
2003|g|pop|Justin Timberlake|Rock Your Body
2003|g|pop|Avril Lavigne|I'm with You
2003|g|pop|Christina Aguilera|Fighter
2003|g|pop|Kylie Minogue|Slow
2003|g|pop|Dido|White Flag
2003|g|pop|Hilary Duff|So Yesterday
2004|g|pop|Britney Spears|Toxic
2004|g|pop|Kelly Clarkson|Since U Been Gone
2004|g|pop|Avril Lavigne|My Happy Ending
2004|g|pop|Anastacia|Left Outside Alone
2004|g|pop|Ashlee Simpson|Pieces of Me
2004|g|pop|Kelly Clarkson|Breakaway
2004|g|pop|Gwen Stefani|What You Waiting For?
2004|g|pop|Jessica Simpson|With You
2005|g|pop|Kelly Clarkson|Behind These Hazel Eyes
2005|g|pop|Gwen Stefani|Hollaback Girl
2005|g|pop|James Blunt|You're Beautiful
2005|g|pop|Gwen Stefani|Cool
2005|g|pop|The Pussycat Dolls feat. Busta Rhymes|Don't Cha
2005|g|pop|Madonna|Hung Up
2005|g|pop|Kelly Clarkson|Because of You
2005|g|pop|The Pussycat Dolls|Stickwitu
2006|g|pop|Nelly Furtado|Promiscuous
2006|g|pop|Justin Timberlake|SexyBack
2006|g|pop|Nelly Furtado|Maneater
2006|g|pop|Rihanna|SOS
2006|g|pop|Fergie|London Bridge
2006|g|pop|Christina Aguilera|Ain't No Other Man
2006|g|pop|Rihanna|Unfaithful
2006|g|pop|Justin Timberlake|My Love
2007|g|pop|Rihanna|Umbrella
2007|g|pop|Fergie|Big Girls Don't Cry
2007|g|pop|Avril Lavigne|Girlfriend
2007|g|pop|Mika|Grace Kelly
2007|g|pop|Leona Lewis|Bleeding Love
2007|g|pop|Britney Spears|Gimme More
2007|g|pop|Rihanna|Don't Stop the Music
2007|g|pop|Kylie Minogue|2 Hearts
2008|g|pop|Lady Gaga|Just Dance
2008|g|pop|Katy Perry|I Kissed a Girl
2008|g|pop|Rihanna|Disturbia
2008|g|pop|Pink|So What
2008|g|pop|Britney Spears|Womanizer
2008|g|pop|Duffy|Mercy
2008|g|pop|Lady Gaga|Poker Face
2008|g|pop|Madonna feat. Justin Timberlake & Timbaland|4 Minutes
2009|g|pop|Lady Gaga|Bad Romance
2009|g|pop|Lady Gaga|Paparazzi
2009|g|pop|Kelly Clarkson|My Life Would Suck Without You
2009|g|pop|Taylor Swift|You Belong with Me
2009|g|pop|Miley Cyrus|Party in the U.S.A.
2009|g|pop|Britney Spears|3
2009|g|pop|Owl City|Fireflies
2009|g|pop|La Roux|Bulletproof
2010|g|pop|Katy Perry|California Gurls
2010|g|pop|Kesha|Tik Tok
2010|g|pop|Katy Perry|Teenage Dream
2010|g|pop|Rihanna|Only Girl (In the World)
2010|g|pop|Bruno Mars|Just the Way You Are
2010|g|pop|Lady Gaga|Alejandro
2010|g|pop|Justin Bieber feat. Ludacris|Baby
2010|g|pop|Pink|Raise Your Glass
2011|g|pop|Adele|Rolling in the Deep
2011|g|pop|Adele|Someone Like You
2011|g|pop|Lady Gaga|Born This Way
2011|g|pop|Katy Perry|Last Friday Night (T.G.I.F.)
2011|g|pop|Jessie J feat. B.o.B|Price Tag
2011|g|pop|Maroon 5 feat. Christina Aguilera|Moves like Jagger
2011|g|pop|Britney Spears|Hold It Against Me
2011|g|pop|Bruno Mars|The Lazy Song
2012|g|pop|Carly Rae Jepsen|Call Me Maybe
2012|g|pop|PSY|Gangnam Style
2012|g|pop|Gotye feat. Kimbra|Somebody That I Used to Know
2012|g|pop|Taylor Swift|We Are Never Ever Getting Back Together
2012|g|pop|One Direction|Live While We're Young
2012|g|pop|Katy Perry|Wide Awake
2012|g|pop|Bruno Mars|Locked Out of Heaven
2012|g|pop|Rihanna|Diamonds
2013|g|pop|Miley Cyrus|Wrecking Ball
2013|g|pop|Lorde|Royals
2013|g|pop|Katy Perry|Roar
2013|g|pop|Bruno Mars|When I Was Your Man
2013|g|pop|Lady Gaga|Applause
2013|g|pop|Pharrell Williams|Happy
2013|g|pop|Justin Timberlake|Mirrors
2013|g|pop|Ellie Goulding|Burn
2014|g|pop|Taylor Swift|Shake It Off
2014|g|pop|Meghan Trainor|All About That Bass
2014|g|pop|Ariana Grande feat. Iggy Azalea|Problem
2014|g|pop|Sam Smith|Stay with Me
2014|g|pop|Jessie J, Ariana Grande & Nicki Minaj|Bang Bang
2014|g|pop|Taylor Swift|Blank Space
2014|g|pop|Ed Sheeran|Thinking Out Loud
2014|g|pop|Sia|Chandelier
2015|g|pop|Adele|Hello
2015|g|pop|Justin Bieber|Sorry
2015|g|pop|Mark Ronson feat. Bruno Mars|Uptown Funk
2015|g|pop|Ellie Goulding|Love Me like You Do
2015|g|pop|Taylor Swift feat. Kendrick Lamar|Bad Blood
2015|g|pop|Justin Bieber|What Do You Mean?
2015|g|pop|Shawn Mendes|Stitches
2015|g|pop|Selena Gomez|Same Old Love
2016|g|pop|Sia|Cheap Thrills
2016|g|pop|Justin Timberlake|Can't Stop the Feeling!
2016|g|pop|Shawn Mendes|Treat You Better
2016|g|pop|Ariana Grande|Into You
2016|g|pop|Lady Gaga|Million Reasons
2016|g|pop|Fifth Harmony feat. Ty Dolla $ign|Work from Home
2016|g|pop|Charlie Puth feat. Selena Gomez|We Don't Talk Anymore
2016|g|pop|Bruno Mars|24K Magic
2017|g|pop|Ed Sheeran|Shape of You
2017|g|pop|Dua Lipa|New Rules
2017|g|pop|Ed Sheeran|Perfect
2017|g|pop|Taylor Swift|Look What You Made Me Do
2017|g|pop|Harry Styles|Sign of the Times
2017|g|pop|Charlie Puth|Attention
2017|g|pop|Sam Smith|Too Good at Goodbyes
2017|g|pop|Selena Gomez|Bad Liar
2018|g|pop|Ariana Grande|thank u, next
2018|g|pop|Ariana Grande|no tears left to cry
2018|g|pop|Lady Gaga & Bradley Cooper|Shallow
2018|g|pop|Dua Lipa|IDGAF
2018|g|pop|Shawn Mendes|In My Blood
2018|g|pop|Maroon 5 feat. Cardi B|Girls Like You
2018|g|pop|Taylor Swift|Delicate
2018|g|pop|Halsey|Without Me
2019|g|pop|Billie Eilish|bad guy
2019|g|pop|Ariana Grande|7 rings
2019|g|pop|The Weeknd|Blinding Lights
2019|g|pop|Shawn Mendes & Camila Cabello|Señorita
2019|g|pop|Taylor Swift feat. Brendon Urie|ME!
2019|g|pop|Ed Sheeran & Justin Bieber|I Don't Care
2019|g|pop|Jonas Brothers|Sucker
2019|g|pop|Selena Gomez|Lose You to Love Me
2020|g|pop|Dua Lipa|Levitating
2020|g|pop|Harry Styles|Watermelon Sugar
2020|g|pop|Lady Gaga|Stupid Love
2020|g|pop|Lady Gaga & Ariana Grande|Rain on Me
2020|g|pop|BTS|Dynamite
2020|g|pop|Taylor Swift|cardigan
2020|g|pop|Ariana Grande|positions
2020|g|pop|Miley Cyrus|Midnight Sky
2021|g|pop|Olivia Rodrigo|drivers license
2021|g|pop|Ed Sheeran|Bad Habits
2021|g|pop|Olivia Rodrigo|good 4 u
2021|g|pop|The Kid LAROI & Justin Bieber|Stay
2021|g|pop|Adele|Easy on Me
2021|g|pop|Billie Eilish|Happier Than Ever
2021|g|pop|Ed Sheeran|Shivers
2021|g|pop|BTS|Butter
2022|g|pop|Harry Styles|As It Was
2022|g|pop|Taylor Swift|Anti-Hero
2022|g|pop|Lizzo|About Damn Time
2022|g|pop|Sam Smith & Kim Petras|Unholy
2022|g|pop|Harry Styles|Late Night Talking
2022|g|pop|Meghan Trainor|Made You Look
2022|g|pop|Nicky Youre & dazy|Sunroof
2022|g|pop|Charlie Puth feat. Jung Kook|Left and Right
2023|g|pop|Miley Cyrus|Flowers
2023|g|pop|Olivia Rodrigo|vampire
2023|g|pop|Dua Lipa|Dance the Night
2023|g|pop|Billie Eilish|What Was I Made For?
2023|g|pop|Tate McRae|greedy
2023|g|pop|Jung Kook feat. Latto|Seven
2023|g|pop|Teddy Swims|Lose Control
2023|g|pop|Kylie Minogue|Padam Padam
2024|g|pop|Sabrina Carpenter|Espresso
2024|g|pop|Chappell Roan|Good Luck, Babe!
2024|g|pop|Billie Eilish|Birds of a Feather
2024|g|pop|Lady Gaga & Bruno Mars|Die with a Smile
2024|g|pop|ROSÉ & Bruno Mars|APT.
2024|g|pop|Benson Boone|Beautiful Things
2024|g|pop|Taylor Swift feat. Post Malone|Fortnight
2024|g|pop|Sabrina Carpenter|Please Please Please
2025|g|pop|Alex Warren|Ordinary
2025|g|pop|Lady Gaga|Abracadabra
2025|g|pop|Sabrina Carpenter|Manchild
2025|g|pop|Tate McRae|Sports Car
2025|g|pop|Ed Sheeran|Azizam
2025|g|pop|Taylor Swift|The Fate of Ophelia
2025|g|pop|Benson Boone|Mystical Magical
2025|g|pop|Justin Bieber|Daisies

1971|g|rock|Led Zeppelin|Stairway to Heaven
1971|g|rock|The Rolling Stones|Brown Sugar
1971|g|rock|The Who|Baba O'Riley
1971|g|rock|The Who|Won't Get Fooled Again
1971|g|rock|The Doors|Riders on the Storm
1971|g|rock|Led Zeppelin|Black Dog
1971|g|rock|Jethro Tull|Aqualung
1971|g|rock|David Bowie|Life on Mars?
1972|g|rock|Deep Purple|Smoke on the Water
1972|g|rock|Deep Purple|Highway Star
1972|g|rock|Alice Cooper|School's Out
1972|g|rock|David Bowie|Starman
1972|g|rock|The Rolling Stones|Tumbling Dice
1972|g|rock|Eagles|Take It Easy
1972|g|rock|Neil Young|Heart of Gold
1972|g|rock|Mott the Hoople|All the Young Dudes
1973|g|rock|Pink Floyd|Money
1973|g|rock|Lynyrd Skynyrd|Free Bird
1973|g|rock|Aerosmith|Dream On
1973|g|rock|ZZ Top|La Grange
1973|g|rock|The Rolling Stones|Angie
1973|g|rock|Steve Miller Band|The Joker
1973|g|rock|Bob Dylan|Knockin' on Heaven's Door
1973|g|rock|Pink Floyd|Time
1974|g|rock|Lynyrd Skynyrd|Sweet Home Alabama
1974|g|rock|Queen|Killer Queen
1974|g|rock|Bad Company|Can't Get Enough
1974|g|rock|Bachman-Turner Overdrive|You Ain't Seen Nothing Yet
1974|g|rock|Deep Purple|Burn
1974|g|rock|Steely Dan|Rikki Don't Lose That Number
1974|g|rock|The Rolling Stones|It's Only Rock 'n Roll (But I Like It)
1974|g|rock|Eric Clapton|I Shot the Sheriff
1975|g|rock|Queen|Bohemian Rhapsody
1975|g|rock|Bruce Springsteen|Born to Run
1975|g|rock|Pink Floyd|Wish You Were Here
1975|g|rock|Aerosmith|Walk This Way
1975|g|rock|Aerosmith|Sweet Emotion
1975|g|rock|Kiss|Rock and Roll All Nite
1975|g|rock|Led Zeppelin|Kashmir
1975|g|rock|Queen|Love of My Life
1976|g|rock|Eagles|Hotel California
1976|g|rock|Boston|More Than a Feeling
1976|g|rock|Blue Öyster Cult|(Don't Fear) The Reaper
1976|g|rock|Ramones|Blitzkrieg Bop
1976|g|rock|Kansas|Carry On Wayward Son
1976|g|rock|Thin Lizzy|The Boys Are Back in Town
1976|g|rock|Queen|Somebody to Love
1976|g|rock|Steve Miller Band|Rock'n Me
1977|g|rock|Fleetwood Mac|Dreams
1977|g|rock|Queen|We Will Rock You
1977|g|rock|Queen|We Are the Champions
1977|g|rock|Fleetwood Mac|Don't Stop
1977|g|rock|Sex Pistols|God Save the Queen
1977|g|rock|AC/DC|Let There Be Rock
1977|g|rock|Meat Loaf|Paradise by the Dashboard Light
1977|g|rock|Foreigner|Cold as Ice
1978|g|rock|Van Halen|Runnin' with the Devil
1978|g|rock|Van Halen|Ain't Talkin' 'bout Love
1978|g|rock|Dire Straits|Sultans of Swing
1978|g|rock|The Police|Roxanne
1978|g|rock|Foreigner|Hot Blooded
1978|g|rock|The Cars|Just What I Needed
1978|g|rock|Toto|Hold the Line
1978|g|rock|Bob Seger|Old Time Rock and Roll
1979|g|rock|Pink Floyd|Another Brick in the Wall, Part 2
1979|g|rock|AC/DC|Highway to Hell
1979|g|rock|The Clash|London Calling
1979|g|rock|The Knack|My Sharona
1979|g|rock|Queen|Crazy Little Thing Called Love
1979|g|rock|Pink Floyd|Comfortably Numb
1979|g|rock|The Police|Message in a Bottle
1979|g|rock|Supertramp|The Logical Song
1980|g|rock|AC/DC|Back in Black
1980|g|rock|Queen|Another One Bites the Dust
1980|g|rock|AC/DC|You Shook Me All Night Long
1980|g|rock|Pat Benatar|Hit Me with Your Best Shot
1980|g|rock|The Police|Don't Stand So Close to Me
1980|g|rock|Joy Division|Love Will Tear Us Apart
1980|g|rock|Ozzy Osbourne|Crazy Train
1980|g|rock|Billy Joel|It's Still Rock and Roll to Me
1981|g|rock|Journey|Don't Stop Believin'
1981|g|rock|Queen & David Bowie|Under Pressure
1981|g|rock|The Rolling Stones|Start Me Up
1981|g|rock|Rush|Tom Sawyer
1981|g|rock|Foreigner|Urgent
1981|g|rock|Foreigner|Waiting for a Girl Like You
1981|g|rock|Billy Squier|The Stroke
1981|g|rock|AC/DC|For Those About to Rock (We Salute You)
1982|g|rock|Survivor|Eye of the Tiger
1982|g|rock|The Clash|Should I Stay or Should I Go
1982|g|rock|The Clash|Rock the Casbah
1982|g|rock|Iron Maiden|Run to the Hills
1982|g|rock|Toto|Rosanna
1982|g|rock|Toto|Africa
1982|g|rock|John Cougar|Jack & Diane
1982|g|rock|Asia|Heat of the Moment
1983|g|rock|The Police|Every Breath You Take
1983|g|rock|Def Leppard|Photograph
1983|g|rock|ZZ Top|Sharp Dressed Man
1983|g|rock|ZZ Top|Gimme All Your Lovin'
1983|g|rock|Quiet Riot|Cum On Feel the Noize
1983|g|rock|Iron Maiden|The Trooper
1983|g|rock|U2|Sunday Bloody Sunday
1983|g|rock|Yes|Owner of a Lonely Heart
1984|g|rock|Van Halen|Jump
1984|g|rock|Bruce Springsteen|Born in the U.S.A.
1984|g|rock|Van Halen|Panama
1984|g|rock|Bruce Springsteen|Dancing in the Dark
1984|g|rock|Twisted Sister|We're Not Gonna Take It
1984|g|rock|Scorpions|Rock You Like a Hurricane
1984|g|rock|U2|Pride (In the Name of Love)
1984|g|rock|The Cars|Drive
1985|g|rock|Dire Straits|Money for Nothing
1985|g|rock|Dire Straits|Walk of Life
1985|g|rock|Dire Straits|Brothers in Arms
1985|g|rock|Simple Minds|Don't You (Forget About Me)
1985|g|rock|Huey Lewis and the News|The Power of Love
1985|g|rock|Starship|We Built This City
1985|g|rock|John Fogerty|The Old Man Down the Road
1985|g|rock|Mötley Crüe|Smokin' in the Boys Room
1986|g|rock|Bon Jovi|Livin' on a Prayer
1986|g|rock|Europe|The Final Countdown
1986|g|rock|Bon Jovi|You Give Love a Bad Name
1986|g|rock|Metallica|Master of Puppets
1986|g|rock|Boston|Amanda
1986|g|rock|Iron Maiden|Wasted Years
1986|g|rock|Peter Gabriel|Sledgehammer
1986|g|rock|Van Halen|Why Can't This Be Love
1987|g|rock|Guns N' Roses|Sweet Child o' Mine
1987|g|rock|U2|With or Without You
1987|g|rock|Guns N' Roses|Welcome to the Jungle
1987|g|rock|Guns N' Roses|Paradise City
1987|g|rock|U2|I Still Haven't Found What I'm Looking For
1987|g|rock|U2|Where the Streets Have No Name
1987|g|rock|Whitesnake|Here I Go Again
1987|g|rock|Def Leppard|Pour Some Sugar on Me
1988|g|rock|Poison|Every Rose Has Its Thorn
1988|g|rock|Bon Jovi|Bad Medicine
1988|g|rock|U2|Desire
1988|g|rock|Metallica|One
1988|g|rock|Guns N' Roses|Patience
1988|g|rock|Van Halen|When It's Love
1988|g|rock|Iron Maiden|Can I Play with Madness
1988|g|rock|Pixies|Where Is My Mind?
1989|g|rock|Aerosmith|Love in an Elevator
1989|g|rock|Mötley Crüe|Dr. Feelgood
1989|g|rock|Mötley Crüe|Kickstart My Heart
1989|g|rock|Tom Petty|Free Fallin'
1989|g|rock|Billy Joel|We Didn't Start the Fire
1989|g|rock|The Cure|Lovesong
1989|g|rock|Skid Row|I Remember You
1989|g|rock|Red Hot Chili Peppers|Higher Ground
1990|g|rock|AC/DC|Thunderstruck
1990|g|rock|AC/DC|Moneytalks
1990|g|rock|Scorpions|Wind of Change
1990|g|rock|Jane's Addiction|Been Caught Stealing
1990|g|rock|Megadeth|Holy Wars... The Punishment Due
1990|g|rock|Pantera|Cowboys from Hell
1990|g|rock|Jon Bon Jovi|Blaze of Glory
1990|g|rock|Damn Yankees|High Enough
1991|g|rock|Nirvana|Smells Like Teen Spirit
1991|g|rock|Guns N' Roses|November Rain
1991|g|rock|R.E.M.|Losing My Religion
1991|g|rock|Metallica|Enter Sandman
1991|g|rock|Pearl Jam|Alive
1991|g|rock|Guns N' Roses|Don't Cry
1991|g|rock|Red Hot Chili Peppers|Give It Away
1991|g|rock|Queen|The Show Must Go On
1992|g|rock|Red Hot Chili Peppers|Under the Bridge
1992|g|rock|Rage Against the Machine|Killing in the Name
1992|g|rock|Alice in Chains|Would?
1992|g|rock|Radiohead|Creep
1992|g|rock|The Cure|Friday I'm in Love
1992|g|rock|R.E.M.|Everybody Hurts
1992|g|rock|Megadeth|Symphony of Destruction
1992|g|rock|Pantera|Walk
1993|g|rock|4 Non Blondes|What's Up?
1993|g|rock|Aerosmith|Cryin'
1993|g|rock|Meat Loaf|I'd Do Anything for Love (But I Won't Do That)
1993|g|rock|Pearl Jam|Daughter
1993|g|rock|The Smashing Pumpkins|Today
1993|g|rock|Nirvana|Heart-Shaped Box
1993|g|rock|The Cranberries|Linger
1993|g|rock|Counting Crows|Mr. Jones
1994|g|rock|The Cranberries|Zombie
1994|g|rock|Green Day|Basket Case
1994|g|rock|Weezer|Buddy Holly
1994|g|rock|Soundgarden|Black Hole Sun
1994|g|rock|The Offspring|Self Esteem
1994|g|rock|Oasis|Live Forever
1994|g|rock|Stone Temple Pilots|Interstate Love Song
1994|g|rock|Bon Jovi|Always
1995|g|rock|Oasis|Wonderwall
1995|g|rock|Alanis Morissette|You Oughta Know
1995|g|rock|The Smashing Pumpkins|Bullet with Butterfly Wings
1995|g|rock|Foo Fighters|This Is a Call
1995|g|rock|Blur|Country House
1995|g|rock|Radiohead|Fake Plastic Trees
1995|g|rock|Pulp|Common People
1995|g|rock|Oasis|Champagne Supernova
1996|g|rock|The Smashing Pumpkins|1979
1996|g|rock|Metallica|Until It Sleeps
1996|g|rock|Rage Against the Machine|Bulls on Parade
1996|g|rock|Sublime|What I Got
1996|g|rock|Bush|Swallowed
1996|g|rock|Manic Street Preachers|A Design for Life
1996|g|rock|Counting Crows|A Long December
1996|g|rock|Tool|Stinkfist
1997|g|rock|Radiohead|Karma Police
1997|g|rock|Radiohead|Paranoid Android
1997|g|rock|Foo Fighters|Everlong
1997|g|rock|The Verve|Bitter Sweet Symphony
1997|g|rock|Third Eye Blind|Semi-Charmed Life
1997|g|rock|Blur|Song 2
1997|g|rock|Green Day|Good Riddance (Time of Your Life)
1997|g|rock|Smash Mouth|Walkin' on the Sun
1998|g|rock|Aerosmith|I Don't Want to Miss a Thing
1998|g|rock|Goo Goo Dolls|Iris
1998|g|rock|The Offspring|Pretty Fly (for a White Guy)
1998|g|rock|Semisonic|Closing Time
1998|g|rock|Fastball|The Way
1998|g|rock|Korn|Freak on a Leash
1998|g|rock|Placebo|Pure Morning
1998|g|rock|Barenaked Ladies|One Week
1999|g|rock|Red Hot Chili Peppers|Scar Tissue
1999|g|rock|Blink-182|All the Small Things
1999|g|rock|Santana feat. Rob Thomas|Smooth
1999|g|rock|Limp Bizkit|Nookie
1999|g|rock|Smash Mouth|All Star
1999|g|rock|Lit|My Own Worst Enemy
1999|g|rock|Foo Fighters|Learn to Fly
1999|g|rock|Creed|Higher
2000|g|rock|Linkin Park|In the End
2000|g|rock|Coldplay|Yellow
2000|g|rock|3 Doors Down|Kryptonite
2000|g|rock|Creed|With Arms Wide Open
2000|g|rock|Papa Roach|Last Resort
2000|g|rock|U2|Beautiful Day
2000|g|rock|Disturbed|Down with the Sickness
2000|g|rock|Deftones|Change (In the House of Flies)
2001|g|rock|The Strokes|Last Nite
2001|g|rock|System of a Down|Chop Suey!
2001|g|rock|Nickelback|How You Remind Me
2001|g|rock|Weezer|Island in the Sun
2001|g|rock|Staind|It's Been Awhile
2001|g|rock|Sum 41|Fat Lip
2001|g|rock|Jimmy Eat World|The Middle
2001|g|rock|Drowning Pool|Bodies
2002|g|rock|Red Hot Chili Peppers|By the Way
2002|g|rock|Red Hot Chili Peppers|Can't Stop
2002|g|rock|Queens of the Stone Age|No One Knows
2002|g|rock|Coldplay|The Scientist
2002|g|rock|Coldplay|Clocks
2002|g|rock|Foo Fighters|All My Life
2002|g|rock|Audioslave|Cochise
2002|g|rock|The Vines|Get Free
2003|g|rock|The White Stripes|Seven Nation Army
2003|g|rock|Evanescence|Bring Me to Life
2003|g|rock|Linkin Park|Numb
2003|g|rock|The Darkness|I Believe in a Thing Called Love
2003|g|rock|Jet|Are You Gonna Be My Girl
2003|g|rock|Muse|Time Is Running Out
2003|g|rock|Three Days Grace|I Hate Everything About You
2003|g|rock|Yeah Yeah Yeahs|Maps
2004|g|rock|The Killers|Mr. Brightside
2004|g|rock|Green Day|Boulevard of Broken Dreams
2004|g|rock|Franz Ferdinand|Take Me Out
2004|g|rock|Green Day|American Idiot
2004|g|rock|The Killers|Somebody Told Me
2004|g|rock|Keane|Somewhere Only We Know
2004|g|rock|Modest Mouse|Float On
2004|g|rock|Velvet Revolver|Slither
2005|g|rock|Coldplay|Fix You
2005|g|rock|Coldplay|Speed of Sound
2005|g|rock|Foo Fighters|Best of You
2005|g|rock|System of a Down|B.Y.O.B.
2005|g|rock|Arctic Monkeys|I Bet You Look Good on the Dancefloor
2005|g|rock|Fall Out Boy|Sugar, We're Goin Down
2005|g|rock|Nickelback|Photograph
2005|g|rock|Green Day|Wake Me Up When September Ends
2006|g|rock|My Chemical Romance|Welcome to the Black Parade
2006|g|rock|Snow Patrol|Chasing Cars
2006|g|rock|The Killers|When You Were Young
2006|g|rock|Muse|Supermassive Black Hole
2006|g|rock|Muse|Starlight
2006|g|rock|Red Hot Chili Peppers|Dani California
2006|g|rock|Red Hot Chili Peppers|Snow (Hey Oh)
2006|g|rock|My Chemical Romance|Famous Last Words
2007|g|rock|Paramore|Misery Business
2007|g|rock|Foo Fighters|The Pretender
2007|g|rock|Linkin Park|What I've Done
2007|g|rock|Linkin Park|Shadow of the Day
2007|g|rock|Fall Out Boy|Thnks fr th Mmrs
2007|g|rock|Arctic Monkeys|Fluorescent Adolescent
2007|g|rock|Arctic Monkeys|Brianstorm
2007|g|rock|The White Stripes|Icky Thump
2008|g|rock|Coldplay|Viva la Vida
2008|g|rock|Kings of Leon|Use Somebody
2008|g|rock|Kings of Leon|Sex on Fire
2008|g|rock|The Killers|Human
2008|g|rock|Metallica|The Day That Never Comes
2008|g|rock|AC/DC|Rock N Roll Train
2008|g|rock|Guns N' Roses|Chinese Democracy
2008|g|rock|Paramore|Decode
2009|g|rock|Muse|Uprising
2009|g|rock|Green Day|21 Guns
2009|g|rock|Green Day|Know Your Enemy
2009|g|rock|Paramore|Ignorance
2009|g|rock|Kasabian|Fire
2009|g|rock|Arctic Monkeys|Crying Lightning
2009|g|rock|Pearl Jam|The Fixer
2009|g|rock|Linkin Park|New Divide
2010|g|rock|Linkin Park|The Catalyst
2010|g|rock|Linkin Park|Waiting for the End
2010|g|rock|Kings of Leon|Radioactive
2010|g|rock|Kings of Leon|Pyro
2010|g|rock|Arcade Fire|The Suburbs
2010|g|rock|The Black Keys|Tighten Up
2010|g|rock|The Black Keys|Howlin' for You
2010|g|rock|Avenged Sevenfold|Nightmare
2011|g|rock|Foster the People|Pumped Up Kicks
2011|g|rock|Foo Fighters|Rope
2011|g|rock|Foo Fighters|Walk
2011|g|rock|The Black Keys|Lonely Boy
2011|g|rock|Coldplay|Paradise
2011|g|rock|Coldplay|Every Teardrop Is a Waterfall
2011|g|rock|Arctic Monkeys|Don't Sit Down 'Cause I've Moved Your Chair
2011|g|rock|Red Hot Chili Peppers|The Adventures of Rain Dance Maggie
2012|g|rock|Imagine Dragons|Radioactive
2012|g|rock|Imagine Dragons|It's Time
2012|g|rock|Imagine Dragons|Demons
2012|g|rock|Muse|Madness
2012|g|rock|Linkin Park|Burn It Down
2012|g|rock|Arctic Monkeys|R U Mine?
2012|g|rock|Jack White|Sixteen Saltines
2012|g|rock|The Killers|Runaways
2013|g|rock|Arctic Monkeys|Do I Wanna Know?
2013|g|rock|Arctic Monkeys|Why'd You Only Call Me When You're High?
2013|g|rock|Paramore|Still Into You
2013|g|rock|Fall Out Boy|My Songs Know What You Did in the Dark (Light Em Up)
2013|g|rock|Arcade Fire|Reflektor
2013|g|rock|Avenged Sevenfold|Hail to the King
2013|g|rock|Pearl Jam|Mind Your Manners
2013|g|rock|Kings of Leon|Supersoaker
2014|g|rock|Royal Blood|Figure It Out
2014|g|rock|Royal Blood|Out of the Black
2014|g|rock|Foo Fighters|Something from Nothing
2014|g|rock|The Black Keys|Fever
2014|g|rock|Fall Out Boy|Centuries
2014|g|rock|Imagine Dragons|I Bet My Life
2014|g|rock|AC/DC|Play Ball
2014|g|rock|Linkin Park|Until It's Gone
2015|g|rock|Muse|Dead Inside
2015|g|rock|Muse|Psycho
2015|g|rock|Disturbed|The Sound of Silence
2015|g|rock|Fall Out Boy|Uma Thurman
2015|g|rock|Imagine Dragons|Shots
2015|g|rock|Coldplay|Adventure of a Lifetime
2015|g|rock|Bring Me the Horizon|Throne
2015|g|rock|Mumford & Sons|Believe
2016|g|rock|Red Hot Chili Peppers|Dark Necessities
2016|g|rock|Metallica|Hardwired
2016|g|rock|Metallica|Moth Into Flame
2016|g|rock|Green Day|Bang Bang
2016|g|rock|Green Day|Still Breathing
2016|g|rock|Kings of Leon|Waste a Moment
2016|g|rock|Radiohead|Burn the Witch
2016|g|rock|Blink-182|Bored to Death
2017|g|rock|Imagine Dragons|Believer
2017|g|rock|Imagine Dragons|Thunder
2017|g|rock|Foo Fighters|Run
2017|g|rock|Queens of the Stone Age|The Way You Used to Do
2017|g|rock|Linkin Park|Heavy
2017|g|rock|Portugal. The Man|Feel It Still
2017|g|rock|Royal Blood|Lights Out
2017|g|rock|The Killers|The Man
2018|g|rock|Greta Van Fleet|When the Curtain Falls
2018|g|rock|Arctic Monkeys|Four Out of Five
2018|g|rock|Imagine Dragons|Natural
2018|g|rock|Muse|Thought Contagion
2018|g|rock|Muse|Pressure
2018|g|rock|Shinedown|Devil
2018|g|rock|Bring Me the Horizon|Mantra
2018|g|rock|Ghost|Rats
2019|g|rock|Bring Me the Horizon|Ludens
2019|g|rock|The Black Keys|Lo/Hi
2019|g|rock|Green Day|Father of All...
2019|g|rock|Slipknot|Unsainted
2019|g|rock|Liam Gallagher|Shockwave
2019|g|rock|Tool|Fear Inoculum
2019|g|rock|Foals|In Degrees
2019|g|rock|Coldplay|Orphans
2020|g|rock|AC/DC|Shot in the Dark
2020|g|rock|Foo Fighters|Shame Shame
2020|g|rock|The Killers|Caution
2020|g|rock|The Strokes|At the Door
2020|g|rock|Pearl Jam|Dance of the Clairvoyants
2020|g|rock|Machine Gun Kelly|Bloody Valentine
2020|g|rock|Bring Me the Horizon|Parasite Eve
2020|g|rock|Royal Blood|Trouble's Coming
2021|g|rock|Måneskin|Beggin'
2021|g|rock|Måneskin|Zitti e buoni
2021|g|rock|Måneskin|I Wanna Be Your Slave
2021|g|rock|Måneskin|MAMMAMIA
2021|g|rock|Foo Fighters|Waiting on a War
2021|g|rock|Royal Blood|Typhoons
2021|g|rock|Weezer|All My Favorite Songs
2021|g|rock|Wolf Alice|Smile

1979|g|hip|The Sugarhill Gang|Rapper's Delight
1979|g|hip|Chic|Good Times
1979|g|hip|McFadden & Whitehead|Ain't No Stoppin' Us Now
1979|g|hip|The Gap Band|Oops Upside Your Head
1979|g|hip|Kool & the Gang|Ladies' Night
1979|g|hip|Earth, Wind & Fire & The Emotions|Boogie Wonderland
1979|g|hip|Anita Ward|Ring My Bell
1979|g|hip|Kurtis Blow|Christmas Rappin'
1980|g|hip|Kurtis Blow|The Breaks
1980|g|hip|Michael Jackson|Off the Wall
1980|g|hip|Yarbrough & Peoples|Don't Stop the Music
1980|g|hip|Kool & the Gang|Celebration
1980|g|hip|Stevie Wonder|Master Blaster (Jammin')
1980|g|hip|George Benson|Give Me the Night
1980|g|hip|The S.O.S. Band|Take Your Time (Do It Right)
1980|g|hip|The Sugarhill Gang|8th Wonder
1981|g|hip|Rick James|Super Freak
1981|g|hip|Rick James|Give It to Me Baby
1981|g|hip|Kool & the Gang|Get Down on It
1981|g|hip|Luther Vandross|Never Too Much
1981|g|hip|Earth, Wind & Fire|Let's Groove
1981|g|hip|Smokey Robinson|Being with You
1981|g|hip|Grandmaster Flash|The Adventures of Grandmaster Flash on the Wheels of Steel
1981|g|hip|Stevie Wonder|Lately
1982|g|hip|Grandmaster Flash & The Furious Five|The Message
1982|g|hip|Marvin Gaye|Sexual Healing
1982|g|hip|Afrika Bambaataa & The Soulsonic Force|Planet Rock
1982|g|hip|The Gap Band|Outstanding
1982|g|hip|Prince|1999
1982|g|hip|Evelyn "Champagne" King|Love Come Down
1982|g|hip|Dazz Band|Let It Whip
1982|g|hip|Zapp|Dance Floor
1983|g|hip|Midnight Star|Freak-A-Zoid
1983|g|hip|Michael Jackson|Wanna Be Startin' Somethin'
1983|g|hip|Herbie Hancock|Rockit
1983|g|hip|Run-D.M.C.|Sucker M.C.'s
1983|g|hip|Run-D.M.C.|It's Like That
1983|g|hip|Grandmaster Flash & Melle Mel|White Lines (Don't Don't Do It)
1983|g|hip|Rick James|Cold Blooded
1983|g|hip|DeBarge|Time Will Reveal
1984|g|hip|Prince & The Revolution|When Doves Cry
1984|g|hip|Chaka Khan|I Feel for You
1984|g|hip|Kurtis Blow|Basketball
1984|g|hip|Run-D.M.C.|Rock Box
1984|g|hip|Whodini|Friends
1984|g|hip|Cameo|She's Strange
1984|g|hip|Rockwell|Somebody's Watching Me
1984|g|hip|Billy Ocean|Caribbean Queen (No More Love on the Run)
1985|g|hip|LL Cool J|I Can't Live Without My Radio
1985|g|hip|Freddie Jackson|Rock Me Tonight (For Old Times Sake)
1985|g|hip|Sade|Smooth Operator
1985|g|hip|Doug E. Fresh & The Get Fresh Crew|The Show
1985|g|hip|Ready for the World|Oh Sheila
1985|g|hip|Aretha Franklin|Freeway of Love
1985|g|hip|Kool & the Gang|Cherish
1985|g|hip|Run-D.M.C.|King of Rock
1986|g|hip|Run-D.M.C. & Aerosmith|Walk This Way
1986|g|hip|Janet Jackson|Nasty
1986|g|hip|Run-D.M.C.|My Adidas
1986|g|hip|Cameo|Word Up!
1986|g|hip|Prince & The Revolution|Kiss
1986|g|hip|Anita Baker|Sweet Love
1986|g|hip|Timex Social Club|Rumors
1986|g|hip|Eric B. & Rakim|Eric B. Is President
1987|g|hip|Beastie Boys|(You Gotta) Fight for Your Right (To Party!)
1987|g|hip|LL Cool J|I Need Love
1987|g|hip|Eric B. & Rakim|Paid in Full
1987|g|hip|Boogie Down Productions|South Bronx
1987|g|hip|Michael Jackson|The Way You Make Me Feel
1987|g|hip|Salt-N-Pepa|Push It
1987|g|hip|Public Enemy|Rebel Without a Pause
1987|g|hip|Club Nouveau|Lean on Me
1988|g|hip|Public Enemy|Don't Believe the Hype
1988|g|hip|N.W.A|Straight Outta Compton
1988|g|hip|Rob Base & DJ E-Z Rock|It Takes Two
1988|g|hip|DJ Jazzy Jeff & The Fresh Prince|Parents Just Don't Understand
1988|g|hip|Bobby Brown|My Prerogative
1988|g|hip|Keith Sweat|I Want Her
1988|g|hip|Eric B. & Rakim|Follow the Leader
1988|g|hip|Al B. Sure!|Nite and Day
1989|g|hip|Public Enemy|Fight the Power
1989|g|hip|Tone Lōc|Wild Thing
1989|g|hip|Young MC|Bust a Move
1989|g|hip|De La Soul|Me Myself and I
1989|g|hip|Bobby Brown|Every Little Step
1989|g|hip|Soul II Soul|Back to Life (However Do You Want Me)
1989|g|hip|Janet Jackson|Miss You Much
1989|g|hip|Neneh Cherry|Buffalo Stance
1990|g|hip|MC Hammer|U Can't Touch This
1990|g|hip|Vanilla Ice|Ice Ice Baby
1990|g|hip|Bell Biv DeVoe|Poison
1990|g|hip|Johnny Gill|My, My, My
1990|g|hip|A Tribe Called Quest|Can I Kick It?
1990|g|hip|Tony! Toni! Toné!|Feels Good
1990|g|hip|Digital Underground|The Humpty Dance
1990|g|hip|En Vogue|Hold On
1991|g|hip|Naughty by Nature|O.P.P.
1991|g|hip|DJ Jazzy Jeff & The Fresh Prince|Summertime
1991|g|hip|Boyz II Men|Motownphilly
1991|g|hip|P.M. Dawn|Set Adrift on Memory Bliss
1991|g|hip|A Tribe Called Quest|Check the Rhime
1991|g|hip|Color Me Badd|I Wanna Sex You Up
1991|g|hip|Salt-N-Pepa|Let's Talk About Sex
1991|g|hip|Jodeci|Forever My Lady
1992|g|hip|Dr. Dre feat. Snoop Dogg|Nuthin' but a "G" Thang
1992|g|hip|Kris Kross|Jump
1992|g|hip|Sir Mix-a-Lot|Baby Got Back
1992|g|hip|Boyz II Men|End of the Road
1992|g|hip|House of Pain|Jump Around
1992|g|hip|Arrested Development|Tennessee
1992|g|hip|Mary J. Blige|Real Love
1992|g|hip|Pete Rock & C.L. Smooth|They Reminisce Over You (T.R.O.Y.)
1993|g|hip|Snoop Doggy Dogg|Who Am I? (What's My Name?)
1993|g|hip|Dr. Dre|Let Me Ride
1993|g|hip|Wu-Tang Clan|Protect Ya Neck
1993|g|hip|Tag Team|Whoomp! (There It Is)
1993|g|hip|Onyx|Slam
1993|g|hip|SWV|Weak
1993|g|hip|Digable Planets|Rebirth of Slick (Cool Like Dat)
1993|g|hip|Ice Cube|It Was a Good Day
1994|g|hip|Warren G & Nate Dogg|Regulate
1994|g|hip|The Notorious B.I.G.|Juicy
1994|g|hip|Snoop Doggy Dogg|Gin and Juice
1994|g|hip|Nas|It Ain't Hard to Tell
1994|g|hip|Boyz II Men|I'll Make Love to You
1994|g|hip|TLC|Creep
1994|g|hip|Coolio|Fantastic Voyage
1994|g|hip|Aaliyah|Back & Forth
1995|g|hip|Coolio|Gangsta's Paradise
1995|g|hip|TLC|Waterfalls
1995|g|hip|Montell Jordan|This Is How We Do It
1995|g|hip|Bone Thugs-n-Harmony|1st of tha Month
1995|g|hip|The Notorious B.I.G.|Big Poppa
1995|g|hip|D'Angelo|Brown Sugar
1995|g|hip|Mobb Deep|Shook Ones (Part II)
1995|g|hip|2Pac|Dear Mama
1996|g|hip|2Pac feat. Dr. Dre|California Love
1996|g|hip|Fugees|Killing Me Softly
1996|g|hip|Bone Thugs-n-Harmony|Tha Crossroads
1996|g|hip|Ginuwine|Pony
1996|g|hip|Busta Rhymes|Woo Hah!! Got You All in Check
1996|g|hip|Nas|If I Ruled the World (Imagine That)
1996|g|hip|Keith Sweat|Twisted
1996|g|hip|Blackstreet feat. Dr. Dre|No Diggity
1997|g|hip|The Notorious B.I.G.|Hypnotize
1997|g|hip|Puff Daddy feat. Faith Evans & 112|I'll Be Missing You
1997|g|hip|The Notorious B.I.G. feat. Puff Daddy & Mase|Mo Money Mo Problems
1997|g|hip|Missy Elliott|The Rain (Supa Dupa Fly)
1997|g|hip|Erykah Badu|On & On
1997|g|hip|Busta Rhymes|Put Your Hands Where My Eyes Could See
1997|g|hip|Usher|You Make Me Wanna...
1997|g|hip|Mase|Feel So Good
1998|g|hip|Lauryn Hill|Doo Wop (That Thing)
1998|g|hip|Jay-Z|Hard Knock Life (Ghetto Anthem)
1998|g|hip|DMX|Ruff Ryders' Anthem
1998|g|hip|Brandy & Monica|The Boy Is Mine
1998|g|hip|Big Pun feat. Joe|Still Not a Player
1998|g|hip|Will Smith|Gettin' Jiggy wit It
1998|g|hip|Next|Too Close
1998|g|hip|OutKast|Rosa Parks
1999|g|hip|TLC|No Scrubs
1999|g|hip|Eminem|My Name Is
1999|g|hip|Dr. Dre feat. Snoop Dogg|Still D.R.E.
1999|g|hip|Destiny's Child|Bills, Bills, Bills
1999|g|hip|Juvenile feat. Mannie Fresh & Lil Wayne|Back That Azz Up
1999|g|hip|Mariah Carey feat. Jay-Z|Heartbreaker
1999|g|hip|702|Where My Girls At?
1999|g|hip|The Roots feat. Erykah Badu|You Got Me
2000|g|hip|Eminem|The Real Slim Shady
2000|g|hip|OutKast|Ms. Jackson
2000|g|hip|Destiny's Child|Say My Name
2000|g|hip|Sisqó|Thong Song
2000|g|hip|Jay-Z feat. UGK|Big Pimpin'
2000|g|hip|DMX|Party Up (Up in Here)
2000|g|hip|Dr. Dre feat. Eminem|Forgot About Dre
2000|g|hip|Nelly|Country Grammar
2001|g|hip|Missy Elliott|Get Ur Freak On
2001|g|hip|Destiny's Child|Survivor
2001|g|hip|Alicia Keys|Fallin'
2001|g|hip|Jay-Z|Izzo (H.O.V.A.)
2001|g|hip|Ja Rule feat. Ashanti|Always on Time
2001|g|hip|Aaliyah|Rock the Boat
2001|g|hip|Usher|U Remind Me
2001|g|hip|Mary J. Blige|Family Affair
2002|g|hip|Eminem|Lose Yourself
2002|g|hip|Nelly|Hot in Herre
2002|g|hip|Nelly feat. Kelly Rowland|Dilemma
2002|g|hip|Missy Elliott|Work It
2002|g|hip|Ashanti|Foolish
2002|g|hip|Eminem|Without Me
2002|g|hip|Fat Joe feat. Ashanti|What's Luv?
2002|g|hip|Clipse|Grindin'
2003|g|hip|50 Cent|In da Club
2003|g|hip|Beyoncé|Crazy in Love
2003|g|hip|OutKast|Hey Ya!
2003|g|hip|Chingy|Right Thurr
2003|g|hip|Ludacris feat. Shawnna|Stand Up
2003|g|hip|Lil Jon & The East Side Boyz feat. Ying Yang Twins|Get Low
2003|g|hip|R. Kelly|Ignition (Remix)
2003|g|hip|Busta Rhymes & Mariah Carey|I Know What You Want
2004|g|hip|Usher|Yeah!
2004|g|hip|Usher|Burn
2004|g|hip|Kanye West|Jesus Walks
2004|g|hip|Snoop Dogg feat. Pharrell|Drop It Like It's Hot
2004|g|hip|Ciara feat. Petey Pablo|Goodies
2004|g|hip|Alicia Keys|If I Ain't Got You
2004|g|hip|Terror Squad|Lean Back
2004|g|hip|Jay-Z|99 Problems
2005|g|hip|Kanye West|Gold Digger
2005|g|hip|50 Cent feat. Olivia|Candy Shop
2005|g|hip|Mike Jones feat. Slim Thug & Paul Wall|Still Tippin'
2005|g|hip|The Game feat. 50 Cent|Hate It or Love It
2005|g|hip|Ciara feat. Missy Elliott|1, 2 Step
2005|g|hip|Chris Brown|Run It!
2005|g|hip|Missy Elliott|Lose Control
2005|g|hip|Young Jeezy feat. Akon|Soul Survivor
2006|g|hip|Beyoncé|Irreplaceable
2006|g|hip|Ne-Yo|So Sick
2006|g|hip|T.I.|What You Know
2006|g|hip|Chamillionaire feat. Krayzie Bone|Ridin'
2006|g|hip|Lupe Fiasco|Kick, Push
2006|g|hip|Jim Jones|We Fly High
2006|g|hip|Akon feat. Eminem|Smack That
2006|g|hip|Cassie|Me & U
2007|g|hip|Kanye West|Stronger
2007|g|hip|Soulja Boy Tell 'Em|Crank That (Soulja Boy)
2007|g|hip|Rihanna feat. Jay-Z|Umbrella
2007|g|hip|T-Pain feat. Yung Joc|Buy U a Drank (Shawty Snappin')
2007|g|hip|Alicia Keys|No One
2007|g|hip|UGK feat. OutKast|Int'l Players Anthem (I Choose You)
2007|g|hip|Chris Brown|Kiss Kiss
2007|g|hip|Fabolous feat. Ne-Yo|Make Me Better
2008|g|hip|Lil Wayne|Lollipop
2008|g|hip|T.I. feat. Rihanna|Live Your Life
2008|g|hip|T.I.|Whatever You Like
2008|g|hip|Lil Wayne|A Milli
2008|g|hip|Flo Rida feat. T-Pain|Low
2008|g|hip|Beyoncé|Single Ladies (Put a Ring on It)
2008|g|hip|Kanye West|Love Lockdown
2008|g|hip|Estelle feat. Kanye West|American Boy
2009|g|hip|Jay-Z & Alicia Keys|Empire State of Mind
2009|g|hip|Drake|Best I Ever Had
2009|g|hip|Jay-Z feat. Rihanna & Kanye West|Run This Town
2009|g|hip|Jeremih|Birthday Sex
2009|g|hip|Eminem feat. Dr. Dre & 50 Cent|Crack a Bottle
2009|g|hip|Jay Sean feat. Lil Wayne|Down
2009|g|hip|Young Money feat. Lloyd|BedRock
2009|g|hip|Keri Hilson feat. Kanye West & Ne-Yo|Knock You Down
2010|g|hip|Eminem feat. Rihanna|Love the Way You Lie
2010|g|hip|Kanye West feat. Pusha T|Runaway
2010|g|hip|B.o.B feat. Bruno Mars|Nothin' on You
2010|g|hip|Rihanna|Rude Boy
2010|g|hip|Drake|Over
2010|g|hip|Wiz Khalifa|Black and Yellow
2010|g|hip|Eminem|Not Afraid
2010|g|hip|Trey Songz feat. Nicki Minaj|Bottoms Up
2011|g|hip|Nicki Minaj|Super Bass
2011|g|hip|Jay-Z & Kanye West|Otis
2011|g|hip|Drake|Headlines
2011|g|hip|Frank Ocean|Novacane
2011|g|hip|The Weeknd|Wicked Games
2011|g|hip|Big Sean feat. Chris Brown|My Last
2011|g|hip|Beyoncé|Love On Top
2011|g|hip|Tyga|Rack City
2012|g|hip|Macklemore & Ryan Lewis|Thrift Shop
2012|g|hip|Kendrick Lamar|Swimming Pools (Drank)
2012|g|hip|Frank Ocean|Thinkin Bout You
2012|g|hip|2 Chainz feat. Kanye West|Birthday Song
2012|g|hip|Kanye West feat. Big Sean, Pusha T & 2 Chainz|Mercy
2012|g|hip|Drake feat. Rihanna|Take Care
2012|g|hip|Chief Keef|Love Sosa
2012|g|hip|Miguel|Adorn
2013|g|hip|Drake|Hold On, We're Going Home
2013|g|hip|Drake|Started from the Bottom
2013|g|hip|J. Cole feat. Miguel|Power Trip
2013|g|hip|Kanye West|Black Skinhead
2013|g|hip|Eminem|Rap God
2013|g|hip|Kendrick Lamar feat. Drake|Poetic Justice
2013|g|hip|Beyoncé feat. Jay-Z|Drunk in Love
2013|g|hip|Migos|Versace
2014|g|hip|Iggy Azalea feat. Charli XCX|Fancy
2014|g|hip|Nicki Minaj|Anaconda
2014|g|hip|ILoveMakonnen feat. Drake|Tuesday
2014|g|hip|Rae Sremmurd|No Type
2014|g|hip|Kendrick Lamar|i
2014|g|hip|Chris Brown feat. Lil Wayne & Tyga|Loyal
2014|g|hip|Fetty Wap|Trap Queen
2014|g|hip|Tinashe feat. ScHoolboy Q|2 On
2015|g|hip|Kendrick Lamar|Alright
2015|g|hip|Drake|Hotline Bling
2015|g|hip|The Weeknd|Can't Feel My Face
2015|g|hip|Silentó|Watch Me (Whip/Nae Nae)
2015|g|hip|Drake & Future|Jumpman
2015|g|hip|Travis Scott|Antidote
2015|g|hip|Rihanna|Bitch Better Have My Money
2015|g|hip|Fetty Wap feat. Remy Boyz|679
2016|g|hip|Drake|One Dance
2016|g|hip|Rae Sremmurd feat. Gucci Mane|Black Beatles
2016|g|hip|Desiigner|Panda
2016|g|hip|Beyoncé|Formation
2016|g|hip|Kanye West|Famous
2016|g|hip|The Weeknd feat. Daft Punk|Starboy
2016|g|hip|Rihanna feat. Drake|Work
2016|g|hip|Chance the Rapper feat. 2 Chainz & Lil Wayne|No Problem
2017|g|hip|Kendrick Lamar|HUMBLE.
2017|g|hip|Cardi B|Bodak Yellow
2017|g|hip|Migos feat. Lil Uzi Vert|Bad and Boujee
2017|g|hip|Post Malone feat. 21 Savage|rockstar
2017|g|hip|Lil Uzi Vert|XO Tour Llif3
2017|g|hip|Future|Mask Off
2017|g|hip|SZA|Love Galore
2017|g|hip|Logic feat. Alessia Cara & Khalid|1-800-273-8255
2018|g|hip|Drake|God's Plan
2018|g|hip|Travis Scott|SICKO MODE
2018|g|hip|Childish Gambino|This Is America
2018|g|hip|Drake|In My Feelings
2018|g|hip|Juice WRLD|Lucid Dreams
2018|g|hip|Kendrick Lamar & SZA|All the Stars
2018|g|hip|Post Malone feat. Ty Dolla $ign|Psycho
2018|g|hip|Ella Mai|Boo'd Up
2019|g|hip|Lil Nas X|Old Town Road
2019|g|hip|DaBaby|Suge
2019|g|hip|Megan Thee Stallion feat. Nicki Minaj & Ty Dolla $ign|Hot Girl Summer
2019|g|hip|Roddy Ricch|The Box
2019|g|hip|Lil Tecca|Ransom
2019|g|hip|Travis Scott|HIGHEST IN THE ROOM
2019|g|hip|Khalid|Talk
2019|g|hip|Tyler, the Creator|EARFQUAKE
2020|g|hip|DaBaby feat. Roddy Ricch|ROCKSTAR
2020|g|hip|Megan Thee Stallion|Savage
2020|g|hip|Cardi B feat. Megan Thee Stallion|WAP
2020|g|hip|Jack Harlow|WHATS POPPIN
2020|g|hip|Drake|Toosie Slide
2020|g|hip|Future feat. Drake|Life Is Good
2020|g|hip|Pop Smoke feat. Lil Baby & DaBaby|For the Night
2020|g|hip|Lil Baby|The Bigger Picture
2021|g|hip|Lil Nas X|MONTERO (Call Me by Your Name)
2021|g|hip|Doja Cat feat. SZA|Kiss Me More
2021|g|hip|Drake feat. Future & Young Thug|Way 2 Sexy
2021|g|hip|Silk Sonic|Leave the Door Open
2021|g|hip|Polo G|RAPSTAR
2021|g|hip|Lil Nas X & Jack Harlow|INDUSTRY BABY
2021|g|hip|Tyler, the Creator|WUSYANAME
2021|g|hip|Masked Wolf|Astronaut in the Ocean
2022|g|hip|Jack Harlow|First Class
2022|g|hip|SZA|Kill Bill
2022|g|hip|Kendrick Lamar|N95
2022|g|hip|Future feat. Drake & Tems|WAIT FOR U
2022|g|hip|Steve Lacy|Bad Habit
2022|g|hip|GloRilla|F.N.F. (Let's Go)
2022|g|hip|Central Cee|Doja
2022|g|hip|Drake & 21 Savage|Rich Flex
2023|g|hip|Doja Cat|Paint the Town Red
2023|g|hip|Metro Boomin, The Weeknd & 21 Savage|Creepin'
2023|g|hip|Travis Scott|FE!N
2023|g|hip|SZA|Snooze
2023|g|hip|Ice Spice & Nicki Minaj|Princess Diana
2023|g|hip|Lil Durk feat. J. Cole|All My Life
2023|g|hip|Drake feat. J. Cole|First Person Shooter
2023|g|hip|Victoria Monét|On My Mama
2024|g|hip|Kendrick Lamar|Not Like Us
2024|g|hip|Tommy Richman|Million Dollar Baby
2024|g|hip|Future, Metro Boomin & Kendrick Lamar|Like That
2024|g|hip|SZA|Saturn
2024|g|hip|Kanye West & Ty Dolla $ign|CARNIVAL
2024|g|hip|Drake|Family Matters
2024|g|hip|Muni Long|Made for Me
2024|g|hip|Tyler, the Creator|NOID

1990|g|ele|Snap!|The Power
1990|g|ele|Deee-Lite|Groove Is in the Heart
1990|g|ele|Black Box|Everybody Everybody
1990|g|ele|C+C Music Factory|Gonna Make You Sweat (Everybody Dance Now)
1990|g|ele|Adamski|Killer
1990|g|ele|Enigma|Sadeness (Part I)
1990|g|ele|Technotronic|Get Up! (Before the Night Is Over)
1990|g|ele|Snap!|Ooops Up
1991|g|ele|2 Unlimited|Get Ready for This
1991|g|ele|The KLF|Last Train to Trancentral
1991|g|ele|Crystal Waters|Gypsy Woman (She's Homeless)
1991|g|ele|C+C Music Factory|Things That Make You Go Hmmm...
1991|g|ele|Moby|Go
1991|g|ele|The Prodigy|Charly
1991|g|ele|Massive Attack|Unfinished Sympathy
1991|g|ele|Rozalla|Everybody's Free (To Feel Good)
1992|g|ele|Snap!|Rhythm Is a Dancer
1992|g|ele|Dr. Alban|It's My Life
1992|g|ele|The Prodigy|Out of Space
1992|g|ele|The Shamen|Ebeneezer Goode
1992|g|ele|Captain Hollywood Project|More and More
1992|g|ele|Utah Saints|Something Good
1992|g|ele|Felix|Don't You Want Me
1992|g|ele|2 Unlimited|Twilight Zone
1993|g|ele|Haddaway|What Is Love
1993|g|ele|2 Unlimited|No Limit
1993|g|ele|Culture Beat|Mr. Vain
1993|g|ele|Haddaway|Life
1993|g|ele|2 Unlimited|Tribal Dance
1993|g|ele|Robin S.|Show Me Love
1993|g|ele|Cappella|U Got 2 Let the Music
1993|g|ele|Urban Cookie Collective|The Key the Secret
1994|g|ele|Corona|The Rhythm of the Night
1994|g|ele|Whigfield|Saturday Night
1994|g|ele|Ice MC|Think About the Way
1994|g|ele|Reel 2 Real feat. The Mad Stuntman|I Like to Move It
1994|g|ele|2 Unlimited|The Real Thing
1994|g|ele|The Prodigy|No Good (Start the Dance)
1994|g|ele|Cappella|Move On Baby
1994|g|ele|Real McCoy|Another Night
1995|g|ele|Robert Miles|Children
1995|g|ele|La Bouche|Be My Lover
1995|g|ele|Scatman John|Scatman (Ski-Ba-Bop-Ba-Dop-Bop)
1995|g|ele|Real McCoy|Run Away
1995|g|ele|Corona|Baby Baby
1995|g|ele|Everything but the Girl|Missing
1995|g|ele|Livin' Joy|Dreamer
1995|g|ele|Captain Jack|Captain Jack
1996|g|ele|Robert Miles|Fable
1996|g|ele|The Prodigy|Firestarter
1996|g|ele|The Prodigy|Breathe
1996|g|ele|Underworld|Born Slippy .NUXX
1996|g|ele|BBE|Seven Days and One Week
1996|g|ele|Faithless|Insomnia
1996|g|ele|The Chemical Brothers|Setting Sun
1996|g|ele|Gala|Freed from Desire
1997|g|ele|Daft Punk|Around the World
1997|g|ele|The Chemical Brothers|Block Rockin' Beats
1997|g|ele|The Prodigy|Smack My Bitch Up
1997|g|ele|Sash!|Encore une fois
1997|g|ele|Sash!|Ecuador
1997|g|ele|Bellini|Samba de Janeiro
1997|g|ele|Olive|You're Not Alone
1997|g|ele|Daft Punk|Burnin'
1998|g|ele|Eiffel 65|Blue (Da Ba Dee)
1998|g|ele|Mousse T. & Hot 'n' Juicy|Horny '98
1998|g|ele|Stardust|Music Sounds Better with You
1998|g|ele|Fatboy Slim|The Rockafeller Skank
1998|g|ele|Sash!|La Primavera
1998|g|ele|Vengaboys|We Like to Party! (The Vengabus)
1998|g|ele|Massive Attack|Teardrop
1998|g|ele|Fatboy Slim|Gangster Trippin
1999|g|ele|Alice Deejay|Better Off Alone
1999|g|ele|ATB|9 PM (Till I Come)
1999|g|ele|Fatboy Slim|Praise You
1999|g|ele|Vengaboys|Boom, Boom, Boom, Boom!!
1999|g|ele|Basement Jaxx|Red Alert
1999|g|ele|Mr. Oizo|Flat Beat
1999|g|ele|The Chemical Brothers|Hey Boy Hey Girl
1999|g|ele|Darude|Sandstorm
2000|g|ele|Daft Punk|One More Time
2000|g|ele|Modjo|Lady (Hear Me Tonight)
2000|g|ele|Spiller|Groovejet (If This Ain't Love)
2000|g|ele|Moby|Porcelain
2000|g|ele|Fragma|Toca's Miracle
2000|g|ele|Moloko|The Time Is Now
2000|g|ele|ATC|Around the World (La La La La La)
2000|g|ele|Moby|Natural Blues
2001|g|ele|Daft Punk|Harder, Better, Faster, Stronger
2001|g|ele|Daft Punk|Digital Love
2001|g|ele|Basement Jaxx|Where's Your Head At
2001|g|ele|Röyksopp|Eple
2001|g|ele|Kosheen|Hide U
2001|g|ele|Roger Sanchez|Another Chance
2001|g|ele|Fatboy Slim|Weapon of Choice
2001|g|ele|Basement Jaxx|Romeo
2002|g|ele|DJ Sammy|Heaven
2002|g|ele|Moby|We Are All Made of Stars
2002|g|ele|Groove Coverage|Moonlight Shadow
2002|g|ele|Elvis vs. JXL|A Little Less Conversation
2002|g|ele|The Chemical Brothers|Star Guitar
2002|g|ele|Paul Oakenfold|Starry Eyed Surprise
2002|g|ele|Röyksopp|Remind Me
2002|g|ele|Scooter|Nessaja
2003|g|ele|Room 5 feat. Oliver Cheatham|Make Luv
2003|g|ele|Tomcraft|Loneliness
2003|g|ele|Basement Jaxx feat. Lisa Kekaula|Good Luck
2003|g|ele|Benny Benassi|Satisfaction
2003|g|ele|Junior Senior|Move Your Feet
2003|g|ele|Tiësto|Traffic
2003|g|ele|The Chemical Brothers|Get Yourself High
2003|g|ele|Bob Sinclar|Kiss My Eyes
2004|g|ele|Eric Prydz|Call on Me
2004|g|ele|Mylo|Drop the Pressure
2004|g|ele|Shapeshifters|Lola's Theme
2004|g|ele|Tiësto feat. BT|Love Comes Again
2004|g|ele|Global Deejays|The Sound of San Francisco
2004|g|ele|Boogie Pimps|Somebody to Love
2004|g|ele|Alter Ego|Rocker
2004|g|ele|Junior Jack|Stupidisco
2005|g|ele|Daft Punk|Robot Rock
2005|g|ele|Bob Sinclar|Love Generation
2005|g|ele|Tiësto|Adagio for Strings
2005|g|ele|Deep Dish|Say Hello
2005|g|ele|Freemasons|Love on My Mind
2005|g|ele|Röyksopp|Only This Moment
2005|g|ele|Daft Punk|Technologic
2005|g|ele|Bodyrockers|I Like the Way
2006|g|ele|Cascada|Everytime We Touch
2006|g|ele|Bob Sinclar|Rock This Party (Everybody Dance Now)
2006|g|ele|Basshunter|Boten Anna
2006|g|ele|Fedde Le Grand|Put Your Hands Up for Detroit
2006|g|ele|Justice vs. Simian|We Are Your Friends
2006|g|ele|David Guetta vs. The Egg|Love Don't Let Me Go (Walking Away)
2006|g|ele|Meck feat. Leo Sayer|Thunder in My Heart Again
2006|g|ele|Sharam|PATT (Party All the Time)
2007|g|ele|Justice|D.A.N.C.E.
2007|g|ele|Basshunter|Now You're Gone
2007|g|ele|Calvin Harris|Acceptable in the 80's
2007|g|ele|Calvin Harris|The Girls
2007|g|ele|Eric Prydz vs. Floyd|Proper Education
2007|g|ele|Axwell|I Found U
2007|g|ele|David Guetta feat. Cozi|Baby When the Light
2007|g|ele|Digitalism|Pogo
2008|g|ele|deadmau5 & Kaskade|I Remember
2008|g|ele|Martin Solveig|C'est la vie
2008|g|ele|Basshunter|All I Ever Wanted
2008|g|ele|Laurent Wolf feat. Eric Carter|No Stress
2008|g|ele|Sam Sparro|Black & Gold
2008|g|ele|Armin van Buuren feat. Sharon den Adel|In and Out of Love
2008|g|ele|Pendulum|Propane Nightmares
2008|g|ele|Hot Chip|Ready for the Floor
2009|g|ele|David Guetta feat. Kelly Rowland|When Love Takes Over
2009|g|ele|David Guetta feat. Akon|Sexy Bitch
2009|g|ele|Calvin Harris|I'm Not Alone
2009|g|ele|Calvin Harris|Ready for the Weekend
2009|g|ele|deadmau5 feat. Rob Swire|Ghosts 'n' Stuff
2009|g|ele|The Prodigy|Omen
2009|g|ele|Sidney Samson|Riverside
2009|g|ele|The Ian Carey Project|Get Shaky
2010|g|ele|Duck Sauce|Barbra Streisand
2010|g|ele|Swedish House Mafia feat. Pharrell|One (Your Name)
2010|g|ele|David Guetta feat. Kid Cudi|Memories
2010|g|ele|Example|Kickstarts
2010|g|ele|Yolanda Be Cool & DCUP|We No Speak Americano
2010|g|ele|Swedish House Mafia feat. Tinie Tempah|Miami 2 Ibiza
2010|g|ele|Martin Solveig & Dragonette|Hello
2010|g|ele|David Guetta & Chris Willis feat. Fergie & LMFAO|Gettin' Over You
2011|g|ele|Avicii|Levels
2011|g|ele|LMFAO|Party Rock Anthem
2011|g|ele|David Guetta feat. Sia|Titanium
2011|g|ele|Rihanna feat. Calvin Harris|We Found Love
2011|g|ele|David Guetta feat. Flo Rida & Nicki Minaj|Where Them Girls At
2011|g|ele|Swedish House Mafia|Save the World
2011|g|ele|Calvin Harris|Feel So Close
2011|g|ele|Example|Changed the Way You Kiss Me
2012|g|ele|Swedish House Mafia|Don't You Worry Child
2012|g|ele|Calvin Harris feat. Ne-Yo|Let's Go
2012|g|ele|Avicii|Silhouettes
2012|g|ele|Zedd feat. Foxes|Clarity
2012|g|ele|Nicky Romero & Avicii|I Could Be the One
2012|g|ele|David Guetta feat. Sia|She Wolf (Falling to Pieces)
2012|g|ele|Calvin Harris feat. Florence Welch|Sweet Nothing
2012|g|ele|Otto Knows|Million Voices
2013|g|ele|Avicii|Wake Me Up
2013|g|ele|Daft Punk feat. Pharrell Williams|Get Lucky
2013|g|ele|Baauer|Harlem Shake
2013|g|ele|Avicii|Hey Brother
2013|g|ele|Calvin Harris feat. Ellie Goulding|I Need Your Love
2013|g|ele|Martin Garrix|Animals
2013|g|ele|Naughty Boy feat. Sam Smith|La La La
2013|g|ele|Duke Dumont feat. A*M*E|Need U (100%)
2014|g|ele|Calvin Harris|Summer
2014|g|ele|Clean Bandit feat. Jess Glynne|Rather Be
2014|g|ele|Calvin Harris feat. John Newman|Blame
2014|g|ele|Kiesza|Hideaway
2014|g|ele|Duke Dumont|I Got U
2014|g|ele|David Guetta feat. Sam Martin|Lovers on the Sun
2014|g|ele|Kygo feat. Conrad Sewell|Firestone
2014|g|ele|Lilly Wood & The Prick and Robin Schulz|Prayer in C
2015|g|ele|Major Lazer & DJ Snake|Lean On
2015|g|ele|Jack Ü feat. Justin Bieber|Where Are Ü Now
2015|g|ele|Kygo feat. Parson James|Stole the Show
2015|g|ele|Robin Schulz feat. Francesco Yates|Sugar
2015|g|ele|Felix Jaehn feat. Jasmine Thompson|Ain't Nobody (Loves Me Better)
2015|g|ele|Calvin Harris & Disciples|How Deep Is Your Love
2015|g|ele|Zedd feat. Selena Gomez|I Want You to Know
2015|g|ele|Avicii|Waiting for Love
2016|g|ele|The Chainsmokers feat. Halsey|Closer
2016|g|ele|Calvin Harris feat. Rihanna|This Is What You Came For
2016|g|ele|The Chainsmokers feat. Daya|Don't Let Me Down
2016|g|ele|Major Lazer feat. Justin Bieber & MØ|Cold Water
2016|g|ele|DJ Snake feat. Justin Bieber|Let Me Love You
2016|g|ele|Mike Posner|I Took a Pill in Ibiza (Seeb Remix)
2016|g|ele|Martin Garrix & Bebe Rexha|In the Name of Love
2016|g|ele|Galantis|No Money
2017|g|ele|The Chainsmokers & Coldplay|Something Just like This
2017|g|ele|Kygo & Selena Gomez|It Ain't Me
2017|g|ele|Calvin Harris feat. Pharrell Williams, Katy Perry & Big Sean|Feels
2017|g|ele|Zedd & Alessia Cara|Stay
2017|g|ele|Marshmello feat. Khalid|Silence
2017|g|ele|Martin Garrix & Dua Lipa|Scared to Be Lonely
2017|g|ele|David Guetta feat. Justin Bieber|2U
2017|g|ele|Avicii feat. Sandro Cavazza|Without You
2018|g|ele|Calvin Harris & Dua Lipa|One Kiss
2018|g|ele|Marshmello & Bastille|Happier
2018|g|ele|Zedd, Maren Morris & Grey|The Middle
2018|g|ele|Marshmello & Anne-Marie|Friends
2018|g|ele|Clean Bandit feat. Demi Lovato|Solo
2018|g|ele|Calvin Harris & Sam Smith|Promises
2018|g|ele|Silk City & Dua Lipa|Electricity
2018|g|ele|David Guetta feat. Sia|Flames
2019|g|ele|Avicii feat. Aloe Blacc|SOS
2019|g|ele|Marshmello feat. CHVRCHES|Here with Me
2019|g|ele|Calvin Harris & Rag'n'Bone Man|Giant
2019|g|ele|Kygo & Whitney Houston|Higher Love
2019|g|ele|Regard|Ride It
2019|g|ele|Meduza feat. Goodboys|Piece of Your Heart
2019|g|ele|The Chainsmokers feat. 5 Seconds of Summer|Who Do You Love
2019|g|ele|Martin Garrix feat. Macklemore & Patrick Stump|Summer Days
2020|g|ele|Joel Corry feat. MNEK|Head & Heart
2020|g|ele|Regard & Raye|Secrets
2020|g|ele|Joel Corry|Lonely
2020|g|ele|Tiësto|The Business
2020|g|ele|Clean Bandit & Mabel feat. 24kGoldn|Tick Tock
2020|g|ele|Calvin Harris & The Weeknd|Over Now
2020|g|ele|Kygo & OneRepublic|Lose Somebody
2020|g|ele|220 Kid & Gracey|Don't Need Love
2021|g|ele|Joel Corry, Raye & David Guetta|Bed
2021|g|ele|Elton John & Dua Lipa|Cold Heart (PNAU Remix)
2021|g|ele|Riton x Nightcrawlers feat. Mufasa & Hypeman|Friday
2021|g|ele|Becky Hill & David Guetta|Remember
2021|g|ele|Acraze feat. Cherish|Do It to It
2021|g|ele|Tiësto & Ava Max|The Motto
2021|g|ele|Imanbek & Byor|Belly Dancer
2021|g|ele|Fred again.. & The Blessed Madonna|Marea (We've Lost Dancing)
2022|g|ele|David Guetta & Bebe Rexha|I'm Good (Blue)
2022|g|ele|Tiësto feat. Tate McRae|10:35
2022|g|ele|Eliza Rose & Interplanetary Criminal|B.O.T.A. (Baddest of Them All)
2022|g|ele|LF System|Afraid to Feel
2022|g|ele|Calvin Harris, Dua Lipa & Young Thug|Potion
2022|g|ele|Oliver Tree & Robin Schulz|Miss You
2022|g|ele|Purple Disco Machine & Sophie and the Giants|In the Dark
2022|g|ele|Tiësto & Charli XCX|Hot in It
2023|g|ele|Calvin Harris & Ellie Goulding|Miracle
2023|g|ele|Kenya Grace|Strangers
2023|g|ele|Peggy Gou|(It Goes Like) Nanana
2023|g|ele|Calvin Harris & Sam Smith|Desire
2023|g|ele|David Guetta, Anne-Marie & Coi Leray|Baby Don't Hurt Me
2023|g|ele|Skrillex, Fred again.. & Flowdan|Rumble
2023|g|ele|Cassö, Raye & D-Block Europe|Prada
2023|g|ele|Mau P|Drugs from Amsterdam

1996|g|lat|Los del Río|Macarena
1996|g|lat|Shakira|Un Poco de Amor
1996|g|lat|Shakira|Pies Descalzos, Sueños Blancos
1996|g|lat|Fey|Azúcar Amargo
1996|g|lat|Chayanne|Volver a Nacer
1996|g|lat|Ricardo Arjona|Si el Norte Fuera el Sur
1996|g|lat|Enrique Iglesias|Por Amarte
1996|g|lat|Luis Miguel|Cómo Es Posible Que a Mi Lado
1997|g|lat|Enrique Iglesias|Enamorado por Primera Vez
1997|g|lat|Enrique Iglesias|Sólo en Ti
1997|g|lat|Alejandro Sanz|Corazón Partío
1997|g|lat|Thalía|Amor a la Mexicana
1997|g|lat|Maná|Clavado en un Bar
1997|g|lat|Maná|En el Muelle de San Blas
1997|g|lat|Luis Miguel|Por Debajo de la Mesa
1997|g|lat|Marc Anthony|Y Hubo Alguien
1998|g|lat|Ricky Martin|La Copa de la Vida
1998|g|lat|Ricky Martin|Vuelve
1998|g|lat|Elvis Crespo|Suavemente
1998|g|lat|Shakira|Ciega, Sordomuda
1998|g|lat|Shakira|Ojos Así
1998|g|lat|Shakira|Inevitable
1998|g|lat|Chayanne|Dejaría Todo
1998|g|lat|Chayanne|Atado a Tu Amor
1999|g|lat|Ricky Martin|Livin' la Vida Loca
1999|g|lat|Enrique Iglesias|Bailamos
1999|g|lat|Marc Anthony|I Need to Know
1999|g|lat|Enrique Iglesias|Rhythm Divine
1999|g|lat|Maná|Se Me Olvidó Otra Vez
1999|g|lat|Ricky Martin|She's All I Ever Had
1999|g|lat|Luis Miguel|Amarte Es un Placer
1999|g|lat|Elvis Crespo|Píntame
2000|g|lat|Thalía|Arrasando
2000|g|lat|Christina Aguilera|Genio Atrapado
2000|g|lat|Enrique Iglesias|Be with You
2000|g|lat|Alejandro Sanz|El Alma al Aire
2000|g|lat|Alejandro Sanz|Cuando Nadie Me Ve
2000|g|lat|Paulina Rubio|Y Yo Sigo Aquí
2000|g|lat|Paulina Rubio|Lo Haré por Ti
2000|g|lat|Son by Four|A Puro Dolor
2001|g|lat|Shakira|Whenever, Wherever
2001|g|lat|Shakira|Te Aviso, Te Anuncio (Tango)
2001|g|lat|Shakira|Underneath Your Clothes
2001|g|lat|Cristian Castro|Azul
2001|g|lat|Cristian Castro|Lloran las Rosas
2001|g|lat|Marc Anthony|Celos
2001|g|lat|Enrique Iglesias|Héroe
2001|g|lat|Ricky Martin & Christina Aguilera|Nobody Wants to Be Lonely
2002|g|lat|Las Ketchup|Aserejé
2002|g|lat|Juanes|A Dios le Pido
2002|g|lat|Juanes|Es Por Ti
2002|g|lat|Chayanne|Torero
2002|g|lat|Ricardo Arjona|El Problema
2002|g|lat|Bacilos|Mi Primer Millón
2002|g|lat|Thalía|Tú y Yo
2002|g|lat|Sin Bandera|Entra en Mi Vida
2003|g|lat|Ricky Martin|Tal Vez
2003|g|lat|Ricky Martin|Jaleo
2003|g|lat|Celia Cruz|Ríe y Llora
2003|g|lat|Don Omar|Dale Don Dale
2003|g|lat|Alejandro Sanz|No Es lo Mismo
2003|g|lat|La Oreja de Van Gogh|Puedes Contar Conmigo
2003|g|lat|La Oreja de Van Gogh|Rosas
2003|g|lat|Thalía|Me Pones Sexy
2004|g|lat|Daddy Yankee|Gasolina
2004|g|lat|Daddy Yankee|Lo Que Pasó, Pasó
2004|g|lat|N.O.R.E. feat. Daddy Yankee & Nina Sky|Oye Mi Canto
2004|g|lat|Juanes|Nada Valgo Sin Tu Amor
2004|g|lat|Juanes|Volverte a Ver
2004|g|lat|Alejandro Fernández|Me Dediqué a Perderte
2004|g|lat|Paulina Rubio|Algo Tienes
2004|g|lat|Bebe|Malo
2005|g|lat|Shakira feat. Alejandro Sanz|La Tortura
2005|g|lat|Shakira|No
2005|g|lat|Shakira|Día de Enero
2005|g|lat|Daddy Yankee|Rompe
2005|g|lat|Wisin & Yandel|Rakata
2005|g|lat|Calle 13|Atrévete-te-te
2005|g|lat|Calle 13|Se Vale Tó-Tó
2005|g|lat|Don Omar|Reggaetón Latino
2006|g|lat|Shakira feat. Wyclef Jean|Hips Don't Lie
2006|g|lat|Julieta Venegas|Me Voy
2006|g|lat|Julieta Venegas|Eres para Mí
2006|g|lat|Don Omar|Angelito
2006|g|lat|Wisin & Yandel|Llamé pa' Verte
2006|g|lat|Tito El Bambino|Caile
2006|g|lat|RBD|Ser o Parecer
2006|g|lat|Maná|Labios Compartidos
2007|g|lat|Juanes|Me Enamora
2007|g|lat|Juanes|Gotas de Agua Dulce
2007|g|lat|Wisin & Yandel|Sexy Movimiento
2007|g|lat|Wisin & Yandel|Yo Te Quiero
2007|g|lat|Daddy Yankee|Impacto
2007|g|lat|Daddy Yankee|Ella Me Levantó
2007|g|lat|Juan Luis Guerra|La Llave de Mi Corazón
2007|g|lat|Enrique Iglesias|Dímelo
2008|g|lat|Enrique Iglesias|¿Dónde Están Corazón?
2008|g|lat|Enrique Iglesias|Lloro por Ti
2008|g|lat|Wisin & Yandel|Me Estás Tentando
2008|g|lat|Jesse & Joy|Espacio Sideral
2008|g|lat|Maná|Si No Te Hubieras Ido
2008|g|lat|Daddy Yankee|Pose
2008|g|lat|Daddy Yankee|Llamado de Emergencia
2008|g|lat|Luis Fonsi|No Me Doy por Vencido
2009|g|lat|Shakira|Loba
2009|g|lat|Shakira|Gitana
2009|g|lat|Wisin & Yandel|Abusadora
2009|g|lat|Aventura|Por un Segundo
2009|g|lat|Aventura|El Perdedor
2009|g|lat|Don Omar|Virtual Diva
2009|g|lat|Alejandro Sanz feat. Alicia Keys|Looking for Paradise
2009|g|lat|Paulina Rubio|Ni Rosas Ni Juguetes
2010|g|lat|Shakira|Waka Waka (This Time for Africa)
2010|g|lat|Don Omar & Lucenzo|Danza Kuduro
2010|g|lat|Enrique Iglesias|Cuando Me Enamoro
2010|g|lat|Juanes|Yerbatero
2010|g|lat|Prince Royce|Stand by Me
2010|g|lat|Prince Royce|Corazón Sin Cara
2010|g|lat|Shakira feat. El Cata|Loca
2010|g|lat|Chino & Nacho|Mi Niña Bonita
2011|g|lat|Don Omar|Taboo
2011|g|lat|Romeo Santos|You
2011|g|lat|Romeo Santos feat. Usher|Promise
2011|g|lat|Maná|Lluvia al Corazón
2011|g|lat|Maná|El Verdadero Amor Perdona
2011|g|lat|Jesse & Joy|¡Corre!
2011|g|lat|Calle 13|Latinoamérica
2011|g|lat|Ricky Martin|Más
2012|g|lat|Prince Royce|Las Cosas Pequeñas
2012|g|lat|Prince Royce|Incondicional
2012|g|lat|Daddy Yankee|Limbo
2012|g|lat|Daddy Yankee|Lovumba
2012|g|lat|Wisin & Yandel|Algo Me Gusta de Ti
2012|g|lat|Don Omar|Hasta Que Salga el Sol
2012|g|lat|Carlos Vives|Volví a Nacer
2012|g|lat|Juanes|La Señal
2013|g|lat|Marc Anthony|Vivir Mi Vida
2013|g|lat|Marc Anthony|Cambio de Piel
2013|g|lat|Romeo Santos|Propuesta Indecente
2013|g|lat|Wisin|Que Viva la Vida
2013|g|lat|Enrique Iglesias|Loco
2013|g|lat|Carlos Vives|Bailar Contigo
2013|g|lat|Carlos Vives|Como Le Gusta a Tu Cuerpo
2013|g|lat|Prince Royce|Darte un Beso
2014|g|lat|Enrique Iglesias|Bailando
2014|g|lat|J Balvin|Ay Vamos
2014|g|lat|J Balvin feat. Farruko|6 AM
2014|g|lat|Nicky Jam|Travesuras
2014|g|lat|Romeo Santos|Eres Mía
2014|g|lat|Romeo Santos feat. Drake|Odio
2014|g|lat|Enrique Iglesias feat. Marco Antonio Solís|El Perdedor
2014|g|lat|Shakira|Nunca Me Acuerdo de Olvidarte
2015|g|lat|Nicky Jam & Enrique Iglesias|El Perdón
2015|g|lat|Gente de Zona feat. Marc Anthony|La Gozadera
2015|g|lat|J Balvin|Ginza
2015|g|lat|Ricky Martin|La Mordidita
2015|g|lat|Maluma|Borró Cassette
2015|g|lat|Daddy Yankee|Sígueme y Te Sigo
2015|g|lat|Alejandro Sanz|Un Zombie a la Intemperie
2015|g|lat|Farruko|Chillax
2016|g|lat|Carlos Vives & Shakira|La Bicicleta
2016|g|lat|Nicky Jam|Hasta el Amanecer
2016|g|lat|Enrique Iglesias feat. Wisin|Duele el Corazón
2016|g|lat|J Balvin|Bobo
2016|g|lat|Daddy Yankee|Shaky Shaky
2016|g|lat|CNCO|Reggaetón Lento (Bailemos)
2016|g|lat|Shakira feat. Maluma|Chantaje
2016|g|lat|Maluma|Cuatro Babys
2017|g|lat|Luis Fonsi feat. Daddy Yankee|Despacito
2017|g|lat|J Balvin & Willy William|Mi Gente
2017|g|lat|Maluma|Felices los 4
2017|g|lat|Shakira|Me Enamoré
2017|g|lat|Nicky Jam|El Amante
2017|g|lat|Becky G feat. Bad Bunny|Mayores
2017|g|lat|Natti Natasha & Ozuna|Criminal
2017|g|lat|Shakira feat. Nicky Jam|Perro Fiel
2018|g|lat|Cardi B, Bad Bunny & J Balvin|I Like It
2018|g|lat|DJ Snake, Selena Gomez, Ozuna & Cardi B|Taki Taki
2018|g|lat|Daddy Yankee|Dura
2018|g|lat|Nicky Jam & J Balvin|X (Equis)
2018|g|lat|Bad Bunny feat. Drake|Mía
2018|g|lat|Becky G & Natti Natasha|Sin Pijama
2018|g|lat|Shakira & Maluma|Clandestino
2018|g|lat|Rosalía|Malamente
2019|g|lat|Rosalía & J Balvin|Con Altura
2019|g|lat|Daddy Yankee feat. Snow|Con Calma
2019|g|lat|Karol G & Nicki Minaj|Tusa
2019|g|lat|Sech feat. Darell|Otro Trago
2019|g|lat|Anuel AA, Daddy Yankee & Karol G feat. J Balvin & Ozuna|China
2019|g|lat|Bad Bunny & Tainy|Callaita
2019|g|lat|J Balvin & Bad Bunny|Qué Pretendes
2019|g|lat|Ozuna|Baila Baila Baila
2020|g|lat|Bad Bunny & Jhay Cortez|Dákiti
2020|g|lat|Bad Bunny|Safaera
2020|g|lat|Bad Bunny|Yo Perreo Sola
2020|g|lat|Rauw Alejandro|Tattoo
2020|g|lat|Maluma|Hawái
2020|g|lat|Karol G|Bichota
2020|g|lat|Karol G|Ay, Dios Mío!
2020|g|lat|Myke Towers & Juhn|Bandido
2021|g|lat|Rauw Alejandro|Todo de Ti
2021|g|lat|Farruko|Pepas
2021|g|lat|Bad Bunny|Yonaguni
2021|g|lat|Aventura & Bad Bunny|Volví
2021|g|lat|Karol G|El Makinon
2021|g|lat|Rauw Alejandro & Chencho Corleone|Desesperados
2021|g|lat|Sebastián Yatra & Myke Towers|Pareja del Año
2021|g|lat|Tainy, Bad Bunny & Julieta Venegas|Lo Siento BB:/
2022|g|lat|Bad Bunny|Tití Me Preguntó
2022|g|lat|Bad Bunny & Chencho Corleone|Me Porto Bonito
2022|g|lat|Bad Bunny|Moscow Mule
2022|g|lat|Bad Bunny & Bomba Estéreo|Ojitos Lindos
2022|g|lat|Becky G & Karol G|MAMIII
2022|g|lat|Rosalía|DESPECHÁ
2022|g|lat|Karol G|Provenza
2022|g|lat|Bizarrap & Quevedo|Quevedo: Bzrp Music Sessions, Vol. 52
2023|g|lat|Karol G & Shakira|TQG
2023|g|lat|Bizarrap & Shakira|Shakira: Bzrp Music Sessions, Vol. 53
2023|g|lat|Grupo Frontera & Bad Bunny|un x100to
2023|g|lat|Eslabon Armado & Peso Pluma|Ella Baila Sola
2023|g|lat|Bad Bunny|WHERE SHE GOES
2023|g|lat|Bad Bunny|MONACO
2023|g|lat|Karol G|Mi Ex Tenía Razón
2023|g|lat|Shakira & Manuel Turizo|Copa Vacía
2024|g|lat|Karol G|Si Antes Te Hubiera Conocido
2024|g|lat|Shakira|Soltera
2024|g|lat|Shakira & Cardi B|Puntería
2024|g|lat|Shakira & Grupo Frontera|(Entre Paréntesis)
2024|g|lat|Feid & ATL Jacob|LUNA
2024|g|lat|Kapo|Ohnana
2024|g|lat|Rauw Alejandro|Touching the Sky
2024|g|lat|Rauw Alejandro & Bad Bunny|Qué Pasaría...
2025|g|lat|Bad Bunny|DtMF
2025|g|lat|Bad Bunny|BAILE INoLVIDABLE
2025|g|lat|Bad Bunny|NUEVAYoL
2025|g|lat|Bad Bunny|VOY A LLeVARTE PA PR
2025|g|lat|Bad Bunny|EoO
2025|g|lat|Bad Bunny|LA MuDANZA
2025|g|lat|Karol G|Latina Foreva
2025|g|lat|Karol G|Ivonny Bonita
`;

  const GENRES = {
    sert: 'Sertanejo', funk: 'Funk', pag: 'Pagode & Samba', mpb: 'MPB',
    rocknac: 'Rock Nacional', rapnac: 'Rap Nacional', popbr: 'Pop BR',
    pop: 'Pop', rock: 'Rock', hip: 'Hip-Hop & R&B', ele: 'Eletrônica', lat: 'Latino'
  };

  // type: 'br' = só Brasil, 'gr' = só gringa, 'mix' = Brasil x gringa
  // mix: as rodadas mostram até 4 músicas de cada lado
  const CATEGORIES = [
    { key: 'br-todos', type: 'br', name: 'Todo o Brasil', genres: ['sert', 'funk', 'pag', 'mpb', 'rocknac', 'rapnac', 'popbr'] },
    { key: 'sertanejo', type: 'br', name: 'Sertanejo', genres: ['sert'] },
    // Rap Nacional não tem 8 músicas em todo ano, então joga junto com o Funk
    { key: 'rap-funk', type: 'br', name: 'Rap & Funk', genres: ['rapnac', 'funk'] },
    { key: 'pagode', type: 'br', name: 'Pagode & Samba', genres: ['pag'] },
    // MPB e Pop BR se completam: juntas têm 8 músicas em todo ano de 1969 a 2023
    { key: 'mpb-pop', type: 'br', name: 'MPB & Pop BR', genres: ['mpb', 'popbr'] },
    { key: 'rock-nacional', type: 'br', name: 'Rock Nacional', genres: ['rocknac'] },
    { key: 'gr-todos', type: 'gr', name: 'Toda a gringa', genres: ['pop', 'rock', 'hip', 'ele', 'lat'] },
    { key: 'pop', type: 'gr', name: 'Pop', genres: ['pop'] },
    { key: 'rock', type: 'gr', name: 'Rock', genres: ['rock'] },
    { key: 'hiphop', type: 'gr', name: 'Hip-Hop & R&B', genres: ['hip'] },
    { key: 'eletronica', type: 'gr', name: 'Eletrônica', genres: ['ele'] },
    { key: 'latino', type: 'gr', name: 'Latino', genres: ['lat'] },
    { key: 'br-x-gringa', type: 'mix', name: 'Brasil x Gringa', genres: null },
    { key: 'pop-x-pop', type: 'mix', name: 'Pop BR x Pop gringo', genres: ['popbr', 'pop'] },
    { key: 'rock-x-rock', type: 'mix', name: 'Rock BR x Rock gringo', genres: ['rocknac', 'rock'] },
    { key: 'rap-x-rap', type: 'mix', name: 'Rap BR x Rap gringo', genres: ['rapnac', 'hip'] }
  ];

  const MAX_OPTIONS = 8;

  function slug(s) {
    return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
  }

  // Hash estável (FNV-1a) para que todo mundo veja as mesmas opções em cada rodada.
  function hash(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
    return h >>> 0;
  }

  const SONGS = [];
  const SONG_BY_ID = {};
  SONGS_RAW.split('\n').forEach((line) => {
    const t = line.trim();
    if (!t) return;
    const [y, o, g, artist, title] = t.split('|');
    if (!GENRES[g]) throw new Error('Gênero desconhecido na linha: ' + t);
    const song = { id: slug(artist + '-' + title), year: Number(y), origin: o === 'b' ? 'br' : 'gr', genre: g, artist, title };
    if (SONG_BY_ID[song.id]) throw new Error('Música repetida: ' + t);
    SONGS.push(song);
    SONG_BY_ID[song.id] = song;
  });

  function byHash(roundId) {
    return (a, b) => hash(roundId + a.id) - hash(roundId + b.id);
  }

  // Escolhe até `n` músicas revezando entre os gêneros, para nenhum dominar a rodada.
  function spread(list, n, roundId) {
    const sorted = list.slice().sort(byHash(roundId));
    const queues = {};
    sorted.forEach((s) => (queues[s.genre] = queues[s.genre] || []).push(s));
    const order = Object.keys(queues).sort((a, b) => hash(roundId + a) - hash(roundId + b));
    const picked = [];
    while (picked.length < n && order.some((g) => queues[g].length)) {
      for (const g of order) if (picked.length < n && queues[g].length) picked.push(queues[g].shift());
    }
    return picked.sort(byHash(roundId + 'order'));
  }

  function optionsFor(cat, year) {
    const roundId = cat.key + ':' + year;
    const inYear = SONGS.filter((s) => s.year === year && (!cat.genres || cat.genres.includes(s.genre)));
    let opts;
    if (cat.type === 'mix') {
      const br = spread(inYear.filter((s) => s.origin === 'br'), MAX_OPTIONS / 2, roundId);
      const gr = spread(inYear.filter((s) => s.origin === 'gr'), MAX_OPTIONS / 2, roundId);
      if (!br.length || !gr.length) return [];
      opts = br.concat(gr).sort(byHash(roundId + 'order'));
    } else {
      opts = spread(inYear.filter((s) => s.origin === cat.type), MAX_OPTIONS, roundId);
    }
    return opts.length >= 2 ? opts : [];
  }

  function roundsFor(catKey) {
    const cat = CATEGORIES.find((c) => c.key === catKey);
    if (!cat) return [];
    const years = [...new Set(SONGS.map((s) => s.year))].sort((a, b) => a - b);
    return years
      .map((year) => ({ id: cat.key + ':' + year, cat: cat.key, year, options: optionsFor(cat, year) }))
      .filter((r) => r.options.length);
  }

  const ROUNDS = {};
  CATEGORIES.forEach((c) => roundsFor(c.key).forEach((r) => { ROUNDS[r.id] = r; }));

  const api = { SONGS, SONG_BY_ID, GENRES, CATEGORIES, ROUNDS, roundsFor };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Game = api;
})(typeof window !== 'undefined' ? window : globalThis);
