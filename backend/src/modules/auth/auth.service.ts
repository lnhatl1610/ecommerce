import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createHash, randomBytes } from "node:crypto";
import { sendEmail } from "../../lib/email.js";
import { AuthRepository } from "./auth.repository.js";
import type {
  RegisterDTO,
  LoginDTO,
  AuthResponse,
  JwtPayload,
  SafeUser,
  User,
} from "./auth.types.js";
import { requiredEnv } from "../../config/env.js";

const ACCESS_TOKEN_SECRET = requiredEnv("JWT_ACCESS_SECRET", "development-access-secret");
const REFRESH_TOKEN_SECRET = requiredEnv("JWT_REFRESH_SECRET", "development-refresh-secret");
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export class AuthService {
  private authRepo: AuthRepository;

  constructor(authRepo?: AuthRepository) {
    this.authRepo = authRepo ?? new AuthRepository();
  }

  private generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  }

  private generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  }

  private verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
  }

  private sanitizeUser(user: User): SafeUser {
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }

  private buildTokens(user: User): { accessToken: string; refreshToken: string; user: SafeUser } {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      user: this.sanitizeUser(user),
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  async register(data: RegisterDTO): Promise<AuthResponse & { refreshToken: string }> {
    const existingUser = await this.authRepo.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.authRepo.create({
      name: data.name,
      email: data.email,
      passwordHash: hashedPassword,
      phone: data.phone,
    });

    return this.buildTokens(user);
  }

  async login(data: LoginDTO): Promise<AuthResponse & { refreshToken: string }> {
    const user = await this.authRepo.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    if (!user.isActive || user.status !== "ACTIVE" || user.deletedAt) {
      throw new Error("Account is deactivated");
    }

    await this.authRepo.updateLastLogin(user.id);

    return this.buildTokens(user);
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.verifyRefreshToken(refreshToken);

      const user = await this.authRepo.findById(payload.userId);
      if (!user || !user.isActive || user.status !== "ACTIVE" || user.deletedAt) {
        throw new Error("User not found");
      }

      const newPayload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      return { accessToken: this.generateAccessToken(newPayload) };
    } catch {
      throw new Error("Invalid or expired refresh token");
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.authRepo.findByEmail(email);
    if (!user) return;
    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    await this.authRepo.createPasswordResetToken(user.id, tokenHash, new Date(Date.now() + 30 * 60 * 1000));
    const resetUrl = `${process.env.WEB_URL ?? "http://localhost:5174"}/reset-password?token=${token}`;
    await sendEmail({ to: user.email, subject: "Reset your password", html: `<p>Use this link within 30 minutes:</p><p><a href="${resetUrl}">Reset password</a></p>` });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const changed = await this.authRepo.resetPassword(tokenHash, await bcrypt.hash(password, 10));
    if (!changed) throw new Error("Invalid or expired reset token");
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.authRepo.findById(userId);
    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) throw new Error("Current password is incorrect");
    await this.authRepo.updatePassword(userId, await bcrypt.hash(newPassword, 10));
  }
}
