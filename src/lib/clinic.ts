export const CLINIC = {
  name: "Klinika Vita",
  tagline: "Shëndeti juaj, prioriteti ynë",
  phone: "+383 44 100 100",
  email: "info@klinikavita.com",
  address: "Rr. Nënë Tereza 42, Prishtinë",
  hours: "Hënë – Premte, 09:00 – 16:30",
};

export const SPECIALTIES = [
  "Mjekësi e përgjithshme",
  "Kardiologji",
  "Pediatri",
  "Ortopedi",
  "Dermatologji",
  "Neurologji",
];

export const SERVICES = [
  {
    title: "Kontrollë e përgjithshme",
    text: "Vlerësim i shëndetit, tensionit, peshës dhe këshilla parandaluese.",
  },
  {
    title: "Kardiologji",
    text: "EKG, ndjekje e tensionit dhe kujdes për sëmundjet e zemrës.",
  },
  {
    title: "Pediatri",
    text: "Vizita për fëmijë, vaksina dhe ndjekje e rritjes.",
  },
  {
    title: "Ortopedi",
    text: "Dhimbje kyçesh, dëmtime sportive dhe rehabilitimi.",
  },
  {
    title: "Dermatologji",
    text: "Probleme të lëkurës, alergji dhe kontrolla dermatologjike.",
  },
  {
    title: "Analiza laboratorike",
    text: "Paketë bazë analizash me rezultate të shpejta.",
  },
];

export const STATUS_LABEL: Record<string, string> = {
  pending: "Në pritje",
  confirmed: "Konfirmuar",
  completed: "Përfunduar",
  cancelled: "Anuluar",
};
