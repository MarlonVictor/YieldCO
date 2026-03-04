export interface Channel {
  id: string;
  name: string;
}

// ✏️ Substitua pelos IDs dos canais que você quer acompanhar
// Como encontrar o ID de um canal:
//   1. Acesse o canal no YouTube
//   2. Clique em "mais informações sobre este canal"
//   3. O ID aparece na URL ou nas informações do canal
//   Ou use: https://www.youtube.com/account_advanced (para o seu próprio canal)

export const CHANNELS: Channel[] = [
  {
    id: "UCzLAzI6Q-0WX2IbKfLmtZUw",
    name: "Geração Dividendos",
  },
  {
    id: "UC3Z2XdKUu21_KtMsohZedOQ",
    name: "A Cara da Riqueza",
  },
  {
    id: "UCj3jEZuLmXOndQJFkPTp3Nw",
    name: "Ela Investe",
  },
];
