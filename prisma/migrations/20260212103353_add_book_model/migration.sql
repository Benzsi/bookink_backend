-- CreateTable
CREATE TABLE `Book` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sequenceNumber` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `coverUrl` VARCHAR(191) NULL,
    `commentId` INTEGER NULL,
    `rating` INTEGER NULL,
    `genre` ENUM('VALLÁSI_IRAT', 'EPOSZ', 'REGÉNY', 'TRAGÉDIA', 'VÍGJÁTÉK') NOT NULL,
    `literaryForm` ENUM('EPIKA', 'DRÁMA', 'LIRIKA') NOT NULL,
    `lyricNote` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Book_sequenceNumber_key`(`sequenceNumber`),
    UNIQUE INDEX `Book_commentId_key`(`commentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
