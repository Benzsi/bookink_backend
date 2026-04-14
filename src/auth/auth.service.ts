import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma.service';
import { user as User } from '@prisma/client';

type SafeUser = Omit<User, 'passwordHash'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  private sanitizeUser(user: User): SafeUser {
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async unlinkSteam(userId: number): Promise<{ message: string; user: SafeUser }> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { steamId: null, updatedAt: new Date() },
    });
    return { message: 'Steam fiók leválasztva', user: this.sanitizeUser(user) };
  }

  async register(dto: RegisterDto): Promise<{ user: SafeUser; token: string }> {
    const existingUser = await this.usersService.findByUsername(dto.username);
    if (existingUser) {
      throw new ConflictException('A felhasználónév már foglalt');
    }

    const existingEmail = await this.usersService.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException('Ez az email már regisztrálva van');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.createUser({
      username: dto.username,
      email: dto.email,
      passwordHash,
    });

    const safeUser = this.sanitizeUser(user);
    const token = this.jwtService.sign({ sub: user.id, username: user.username, role: user.role });

    return { user: safeUser, token };
  }

  async login(dto: LoginDto): Promise<{ user: SafeUser; token: string }> {
    // Ellenőrizzük, hogy email cím-e a bemenet
    const isEmail = dto.username.includes('@');
    
    let user: User | null;
    if (isEmail) {
      user = await this.usersService.findByEmail(dto.username);
    } else {
      user = await this.usersService.findByUsername(dto.username);
    }

    if (!user) {
      throw new UnauthorizedException('Hibás felhasználónév/email vagy jelszó');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Hibás felhasználónév/email vagy jelszó');
    }

    const safeUser = this.sanitizeUser(user);
    const token = this.jwtService.sign({ sub: user.id, username: user.username, role: user.role });

    return { user: safeUser, token };
  }

  async getSteamAchievements(userId: number, appId: string): Promise<any> {
    const fs = require('fs');
    const path = require('path');
    
    // Lekérdezzük a felhasználót az adatbázisból, hogy megkapjuk a steamId-t
    const user = await this.usersService.findById(userId);
    if (!user || !user.steamId) {
      throw new UnauthorizedException('Ehhez a fiókhoz nincs Steam azonosító (steamId) csatolva!');
    }

    // Létrehozzuk a gyorsítótár (cache) mappát, ha még nincs
    const cacheDir = path.join(process.cwd(), 'steam_cache', 'achievements');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // Készítünk egy egyedi fájlnevet a SteamID és a Játék azonosítójából (AppId)
    const cacheFile = path.join(cacheDir, `${user.steamId}_${appId}.json`);
    const CACHE_HOURS = 24;

    // Ha létezik a fájl, nézzük meg, mikor módosult
    if (fs.existsSync(cacheFile)) {
      const stats = fs.statSync(cacheFile);
      const now = new Date().getTime();
      const mtime = new Date(stats.mtime).getTime();
      const hoursDiff = (now - mtime) / (1000 * 60 * 60);

      // Ha frissebb, mint 24 óra, adjuk vissza a mentett JSON-t!
      if (hoursDiff <= CACHE_HOURS) {
         return JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      }
    }

    const apiKey = process.env.STEAM_API_KEY;
    if (!apiKey) {
      throw new ConflictException("Szerver hiba: Nincs Steam API kulcs beállítva!");
    }

    // Személyes achievement statisztikák API elérhetősége
    const statsUrl = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${apiKey}&steamid=${user.steamId}&l=hu`;
    
    // Globális játék séma elérhetősége (ez tartalmazza az ikonokat és a leírásokat)
    const schemaUrl = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${apiKey}&appid=${appId}&l=hu`;

    try {
        const fetchWithRetry = async (url: string, retries = 3): Promise<any> => {
            for (let i = 0; i < retries; i++) {
                try {
                    const res = await fetch(url);
                    if (!res.ok) {
                        // Ha pl. 403 Forbidden vagy egyéb hiba van
                        if (res.status >= 400 && res.status < 500 && res.status !== 429) {
                            throw new Error(`Kliens hiba: ${res.status}`);
                        }
                        throw new Error(`HTTP hiba: ${res.status}`);
                    }
                    return res;
                } catch (err: any) {
                    if (i === retries - 1) throw err;
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
        };

        const [statsRes, schemaRes] = await Promise.all([
          fetchWithRetry(statsUrl, 3), fetchWithRetry(schemaUrl, 3)
        ]);
        
        const statsData = await statsRes.json();
        const schemaData = await schemaRes.json();

        let achievementsList = [];
        let gameName = 'Ismeretlen';
        
        // Ha van rá adat a Steamen
        if (statsData.playerstats && statsData.playerstats.success && schemaData.game && schemaData.game.availableGameStats) {
           gameName = statsData.playerstats.gameName || 'Ismeretlen';
           const schemaAchievements = schemaData.game.availableGameStats.achievements || [];
           const playerAchievements = statsData.playerstats.achievements || [];

           // Összefésüljük a kettőt, hogy a frontend szép listát, neveket és képeket kapjon
           achievementsList = schemaAchievements.map((schemaAch: any) => {
               // Megkeressük, hogy a játékosnál megvan-e ez
               const pAch = playerAchievements.find((p: any) => p.apiname === schemaAch.name);
               const isAchieved = pAch && pAch.achieved === 1;

               return {
                   apiName: schemaAch.name,
                   name: schemaAch.displayName,
                   description: schemaAch.description || '',
                   // Ha megvan neki, akkor a színes ikon, ha nem, akkor a szürke
                   icon: isAchieved ? schemaAch.icon : schemaAch.icongray, 
                   achieved: isAchieved ? 1 : 0,
                   unlockTime: isAchieved ? pAch.unlocktime : 0
               };
           });
        } else if (statsData.playerstats && !statsData.playerstats.success) {
           throw new Error(statsData.playerstats.error || "A profil privát vagy nincs adat.");
        }

        const finalResult = {
           gameName,
           achievements: achievementsList
        };

        // Mentés a cache mappába
        fs.writeFileSync(cacheFile, JSON.stringify(finalResult, null, 2), 'utf8');
        return finalResult;

    } catch (e: any) {
      console.error(`[SteamSync] Hiba a(z) ${appId} játék achievementjeinek lekérésekor: ${e.message}`);
      // Ha lekéréshiba volt, de van egy "régi" 24 óránál is régebbi cache-ünk, essünk vissza arra!
      if (fs.existsSync(cacheFile)) {
        console.log(`[SteamSync] Régi cache visszaadása fallback-ként a(z) ${appId}-hez.`);
        // "Érintjük" a fájlt (frissítjük a módosítási dátumát), hogy ne próbálkozzon újra azonnal
        try {
            const now = new Date();
            fs.utimesSync(cacheFile, now, now);
        } catch (utErr) {}
        
        return JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      }
      throw new ConflictException("Nem sikerült lekérni a Steam-ről a játékhoz tartozó achievementeket. (Privát profil vagy hálózati hiba)");
    }
  }

  async getSteamAchievementsBygameId(userId: number, gameId: number): Promise<any> {
    const fs = require('fs');
    const path = require('path');
    
    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
       throw new ConflictException("Játék nem található az adatbázisban.");
    }

    const gamesPath = path.join(process.cwd(), 'steam_games_data.json');
    if (!fs.existsSync(gamesPath)) {
        return { gameName: game.title, achievements: [] };
    }

    const gamesData = JSON.parse(fs.readFileSync(gamesPath, 'utf8'));
    if (!gamesData || !gamesData.response || !gamesData.response.games) {
        return { gameName: game.title, achievements: [] };
    }

    // Keressük meg a helyi Steam mentésünkben ezt a címet
    const steamGame = gamesData.response.games.find((g: any) => g.name === game.title);
    
    if (!steamGame) {
        return { gameName: game.title, achievements: [] }; // Ehhez a játékhoz nincs Steam statisztikánk
    }

    // Most már megvan az appId, hívjuk meg az igazi lekérőt!
    return this.getSteamAchievements(userId, steamGame.appid.toString());
  }
}

