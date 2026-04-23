-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Ápr 23. 08:23
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `indiebackseat`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `content` text NOT NULL,
  `userId` int(11) NOT NULL,
  `gameId` int(11) NOT NULL,
  `likes` int(11) NOT NULL DEFAULT 0,
  `dislikes` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `comment`
--

INSERT INTO `comment` (`id`, `content`, `userId`, `gameId`, `likes`, `dislikes`, `createdAt`, `updatedAt`) VALUES
(42, 'A Hollow Knight a legjobb indie játék amit valaha játszottam. A világ felépítése, a boss harcok és a hangulat egyedülállóan gyönyörű. Órányi felfedezés vár mindenkire!', 1, 1, 1, 0, '2026-04-16 07:02:06.365', '2026-04-20 08:37:30.620'),
(43, 'A Stardew Valley egy igazi lelki feltöltődés. Egyetlen fejlesztő hozta létre, mégis annyi tartalom van benne, hogy hetekig nem tudtam letenni. Co-op módban barátokkal különösen élvezetes.', 1, 2, 0, 0, '2026-04-16 07:02:06.368', '2026-04-16 07:02:06.367'),
(44, 'A Celeste nem csak egy platformer, hanem egy mélyen érzelmes történet a szorongásról és az önelfogadásról. A pixelgrafika és a zene tökéletes összhangban van.', 1, 3, 0, 0, '2026-04-16 07:02:06.370', '2026-04-16 07:02:06.369'),
(45, 'Az Among Us egyszerű koncepció, mégis végtelen szórakozást nyújt. Baráti társaságban órákon át nevettünk – és gyanakodtunk egymásra.', 1, 4, 0, 0, '2026-04-16 07:02:06.372', '2026-04-16 07:02:06.371'),
(46, 'A Hades a roguelite műfaj új csúcsa. Minden halál után egyre erősebb leszel, és a sztori is folytatódik. Zagreus karaktere és a görög mitológia brilliánsan van feldolgozva.', 1, 5, 0, 0, '2026-04-16 07:02:06.374', '2026-04-16 07:02:06.374'),
(47, 'Az Undertale megváltoztatta azt, ahogyan a játékokra tekintek. Az irónia, a humor, az érzelem és a meta-elemek csodálatosan olvadnak össze. Nem megölni is egy opció – és ez mindent megváltoztat.', 1, 6, 0, 0, '2026-04-16 07:02:06.377', '2026-04-16 07:02:06.376'),
(48, 'A Cuphead vizuálisan lenyűgöző – mintha egy 1930-as évekbeli rajzfilmbe kerültél volna. A bosszantóan nehéz boss harcok ellenére teljesen addiktív.', 1, 7, 0, 0, '2026-04-16 07:02:06.379', '2026-04-16 07:02:06.378'),
(49, 'A Limbo atmoszférája felülmúlhatatlan. Fekete-fehér képi világa és néma hangulata más játékoknál sosem látott szorongást ad. Rövid, de feledhetetlen élmény.', 1, 8, 0, 0, '2026-04-16 07:02:06.381', '2026-04-16 07:02:06.380'),
(50, 'Az Ori and the Blind Forest a legszebb indie játék amit valaha láttam. A zenéje és a grafika együtt szinte síratott meg. Tökéletes platformer és megható történet egyszerre.', 1, 9, 0, 0, '2026-04-16 07:02:06.384', '2026-04-16 07:02:06.383'),
(51, 'A Terraria egyike a leghosszabb módon játszható indie játékoknak. Barátokkal együtt egyszerűen végtelen – építs, ásj, harcolj főnökök ellen és fedezz fel minden zugot!', 1, 10, 0, 0, '2026-04-16 07:02:06.386', '2026-04-16 07:02:06.385'),
(52, 'ads', 1, 1, 0, 1, '2026-04-16 12:10:17.168', '2026-04-16 12:10:18.758'),
(53, 'ad', 1, 1, 0, 1, '2026-04-16 12:10:23.376', '2026-04-20 08:37:29.737');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `commentvote`
--

CREATE TABLE `commentvote` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `commentId` int(11) NOT NULL,
  `isLike` tinyint(1) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `commentvote`
--

INSERT INTO `commentvote` (`id`, `userId`, `commentId`, `isLike`, `createdAt`) VALUES
(3, 1, 42, 1, '2026-04-16 12:10:13.947'),
(4, 1, 52, 0, '2026-04-16 12:10:18.744'),
(5, 1, 53, 0, '2026-04-16 12:10:46.168');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `devlogentry`
--

CREATE TABLE `devlogentry` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `content` text NOT NULL,
  `projectId` int(11) NOT NULL,
  `imagePath` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `devlogentry`
--

INSERT INTO `devlogentry` (`id`, `title`, `content`, `projectId`, `imagePath`, `createdAt`, `updatedAt`) VALUES
(2, 'Új fejlesztés érkezik', 'A fejlesztés legfrissebb szakaszában a harci csapat a dinamikus lény-AI és az animációs rendszerek összehangolására összpontosít, hogy a nagy méretű boss-harcok (mint a sárkányok elleni küzdelem) valóban epikusnak és kiszámíthatatlannak tűnjenek.', 11, 'http://localhost:3000/dev_covers/fantasy_rpg_1.png', '2026-04-14 08:57:36.695', '2026-04-16 07:02:06.394'),
(3, 'Most a mágiákon dolgozunk', 'Közben a környezetvédelmi művészek és a technikai programozók a mágikus rendszerek vizuális effektjeit és az ősi romok procedurális generálását optimalizálják, hogy a felfedezés zökkenőmentes és látványos legyen.', 11, 'http://localhost:3000/dev_covers/fantasy_rpg_2.png', '2026-04-14 08:57:36.699', '2026-04-16 07:02:06.398'),
(4, 'Hatékonyság', 'A technikai csapat jelenleg a többszáz hajót számláló űrcsaták optimalizálásán fáradozik, hogy a látványos robbanások, lézerhatások és a hajók rombolhatósága mellett is stabil maradjon a képkockasebesség.', 12, 'http://localhost:3000/dev_covers/scifi_war_1.png', '2026-04-14 08:57:36.705', '2026-04-16 07:02:06.403'),
(5, 'Hang és kép fejlesztés', 'A belső helyszínekért felelős művészeti csapat az idegen megastruktúrák hangulatát finomítja, fókuszálva a futurisztikus megvilágításra, a biometallikus textúrák élethű renderelésére.', 12, 'http://localhost:3000/dev_covers/scifi_war_2.png', '2026-04-14 08:57:36.708', '2026-04-16 07:02:06.406'),
(6, 'AI fejlesztés', 'A játékmenet-tervezők a nagyszabású ostrommechanika finomhangolását végzik, tesztelve az ostromgépek, a létrás egységek és az egység-AI viselkedését a várfalak közelében.', 13, 'http://localhost:3000/dev_covers/history_strategy_1.png', '2026-04-14 08:57:36.714', '2026-04-16 07:02:06.412'),
(7, 'Vizuális megjelenés, Új karakter', 'A kampányért felelős csapat a grandiózus stratégiai térkép (haditérkép) és a tróntermi diplomáciai rendszerek integrálását teszteli, amely összeköti a taktikai csatákat a királyság menedzsmentjével.', 13, 'http://localhost:3000/dev_covers/history_strategy_2.png', '2026-04-14 08:57:36.717', '2026-04-16 07:02:06.416'),
(8, 'Zugló szkennelése', 'A mai napon sikerült befejeznünk Zugló központi részének 3D-s szkennelését műholdas adatok alapján. A Microsoft Flight Simulatorhoz hasonló technológia elképesztő részletességet ad a környezetnek, így a játékosok valóban otthon érezhetik magukat a mocsokban.', 14, 'http://localhost:3000/uploads/1776322470241-91948707.png', '2026-04-16 06:59:39.459', '2026-04-16 07:02:06.423'),
(9, 'Az 5-ös busz legendája', 'Bevezettük az első igazi \'ellenséget\': az 5-ös buszt. Ez egy megállíthatatlan fenevad, amely Zugló utcáin száguldozik. Ha nem figyelsz a menetrendre és az úttestre, könnyen a kerekek alatt végezheted. A mesterséges intelligenciája még finomításra szorul, de már most félelmetes!', 14, 'http://localhost:3000/uploads/1776322419999-142023757.png', '2026-04-16 06:59:39.463', '2026-04-16 07:02:06.427');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `devproject`
--

CREATE TABLE `devproject` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `genre` enum('ACTION','PUZZLE','RPG','PLATFORMER','HORROR','ADVENTURE','SANDBOX','SIMULATION','STRATEGY','SPORTS','RACING','FIGHTING','SHOOTER','SURVIVAL','STEALTH','ROGUELIKE','MOBA','MMORPG','TOWER_DEFENSE','PARTY','CARD_GAME','RHYTHM') NOT NULL,
  `literaryForm` enum('SINGLE_PLAYER','MULTIPLAYER','CO_OP','BATTLE_ROYALE','OPEN_WORLD','LINEAR','METROIDVANIA','SOULSLIKE','FIRST_PERSON','THIRD_PERSON','VR','AUTOSHOOTER','TEXT_BASED') NOT NULL,
  `description` text NOT NULL,
  `imagePath` text DEFAULT NULL,
  `developerId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `progress` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `devproject`
--

INSERT INTO `devproject` (`id`, `name`, `genre`, `literaryForm`, `description`, `imagePath`, `developerId`, `createdAt`, `updatedAt`, `progress`) VALUES
(11, 'Aethelgard Chronicles: The Fractured Realm', 'RPG', 'SINGLE_PLAYER', 'Ez egy nyílt világú, sötét fantasy akció-RPG, ahol a játékos egy bukott birodalom romjai között navigál. A játékmenet a dinamikus, ügyességalapú harcra, a mély karakterfejlesztésre és az ősi titkok felfedezésére épít egy vizuálisan lenyűgöző, festői környezetben.', 'http://localhost:3000/dev_covers/fantasy_rpg_logo.png', 2, '2026-04-14 08:57:36.691', '2026-04-16 07:02:06.388', 42),
(12, 'Odyssey 2142: Nova Strike', 'ACTION', 'MULTIPLAYER', 'Ez egy hibrid sci-fi játék, amely keveri a nagyszabású űrstratégiát a belső nézetű (FPS) felfedezéssel és taktikával. A játékos egy elitegység parancsnokaként flottákat irányít a csillagtérképen.', 'http://localhost:3000/dev_covers/scifi_war_logo.png', 2, '2026-04-14 08:57:36.702', '2026-04-16 07:02:06.400', 78),
(13, 'Crown & Conquest: The Iron Throne', 'STRATEGY', 'OPEN_WORLD', 'Ez egy klasszikus valós idejű stratégiai játék (RTS), amely a középkori hadviselés történelmi hitelességére, a komplex gazdaságmenedzsmentre és a megerősített várak ostromára épít.', 'http://localhost:3000/dev_covers/history_strategy_logo.png', 2, '2026-04-14 08:57:36.711', '2026-04-16 07:02:06.408', 87),
(14, 'Kukabuvár', 'ACTION', 'SINGLE_PLAYER', 'Kukabúvár (Dumpster Diver) is a first-person educational explorer puzzle game, where you play as Máté, who has to clean up Zugló, a very dirty part of Budapest, full of stories and strange events.', '1776322298732-608424715.png', 22, '2026-04-16 06:59:39.452', '2026-04-16 07:29:21.132', 100);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `devprojectfavorite`
--

CREATE TABLE `devprojectfavorite` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `projectId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `devprojectfavorite`
--

INSERT INTO `devprojectfavorite` (`id`, `userId`, `projectId`, `createdAt`) VALUES
(2, 1, 14, '2026-04-17 09:14:31.383');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `devprojectwishlist`
--

CREATE TABLE `devprojectwishlist` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `projectId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `devprojectwishlist`
--

INSERT INTO `devprojectwishlist` (`id`, `userId`, `projectId`, `createdAt`) VALUES
(10, 1, 12, '2026-04-14 08:57:36.792'),
(19, 12, 13, '2026-04-14 08:57:36.872'),
(29, 8, 12, '2026-04-16 06:50:04.474'),
(32, 19, 12, '2026-04-16 06:50:04.492'),
(46, 18, 13, '2026-04-16 06:50:04.529'),
(54, 4, 11, '2026-04-16 06:59:39.496'),
(55, 5, 11, '2026-04-16 06:59:39.500'),
(57, 7, 11, '2026-04-16 06:59:39.508'),
(58, 8, 11, '2026-04-16 06:59:39.511'),
(59, 10, 11, '2026-04-16 06:59:39.516'),
(63, 20, 11, '2026-04-16 06:59:39.541'),
(67, 14, 12, '2026-04-16 06:59:39.573'),
(68, 9, 13, '2026-04-16 06:59:39.600'),
(69, 13, 13, '2026-04-16 06:59:39.609'),
(70, 19, 13, '2026-04-16 06:59:39.623'),
(72, 2, 14, '2026-04-16 06:59:39.632'),
(73, 5, 14, '2026-04-16 06:59:39.637'),
(74, 6, 14, '2026-04-16 06:59:39.640'),
(75, 7, 14, '2026-04-16 06:59:39.642'),
(76, 9, 14, '2026-04-16 06:59:39.645'),
(77, 10, 14, '2026-04-16 06:59:39.648'),
(79, 12, 14, '2026-04-16 06:59:39.653'),
(80, 13, 14, '2026-04-16 06:59:39.656'),
(81, 16, 14, '2026-04-16 06:59:39.662'),
(82, 20, 14, '2026-04-16 06:59:39.669'),
(83, 22, 14, '2026-04-16 06:59:39.671'),
(84, 2, 11, '2026-04-16 07:02:06.477'),
(85, 9, 11, '2026-04-16 07:02:06.497'),
(86, 11, 11, '2026-04-16 07:02:06.503'),
(87, 16, 11, '2026-04-16 07:02:06.521'),
(88, 5, 12, '2026-04-16 07:02:06.546'),
(89, 6, 12, '2026-04-16 07:02:06.550'),
(90, 13, 12, '2026-04-16 07:02:06.567'),
(91, 16, 12, '2026-04-16 07:02:06.573'),
(92, 20, 12, '2026-04-16 07:02:06.584'),
(93, 22, 12, '2026-04-16 07:02:06.587'),
(94, 2, 13, '2026-04-16 07:02:06.591'),
(95, 5, 13, '2026-04-16 07:02:06.597'),
(96, 6, 13, '2026-04-16 07:02:06.600'),
(97, 8, 13, '2026-04-16 07:02:06.605'),
(98, 11, 13, '2026-04-16 07:02:06.612'),
(99, 15, 13, '2026-04-16 07:02:06.621'),
(100, 16, 13, '2026-04-16 07:02:06.624'),
(101, 17, 13, '2026-04-16 07:02:06.626'),
(102, 4, 14, '2026-04-16 07:02:06.640'),
(103, 8, 14, '2026-04-16 07:02:06.648'),
(104, 15, 14, '2026-04-16 07:02:06.661'),
(105, 17, 14, '2026-04-16 07:02:06.665'),
(106, 18, 14, '2026-04-16 07:02:06.667'),
(107, 19, 14, '2026-04-16 07:02:06.670'),
(119, 1, 14, '2026-04-17 09:14:32.358'),
(120, 1, 13, '2026-04-20 08:39:45.754');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `game`
--

CREATE TABLE `game` (
  `id` int(11) NOT NULL,
  `sequenceNumber` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `author` varchar(191) NOT NULL,
  `coverUrl` varchar(191) DEFAULT NULL,
  `commentId` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `genre` enum('ACTION','PUZZLE','RPG','PLATFORMER','HORROR','ADVENTURE','SANDBOX','SIMULATION','STRATEGY','SPORTS','RACING','FIGHTING','SHOOTER','SURVIVAL','STEALTH','ROGUELIKE','MOBA','MMORPG','TOWER_DEFENSE','PARTY','CARD_GAME','RHYTHM') NOT NULL,
  `literaryForm` enum('SINGLE_PLAYER','MULTIPLAYER','CO_OP','BATTLE_ROYALE','OPEN_WORLD','LINEAR','METROIDVANIA','SOULSLIKE','FIRST_PERSON','THIRD_PERSON','VR','AUTOSHOOTER','TEXT_BASED') NOT NULL,
  `lyricNote` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `pageCount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `game`
--

INSERT INTO `game` (`id`, `sequenceNumber`, `title`, `author`, `coverUrl`, `commentId`, `rating`, `genre`, `literaryForm`, `lyricNote`, `createdAt`, `updatedAt`, `pageCount`) VALUES
(1, 1, 'Hollow Knight', 'Team Cherry', 'http://localhost:3000/covers/game-01-hollow-knight.jpg', 1001, NULL, 'ADVENTURE', 'SINGLE_PLAYER', 'Sötét katakombák mélyén egy apró lovag keresi az igazságot.', '2026-04-14 08:57:35.919', '2026-04-16 07:02:05.548', 2017),
(2, 2, 'Stardew Valley', 'ConcernedApe', 'http://localhost:3000/covers/game-02-stardew-valley.jpg', 1002, NULL, 'SANDBOX', 'CO_OP', 'Hagyd el a várost – a farm és a természet visszavár.', '2026-04-14 08:57:35.923', '2026-04-16 07:02:05.555', 2016),
(3, 3, 'Celeste', 'Maddy Thorson & Noel Berry', 'http://localhost:3000/covers/game-03-celeste.jpg', 1003, NULL, 'PLATFORMER', 'SINGLE_PLAYER', 'Egy hegy, ezer bukás – és a belső démonok legyőzése.', '2026-04-14 08:57:35.928', '2026-04-16 07:02:05.558', 2018),
(4, 4, 'Among Us', 'InnerSloth', 'http://localhost:3000/covers/game-04-among-us.jpg', 1004, NULL, 'PUZZLE', 'MULTIPLAYER', 'Az áruló közöttünk van – de ki az?', '2026-04-14 08:57:35.932', '2026-04-16 07:02:05.562', 2018),
(5, 5, 'Hades', 'Supergiant Games', 'http://localhost:3000/covers/game-05-hades.jpg', 1005, NULL, 'ACTION', 'SINGLE_PLAYER', 'Zagreus minden halállal közelebb kerül a napfényhez.', '2026-04-14 08:57:35.936', '2026-04-16 07:02:05.565', 2020),
(6, 6, 'Undertale', 'Toby Fox', 'http://localhost:3000/covers/game-06-undertale.jpg', 1006, NULL, 'RPG', 'SINGLE_PLAYER', 'Senkit sem kell megölnöd – ez a te döntésed.', '2026-04-14 08:57:35.939', '2026-04-16 07:02:05.568', 2015),
(7, 7, 'Cuphead', 'Studio MDHR', 'http://localhost:3000/covers/game-07-cuphead.jpg', 1007, NULL, 'ACTION', 'CO_OP', 'Az ördöggel kötött adósság – rajzfilmbe álmodva.', '2026-04-14 08:57:35.942', '2026-04-16 07:02:05.571', 2017),
(8, 8, 'Limbo', 'Playdead', 'http://localhost:3000/covers/game-08-limbo.jpg', 1008, NULL, 'HORROR', 'SINGLE_PLAYER', 'Szürke sötétség és csend – ahol a félelem lakik.', '2026-04-14 08:57:35.944', '2026-04-16 07:02:05.575', 2010),
(9, 9, 'Ori and the Blind Forest', 'Moon Studios', 'http://localhost:3000/covers/game-09-ori-blind-forest.jpg', 1009, NULL, 'ADVENTURE', 'SINGLE_PLAYER', 'Egy erdő lelke keres utat haza a fény felé.', '2026-04-14 08:57:35.947', '2026-04-16 07:02:05.578', 2015),
(10, 10, 'Terraria', 'Re-Logic', 'http://localhost:3000/covers/game-10-terraria.jpg', 1010, NULL, 'SANDBOX', 'MULTIPLAYER', 'Ásni, építeni, harcolni – végtelen világ vár.', '2026-04-14 08:57:35.950', '2026-04-16 07:02:05.582', 2011),
(11, 11, 'Little Nightmares', 'Tarsier Studios', 'http://localhost:3000/covers/game-11-little-nightmares.jpg', 1011, NULL, 'HORROR', 'SINGLE_PLAYER', 'Egy kis lány menekül egy világ elől, ahol minden torz.', '2026-04-14 08:57:35.953', '2026-04-16 07:02:05.586', 2017),
(12, 12, 'Dead Cells', 'Motion Twin', 'http://localhost:3000/covers/game-12-dead-cells.jpg', 1012, NULL, 'ACTION', 'SINGLE_PLAYER', 'Fegyverkezz fel, halj meg, tanulj belőle – és kezdd újra.', '2026-04-14 08:57:35.956', '2026-04-16 07:02:05.589', 2018),
(13, 13, 'Slay the Spire', 'Mega Crit', 'http://localhost:3000/covers/game-13-slay-the-spire.jpg', 1013, NULL, 'RPG', 'SINGLE_PLAYER', 'Építs paklit, mássz meg a tornyot, és küzdj meg a szívvel.', '2026-04-14 08:57:35.958', '2026-04-16 07:02:05.592', 2017),
(14, 14, 'Outer Wilds', 'Mobius Digital', 'http://localhost:3000/covers/game-14-outer-wilds.jpg', 1014, NULL, 'ADVENTURE', 'SINGLE_PLAYER', 'A nap hamarosan felrobban – fejtsd meg a rejtélyt az időhurokban.', '2026-04-14 08:57:35.960', '2026-04-16 07:02:05.596', 2019),
(15, 15, 'Into the Breach', 'Subset Games', 'http://localhost:3000/covers/game-15-into-the-breach.jpg', 1015, NULL, 'PUZZLE', 'SINGLE_PLAYER', 'Óriás robotok az időutazók kezében – védd meg a megmaradt jövőt.', '2026-04-14 08:57:35.963', '2026-04-16 07:02:05.599', 2018),
(16, 16, 'Disco Elysium', 'ZA/UM', 'http://localhost:3000/covers/game-16-disco-elysium.jpg', 1016, NULL, 'RPG', 'SINGLE_PLAYER', 'Egy amnéziás nyomozó elmélkedik Revachol mocskos utcáin.', '2026-04-14 08:57:35.966', '2026-04-16 07:02:05.603', 2019),
(17, 17, 'The Binding of Isaac', 'Edmund McMillen', 'http://localhost:3000/covers/game-17-binding-of-isaac.jpg', 1017, NULL, 'ACTION', 'SINGLE_PLAYER', 'Anya hangokat hall, Isaac pedig a pincébe menekül a könnyek között.', '2026-04-14 08:57:35.969', '2026-04-16 07:02:05.606', 2011),
(18, 18, 'Vampire Survivors', 'poncle', 'http://localhost:3000/covers/game-18-vampire-survivors.jpg', 1018, NULL, 'ACTION', 'SINGLE_PLAYER', 'Légy a golyózápor puszta jelenléteddel – amíg az Éjszaka engedi.', '2026-04-14 08:57:35.972', '2026-04-16 07:02:05.610', 2022),
(19, 19, 'Cult of the Lamb', 'Massive Monster', 'http://localhost:3000/covers/game-19-cult-of-the-lamb.jpg', 1019, NULL, 'ACTION', 'SINGLE_PLAYER', 'Alapíts szektát egy ősi isten nevében – áldozd fel a hitetleneket.', '2026-04-14 08:57:35.974', '2026-04-16 07:02:05.613', 2022),
(20, 20, 'Hotline Miami', 'Dennaton Games', 'http://localhost:3000/covers/game-20-hotline-miami.jpg', 1020, NULL, 'ACTION', 'SINGLE_PLAYER', 'Szereted bántani az embereket? Lépj be a neonfényes vérengzésbe.', '2026-04-14 08:57:35.977', '2026-04-16 07:02:05.617', 2012);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `gamelist`
--

CREATE TABLE `gamelist` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `userId` int(11) NOT NULL,
  `imagePath` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `gamelist`
--

INSERT INTO `gamelist` (`id`, `name`, `userId`, `imagePath`, `createdAt`, `updatedAt`) VALUES
(1, 'ads', 1, NULL, '2026-04-16 07:14:40.013', '2026-04-16 07:14:40.011'),
(2, 'Kedveltek', 22, NULL, '2026-04-16 09:09:02.391', '2026-04-16 09:09:02.389'),
(3, 'Wishlist', 22, NULL, '2026-04-16 12:11:10.326', '2026-04-16 12:11:10.323'),
(4, 'asdsa', 22, NULL, '2026-04-16 12:11:27.608', '2026-04-16 12:11:27.606'),
(6, 'Játékaim', 1, '1776525027552-345322220.png', '2026-04-18 15:06:12.838', '2026-04-18 15:10:27.590'),
(7, 'Wishlist', 1, NULL, '2026-04-20 06:40:03.898', '2026-04-20 06:40:03.896'),
(8, 'Kedveltek', 1, NULL, '2026-04-20 06:56:44.325', '2026-04-20 06:56:44.324');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `gamelistitem`
--

CREATE TABLE `gamelistitem` (
  `id` int(11) NOT NULL,
  `gameListId` int(11) NOT NULL,
  `gameId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `gamelistitem`
--

INSERT INTO `gamelistitem` (`id`, `gameListId`, `gameId`, `createdAt`) VALUES
(1, 1, 3, '2026-04-16 07:14:47.224'),
(2, 1, 19, '2026-04-16 07:15:36.926'),
(3, 2, 4, '2026-04-16 09:09:02.401'),
(4, 3, 19, '2026-04-16 12:11:10.342'),
(5, 2, 19, '2026-04-16 12:11:11.972'),
(6, 4, 19, '2026-04-16 12:11:31.447'),
(7, 6, 2, '2026-04-18 15:06:12.849'),
(8, 6, 7, '2026-04-18 15:06:12.853'),
(9, 6, 11, '2026-04-18 15:06:12.859'),
(10, 6, 19, '2026-04-18 15:06:12.863'),
(11, 7, 19, '2026-04-20 06:40:03.912'),
(12, 8, 19, '2026-04-20 06:56:44.334'),
(13, 7, 3, '2026-04-20 06:57:06.798'),
(14, 8, 3, '2026-04-20 06:57:07.603');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `gamelistitemgallery`
--

CREATE TABLE `gamelistitemgallery` (
  `id` int(11) NOT NULL,
  `gameListItemId` int(11) NOT NULL,
  `filePath` text NOT NULL,
  `fileType` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `gamelistitemgallery`
--

INSERT INTO `gamelistitemgallery` (`id`, `gameListItemId`, `filePath`, `fileType`, `createdAt`) VALUES
(2, 10, '1776668635267-906319748.jpg', 'IMAGE', '2026-04-20 07:03:55.278'),
(3, 10, '1776668639186-49055045.jpg', 'IMAGE', '2026-04-20 07:03:59.192');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rating`
--

CREATE TABLE `rating` (
  `id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `gameId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `rating`
--

INSERT INTO `rating` (`id`, `rating`, `userId`, `gameId`, `createdAt`, `updatedAt`) VALUES
(1217, 5, 14, 1, '2026-04-16 07:02:05.632', '2026-04-16 07:02:05.632'),
(1218, 3, 1, 1, '2026-04-16 07:02:05.636', '2026-04-20 08:37:32.765'),
(1219, 3, 16, 1, '2026-04-16 07:02:05.639', '2026-04-16 07:02:05.638'),
(1220, 4, 18, 1, '2026-04-16 07:02:05.642', '2026-04-16 07:02:05.641'),
(1221, 5, 2, 1, '2026-04-16 07:02:05.645', '2026-04-16 07:02:05.644'),
(1222, 1, 11, 1, '2026-04-16 07:02:05.648', '2026-04-16 07:02:05.647'),
(1223, 1, 9, 1, '2026-04-16 07:02:05.650', '2026-04-16 07:02:05.649'),
(1224, 5, 19, 1, '2026-04-16 07:02:05.652', '2026-04-16 07:02:05.651'),
(1225, 4, 20, 1, '2026-04-16 07:02:05.655', '2026-04-16 07:02:05.654'),
(1226, 5, 13, 1, '2026-04-16 07:02:05.657', '2026-04-16 07:02:05.656'),
(1227, 5, 7, 1, '2026-04-16 07:02:05.660', '2026-04-16 07:02:05.659'),
(1228, 1, 17, 1, '2026-04-16 07:02:05.663', '2026-04-16 07:02:05.662'),
(1229, 3, 4, 1, '2026-04-16 07:02:05.666', '2026-04-16 07:02:05.665'),
(1230, 4, 15, 1, '2026-04-16 07:02:05.669', '2026-04-16 07:02:05.668'),
(1231, 1, 5, 1, '2026-04-16 07:02:05.672', '2026-04-16 07:02:05.671'),
(1232, 3, 8, 1, '2026-04-16 07:02:05.675', '2026-04-16 07:02:05.674'),
(1233, 2, 19, 2, '2026-04-16 07:02:05.678', '2026-04-16 07:02:05.677'),
(1234, 5, 14, 2, '2026-04-16 07:02:05.681', '2026-04-16 07:02:05.680'),
(1235, 2, 10, 2, '2026-04-16 07:02:05.684', '2026-04-16 07:02:05.683'),
(1236, 2, 1, 2, '2026-04-16 07:02:05.686', '2026-04-16 07:02:05.686'),
(1237, 3, 8, 2, '2026-04-16 07:02:05.689', '2026-04-16 07:02:05.688'),
(1238, 5, 13, 2, '2026-04-16 07:02:05.691', '2026-04-16 07:02:05.690'),
(1239, 4, 11, 2, '2026-04-16 07:02:05.693', '2026-04-16 07:02:05.692'),
(1240, 2, 16, 2, '2026-04-16 07:02:05.695', '2026-04-16 07:02:05.694'),
(1241, 5, 18, 2, '2026-04-16 07:02:05.698', '2026-04-16 07:02:05.697'),
(1242, 2, 17, 2, '2026-04-16 07:02:05.700', '2026-04-16 07:02:05.699'),
(1243, 4, 4, 2, '2026-04-16 07:02:05.702', '2026-04-16 07:02:05.701'),
(1244, 1, 2, 2, '2026-04-16 07:02:05.704', '2026-04-16 07:02:05.703'),
(1245, 1, 22, 2, '2026-04-16 07:02:05.706', '2026-04-16 07:02:05.706'),
(1246, 3, 5, 3, '2026-04-16 07:02:05.708', '2026-04-16 07:02:05.707'),
(1247, 4, 14, 3, '2026-04-16 07:02:05.711', '2026-04-16 07:02:05.711'),
(1248, 5, 13, 3, '2026-04-16 07:02:05.714', '2026-04-16 07:02:05.713'),
(1249, 5, 22, 3, '2026-04-16 07:02:05.716', '2026-04-16 07:02:05.716'),
(1250, 1, 19, 3, '2026-04-16 07:02:05.718', '2026-04-16 07:02:05.718'),
(1251, 2, 16, 3, '2026-04-16 07:02:05.721', '2026-04-16 07:02:05.720'),
(1252, 1, 15, 3, '2026-04-16 07:02:05.723', '2026-04-16 07:02:05.722'),
(1253, 5, 10, 3, '2026-04-16 07:02:05.725', '2026-04-16 07:02:05.724'),
(1254, 1, 20, 3, '2026-04-16 07:02:05.727', '2026-04-16 07:02:05.726'),
(1255, 2, 18, 3, '2026-04-16 07:02:05.730', '2026-04-16 07:02:05.729'),
(1256, 3, 8, 3, '2026-04-16 07:02:05.732', '2026-04-16 07:02:05.731'),
(1257, 1, 17, 3, '2026-04-16 07:02:05.734', '2026-04-16 07:02:05.733'),
(1258, 5, 9, 3, '2026-04-16 07:02:05.736', '2026-04-16 07:02:05.735'),
(1259, 5, 7, 3, '2026-04-16 07:02:05.738', '2026-04-16 07:02:05.737'),
(1260, 4, 2, 3, '2026-04-16 07:02:05.740', '2026-04-16 07:02:05.739'),
(1261, 5, 10, 4, '2026-04-16 07:02:05.742', '2026-04-16 07:02:05.741'),
(1262, 5, 22, 4, '2026-04-16 07:02:05.745', '2026-04-16 07:02:05.745'),
(1263, 1, 5, 4, '2026-04-16 07:02:05.747', '2026-04-16 07:02:05.747'),
(1264, 1, 11, 4, '2026-04-16 07:02:05.749', '2026-04-16 07:02:05.749'),
(1265, 3, 7, 4, '2026-04-16 07:02:05.752', '2026-04-16 07:02:05.751'),
(1266, 2, 15, 4, '2026-04-16 07:02:05.754', '2026-04-16 07:02:05.753'),
(1267, 4, 16, 4, '2026-04-16 07:02:05.756', '2026-04-16 07:02:05.755'),
(1268, 3, 8, 4, '2026-04-16 07:02:05.758', '2026-04-16 07:02:05.758'),
(1269, 2, 19, 4, '2026-04-16 07:02:05.761', '2026-04-16 07:02:05.760'),
(1270, 4, 13, 4, '2026-04-16 07:02:05.764', '2026-04-16 07:02:05.763'),
(1271, 1, 20, 4, '2026-04-16 07:02:05.767', '2026-04-16 07:02:05.766'),
(1272, 5, 1, 4, '2026-04-16 07:02:05.769', '2026-04-16 07:02:05.768'),
(1273, 5, 2, 4, '2026-04-16 07:02:05.771', '2026-04-16 07:02:05.770'),
(1274, 5, 9, 4, '2026-04-16 07:02:05.774', '2026-04-16 07:02:05.773'),
(1275, 1, 17, 4, '2026-04-16 07:02:05.777', '2026-04-16 07:02:05.776'),
(1276, 4, 8, 5, '2026-04-16 07:02:05.779', '2026-04-16 07:02:05.778'),
(1277, 2, 17, 5, '2026-04-16 07:02:05.781', '2026-04-16 07:02:05.780'),
(1278, 2, 9, 5, '2026-04-16 07:02:05.784', '2026-04-16 07:02:05.783'),
(1279, 2, 12, 5, '2026-04-16 07:02:05.787', '2026-04-16 07:02:05.786'),
(1280, 2, 1, 5, '2026-04-16 07:02:05.789', '2026-04-16 07:02:05.788'),
(1281, 1, 19, 5, '2026-04-16 07:02:05.792', '2026-04-16 07:02:05.791'),
(1282, 1, 7, 5, '2026-04-16 07:02:05.795', '2026-04-16 07:02:05.794'),
(1283, 3, 22, 5, '2026-04-16 07:02:05.797', '2026-04-16 07:02:05.797'),
(1284, 3, 18, 5, '2026-04-16 07:02:05.800', '2026-04-16 07:02:05.799'),
(1285, 3, 15, 5, '2026-04-16 07:02:05.802', '2026-04-16 07:02:05.802'),
(1286, 2, 20, 5, '2026-04-16 07:02:05.804', '2026-04-16 07:02:05.804'),
(1287, 4, 5, 5, '2026-04-16 07:02:05.807', '2026-04-16 07:02:05.806'),
(1288, 5, 10, 5, '2026-04-16 07:02:05.810', '2026-04-16 07:02:05.809'),
(1289, 4, 4, 5, '2026-04-16 07:02:05.812', '2026-04-16 07:02:05.811'),
(1290, 1, 14, 5, '2026-04-16 07:02:05.814', '2026-04-16 07:02:05.814'),
(1291, 3, 13, 5, '2026-04-16 07:02:05.817', '2026-04-16 07:02:05.816'),
(1292, 2, 16, 5, '2026-04-16 07:02:05.819', '2026-04-16 07:02:05.819'),
(1293, 4, 11, 5, '2026-04-16 07:02:05.822', '2026-04-16 07:02:05.821'),
(1294, 1, 20, 6, '2026-04-16 07:02:05.824', '2026-04-16 07:02:05.823'),
(1295, 4, 10, 6, '2026-04-16 07:02:05.826', '2026-04-16 07:02:05.825'),
(1296, 5, 13, 6, '2026-04-16 07:02:05.828', '2026-04-16 07:02:05.827'),
(1297, 3, 8, 6, '2026-04-16 07:02:05.831', '2026-04-16 07:02:05.830'),
(1298, 1, 17, 6, '2026-04-16 07:02:05.833', '2026-04-16 07:02:05.832'),
(1299, 1, 19, 6, '2026-04-16 07:02:05.835', '2026-04-16 07:02:05.834'),
(1300, 2, 2, 6, '2026-04-16 07:02:05.837', '2026-04-16 07:02:05.836'),
(1301, 3, 5, 6, '2026-04-16 07:02:05.839', '2026-04-16 07:02:05.838'),
(1302, 1, 6, 6, '2026-04-16 07:02:05.841', '2026-04-16 07:02:05.841'),
(1303, 2, 4, 6, '2026-04-16 07:02:05.844', '2026-04-16 07:02:05.843'),
(1304, 5, 1, 6, '2026-04-16 07:02:05.846', '2026-04-16 07:02:05.845'),
(1305, 5, 11, 7, '2026-04-16 07:02:05.848', '2026-04-16 07:02:05.847'),
(1306, 3, 22, 7, '2026-04-16 07:02:05.850', '2026-04-16 07:02:05.849'),
(1307, 5, 14, 7, '2026-04-16 07:02:05.852', '2026-04-16 07:02:05.851'),
(1308, 4, 12, 7, '2026-04-16 07:02:05.854', '2026-04-16 07:02:05.853'),
(1309, 3, 20, 7, '2026-04-16 07:02:05.856', '2026-04-16 07:02:05.855'),
(1310, 4, 10, 7, '2026-04-16 07:02:05.858', '2026-04-16 07:02:05.857'),
(1311, 5, 1, 7, '2026-04-16 07:02:05.860', '2026-04-16 07:02:05.859'),
(1312, 3, 5, 7, '2026-04-16 07:02:05.862', '2026-04-16 07:02:05.861'),
(1313, 1, 19, 7, '2026-04-16 07:02:05.865', '2026-04-16 07:02:05.864'),
(1314, 1, 18, 7, '2026-04-16 07:02:05.867', '2026-04-16 07:02:05.867'),
(1315, 5, 9, 7, '2026-04-16 07:02:05.870', '2026-04-16 07:02:05.869'),
(1316, 3, 4, 7, '2026-04-16 07:02:05.872', '2026-04-16 07:02:05.871'),
(1317, 1, 2, 7, '2026-04-16 07:02:05.874', '2026-04-16 07:02:05.873'),
(1318, 5, 7, 7, '2026-04-16 07:02:05.876', '2026-04-16 07:02:05.875'),
(1319, 5, 6, 7, '2026-04-16 07:02:05.878', '2026-04-16 07:02:05.877'),
(1320, 3, 16, 7, '2026-04-16 07:02:05.880', '2026-04-16 07:02:05.879'),
(1321, 1, 17, 7, '2026-04-16 07:02:05.882', '2026-04-16 07:02:05.881'),
(1322, 5, 18, 8, '2026-04-16 07:02:05.884', '2026-04-16 07:02:05.883'),
(1323, 1, 12, 8, '2026-04-16 07:02:05.886', '2026-04-16 07:02:05.885'),
(1324, 1, 4, 8, '2026-04-16 07:02:05.888', '2026-04-16 07:02:05.887'),
(1325, 2, 14, 8, '2026-04-16 07:02:05.891', '2026-04-16 07:02:05.890'),
(1326, 2, 1, 8, '2026-04-16 07:02:05.894', '2026-04-16 07:02:05.893'),
(1327, 3, 19, 8, '2026-04-16 07:02:05.896', '2026-04-16 07:02:05.895'),
(1328, 5, 10, 8, '2026-04-16 07:02:05.898', '2026-04-16 07:02:05.897'),
(1329, 2, 22, 8, '2026-04-16 07:02:05.900', '2026-04-16 07:02:05.899'),
(1330, 3, 9, 8, '2026-04-16 07:02:05.902', '2026-04-16 07:02:05.901'),
(1331, 1, 8, 8, '2026-04-16 07:02:05.904', '2026-04-16 07:02:05.904'),
(1332, 5, 6, 8, '2026-04-16 07:02:05.906', '2026-04-16 07:02:05.906'),
(1333, 2, 5, 8, '2026-04-16 07:02:05.909', '2026-04-16 07:02:05.908'),
(1334, 1, 2, 8, '2026-04-16 07:02:05.911', '2026-04-16 07:02:05.910'),
(1335, 4, 16, 8, '2026-04-16 07:02:05.913', '2026-04-16 07:02:05.912'),
(1336, 4, 7, 8, '2026-04-16 07:02:05.915', '2026-04-16 07:02:05.914'),
(1337, 5, 13, 8, '2026-04-16 07:02:05.917', '2026-04-16 07:02:05.916'),
(1338, 2, 20, 8, '2026-04-16 07:02:05.919', '2026-04-16 07:02:05.918'),
(1339, 2, 11, 8, '2026-04-16 07:02:05.921', '2026-04-16 07:02:05.920'),
(1340, 5, 15, 8, '2026-04-16 07:02:05.923', '2026-04-16 07:02:05.922'),
(1341, 3, 16, 9, '2026-04-16 07:02:05.925', '2026-04-16 07:02:05.925'),
(1342, 1, 18, 9, '2026-04-16 07:02:05.927', '2026-04-16 07:02:05.927'),
(1343, 4, 11, 9, '2026-04-16 07:02:05.930', '2026-04-16 07:02:05.929'),
(1344, 3, 12, 9, '2026-04-16 07:02:05.932', '2026-04-16 07:02:05.931'),
(1345, 4, 17, 9, '2026-04-16 07:02:05.934', '2026-04-16 07:02:05.933'),
(1346, 2, 15, 9, '2026-04-16 07:02:05.936', '2026-04-16 07:02:05.935'),
(1347, 5, 5, 9, '2026-04-16 07:02:05.938', '2026-04-16 07:02:05.937'),
(1348, 1, 9, 9, '2026-04-16 07:02:05.940', '2026-04-16 07:02:05.940'),
(1349, 2, 4, 9, '2026-04-16 07:02:05.943', '2026-04-16 07:02:05.942'),
(1350, 1, 8, 9, '2026-04-16 07:02:05.944', '2026-04-16 07:02:05.944'),
(1351, 2, 6, 9, '2026-04-16 07:02:05.946', '2026-04-16 07:02:05.946'),
(1352, 1, 20, 9, '2026-04-16 07:02:05.948', '2026-04-16 07:02:05.947'),
(1353, 5, 19, 9, '2026-04-16 07:02:05.950', '2026-04-16 07:02:05.949'),
(1354, 3, 2, 9, '2026-04-16 07:02:05.952', '2026-04-16 07:02:05.951'),
(1355, 2, 7, 9, '2026-04-16 07:02:05.954', '2026-04-16 07:02:05.953'),
(1356, 3, 14, 9, '2026-04-16 07:02:05.957', '2026-04-16 07:02:05.956'),
(1357, 2, 13, 9, '2026-04-16 07:02:05.959', '2026-04-16 07:02:05.958'),
(1358, 2, 17, 10, '2026-04-16 07:02:05.961', '2026-04-16 07:02:05.960'),
(1359, 1, 1, 10, '2026-04-16 07:02:05.963', '2026-04-16 07:02:05.963'),
(1360, 4, 14, 10, '2026-04-16 07:02:05.966', '2026-04-16 07:02:05.965'),
(1361, 1, 9, 10, '2026-04-16 07:02:05.968', '2026-04-16 07:02:05.967'),
(1362, 1, 4, 10, '2026-04-16 07:02:05.971', '2026-04-16 07:02:05.970'),
(1363, 2, 19, 10, '2026-04-16 07:02:05.973', '2026-04-16 07:02:05.972'),
(1364, 2, 6, 10, '2026-04-16 07:02:05.975', '2026-04-16 07:02:05.974'),
(1365, 4, 22, 10, '2026-04-16 07:02:05.978', '2026-04-16 07:02:05.977'),
(1366, 3, 5, 10, '2026-04-16 07:02:05.980', '2026-04-16 07:02:05.979'),
(1367, 3, 8, 10, '2026-04-16 07:02:05.982', '2026-04-16 07:02:05.981'),
(1368, 3, 13, 10, '2026-04-16 07:02:05.984', '2026-04-16 07:02:05.984'),
(1369, 3, 20, 10, '2026-04-16 07:02:05.986', '2026-04-16 07:02:05.986'),
(1370, 4, 7, 10, '2026-04-16 07:02:05.988', '2026-04-16 07:02:05.988'),
(1371, 3, 12, 10, '2026-04-16 07:02:05.991', '2026-04-16 07:02:05.990'),
(1372, 3, 15, 10, '2026-04-16 07:02:05.993', '2026-04-16 07:02:05.992'),
(1373, 3, 16, 10, '2026-04-16 07:02:05.995', '2026-04-16 07:02:05.994'),
(1374, 1, 18, 10, '2026-04-16 07:02:05.997', '2026-04-16 07:02:05.996'),
(1375, 1, 1, 11, '2026-04-16 07:02:05.999', '2026-04-16 07:02:05.998'),
(1376, 4, 7, 11, '2026-04-16 07:02:06.002', '2026-04-16 07:02:06.001'),
(1377, 2, 20, 11, '2026-04-16 07:02:06.004', '2026-04-16 07:02:06.003'),
(1378, 4, 22, 11, '2026-04-16 07:02:06.006', '2026-04-16 07:02:06.005'),
(1379, 5, 5, 11, '2026-04-16 07:02:06.008', '2026-04-16 07:02:06.008'),
(1380, 1, 11, 11, '2026-04-16 07:02:06.011', '2026-04-16 07:02:06.010'),
(1381, 1, 9, 11, '2026-04-16 07:02:06.013', '2026-04-16 07:02:06.012'),
(1382, 4, 17, 11, '2026-04-16 07:02:06.015', '2026-04-16 07:02:06.014'),
(1383, 3, 18, 11, '2026-04-16 07:02:06.017', '2026-04-16 07:02:06.016'),
(1384, 1, 12, 11, '2026-04-16 07:02:06.019', '2026-04-16 07:02:06.018'),
(1385, 2, 15, 11, '2026-04-16 07:02:06.022', '2026-04-16 07:02:06.021'),
(1386, 5, 14, 11, '2026-04-16 07:02:06.024', '2026-04-16 07:02:06.023'),
(1387, 2, 10, 11, '2026-04-16 07:02:06.026', '2026-04-16 07:02:06.025'),
(1388, 3, 13, 11, '2026-04-16 07:02:06.028', '2026-04-16 07:02:06.027'),
(1389, 1, 8, 11, '2026-04-16 07:02:06.030', '2026-04-16 07:02:06.030'),
(1390, 3, 2, 11, '2026-04-16 07:02:06.033', '2026-04-16 07:02:06.032'),
(1391, 2, 6, 11, '2026-04-16 07:02:06.035', '2026-04-16 07:02:06.034'),
(1392, 2, 16, 11, '2026-04-16 07:02:06.037', '2026-04-16 07:02:06.036'),
(1393, 4, 4, 11, '2026-04-16 07:02:06.039', '2026-04-16 07:02:06.038'),
(1394, 2, 14, 12, '2026-04-16 07:02:06.042', '2026-04-16 07:02:06.041'),
(1395, 2, 12, 12, '2026-04-16 07:02:06.044', '2026-04-16 07:02:06.043'),
(1396, 3, 5, 12, '2026-04-16 07:02:06.046', '2026-04-16 07:02:06.045'),
(1397, 1, 13, 12, '2026-04-16 07:02:06.049', '2026-04-16 07:02:06.048'),
(1398, 5, 1, 12, '2026-04-16 07:02:06.051', '2026-04-16 07:02:06.050'),
(1399, 4, 7, 12, '2026-04-16 07:02:06.053', '2026-04-16 07:02:06.052'),
(1400, 2, 4, 12, '2026-04-16 07:02:06.055', '2026-04-16 07:02:06.054'),
(1401, 4, 16, 12, '2026-04-16 07:02:06.057', '2026-04-16 07:02:06.056'),
(1402, 2, 8, 12, '2026-04-16 07:02:06.060', '2026-04-16 07:02:06.059'),
(1403, 1, 19, 12, '2026-04-16 07:02:06.062', '2026-04-16 07:02:06.061'),
(1404, 4, 20, 12, '2026-04-16 07:02:06.065', '2026-04-16 07:02:06.064'),
(1405, 5, 17, 12, '2026-04-16 07:02:06.067', '2026-04-16 07:02:06.066'),
(1406, 3, 15, 12, '2026-04-16 07:02:06.069', '2026-04-16 07:02:06.068'),
(1407, 5, 10, 12, '2026-04-16 07:02:06.071', '2026-04-16 07:02:06.070'),
(1408, 1, 11, 12, '2026-04-16 07:02:06.074', '2026-04-16 07:02:06.073'),
(1409, 2, 22, 12, '2026-04-16 07:02:06.076', '2026-04-16 07:02:06.075'),
(1410, 3, 2, 12, '2026-04-16 07:02:06.078', '2026-04-16 07:02:06.077'),
(1411, 1, 20, 13, '2026-04-16 07:02:06.080', '2026-04-16 07:02:06.080'),
(1412, 5, 12, 13, '2026-04-16 07:02:06.083', '2026-04-16 07:02:06.082'),
(1413, 2, 14, 13, '2026-04-16 07:02:06.086', '2026-04-16 07:02:06.085'),
(1414, 3, 13, 13, '2026-04-16 07:02:06.088', '2026-04-16 07:02:06.087'),
(1415, 2, 18, 13, '2026-04-16 07:02:06.091', '2026-04-16 07:02:06.090'),
(1416, 3, 7, 13, '2026-04-16 07:02:06.095', '2026-04-16 07:02:06.094'),
(1417, 3, 10, 13, '2026-04-16 07:02:06.098', '2026-04-16 07:02:06.097'),
(1418, 2, 9, 13, '2026-04-16 07:02:06.101', '2026-04-16 07:02:06.100'),
(1419, 3, 17, 13, '2026-04-16 07:02:06.104', '2026-04-16 07:02:06.103'),
(1420, 3, 2, 13, '2026-04-16 07:02:06.107', '2026-04-16 07:02:06.106'),
(1421, 5, 15, 13, '2026-04-16 07:02:06.109', '2026-04-16 07:02:06.108'),
(1422, 4, 1, 13, '2026-04-16 07:02:06.112', '2026-04-16 07:02:06.111'),
(1423, 1, 4, 13, '2026-04-16 07:02:06.114', '2026-04-16 07:02:06.113'),
(1424, 2, 20, 14, '2026-04-16 07:02:06.116', '2026-04-16 07:02:06.115'),
(1425, 4, 12, 14, '2026-04-16 07:02:06.119', '2026-04-16 07:02:06.118'),
(1426, 5, 5, 14, '2026-04-16 07:02:06.121', '2026-04-16 07:02:06.120'),
(1427, 2, 16, 14, '2026-04-16 07:02:06.123', '2026-04-16 07:02:06.123'),
(1428, 2, 7, 14, '2026-04-16 07:02:06.126', '2026-04-16 07:02:06.125'),
(1429, 5, 2, 14, '2026-04-16 07:02:06.128', '2026-04-16 07:02:06.127'),
(1430, 2, 11, 14, '2026-04-16 07:02:06.131', '2026-04-16 07:02:06.130'),
(1431, 5, 9, 14, '2026-04-16 07:02:06.133', '2026-04-16 07:02:06.132'),
(1432, 4, 14, 14, '2026-04-16 07:02:06.135', '2026-04-16 07:02:06.134'),
(1433, 5, 13, 14, '2026-04-16 07:02:06.138', '2026-04-16 07:02:06.137'),
(1434, 3, 4, 14, '2026-04-16 07:02:06.140', '2026-04-16 07:02:06.139'),
(1435, 5, 17, 14, '2026-04-16 07:02:06.143', '2026-04-16 07:02:06.142'),
(1436, 5, 14, 15, '2026-04-16 07:02:06.145', '2026-04-16 07:02:06.144'),
(1437, 3, 17, 15, '2026-04-16 07:02:06.148', '2026-04-16 07:02:06.147'),
(1438, 5, 1, 15, '2026-04-16 07:02:06.150', '2026-04-16 07:02:06.149'),
(1439, 2, 2, 15, '2026-04-16 07:02:06.152', '2026-04-16 07:02:06.151'),
(1440, 2, 4, 15, '2026-04-16 07:02:06.154', '2026-04-16 07:02:06.153'),
(1441, 3, 7, 15, '2026-04-16 07:02:06.157', '2026-04-16 07:02:06.156'),
(1442, 3, 16, 15, '2026-04-16 07:02:06.159', '2026-04-16 07:02:06.158'),
(1443, 3, 11, 15, '2026-04-16 07:02:06.162', '2026-04-16 07:02:06.161'),
(1444, 2, 5, 15, '2026-04-16 07:02:06.165', '2026-04-16 07:02:06.164'),
(1445, 2, 8, 15, '2026-04-16 07:02:06.167', '2026-04-16 07:02:06.167'),
(1446, 1, 12, 15, '2026-04-16 07:02:06.170', '2026-04-16 07:02:06.169'),
(1447, 4, 22, 15, '2026-04-16 07:02:06.173', '2026-04-16 07:02:06.173'),
(1448, 1, 10, 15, '2026-04-16 07:02:06.177', '2026-04-16 07:02:06.176'),
(1449, 4, 18, 15, '2026-04-16 07:02:06.181', '2026-04-16 07:02:06.180'),
(1450, 1, 6, 15, '2026-04-16 07:02:06.185', '2026-04-16 07:02:06.184'),
(1451, 3, 20, 15, '2026-04-16 07:02:06.189', '2026-04-16 07:02:06.188'),
(1452, 5, 13, 15, '2026-04-16 07:02:06.192', '2026-04-16 07:02:06.191'),
(1453, 5, 2, 16, '2026-04-16 07:02:06.196', '2026-04-16 07:02:06.195'),
(1454, 2, 16, 16, '2026-04-16 07:02:06.199', '2026-04-16 07:02:06.198'),
(1455, 2, 13, 16, '2026-04-16 07:02:06.202', '2026-04-16 07:02:06.201'),
(1456, 4, 14, 16, '2026-04-16 07:02:06.204', '2026-04-16 07:02:06.203'),
(1457, 1, 20, 16, '2026-04-16 07:02:06.207', '2026-04-16 07:02:06.206'),
(1458, 1, 10, 16, '2026-04-16 07:02:06.210', '2026-04-16 07:02:06.209'),
(1459, 4, 18, 16, '2026-04-16 07:02:06.213', '2026-04-16 07:02:06.212'),
(1460, 4, 15, 16, '2026-04-16 07:02:06.216', '2026-04-16 07:02:06.215'),
(1461, 1, 9, 16, '2026-04-16 07:02:06.219', '2026-04-16 07:02:06.218'),
(1462, 3, 12, 16, '2026-04-16 07:02:06.221', '2026-04-16 07:02:06.220'),
(1463, 4, 17, 16, '2026-04-16 07:02:06.223', '2026-04-16 07:02:06.222'),
(1464, 3, 16, 17, '2026-04-16 07:02:06.225', '2026-04-16 07:02:06.224'),
(1465, 4, 15, 17, '2026-04-16 07:02:06.228', '2026-04-16 07:02:06.227'),
(1466, 2, 8, 17, '2026-04-16 07:02:06.230', '2026-04-16 07:02:06.229'),
(1467, 3, 6, 17, '2026-04-16 07:02:06.232', '2026-04-16 07:02:06.231'),
(1468, 2, 17, 17, '2026-04-16 07:02:06.234', '2026-04-16 07:02:06.233'),
(1469, 3, 10, 17, '2026-04-16 07:02:06.236', '2026-04-16 07:02:06.235'),
(1470, 1, 14, 17, '2026-04-16 07:02:06.238', '2026-04-16 07:02:06.237'),
(1471, 4, 20, 17, '2026-04-16 07:02:06.240', '2026-04-16 07:02:06.239'),
(1472, 5, 9, 17, '2026-04-16 07:02:06.242', '2026-04-16 07:02:06.242'),
(1473, 2, 19, 17, '2026-04-16 07:02:06.245', '2026-04-16 07:02:06.244'),
(1474, 4, 12, 18, '2026-04-16 07:02:06.247', '2026-04-16 07:02:06.246'),
(1475, 3, 16, 18, '2026-04-16 07:02:06.250', '2026-04-16 07:02:06.249'),
(1476, 1, 15, 18, '2026-04-16 07:02:06.252', '2026-04-16 07:02:06.251'),
(1477, 5, 2, 18, '2026-04-16 07:02:06.254', '2026-04-16 07:02:06.253'),
(1478, 4, 14, 18, '2026-04-16 07:02:06.256', '2026-04-16 07:02:06.255'),
(1479, 4, 22, 18, '2026-04-16 07:02:06.258', '2026-04-16 07:02:06.258'),
(1480, 5, 9, 18, '2026-04-16 07:02:06.261', '2026-04-16 07:02:06.260'),
(1481, 3, 7, 18, '2026-04-16 07:02:06.263', '2026-04-16 07:02:06.262'),
(1482, 5, 1, 18, '2026-04-16 07:02:06.265', '2026-04-16 07:02:06.265'),
(1483, 3, 13, 18, '2026-04-16 07:02:06.267', '2026-04-16 07:02:06.267'),
(1484, 1, 19, 18, '2026-04-16 07:02:06.269', '2026-04-16 07:02:06.269'),
(1485, 5, 11, 18, '2026-04-16 07:02:06.271', '2026-04-16 07:02:06.270'),
(1486, 1, 16, 19, '2026-04-16 07:02:06.273', '2026-04-16 07:02:06.273'),
(1487, 4, 12, 19, '2026-04-16 07:02:06.275', '2026-04-16 07:02:06.274'),
(1488, 3, 20, 19, '2026-04-16 07:02:06.278', '2026-04-16 07:02:06.277'),
(1489, 3, 17, 19, '2026-04-16 07:02:06.280', '2026-04-16 07:02:06.279'),
(1490, 1, 14, 19, '2026-04-16 07:02:06.283', '2026-04-16 07:02:06.282'),
(1491, 2, 22, 19, '2026-04-16 07:02:06.285', '2026-04-16 07:02:06.284'),
(1492, 1, 9, 19, '2026-04-16 07:02:06.287', '2026-04-16 07:02:06.286'),
(1493, 4, 10, 19, '2026-04-16 07:02:06.289', '2026-04-16 07:02:06.288'),
(1494, 5, 15, 19, '2026-04-16 07:02:06.292', '2026-04-16 07:02:06.291'),
(1495, 3, 11, 19, '2026-04-16 07:02:06.294', '2026-04-16 07:02:06.293'),
(1496, 4, 4, 19, '2026-04-16 07:02:06.296', '2026-04-16 07:02:06.295'),
(1497, 1, 1, 19, '2026-04-16 07:02:06.299', '2026-04-16 07:02:06.298'),
(1498, 1, 18, 19, '2026-04-16 07:02:06.301', '2026-04-16 07:02:06.300'),
(1499, 3, 13, 19, '2026-04-16 07:02:06.303', '2026-04-16 07:02:06.302'),
(1500, 1, 2, 19, '2026-04-16 07:02:06.305', '2026-04-16 07:02:06.304'),
(1501, 3, 7, 19, '2026-04-16 07:02:06.307', '2026-04-16 07:02:06.306'),
(1502, 3, 19, 19, '2026-04-16 07:02:06.309', '2026-04-16 07:02:06.308'),
(1503, 2, 8, 19, '2026-04-16 07:02:06.312', '2026-04-16 07:02:06.311'),
(1504, 3, 16, 20, '2026-04-16 07:02:06.314', '2026-04-16 07:02:06.313'),
(1505, 1, 10, 20, '2026-04-16 07:02:06.317', '2026-04-16 07:02:06.316'),
(1506, 2, 6, 20, '2026-04-16 07:02:06.319', '2026-04-16 07:02:06.319'),
(1507, 4, 20, 20, '2026-04-16 07:02:06.322', '2026-04-16 07:02:06.321'),
(1508, 1, 2, 20, '2026-04-16 07:02:06.325', '2026-04-16 07:02:06.324'),
(1509, 2, 8, 20, '2026-04-16 07:02:06.328', '2026-04-16 07:02:06.327'),
(1510, 1, 11, 20, '2026-04-16 07:02:06.330', '2026-04-16 07:02:06.330'),
(1511, 2, 7, 20, '2026-04-16 07:02:06.333', '2026-04-16 07:02:06.332'),
(1512, 2, 22, 20, '2026-04-16 07:02:06.336', '2026-04-16 07:02:06.335'),
(1513, 5, 9, 20, '2026-04-16 07:02:06.338', '2026-04-16 07:02:06.338'),
(1514, 4, 5, 20, '2026-04-16 07:02:06.341', '2026-04-16 07:02:06.340'),
(1515, 1, 13, 20, '2026-04-16 07:02:06.343', '2026-04-16 07:02:06.342'),
(1516, 2, 19, 20, '2026-04-16 07:02:06.346', '2026-04-16 07:02:06.345'),
(1517, 1, 1, 20, '2026-04-16 07:02:06.348', '2026-04-16 07:02:06.347'),
(1518, 3, 12, 20, '2026-04-16 07:02:06.350', '2026-04-16 07:02:06.349'),
(1519, 2, 14, 20, '2026-04-16 07:02:06.352', '2026-04-16 07:02:06.351'),
(1520, 5, 18, 20, '2026-04-16 07:02:06.354', '2026-04-16 07:02:06.354'),
(1521, 3, 15, 20, '2026-04-16 07:02:06.356', '2026-04-16 07:02:06.356'),
(1522, 5, 22, 1, '2026-04-16 12:10:12.054', '2026-04-16 12:10:12.050');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `passwordHash` varchar(191) NOT NULL,
  `steamId` varchar(191) DEFAULT NULL,
  `role` enum('USER','DEVELOPER','ADMIN') NOT NULL DEFAULT 'USER',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `passwordHash`, `steamId`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', 'admin@indiebackseat.hu', '$2b$10$XDBVp0uKC8Va5Orraqjt2OiWWkpmRoLiP8xk6q6oRbyWWKAf.O6Lq', '76561198274350601', 'ADMIN', '2026-04-14 08:57:35.764', '2026-04-18 15:06:12.824'),
(2, 'developer', 'developer@indiebackseat.hu', '$2b$10$azBBTYHuDB6jhOQtrluA2ecLO7G3Ks4GSKN43gH/kECFge5QFbjjO', NULL, 'DEVELOPER', '2026-04-14 08:57:35.840', '2026-04-16 07:02:05.483'),
(4, 'user4', 'user4@indiebackseat.hu', 'dummy', NULL, 'USER', '2026-04-14 08:57:35.986', '2026-04-14 08:57:35.985'),
(5, 'user6', 'user6@indiebackseat.hu', 'dummy', NULL, 'USER', '2026-04-14 08:57:35.988', '2026-04-14 08:57:35.987'),
(6, 'user8', 'user8@indiebackseat.hu', 'dummy', NULL, 'USER', '2026-04-14 08:57:35.991', '2026-04-14 08:57:35.990'),
(7, 'user10', 'user10@indiebackseat.hu', 'dummy', NULL, 'USER', '2026-04-14 08:57:35.993', '2026-04-14 08:57:35.992'),
(8, 'user12', 'user12@indiebackseat.hu', 'dummy', NULL, 'USER', '2026-04-14 08:57:35.995', '2026-04-14 08:57:35.994'),
(9, 'user14', 'user14@indiebackseat.hu', 'dummy', NULL, 'USER', '2026-04-14 08:57:35.998', '2026-04-14 08:57:35.997'),
(10, 'user16', 'user16@indiebackseat.hu', 'dummy', NULL, 'USER', '2026-04-14 08:57:36.001', '2026-04-14 08:57:36.000'),
(11, 'user18', 'user18@indiebackseat.hu', 'dummy', NULL, 'USER', '2026-04-14 08:57:36.003', '2026-04-14 08:57:36.002'),
(12, 'user20', 'user20@indiebackseat.hu', 'dummy', NULL, 'USER', '2026-04-14 08:57:36.006', '2026-04-14 08:57:36.004'),
(13, 'user22', 'user22@indiebackseat.hu', 'dummy', NULL, 'USER', '2026-04-14 08:57:36.007', '2026-04-14 08:57:36.006'),
(14, 'user24', 'user24@indiebackseat.hu', 'dummy', NULL, 'USER', '2026-04-14 08:57:36.010', '2026-04-14 08:57:36.008'),
(15, 'user26', 'user26@indiebackseat.hu', 'dummy', NULL, 'USER', '2026-04-14 08:57:36.011', '2026-04-14 08:57:36.010'),
(16, 'user28', 'user28@indiebackseat.hu', 'dummy', NULL, 'USER', '2026-04-14 08:57:36.013', '2026-04-14 08:57:36.012'),
(17, 'user30', 'user30@indiebackseat.hu', 'dummy', NULL, 'USER', '2026-04-14 08:57:36.017', '2026-04-14 08:57:36.015'),
(18, 'user32', 'user32@indiebackseat.hu', 'dummy', NULL, 'USER', '2026-04-14 08:57:36.019', '2026-04-14 08:57:36.018'),
(19, 'user34', 'user34@indiebackseat.hu', 'dummy', NULL, 'USER', '2026-04-14 08:57:36.021', '2026-04-14 08:57:36.020'),
(20, 'user36', 'user36@indiebackseat.hu', 'dummy', NULL, 'USER', '2026-04-14 08:57:36.023', '2026-04-14 08:57:36.022'),
(22, 'mate', 'galganmate@indiebackseat.hu', '$2b$10$82MBVc0a6Am1/Hqouv0mdebauA8zP79q5RChDKkICGCqPqu6fLwMG', NULL, 'DEVELOPER', '2026-04-16 06:50:03.640', '2026-04-16 07:02:05.544'),
(23, 'bela', 'as@kdasd.com', '$2b$10$y/br4/DRf7IHsHRdurMrIuOW.qGu9l0Ws13w6uzWL.K2VioKwWx3.', NULL, 'USER', '2026-04-16 07:10:02.312', '2026-04-16 07:10:02.311'),
(24, 'johndoe', 'johndoe@example.com', '$2b$10$bLPAyCU.ZtPQfdzfTC/e0uOBxUY9RVDwEDWqHIGgzS4I9tFfzplGi', NULL, 'USER', '2026-04-16 08:08:55.378', '2026-04-16 08:08:55.376'),
(25, 'adsad', 'ads@ad.com', '$2b$10$l9JVILfQuisRYBK3dl2PfebJyithdew1xtA3TSpyt9ZEXCM8uKo42', NULL, 'USER', '2026-04-16 12:20:54.101', '2026-04-16 12:20:54.099');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Comment_gameId_fkey` (`gameId`),
  ADD KEY `Comment_userId_fkey` (`userId`);

--
-- A tábla indexei `commentvote`
--
ALTER TABLE `commentvote`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `CommentVote_userId_commentId_key` (`userId`,`commentId`),
  ADD KEY `CommentVote_commentId_fkey` (`commentId`);

--
-- A tábla indexei `devlogentry`
--
ALTER TABLE `devlogentry`
  ADD PRIMARY KEY (`id`),
  ADD KEY `DevLogEntry_projectId_fkey` (`projectId`);

--
-- A tábla indexei `devproject`
--
ALTER TABLE `devproject`
  ADD PRIMARY KEY (`id`),
  ADD KEY `DevProject_developerId_fkey` (`developerId`);

--
-- A tábla indexei `devprojectfavorite`
--
ALTER TABLE `devprojectfavorite`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `devprojectfavorite_userId_projectId_key` (`userId`,`projectId`),
  ADD KEY `devprojectfavorite_projectId_fkey` (`projectId`);

--
-- A tábla indexei `devprojectwishlist`
--
ALTER TABLE `devprojectwishlist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `devprojectwishlist_userId_projectId_key` (`userId`,`projectId`),
  ADD KEY `devprojectwishlist_projectId_fkey` (`projectId`);

--
-- A tábla indexei `game`
--
ALTER TABLE `game`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Game_sequenceNumber_key` (`sequenceNumber`),
  ADD UNIQUE KEY `Game_commentId_key` (`commentId`);

--
-- A tábla indexei `gamelist`
--
ALTER TABLE `gamelist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `GameList_userId_fkey` (`userId`);

--
-- A tábla indexei `gamelistitem`
--
ALTER TABLE `gamelistitem`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `GameListItem_gameListId_gameId_key` (`gameListId`,`gameId`),
  ADD KEY `GameListItem_gameId_fkey` (`gameId`);

--
-- A tábla indexei `gamelistitemgallery`
--
ALTER TABLE `gamelistitemgallery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `GameListItemGallery_gameListItemId_fkey` (`gameListItemId`);

--
-- A tábla indexei `rating`
--
ALTER TABLE `rating`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Rating_userId_gameId_key` (`userId`,`gameId`),
  ADD KEY `Rating_gameId_fkey` (`gameId`);

--
-- A tábla indexei `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_username_key` (`username`),
  ADD UNIQUE KEY `User_email_key` (`email`),
  ADD UNIQUE KEY `User_steamId_key` (`steamId`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT a táblához `commentvote`
--
ALTER TABLE `commentvote`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `devlogentry`
--
ALTER TABLE `devlogentry`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT a táblához `devproject`
--
ALTER TABLE `devproject`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT a táblához `devprojectfavorite`
--
ALTER TABLE `devprojectfavorite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `devprojectwishlist`
--
ALTER TABLE `devprojectwishlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT a táblához `game`
--
ALTER TABLE `game`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT a táblához `gamelist`
--
ALTER TABLE `gamelist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT a táblához `gamelistitem`
--
ALTER TABLE `gamelistitem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT a táblához `gamelistitemgallery`
--
ALTER TABLE `gamelistitemgallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `rating`
--
ALTER TABLE `rating`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1523;

--
-- AUTO_INCREMENT a táblához `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `Comment_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `game` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `commentvote`
--
ALTER TABLE `commentvote`
  ADD CONSTRAINT `CommentVote_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `comment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `CommentVote_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `devlogentry`
--
ALTER TABLE `devlogentry`
  ADD CONSTRAINT `DevLogEntry_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `devproject` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `devproject`
--
ALTER TABLE `devproject`
  ADD CONSTRAINT `DevProject_developerId_fkey` FOREIGN KEY (`developerId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `devprojectfavorite`
--
ALTER TABLE `devprojectfavorite`
  ADD CONSTRAINT `devprojectfavorite_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `devproject` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `devprojectfavorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `devprojectwishlist`
--
ALTER TABLE `devprojectwishlist`
  ADD CONSTRAINT `devprojectwishlist_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `devproject` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `devprojectwishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `gamelist`
--
ALTER TABLE `gamelist`
  ADD CONSTRAINT `GameList_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `gamelistitem`
--
ALTER TABLE `gamelistitem`
  ADD CONSTRAINT `GameListItem_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `game` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `GameListItem_gameListId_fkey` FOREIGN KEY (`gameListId`) REFERENCES `gamelist` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `gamelistitemgallery`
--
ALTER TABLE `gamelistitemgallery`
  ADD CONSTRAINT `GameListItemGallery_gameListItemId_fkey` FOREIGN KEY (`gameListItemId`) REFERENCES `gamelistitem` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `rating`
--
ALTER TABLE `rating`
  ADD CONSTRAINT `Rating_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `game` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Rating_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
