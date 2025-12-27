/*
  Warnings:

  - The primary key for the `sys_dept` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sys_menu` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sys_post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sys_role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sys_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `updateTime` on table `sys_menu` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createTime` on table `sys_role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updateTime` on table `sys_role` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `_sys_dept_to_sys_role` DROP FOREIGN KEY `_sys_dept_to_sys_role_A_fkey`;

-- DropForeignKey
ALTER TABLE `_sys_dept_to_sys_role` DROP FOREIGN KEY `_sys_dept_to_sys_role_B_fkey`;

-- DropForeignKey
ALTER TABLE `_sys_menu_to_sys_role` DROP FOREIGN KEY `_sys_menu_to_sys_role_A_fkey`;

-- DropForeignKey
ALTER TABLE `_sys_menu_to_sys_role` DROP FOREIGN KEY `_sys_menu_to_sys_role_B_fkey`;

-- DropForeignKey
ALTER TABLE `_sys_post_to_sys_user` DROP FOREIGN KEY `_sys_post_to_sys_user_A_fkey`;

-- DropForeignKey
ALTER TABLE `_sys_post_to_sys_user` DROP FOREIGN KEY `_sys_post_to_sys_user_B_fkey`;

-- DropForeignKey
ALTER TABLE `_sys_role_to_sys_user` DROP FOREIGN KEY `_sys_role_to_sys_user_A_fkey`;

-- DropForeignKey
ALTER TABLE `_sys_role_to_sys_user` DROP FOREIGN KEY `_sys_role_to_sys_user_B_fkey`;

-- DropForeignKey
ALTER TABLE `sys_dept` DROP FOREIGN KEY `sys_dept_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `sys_menu` DROP FOREIGN KEY `sys_menu_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `sys_user` DROP FOREIGN KEY `sys_user_deptId_fkey`;

-- DropIndex
DROP INDEX `sys_dept_parentId_fkey` ON `sys_dept`;

-- DropIndex
DROP INDEX `sys_menu_parentId_fkey` ON `sys_menu`;

-- AlterTable
ALTER TABLE `_sys_dept_to_sys_role` MODIFY `A` CHAR(36) NOT NULL,
    MODIFY `B` CHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `_sys_menu_to_sys_role` MODIFY `A` CHAR(36) NOT NULL,
    MODIFY `B` CHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `_sys_post_to_sys_user` MODIFY `A` CHAR(36) NOT NULL,
    MODIFY `B` CHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `_sys_role_to_sys_user` MODIFY `A` CHAR(36) NOT NULL,
    MODIFY `B` CHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `sys_dept` DROP PRIMARY KEY,
    MODIFY `deptId` CHAR(36) NOT NULL,
    MODIFY `parentId` CHAR(36) NULL,
    MODIFY `createTime` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD PRIMARY KEY (`deptId`);

-- AlterTable
ALTER TABLE `sys_menu` DROP PRIMARY KEY,
    MODIFY `menuId` CHAR(36) NOT NULL,
    MODIFY `parentId` CHAR(36) NULL,
    MODIFY `createTime` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updateTime` DATETIME(3) NOT NULL,
    ADD PRIMARY KEY (`menuId`);

-- AlterTable
ALTER TABLE `sys_post` DROP PRIMARY KEY,
    MODIFY `postId` CHAR(36) NOT NULL,
    MODIFY `createTime` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD PRIMARY KEY (`postId`);

-- AlterTable
ALTER TABLE `sys_role` DROP PRIMARY KEY,
    MODIFY `roleId` CHAR(36) NOT NULL,
    MODIFY `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updateTime` DATETIME(3) NOT NULL,
    ADD PRIMARY KEY (`roleId`);

-- AlterTable
ALTER TABLE `sys_user` DROP PRIMARY KEY,
    MODIFY `userId` CHAR(36) NOT NULL,
    MODIFY `deptId` CHAR(36) NULL,
    ADD PRIMARY KEY (`userId`);

-- AddForeignKey
ALTER TABLE `sys_user` ADD CONSTRAINT `sys_user_deptId_fkey` FOREIGN KEY (`deptId`) REFERENCES `sys_dept`(`deptId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_menu` ADD CONSTRAINT `sys_menu_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `sys_menu`(`menuId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_dept` ADD CONSTRAINT `sys_dept_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `sys_dept`(`deptId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_sys_role_to_sys_user` ADD CONSTRAINT `_sys_role_to_sys_user_A_fkey` FOREIGN KEY (`A`) REFERENCES `sys_role`(`roleId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_sys_role_to_sys_user` ADD CONSTRAINT `_sys_role_to_sys_user_B_fkey` FOREIGN KEY (`B`) REFERENCES `sys_user`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_sys_menu_to_sys_role` ADD CONSTRAINT `_sys_menu_to_sys_role_A_fkey` FOREIGN KEY (`A`) REFERENCES `sys_menu`(`menuId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_sys_menu_to_sys_role` ADD CONSTRAINT `_sys_menu_to_sys_role_B_fkey` FOREIGN KEY (`B`) REFERENCES `sys_role`(`roleId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_sys_dept_to_sys_role` ADD CONSTRAINT `_sys_dept_to_sys_role_A_fkey` FOREIGN KEY (`A`) REFERENCES `sys_dept`(`deptId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_sys_dept_to_sys_role` ADD CONSTRAINT `_sys_dept_to_sys_role_B_fkey` FOREIGN KEY (`B`) REFERENCES `sys_role`(`roleId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_sys_post_to_sys_user` ADD CONSTRAINT `_sys_post_to_sys_user_A_fkey` FOREIGN KEY (`A`) REFERENCES `sys_post`(`postId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_sys_post_to_sys_user` ADD CONSTRAINT `_sys_post_to_sys_user_B_fkey` FOREIGN KEY (`B`) REFERENCES `sys_user`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
