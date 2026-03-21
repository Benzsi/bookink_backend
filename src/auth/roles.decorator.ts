import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Meghatározza, hogy milyen szerepkörök férhetnek hozzá az adott útvonalhoz.
 * Példa: @Roles(Role.ADMIN) vagy @Roles(Role.DEVELOPER, Role.ADMIN)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
