import 'dotenv/config';
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export const booksData = [
  {
    title: 'Under the Greenwood Tree',
    page_count: 206,
    author: 'Thomas Hardy',
    category: 'unknown',
    publishing_date: new Date('2016-01-01'),
    summary:
      "Under the Greenwood Tree is the story of the romantic entanglement between church musician, Dick Dewey, and the attractive new school mistress, Fancy Day. A pleasant romantic tale set in the Victorian era, Under the Greenwood Tree is one of Thomas Hardy's most gentle and pastoral novels.",
    publisher: 'CreateSpace Independent Publishing Platform',
    isbn: '9781537150253',
    cover: 'https://covers.openlibrary.org/b/id/902186-M.jpg',
    averageRating: 0,
  },
  {
    title: 'Ramáyana Book Two',
    page_count: 512,
    author: 'Vālmīki, Robert P. Goldman, Rosalind Lefeber, Sheldon I. Pollock',
    category: 'unknown',
    publishing_date: new Date('2005-01-01'),
    summary:
      'राहुल मौर्य " पब्लिकेशन अथॉरिटी भारतीय प्रोड्यूसर द्वारा संचालित भारत ,सरकार यूपी"',
    publisher: 'NYU Press',
    isbn: '9780814767160',
    cover: 'https://covers.openlibrary.org/b/id/612366-M.jpg',
    averageRating: 0,
  },
  {
    title: 'Il gioco del mondo',
    page_count: 523,
    author: 'Julio Cortázar',
    category: 'unknown',
    publishing_date: new Date('1969-01-01'),
    summary:
      'Rayuela es la segunda novela del escritor argentino Julio Cortázar. Escrita en París y publicada por primera vez el 28 de junio de 1963, constituye una de las obras centrales del boom latinoamericano y de la literatura en español. Narra la historia de Horacio Oliveira, su protagonista, y su relación con «la Maga». La historia pone en juego la subjetividad del lector y tiene múltiples finales. A esta obra suele llamársela «antinovela», aunque el mismo Cortázar prefería denominarla «contranovela». Con un total de 155 capítulos, Rayuela puede leerse de varias maneras.',
    publisher: 'Einaudi',
    isbn: '9781548833152',
    cover: 'https://covers.openlibrary.org/b/id/15104001-M.jpg',
    averageRating: 0,
  },
  {
    title: 'The golden bough',
    page_count: 751,
    author: 'James George Frazer, Theodor Herzl Gaster, George W. Stocking',
    category: 'unknown',
    publishing_date: new Date('1937-01-01'),
    summary:
      'Wikipedia - "The Golden Bough: A Study in Comparative Religion (retitled The Golden Bough: A Study in Magic and Religion in its second edition) is a wide-ranging, comparative study of mythology and religion, written by the Scottish anthropologist Sir James George Frazer. The Golden Bough was first published in two volumes in 1890; in three volumes in 1900; and in twelve volumes in the third edition, published 1906–1915. It has also been published in several different one-volume abridgments. The work was for a wide literate audience raised on tales as told in such publications as Thomas Bulfinch\'s The Age of Fable, or Stories of Gods and Heroes (1855). The influence of The Golden Bough on contemporary European literature and thought has been substantial."',
    publisher: 'The Macmillan company',
    isbn: '0141194014',
    cover: 'https://covers.openlibrary.org/b/id/8876695-M.jpg',
    averageRating: 0,
  },
  {
    title: 'Сказки',
    page_count: 0,
    author: 'Hans Christian Andersen',
    category: 'unknown',
    publishing_date: new Date('1981-01-01'),
    summary:
      "Many of these stories for children are famous the world over. 'The Emperor's New Clothes', 'The Little Mermaid', 'The Ice Maiden', 'The Red Shoes', 'The Snow Queen', 'Thumbelina', 'The Steadfast Tin Soldier' and 'The Ugly Duckling' are as popular now as they ever were.",
    publisher: 'Художественная литература',
    isbn: '898567546X',
    cover: 'https://covers.openlibrary.org/b/id/14365209-M.jpg',
    averageRating: 0,
  },
  {
    title: 'A Farewell to Arms',
    page_count: 332,
    author: 'Ernest Hemingway',
    category: 'unknown',
    publishing_date: new Date('1957-01-01'),
    summary:
      'A Farewell to Arms is about a love affair between the expatriate American Henry and Catherine Barkley against the backdrop of the First World War, cynical soldiers, fighting and the displacement of populations. The publication of A Farewell to Arms cemented Hemingway\'s stature as a modern American writer, became his first best-seller, and is described by biographer Michael Reynolds as "the premier American war novel from that debacle World War I."',
    publisher: 'Scribner',
    isbn: '9584302019',
    cover: 'https://covers.openlibrary.org/b/id/15098500-M.jpg',
    averageRating: 0,
  },
  {
    title: 'O Símbolo Perdido',
    page_count: 766,
    author: 'Dan Brown',
    category: 'unknown',
    publishing_date: new Date('2013-01-01'),
    summary:
      "The Lost Symbol is a 2009 novel written by American writer Dan Brown. It is a thriller set in Washington, D.C., after the events of The Da Vinci Code, and relies on Freemasonry for both its recurring theme and its major characters. Released on September 15, 2009, it is the third Brown novel to involve the character of Harvard University symbologist Robert Langdon, following 2000's Angels & Demons and 2003's The Da Vinci Code.",
    publisher: 'Arqueiro',
    isbn: '9788580411829',
    cover: 'https://covers.openlibrary.org/b/id/14630162-M.jpg',
    averageRating: 0,
  },
  {
    title: 'Manifesto Comunista',
    page_count: 254,
    author: 'Karl Marx, Friedrich Engels',
    category: 'unknown',
    publishing_date: new Date('1998-01-01'),
    summary:
      '"The Communist Manifesto," penned by Karl Marx and Friedrich Engels, is a revolutionary treatise advocating for the overthrow of capitalist systems and the establishment of a classless society. Published in 1848, its succinct yet powerful prose remains a cornerstone of socialist ideology, inspiring movements worldwide.',
    publisher: 'Boitempo Editorial',
    isbn: '9788585934231',
    cover: 'https://covers.openlibrary.org/b/id/15105136-M.jpg',
    averageRating: 0,
  },
  {
    title: 'Umiłowana',
    page_count: 360,
    author: 'Toni Morrison',
    category: 'unknown',
    publishing_date: new Date('2014-01-01'),
    summary:
      'Toni Morrison--author of Song of Solomon and Tar Baby--is a writer of remarkable powers: her novels, brilliantly acclaimed for their passion, their dazzling language and their lyric and emotional force, combine the unassailable truths of experience and emotion with the vision of legend and imagination. It is the story--set in post-Civil War Ohio--of Sethe, an escaped slave who has risked death in order to wrench herself from a living death; who has lost a husband and buried a child; who has borne the unthinkable and not gone mad: a woman of "iron eyes and backbone to match." Sethe lives in a small house on the edge of town with her daughter, Denver, her mother-in-law, Baby Suggs, and a disturbing, mesmerizing intruder who calls herself Beloved.',
    publisher: 'Swiat Ksiazki',
    isbn: '9788379433469',
    cover: 'https://covers.openlibrary.org/b/id/13947146-M.jpg',
    averageRating: 0,
  },
  {
    title: 'The Great Gatsby / Der große Gatsby',
    page_count: 431,
    author: 'F. Scott Fitzgerald',
    category: 'unknown',
    publishing_date: new Date('2020-01-01'),
    summary:
      'Here is a novel, glamorous, ironical, compassionate – a marvelous fusion into unity of the curious incongruities of the life of the period – which reveals a hero like no other – one who could live at no other time and in no other place. But he will live as a character, we surmise, as long as the memory of any reader lasts.',
    publisher: 'Anaconda',
    isbn: '9783730600009',
    cover: 'https://covers.openlibrary.org/b/id/14369845-M.jpg',
    averageRating: 0,
  },
  {
    title: 'Fiesta',
    page_count: 180,
    author: 'Ernest Hemingway',
    category: 'unknown',
    publishing_date: new Date('1968-01-01'),
    summary:
      "Hemingway's profile of the Lost Generation captures life among the expatriates on Paris' Left Bank during the 1920s, the brutality of bullfighting in Spain, and the moral and spiritual dissolution of a generation.",
    publisher: 'Rowohlt',
    isbn: '9798621394370',
    cover: 'https://covers.openlibrary.org/b/id/14613315-M.jpg',
    averageRating: 0,
  },
  {
    title: 'Club of Queer Trades',
    page_count: 0,
    author: 'Gilbert Keith Chesterton',
    category: 'unknown',
    publishing_date: new Date('2018-01-01'),
    summary: 'The Tremendous Adventures of Major Brown.',
    publisher: 'Independently Published',
    isbn: '9781791912710',
    cover: 'https://covers.openlibrary.org/b/id/8242288-M.jpg',
    averageRating: 0,
  },
  {
    title: 'Bridge To Terabithia',
    page_count: 0,
    author: 'Katherine Paterson',
    category: 'unknown',
    publishing_date: new Date('2003-01-01'),
    summary:
      'The life of a ten-year-old boy in rural Virginia expands when he becomes friends with a newcomer who subsequently meets an untimely death trying to reach their hideaway, Terabithia, during a storm.',
    publisher: 'Harper Trophy',
    isbn: '9780329019860',
    cover: 'https://covers.openlibrary.org/b/id/13887085-M.jpg',
    averageRating: 0,
  },
  {
    title: "G'aims Bond be-Ḳasino Royal",
    page_count: 167,
    author: 'Ian Fleming',
    category: 'unknown',
    publishing_date: new Date('2026-01-05'),
    summary:
      'Introducing James Bond: charming, sophisticated, handsome, chillingly ruthless and licensed to kill. This, the first of Ian Fleming\'s tales of secret agent 007, finds Bond on a mission to neutralize a lethal, high-rolling Russian operative called simply "le Chiffre" -- by ruining him at the Baccarat table and forcing his Soviet spymasters to "retire" him. It seems that lady luck is taken with 007 -- le Chiffre has hit a losing streak. But some people just refuse to play by the rules, and Bond\'s attraction to a beautiful female agent leads him to disaster and an unexpected savior...',
    publisher: 'M. Mizraḥi',
    isbn: '9798548926715',
    cover: 'https://covers.openlibrary.org/b/id/5540820-M.jpg',
    averageRating: 0,
  },
  {
    title: 'Incidents in the life of a slave girl',
    page_count: 306,
    author: 'Harriet A. Jacobs',
    category: 'unknown',
    publishing_date: new Date('1861-01-01'),
    summary:
      "The true story of an individual's struggle for self-identity, self-preservation, and freedom, Incidents in the Life of a Slave Girl remains among the few extant slave narratives written by a woman. This autobiographical account chronicles the remarkable odyssey of Harriet Jacobs (1813–1897) whose dauntless spirit and faith carried her from a life of servitude and degradation in North Carolina to liberty and reunion with her children in the North.",
    publisher: 'Pub. for the Author',
    isbn: '9781530860203',
    cover: 'https://covers.openlibrary.org/b/id/411542-M.jpg',
    averageRating: 0,
  },
  {
    title: 'The old man and the sea',
    page_count: 125,
    author: 'Ernest Hemingway',
    category: 'unknown',
    publishing_date: new Date('1985-01-01'),
    summary:
      "Set in the Gulf Stream off the coast of Havana, Hemingway's magnificent fable is the tale of an old man, a young boy and a giant fish. This story of heroic endeavour won Hemingway the Nobel Prize for Literature. It stands as a unique and timeless vision of the beauty and grief of man's challenge to the elements.",
    publisher: 'Franklin Library',
    isbn: '7532740099',
    cover: 'https://covers.openlibrary.org/b/id/463307-M.jpg',
    averageRating: 0,
  },
  {
    title: 'The family shakespeare, in one volume',
    page_count: 910,
    author: 'William Shakespeare',
    category: 'unknown',
    publishing_date: new Date('1847-01-01'),
    summary:
      "aka The First Folio. Contains 36 plays: All's Well That Ends Well, Antony and Cleopatra, As You Like It, Comedy of Errors, Coriolanus, Cymbeline, Hamlet, Julius Caesar, King Henry IV. Part 1, King Henry IV. Part 2, King Henry V, King Henry VI. Part 1, King Henry VI. Part 2, King Henry VI. Part 3, King Henry VIII, King John, King Lear, King Richard II, King Richard III, Love's Labour's Lost, Macbeth, Measure for Measure, Merchant of Venice, Merry Wives of Windsor, Midsummer Night's Dream, Much Ado About Nothing, Othello, Romeo and Juliet, Taming of the Shrew, Tempest, Timon of Athens, Titus Andronicus, Troilus and Cressida, Twelfth Night, Two Gentlemen of Verona, Winter's Tale.",
    publisher: 'Longman, Brown, Green & Longmans',
    isbn: '9784841902525',
    cover: 'https://covers.openlibrary.org/b/id/7113485-M.jpg',
    averageRating: 0,
  },
  {
    title: 'Historias de dragones',
    page_count: 224,
    author: 'Edith Nesbit',
    category: 'unknown',
    publishing_date: new Date('2009-01-01'),
    summary:
      'Eight madcap tales of unpredictable dragons — including one made of ice, another that takes refuge in the General Post Office, and a fire-breathing monster that flies out of an enchanted book and eats an entire soccer team! Marvelous adventure and excitement for make-believers of all ages.',
    publisher: 'ANAYA INFANTIL Y JUVENIL',
    isbn: '9788466784825',
    cover: 'https://covers.openlibrary.org/b/id/13574833-M.jpg',
    averageRating: 0,
  },
  {
    title: 'O último adeus de Sherlock Holmes',
    page_count: 256,
    author: 'Arthur Conan Doyle',
    category: 'unknown',
    publishing_date: new Date('2016-01-01'),
    summary:
      "The adventure of Wisteria lodge.--The adventure of the cardboard box.--The adventure of the red circle.--The adventure of the Bruce-Partington plans.--The adventure of the dying detective.--The disappearance of Lady Frances Carfax.--The adventure of the devil's foot.--His last bow.",
    publisher: 'Zahar',
    isbn: '9788537815762',
    cover: 'https://covers.openlibrary.org/b/id/15131507-M.jpg',
    averageRating: 0,
  },
  {
    title: 'Percy Jackson 01. Diebe im Olymp. Filmausgabe',
    page_count: 0,
    author: 'Rick Riordan',
    category: 'unknown',
    publishing_date: new Date('2010-01-01'),
    summary:
      "Twelve-year-old Percy Jackson is on the most dangerous quest of his life. With the help of a satyr and a daughter of Athena, Percy must journey across the United States to catch a thief who has stolen the original weapon of mass destruction—Zeus' master bolt. Along the way, he must face a host of mythological enemies determined to stop him. Most of all, he must come to terms with a father he has never known, and an Oracle that has warned him of betrayal by a friend.",
    publisher: 'Carlsen Verlag Gmbh',
    isbn: '9783551359605',
    cover: 'https://covers.openlibrary.org/b/id/7239831-M.jpg',
    averageRating: 0,
  },
  {
    title: 'Fantastes',
    page_count: 256,
    author: 'George MacDonald',
    category: 'unknown',
    publishing_date: new Date('2019-01-01'),
    summary:
      "One of George MacDonald's most important works, Phantastes is the story of a young man named Anotos and his long dreamlike journey in Fairy Land. It is the fairy tale of deep spiritual insight as Anotos makes his way through moments of uncertainty and peril and mistakes that can have irreversible consequences. This is also his spiritual quest that is destined to end with the supreme surrender of the self.",
    publisher: 'İthaki Yayınları',
    isbn: '9786057762092',
    cover: 'https://covers.openlibrary.org/b/id/12263827-M.jpg',
    averageRating: 0,
  },
  {
    title: 'Man Who Knew Too Much Gilbert Keith Chesterton',
    page_count: 128,
    author: 'Gilbert Keith Chesterton',
    category: 'unknown',
    publishing_date: new Date('2016-01-01'),
    summary:
      'Series of stories featuring world-weary government employee Horne Fisher and crusading journalist Harold March. Mysteries that are reflections on moral ambiguity in politics in the British Empire on the eve of World War I',
    publisher: 'CreateSpace Independent Publishing Platform',
    isbn: '9781541161740',
    cover: 'https://covers.openlibrary.org/b/id/12897858-M.jpg',
    averageRating: 0,
  },
  {
    title: 'Martin Eden',
    page_count: 422,
    author: 'Jack London',
    category: 'unknown',
    publishing_date: new Date('1956-01-01'),
    summary:
      "Jack London's Martin Eden was first published in 1909 and is the story of a young writer's quest for celebrity and love. Much loved by writers who identify with Martin's belief that when he posted a manuscript, 'there was no human editor at the other end, but a mere cunning arrangement of cogs that changed the manuscript from one envelope to another and stuck on the stamps,' that automatically returned it slapped with a rejection slip.",
    publisher: 'Reeneharl & Eo.',
    isbn: '9780140390360',
    cover: 'https://covers.openlibrary.org/b/id/9223765-M.jpg',
    averageRating: 0,
  },
  {
    title: 'Une Aventure De Tom Sawyer Détective (folio junior, #524)',
    page_count: 0,
    author: 'Mark Twain',
    category: 'unknown',
    publishing_date: new Date('1989-01-01'),
    summary:
      "Tom Sawyer, Detective follows Twain's popular novels The Adventures of Tom Sawyer, Adventures of Huckleberry Finn, and Tom Sawyer Abroad. In this novel, Tom turns detective, trying to solve a murder. Twain plays with and celebrates the detective novel, wildly popular at the time. This novel, like the others, is told through the first-person narrative of Huck Finn.",
    publisher: 'Mercure de France, Paris',
    isbn: '9782070335244',
    cover: 'https://covers.openlibrary.org/b/id/8923621-M.jpg',
    averageRating: 0,
  },
  {
    title: "Poems (Everyman's Library Classics)",
    page_count: 912,
    author: 'William Butler Yeats',
    category: 'unknown',
    publishing_date: new Date('1992-01-01'),
    summary:
      'A collection of the poetry of W. B. Yeats, famed Irish poet whose early poems are strongly influenced by the Pre-Raphaelites, and his later poems having more modernist leanings, although retaining the traditional forms rather than adopting free verse.',
    publisher: "Everyman's Library",
    isbn: '9781857151039',
    cover: 'https://covers.openlibrary.org/b/id/6968826-M.jpg',
    averageRating: 0,
  },
  {
    title: 'The Secret Agent A Simple Tale',
    page_count: 456,
    author: 'Joseph Conrad',
    category: 'unknown',
    publishing_date: new Date('1907-01-01'),
    summary:
      "The Secret Agent: A Simple Tale is a novel by Joseph Conrad, first published in 1907. The story is set in London in 1886 and deals with Mr. Adolf Verloc and his work as a spy for an unnamed country (presumably Russia). The Secret Agent is one of Conrad's later political novels in which he moved away from his former tales of seafaring. The novel is dedicated to H. G. Wells and deals broadly with anarchism, espionage, and terrorism.",
    publisher: 'Methuen And Company, Limited',
    isbn: '9798708222466',
    cover: 'https://covers.openlibrary.org/b/id/8239401-M.jpg',
    averageRating: 0,
  },
  {
    title: 'Picasso',
    page_count: 271,
    author: 'Pablo Picasso, Jean-Louis Andral, Pierre Daix',
    category: 'unknown',
    publishing_date: new Date('1965-01-01'),
    summary:
      "In 1946, when Picasso received the offer to use one of the great rooms in the castle at Antibes as a studio, he exclaimed enthusiastically: \"I'm not only going to paint, I'll decorate the museum too.\" The result was a series of paintings and drawings that reflected the jubilant spirit, the joie de vivre, of a country that was free once more. Picasso later added sculptures, graphic works, and ceramics to this collection, forming the basis for what would be France's first museum dedicated to him, inaugurated in 1966 as Musée Picasso, Antibes.",
    publisher: 'Thames and Hudson',
    isbn: '9789802720255',
    cover: 'https://covers.openlibrary.org/b/id/2238306-M.jpg',
    averageRating: 0,
  },
  {
    title: 'The Silmarillion',
    page_count: 0,
    author: 'J.R.R. Tolkien',
    category: 'unknown',
    publishing_date: new Date('1977-01-01'),
    summary:
      "A number-one New York Times bestseller when it was originally published, The Silmarillion is the core of J.R.R. Tolkien's imaginative writing, a work whose origins stretch back to a time long before The Hobbit.",
    publisher: 'tolkien',
    isbn: '9786070791390',
    cover: 'https://covers.openlibrary.org/b/id/14627042-M.jpg',
    averageRating: 0,
  },
  {
    title: 'A Morte de Ivan Ilitch',
    page_count: 0,
    author:
      'Лев Толстой, Anthony Briggs, Anthony Horvath, Constance Black Garnett, Zinc Read',
    category: 'unknown',
    publishing_date: new Date('1997-01-01'),
    summary:
      'This satirical novella tells the story of the life and early death of a high court judge. Ivan Ilych is proud of his achievements and his status in society, despite his poor relations with his wife which renders his home life bleak and joyless. When he becomes hopelessly ill he begins to realize that he has not after all lived the good life he had supposed he was enjoying.',
    publisher: 'L&PM',
    isbn: '2080706047',
    cover: 'https://covers.openlibrary.org/b/id/14859315-M.jpg',
    averageRating: 0,
  },
  {
    title: 'Die Wellen',
    page_count: 237,
    author: 'Virginia Woolf',
    category: 'unknown',
    publishing_date: new Date('2015-01-01'),
    summary:
      'Tracing the lives of a group of friends, this novel follows their development from childhood to middle age. Social events, individual achievements and disappointments form the outer structure of the book, but the focus is the inner life of the characters which is conveyed in rich poetic language.',
    publisher: 'S. Fischer',
    isbn: '9783100925541',
    cover: 'https://covers.openlibrary.org/b/id/14822143-M.jpg',
    averageRating: 0,
  },
  {
    title: 'Jude the Obscure',
    page_count: 0,
    author: 'Thomas Hardy',
    category: 'unknown',
    publishing_date: new Date('2019-01-01'),
    summary:
      "Hardy's last work of fiction, Jude the Obscure is also one of his most gloomily fatalistic, depicting the lives of individuals who are trapped by forces beyond their control. Jude Fawley, a poor villager, wants to enter the divinity school at Christminster.",
    publisher: 'Independently Published',
    isbn: '9781795416092',
    cover: 'https://covers.openlibrary.org/b/id/12973053-M.jpg',
    averageRating: 0,
  },
  {
    title:
      'Ozma of OzA Record of Her Adventures with Dorothy Gale of Kansas, the Yellow Hen, the Scarecrow, the Tin Woodman, Tiktok, the Cowardly Lion, and the Hungry Tiger; Besides Other Good People Too Numero',
    page_count: 120,
    author: 'L. Frank Baum',
    category: 'unknown',
    publishing_date: new Date('2018-01-01'),
    summary:
      'When a storm blows Dorothy to the land of Ev where lunches grow on trees, she meets the Scarecrow, the Tin Woodman, the Cowardly Lion, and Princess Ozma, and together they set out to free the Queen of Ev and her ten children.',
    publisher: 'Publishers of the Valley',
    isbn: '9781985385986',
    cover: 'https://covers.openlibrary.org/b/id/12648657-M.jpg',
    averageRating: 0,
  },
  {
    title: 'Cinquenta Tons de Cinza',
    page_count: 0,
    author: 'E. L. James',
    category: 'unknown',
    publishing_date: new Date('2012-01-01'),
    summary:
      'When literature student Anastasia Steele goes to interview young entrepreneur Christian Grey, she encounters a man who is beautiful, brilliant, and intimidating. The unworldly, innocent Ana is startled to realize she wants this man and, despite his enigmatic reserve, finds she is desperate to get close to him.',
    publisher: 'Intrinseca',
    isbn: '9788580572186',
    cover: 'https://covers.openlibrary.org/b/id/12327941-M.jpg',
    averageRating: 0,
  },
  {
    title: 'rich dad poor dad',
    page_count: 0,
    author: 'Robert T. Kiyosaki, Sharon L. Lechter',
    category: 'unknown',
    publishing_date: new Date('2000-01-01'),
    summary:
      'April of 2022 marks a 25-year milestone for the personal finance classic Rich Dad Poor Dad that still ranks as the #1 Personal Finance book of all time. And although 25 years have passed since Rich Dad Poor Dad was first published, readers will find that very little in the book itself has changed — and for good reason.',
    publisher: 'Penguin Books',
    isbn: '9783125712935',
    cover: 'https://covers.openlibrary.org/b/id/0-0.jpg',
    averageRating: 0,
  },
  {
    title: 'Lady Susan e outras histórias',
    page_count: 456,
    author: 'Jane Austen',
    category: 'unknown',
    publishing_date: new Date('2020-01-01'),
    summary:
      'Beautiful, flirtatious, and recently widowed, Lady Susan Vernon seeks an advantageous second marriage for herself, while attempting to push her daughter into a dismal match. A magnificently crafted novel of Regency manners and mores that will delight Austen enthusiasts with its wit and elegant expression',
    publisher: 'Martin Claret',
    isbn: '9788544002803',
    cover: 'https://covers.openlibrary.org/b/id/15088415-M.jpg',
    averageRating: 0,
  },
];

async function main() {
  try {
    // Roles
    const adminRole = await prisma.role.upsert({
      where: { name: 'ADMIN' },
      update: {},
      create: {
        name: 'ADMIN',
      },
    });

    const userRole = await prisma.role.upsert({
      where: { name: 'USER' },
      update: {},
      create: {
        name: 'USER',
      },
    });

    console.log('Roles créés');

    // User 1
    const admin = await prisma.user.upsert({
      where: { email: 'truc1@mail.com' },
      update: {},
      create: {
        email: 'truc1@mail.com',
        username: 'Thomas',
        password: 'SuperMotDePasse1!',
        isPrivate: false,
        roleId: adminRole.id,
      },
    });

    console.log('Users créés:', { admin });

    // Books
    for (const bookData of booksData) {
      await prisma.book.upsert({
        where: { isbn: bookData.isbn },
        update: {},
        create: bookData,
      });
    }

    console.log(`${booksData.length} books créés`);
    console.log('Seed terminé avec succès!');
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Erreur pendant le seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
