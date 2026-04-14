
import { PrismaClient, devproject_genre, devproject_literaryForm } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedDevLogs() {
  console.log('Dev Log adatok frissítése és seedelése...');

  // Fix developer user ID (a korábbi lekérdezés alapján id: 2)
  const developerId = 2;

  const projects = [
    {
      id: 11,
      name: "Aethelgard Chronicles: The Fractured Realm",
      genre: devproject_genre.RPG,
      literaryForm: devproject_literaryForm.SINGLE_PLAYER,
      description: "Ez egy nyílt világú, sötét fantasy akció-RPG, ahol a játékos egy bukott birodalom romjai között navigál. A játékmenet a dinamikus, ügyességalapú harcra, a mély karakterfejlesztésre és az ősi titkok felfedezésére épít egy vizuálisan lenyűgöző, festői környezetben.",
      imagePath: "http://localhost:3000/dev_covers/fantasy_rpg_logo.png",
      entries: [
        {
          id: 2,
          title: "Új fejlesztés érkezik",
          content: "A fejlesztés legfrissebb szakaszában a harci csapat a dinamikus lény-AI és az animációs rendszerek összehangolására összpontosít, hogy a nagy méretű boss-harcok (mint a sárkányok elleni küzdelem) valóban epikusnak és kiszámíthatatlannak tűnjenek.",
          imagePath: "http://localhost:3000/dev_covers/fantasy_rpg_1.png"
        },
        {
          id: 3,
          title: "Most a mágiákon dolgozunk",
          content: "Közben a környezetvédelmi művészek és a technikai programozók a mágikus rendszerek vizuális effektjeit és az ősi romok procedurális generálását optimalizálják, hogy a felfedezés zökkenőmentes és látványos legyen.",
          imagePath: "http://localhost:3000/dev_covers/fantasy_rpg_2.png"
        }
      ]
    },
    {
      id: 12,
      name: "Odyssey 2142: Nova Strike",
      genre: devproject_genre.ACTION,
      literaryForm: devproject_literaryForm.MULTIPLAYER,
      description: "Ez egy hibrid sci-fi játék, amely keveri a nagyszabású űrstratégiát a belső nézetű (FPS) felfedezéssel és taktikával. A játékos egy elitegység parancsnokaként flottákat irányít a csillagtérképen.",
      imagePath: "http://localhost:3000/dev_covers/scifi_war_logo.png",
      entries: [
        {
          id: 4,
          title: "Hatékonyság",
          content: "A technikai csapat jelenleg a többszáz hajót számláló űrcsaták optimalizálásán fáradozik, hogy a látványos robbanások, lézerhatások és a hajók rombolhatósága mellett is stabil maradjon a képkockasebesség.",
          imagePath: "http://localhost:3000/dev_covers/scifi_war_1.png"
        },
        {
          id: 5,
          title: "Hang és kép fejlesztés",
          content: "A belső helyszínekért felelős művészeti csapat az idegen megastruktúrák hangulatát finomítja, fókuszálva a futurisztikus megvilágításra, a biometallikus textúrák élethű renderelésére.",
          imagePath: "http://localhost:3000/dev_covers/scifi_war_2.png"
        }
      ]
    },
    {
      id: 13,
      name: "Crown & Conquest: The Iron Throne",
      genre: devproject_genre.STRATEGY,
      literaryForm: devproject_literaryForm.OPEN_WORLD,
      description: "Ez egy klasszikus valós idejű stratégiai játék (RTS), amely a középkori hadviselés történelmi hitelességére, a komplex gazdaságmenedzsmentre és a megerősített várak ostromára épít.",
      imagePath: "http://localhost:3000/dev_covers/history_strategy_logo.png",
      entries: [
        {
          id: 6,
          title: "AI fejlesztés",
          content: "A játékmenet-tervezők a nagyszabású ostrommechanika finomhangolását végzik, tesztelve az ostromgépek, a létrás egységek és az egység-AI viselkedését a várfalak közelében.",
          imagePath: "http://localhost:3000/dev_covers/history_strategy_1.png"
        },
        {
          id: 7,
          title: "Vizuális megjelenés, Új karakter",
          content: "A kampányért felelős csapat a grandiózus stratégiai térkép (haditérkép) és a tróntermi diplomáciai rendszerek integrálását teszteli, amely összeköti a taktikai csatákat a királyság menedzsmentjével.",
          imagePath: "http://localhost:3000/dev_covers/history_strategy_2.png"
        }
      ]
    }
  ];

  for (const project of projects) {
    const { entries, ...projectData } = project;
    
    await prisma.devproject.upsert({
      where: { id: project.id },
      update: {
        ...projectData,
        developerId: developerId,
        updatedAt: new Date(),
      },
      create: {
        ...projectData,
        developerId: developerId,
        updatedAt: new Date(),
      },
    });

    for (const entry of entries) {
      await prisma.devlogentry.upsert({
        where: { id: entry.id },
        update: {
          ...entry,
          projectId: project.id,
          updatedAt: new Date(),
        },
        create: {
          ...entry,
          projectId: project.id,
          updatedAt: new Date(),
        },
      });
    }
  }

  console.log('✓ Dev Log adatok sikeresen frissítve!');
}

if (require.main === module) {
  seedDevLogs()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
