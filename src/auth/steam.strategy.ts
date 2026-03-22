import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy, 'steam') {
  constructor(private readonly prisma: PrismaService) {
    super({
      returnURL: process.env.STEAM_RETURN_URL || 'http://localhost:3000/api/auth/steam/return',
      realm: process.env.STEAM_REALM || 'http://localhost:3000/',
      apiKey: process.env.STEAM_API_KEY || 'A_TE_STEAM_API_KULCSOD',
      passReqToCallback: true,
    });
  }

  async validate(req: any, identifier: string, profile: any) {
    const fs = require('fs');
    const path = require('path');

    // Mentsük el a visszaadott profil alapadatokat egy JSON fájlba, ha még nem létezik
    const profilePath = path.join(process.cwd(), 'steam_profile_data.json');
    if (!fs.existsSync(profilePath)) {
        fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2), 'utf8');
    }

    // Kérjük le a felhasználó játékait is (owned games), és mentsük el, hogy ne kelljen újra kérést küldeni
    const gamesPath = path.join(process.cwd(), 'steam_games_data.json');
    if (!fs.existsSync(gamesPath)) {
        try {
            const apiKey = process.env.STEAM_API_KEY;
            const response = await fetch(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${profile.id}&format=json&include_appinfo=true`);
            const gamesData = await response.json();
            fs.writeFileSync(gamesPath, JSON.stringify(gamesData, null, 2), 'utf8');
            console.log('Steam játékkönyvtár lementve a steam_games_data.json fájlba!');
        } catch (error) {
            console.error('Hiba a Steam játékok lekérése közben:', error);
        }
    }

    // MEGJEGYZÉS: A Kívánságlista (Wishlist) JSON lekérését a Steam szerverei a közelmúltban globálisan
    // letiltották a "Bot és Adatközpont" típusú (pl. Node.js backend) lekérések elől, és folyamatosan a Főoldalra 
    // irányítanak át. Mivel nincs hozzá hivatalos Web API hozzáférés (mint a Játékokhoz), ezért ezt a funkciót kikapcsoltuk.

    const userId = req.session?.currentUserId;

    if (!userId) {
      throw new UnauthorizedException("A munkamenet lejárt, nem tudjuk azonosítani a fiókot!");
    }

    const steamId64 = profile.id;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { steamId: steamId64 }
    });

    // ---------------------------------------------------------------------------------
    // AUTOMATIKUS "Játékaim" LISTA LÉTREHOZÁS ÉS FELTÖLTÉS A STEAM JSON ALAPJÁN
    // ---------------------------------------------------------------------------------
    try {
        const gamesPath = path.join(process.cwd(), 'steam_games_data.json');
        if (fs.existsSync(gamesPath)) {
            const fileContent = fs.readFileSync(gamesPath, 'utf8');
            const gamesData = JSON.parse(fileContent);
            
            if (gamesData.response && gamesData.response.games) {
                // Kigyűjtjük a játékcímeket a JSON-ból
                const steamGameNames = gamesData.response.games.map((g: any) => g.name);

                // 1. Kikeressük vagy létrehozzuk a felhasználó "Játékaim" listáját
                let myGamesList = await this.prisma.bookList.findFirst({
                    where: { userId: userId, name: 'Játékaim' }
                });

                if (!myGamesList) {
                    myGamesList = await this.prisma.bookList.create({
                        data: {
                            name: 'Játékaim',
                            userId: userId
                        }
                    });
                }

                // 2. Kikeressük az adatbázisunk "Book" táblájából azokat amik címen egyeznek
                const matchingGamesInDb = await this.prisma.book.findMany({
                    where: {
                        title: {
                            in: steamGameNames
                        }
                    }
                });

                // 3. Hozzáadjuk a listához, ha még nincsenek benne
                let addedCount = 0;
                for (const dbGame of matchingGamesInDb) {
                    const existingItem = await this.prisma.bookListItem.findUnique({
                        where: {
                            bookListId_bookId: {
                                bookListId: myGamesList.id,
                                bookId: dbGame.id
                            }
                        }
                    });

                    if (!existingItem) {
                        await this.prisma.bookListItem.create({
                            data: {
                                bookListId: myGamesList.id,
                                bookId: dbGame.id
                            }
                        });
                        addedCount++;
                    }
                }
                
                console.log(`[SteamSync] A "Játékaim" listába ${addedCount} db egyező játék került becsatolásra. Összesen ${matchingGamesInDb.length} játék szerepel a mi adatbázisunkban is.`);
            }
        }
    } catch (err) {
        console.error('[SteamSync] Hiba a Játékaim lista automatikus feltöltésekor:', err);
    }

    return updatedUser;
  }
}
