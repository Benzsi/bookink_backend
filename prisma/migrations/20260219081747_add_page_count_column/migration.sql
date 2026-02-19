/*
  Warnings:

  - Added the required column `pageCount` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `book` ADD COLUMN `pageCount` INTEGER NOT NULL;
