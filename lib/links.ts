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
  { slug: "presencial", title: "CURSO PRESENCIAL", description: "Evolua sua pilotagem na pista.", href: "#", image: "/images/curso-presencial.jpg", active: true, featured: true },
  { slug: "online", title: "CURSO ONLINE", description: "Conheça o Método DAC.", href: "#", image: "/images/curso-online.jpg", active: true, featured: false },
  { slug: "loja", title: "MARQUES STORE", description: "Produtos oficiais e acessórios.", href: "#", image: "/images/marques-store.jpg", active: true, featured: false },
  { slug: "comunidade", title: "COMUNIDADE", description: "Faça parte do universo Leo Marques.", href: "#", image: "/images/comunidade.jpg", active: true, featured: false }
];

// Mantido como lista de slugs válidos para o registro de analytics.
export const links = defaultLinks;
