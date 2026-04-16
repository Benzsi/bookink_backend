
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
    },
    {
      id: 14,
      name: "Kukabuvár",
      genre: devproject_genre.ACTION,
      literaryForm: devproject_literaryForm.SINGLE_PLAYER,
      description: "Kukabúvár (Dumpster Diver) is a first-person educational explorer puzzle game, where you play as Máté, who has to clean up Zugló, a very dirty part of Budapest, full of stories and strange events.",
      imagePath: "1776322298732-608424715.png",
      developerId: 22,
      entries: [
        {
          id: 8,
          title: "Zugló szkennelése",
          content: "A mai napon sikerült befejeznünk Zugló központi részének 3D-s szkennelését műholdas adatok alapján. A Microsoft Flight Simulatorhoz hasonló technológia elképesztő részletességet ad a környezetnek, így a játékosok valóban otthon érezhetik magukat a mocsokban.",
          imagePath: "http://localhost:3000/uploads/1776322470241-91948707.png"
        },
        {
          id: 9,
          title: "Az 5-ös busz legendája",
          content: "Bevezettük az első igazi 'ellenséget': az 5-ös buszt. Ez egy megállíthatatlan fenevad, amely Zugló utcáin száguldozik. Ha nem figyelsz a menetrendre és az úttestre, könnyen a kerekek alatt végezheted. A mesterséges intelligenciája még finomításra szorul, de már most félelmetes!",
          imagePath: "http://localhost:3000/uploads/1776322419999-142023757.png"
        }
      ]
    }
  ];

  for (const project of projects) {
    const { entries, ...projectData } = project;
    
    // Use the project's own developerId if provided, otherwise fallback to the default
    const effectiveDeveloperId = (projectData as any).developerId || developerId;
    delete (projectData as any).developerId;

    await prisma.devproject.upsert({
      where: { id: project.id },
      update: {
        ...projectData,
        developerId: effectiveDeveloperId,
        updatedAt: new Date(),
      },
      create: {
        ...projectData,
        developerId: effectiveDeveloperId,
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
