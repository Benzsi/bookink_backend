import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { Role, User } from 'generated/prisma/client';

interface CreateUserInput {
  username: string;
  passwordHash: string;
  role?: Role;
}

interface CreateUserWithPasswordInput {
  username: string;
  password: string;
  role?: Role;
}

interface UpdateUserInput {
  username?: string;
  role?: Role;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const { username, passwordHash, role = Role.USER } = input;
    return this.prisma.user.create({
      data: {
        username,
        passwordHash,
        role,
      },
    });
  }

  async createUserWithPassword(
    input: CreateUserWithPasswordInput,
  ): Promise<User> {
    const { username, password, role = Role.USER } = input;
    const passwordHash = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        username,
        passwordHash,
        role,
      },
    });
  }

  async updateUser(id: number, input: UpdateUserInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...(input.username && { username: input.username }),
        ...(input.role && { role: input.role }),
      },
    });
  }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
