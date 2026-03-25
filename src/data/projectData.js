import { WindArrowDown } from "lucide-react";

const portfolioProjects = [
  {
    id: 1,
    title: { tr: "Nottepe.com", en: "Nottepe.com" },
    image: "/images/nottepe2.png",

    category: { tr: "Blog", en: "Blog" },
    tech: [
      "React",
      "Node.js",
      "PostgreSQL",
      " Tailwind CSS",
      "Ubuntu Server",
      "Nginx",
    ],
    description: {
      tr: "Aktif kullanılan(1500 kullanıcı) Hacettepe Üniversitesi öğrencileri not paylaşım platformu.",
      en: "Actively used(1500 user) Hacettepe University students' note sharing platform",
    },
    link: "www.nottepe.com",
  },
  {
    id: 2,
    title: { tr: " Film Keşif Uygulaması", en: "Movie Discovery Application" },
    image:
      "/images/uniquemovies.png",
    category: {
      tr: "Açık kaynak API webistesi",
      en: "Open source API website",
    },
    tech: ["React", "TMDB API", "Tailwind CSS"],
    description: {
      tr: "Kullanıcılar popüler, trend ve yüksek puanlı filmleri görüntüleyebilir, arama ve filtreleme yapabilir",
      en: " Users can browse popular, trending, and top-rated movies, as well as perform search and filtering functions.",
    },
    link: "https://uniquemovies.vercel.app/",
  },
  {
    id: 3,
    title: {
      tr: "Modern Mobil Alışveriş Uygulaması",
      en: "Mobile Shopping Application",
    },
    image:
       "/images/quickmobile.jpg",
    category: { tr: "Mobil Uygulama", en: "Mobile App" },
    tech: [
      "React Native",
      "Nativewind",
      "Node.js",
      "Nosql",
      "MongoDB",
      "Typescript",
    ],
    description: {
      tr: `Web alışveriş uygulaması ile aynı backend’i kullanarak uygulamanın mobil versiyonunu
 React Native ve Nativewind ile ios uyumlu bir şekilde geliştirildi.
 Web ve mobilde tutarlı bir kullanıcı deneyimi sağlandı ve modern, ölçeklenebilir bir e
ticaret çözümü sunuldu.`,
      en: ` Using the same backend as the web shopping platform, I developed the mobile version of
 the application with React Native and Nativewind, ensuring full iOS compatibility.
 A consistent user experience was achieved across both web and mobile platforms,
 providing a modern and scalable e-commerce solution.`,
    },
    link: "https://github.com/hburakdemir/QuickShopMobile",
  },
  {
    id: 4,
    title: {
      tr: " Modern Web Alışveriş Uygulaması ",
      en: " Modern Web Shopping Application",
    },
    image:
      "/images/quickweb.jpg",
    category: { tr: "Web Uygulaması", en: "Web App" },
    tech: ["Vue.js", "Tailwind CSS", "Node.js", "MongoDB", "Nosql"],
    description: {
      tr: ` Kullanıcı yönetimi, ürün yönetimi, alışveriş sepeti ve ödeme
 entegrasyonları gibi temel e-ticaret işlevlerini kapsayan modern ve responsive bir yapı
 oluşturdum. Crud işlemlerinin hepsi global state için contextler ve tarayıcı hafızasında
 kullanıcı bilgileri yönetimini gerçekleştirdim.`,
      en: `  I built a modern and responsive structure covering core e-commerce functionalities such
 as user management, product management, shopping cart, and payment integrations.
 All CRUD operations were implemented with a global state management structure.`,
    },
    link: "https://github.com/hburakdemir/QuickShop-Vue",
  },

  {
    id: 5,
    title: {
      tr: " Sosyal Yardım Yönetimi Uygulaması",
      en: " Modern Web Shopping Application ",
    },
    image:
    "/images/bgyardımcom.png",
    category: { tr: "Web Tasarım", en: "Web Design" },
    tech: ["React", "Tailwind", "TypeScript", "MongoDB", "Nosql"],
    description: {
      tr: `Burs ve kitap bağışlarını yönetmek için bir
 web uygulaması geliştirildi.
Dinamik bir yönetici paneli geliştirildi ve güvenli, ölçeklenebilir CRUD tabanlı yardım
 yönetimi uygulandı.
 Kullanıcı dostu ve SEO uyumlu bir websitesi olması hedeflendi.`,
      en: `Manage scholarship and book donations using React,
 TypeScript, Tailwind CSS, and MongoDB.
 A dynamic admin panel was developed and secure, scalable CRUD-based donation
 management was implemented.
 The goal was to create a user-friendly and SEO-friendly website.`,
    },
    link: "waiting..",
  },

  {
    id: 6,
    title: {
      tr: "Yapay Zeka Fatura Tarama Uygulaması",
      en: "Artificial Intelligence Invoice Scanning Application",
    },
    image:
      "/images/ocrapp.png",
    category: { tr: "Web uygulaması", en: "Web App" },
    tech: ["React", "Python", "Node.js", "PaddleOCR", "NumPy"],
    description: {
      tr: `Verileri yapılandırılmış tablolara aktarmak için Python ve makine öğrenimi (45-55%
 doğruluk) kullanan yapay zeka tabanlı bir fatura işleme sistemi geliştirildi.
 Websitesi React ile oluşturuldu ve Excel'e aktarım tasarlandı.
 Verimliliği artırmak için manuel işleme otomatikleştirildi.`,
      en: `An AI-based invoice processing system was developed using Python and machine learning
 (45-55% accuracy) to export data into structured tables.
 The website was built with React and designed for export to Excel.
 Manual processing was automated to increase efficiency.`,
    },
    link: "https://github.com/hburakdemir/Receipt-Ocr-Ai",
  },

  {
    id: 7,
    title: {
      tr: "elcitr.com",
      en: "elcitr.com",
    },
    image:
     "/images/elci.png",
    category: { tr: "Web Tasarım", en: "Web Design" },
    tech: ["React", "Materıal UI", "Node.js", "PostgreSQL"],
    description: {
      tr: `Detaylı ve modern bir kurumsal şirket tanıtım web sitesi geliştirildi.`,
      en: ` A detailed and modern corporate company promotion website was developed.`,
    },
    link: "www.elcitr.com",
  },

  {
    id: 8,
    title: { tr: "Portfolio Web Sitesi", en: "  Personal Portfolio Website " },
    image:
     "/images/ysportfolio.png",
    category: { tr: "Web Tasarım", en: "Web Design" },
    tech: ["React", "Material UI"],
    description: {
      tr: `Bireysel kullanım için modern ve şık bir portfolio web sitesi tasarlandı ve geliştirildi.`,
      en: `A modern and stylish portfolio website was designed and developed for individual use.`,
    },
    link: "www.yakupsimsek.site",
  },
];

export default portfolioProjects;
