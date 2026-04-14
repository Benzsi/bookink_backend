import { SetMetadata } from '@nestjs/common';
import { user_role } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Meghatározza, hogy milyen szerepkörök férhetnek hozzá az adott útvonalhoz.
 * Példa: @Roles(user_role.ADMIN) vagy @Roles(user_role.DEVELOPER, user_role.ADMIN)
 */
export const Roles = (...roles: user_role[]) => SetMetadata(ROLES_KEY, roles);
