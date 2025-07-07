/*
  Warnings:

  - A unique constraint covering the columns `[title,category_id]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Post_title_category_id_key" ON "Post"("title", "category_id");
