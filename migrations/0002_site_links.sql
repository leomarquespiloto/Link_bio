CREATE TABLE IF NOT EXISTS site_links (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  href TEXT NOT NULL DEFAULT '#',
  image TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  featured INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO site_links (slug,title,description,href,image,active,featured,position) VALUES
('presencial','CURSO PRESENCIAL','Evolua sua pilotagem na pista.','#','/images/curso-presencial.jpg',1,1,0),
('online','CURSO ONLINE','Conheça o Método DAC.','#','/images/curso-online.jpg',1,0,1),
('loja','MARQUES STORE','Produtos oficiais e acessórios.','#','/images/marques-store.jpg',1,0,2),
('comunidade','COMUNIDADE','Faça parte do universo Leo Marques.','#','/images/comunidade.jpg',1,0,3);
