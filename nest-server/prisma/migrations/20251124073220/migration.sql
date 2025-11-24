-- CreateTable
CREATE TABLE `sys_user` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `avatar` VARCHAR(100) NULL DEFAULT '',
    `createBy` VARCHAR(64) NULL DEFAULT '',
    `createTime` DATETIME(3) NULL,
    `delFlag` CHAR(1) NULL DEFAULT '0',
    `deptId` INTEGER NULL,
    `email` VARCHAR(50) NULL DEFAULT '',
    `loginDate` DATETIME(3) NULL,
    `loginIp` VARCHAR(128) NULL DEFAULT '',
    `nickName` VARCHAR(30) NOT NULL,
    `password` VARCHAR(100) NULL DEFAULT '',
    `phonenumber` VARCHAR(11) NULL DEFAULT '',
    `remark` VARCHAR(500) NULL,
    `sex` CHAR(1) NULL DEFAULT '0',
    `status` CHAR(1) NULL DEFAULT '0',
    `updateBy` VARCHAR(64) NULL DEFAULT '',
    `updateTime` DATETIME(3) NULL,
    `userName` VARCHAR(30) NOT NULL,
    `userType` VARCHAR(2) NULL DEFAULT '00',

    UNIQUE INDEX `sys_user_userName_key`(`userName`),
    INDEX `sys_user_deptId_fkey`(`deptId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_role` (
    `roleId` INTEGER NOT NULL AUTO_INCREMENT,
    `createBy` VARCHAR(64) NULL DEFAULT '',
    `createTime` DATETIME(3) NULL,
    `dataScope` CHAR(4) NULL DEFAULT '4',
    `delFlag` CHAR(1) NULL DEFAULT '0',
    `deptCheckStrictly` BOOLEAN NULL DEFAULT true,
    `menuCheckStrictly` BOOLEAN NULL DEFAULT true,
    `remark` VARCHAR(500) NULL,
    `roleKey` VARCHAR(100) NOT NULL,
    `roleName` VARCHAR(30) NOT NULL,
    `roleSort` INTEGER NOT NULL,
    `status` CHAR(1) NOT NULL,
    `updateBy` VARCHAR(64) NULL DEFAULT '',
    `updateTime` DATETIME(3) NULL,

    PRIMARY KEY (`roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_menu` (
    `menuId` INTEGER NOT NULL AUTO_INCREMENT,
    `menuName` VARCHAR(50) NOT NULL,
    `parentId` INTEGER NULL,
    `orderNum` INTEGER NULL DEFAULT 0,
    `path` VARCHAR(200) NULL DEFAULT '',
    `component` VARCHAR(255) NULL,
    `query` VARCHAR(255) NULL,
    `isFrame` CHAR(1) NULL DEFAULT '1',
    `isCache` CHAR(1) NULL DEFAULT '0',
    `menuType` CHAR(1) NULL DEFAULT '',
    `visible` CHAR(1) NULL DEFAULT '0',
    `status` CHAR(1) NULL DEFAULT '0',
    `perms` VARCHAR(100) NULL,
    `icon` VARCHAR(100) NULL DEFAULT '#',
    `createBy` VARCHAR(64) NULL DEFAULT '',
    `createTime` DATETIME(3) NULL,
    `updateBy` VARCHAR(64) NULL DEFAULT '',
    `updateTime` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL DEFAULT '',

    PRIMARY KEY (`menuId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_dept` (
    `deptId` INTEGER NOT NULL AUTO_INCREMENT,
    `parentId` INTEGER NULL,
    `ancestors` VARCHAR(50) NOT NULL DEFAULT '',
    `deptName` VARCHAR(30) NULL DEFAULT '',
    `orderNum` INTEGER NULL DEFAULT 0,
    `leader` VARCHAR(20) NULL,
    `phone` VARCHAR(11) NULL,
    `email` VARCHAR(50) NULL,
    `status` CHAR(1) NULL DEFAULT '0',
    `delFlag` CHAR(1) NULL DEFAULT '0',
    `createBy` VARCHAR(64) NULL DEFAULT '',
    `createTime` DATETIME(3) NULL,
    `updateBy` VARCHAR(64) NULL DEFAULT '',
    `updateTime` DATETIME(3) NULL,

    PRIMARY KEY (`deptId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_post` (
    `postId` INTEGER NOT NULL AUTO_INCREMENT,
    `postCode` VARCHAR(64) NOT NULL,
    `postName` VARCHAR(50) NOT NULL,
    `postSort` INTEGER NOT NULL,
    `status` CHAR(1) NOT NULL,
    `createBy` VARCHAR(64) NULL DEFAULT '',
    `createTime` DATETIME(3) NULL,
    `updateBy` VARCHAR(64) NULL DEFAULT '',
    `updateTime` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    UNIQUE INDEX `sys_post_postCode_key`(`postCode`),
    PRIMARY KEY (`postId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_sys_role_to_sys_user` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_sys_role_to_sys_user_AB_unique`(`A`, `B`),
    INDEX `_sys_role_to_sys_user_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_sys_menu_to_sys_role` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_sys_menu_to_sys_role_AB_unique`(`A`, `B`),
    INDEX `_sys_menu_to_sys_role_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_sys_dept_to_sys_role` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_sys_dept_to_sys_role_AB_unique`(`A`, `B`),
    INDEX `_sys_dept_to_sys_role_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_sys_post_to_sys_user` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_sys_post_to_sys_user_AB_unique`(`A`, `B`),
    INDEX `_sys_post_to_sys_user_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
