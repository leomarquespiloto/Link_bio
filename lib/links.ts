export type SiteLink = {
  slug: string;
  title: string;
  description: string;
  href: string;
  image: string;
  active: boolean;
  featured: boolean;
};

export const defaultLinks: SiteLink[] = [
  { slug: "presencial", title: "CURSO PRESENCIAL", description: "Evolua sua pilotagem na pista.", href: "#", image: "/imagens/1.webp", active: true, featured: true },
  { slug: "online", title: "CURSO ONLINE", description: "Conheça o Método DAC.", href: "#", image: "/imagens/2.webp", active: true, featured: false },
  { slug: "loja", title: "MARQUES STORE", description: "Produtos oficiais e acessórios.", href: "#", image: "/imagens/3.webp", active: true, featured: false },
  { slug: "comunidade", title: "COMUNIDADE", description: "Faça parte do universo Leo Marques.", href: "#", image: "/imagens/4.webp", active: true, featured: false }
];

// Mantido como lista de slugs válidos para o registro de analytics.
export const links = defaultLinks;
