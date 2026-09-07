import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRepository } from "./auth.repository.js";
import type { RegisterDTO, LoginDTO, RefreshTokenDTO, AuthResponse, JwtPayload } from "./auth.types.js";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || "your-access-secret";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret";
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

  private verifyAccessTokenInternal(token: string): JwtPayload {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
  }

  private verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
  }

  private sanitizeUser(user: any): Omit<any, "password"> {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const existingUser = await this.authRepo.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.authRepo.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
    });

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await this.authRepo.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
      throw new Error("Account is deactivated");
    }

    await this.authRepo.updateLastLogin(user.id);

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(data: RefreshTokenDTO): Promise<{ accessToken: string }> {
    try {
      const payload = this.verifyRefreshToken(data.refreshToken);

      const user = await this.authRepo.findById(payload.userId);
      if (!user) {
        throw new Error("User not found");
      }

      const newPayload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = this.generateAccessToken(newPayload);

      return { accessToken };
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    try {
      return this.verifyAccessTokenInternal(token);
    } catch (error) {
      throw new Error("Invalid or expired access token");
    }
  }
}
