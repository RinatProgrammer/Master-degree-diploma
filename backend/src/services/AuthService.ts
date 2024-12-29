import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export class AuthService {
  static async register(email: string, password: string, walletAddress: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          walletAddress
        }
      });

      return this.generateToken(user);
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    return this.generateToken(user);
  }

  private static generateToken(user: any) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        walletAddress: user.walletAddress 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
  }
}