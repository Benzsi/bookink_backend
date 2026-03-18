/*
  Warnings:

  - The values [VALLÁSI_IRAT,EPOSZ,REGÉNY,TRAGÉDIA,VÍGJÁTÉK] on the enum `Book_genre` will be removed. If these variants are still used in the database, this will fail.
  - The values [EPIKA,DRÁMA,LIRIKA] on the enum `Book_literaryForm` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `book` MODIFY `genre` ENUM('ACTION', 'PUZZLE', 'RPG', 'PLATFORMER', 'HORROR', 'ADVENTURE', 'SANDBOX') NOT NULL,
    MODIFY `literaryForm` ENUM('SINGLE_PLAYER', 'MULTIPLAYER', 'CO_OP') NOT NULL;

-- CreateTable
CREATE TABLE `BookList` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookListItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookListId` INTEGER NOT NULL,
    `bookId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `BookListItem_bookListId_bookId_key`(`bookListId`, `bookId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BookList` ADD CONSTRAINT `BookList_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookListItem` ADD CONSTRAINT `BookListItem_bookListId_fkey` FOREIGN KEY (`bookListId`) REFERENCES `BookList`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookListItem` ADD CONSTRAINT `BookListItem_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
