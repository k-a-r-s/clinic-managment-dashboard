import { Request, Response } from "express";
import { UserAuthService } from "../../application/services/UserAuthService";
import { AuthRequest } from "../middlewares/authMiddleware";
import { ResponseFormatter } from "../utils/ResponseFormatter";

export class AuthController {
  constructor(private userAuthService: UserAuthService) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await this.userAuthService.loginUser(email, password);

    // Set access token in HTTP-only cookie (1 hour expiration)
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 6 * 24 * 60 * 60 * 1000, // 6 days
      path: "/",
    });

    // Set refresh token in HTTP-only cookie (7 days expiration)
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/api/auth/refresh-token",
    });

    // Return response with only user info (no tokens)
    const responseJson = result.toJSON();
    const { refreshToken, accessToken, ...dataWithoutTokens } =
      responseJson.data;

    return ResponseFormatter.success(res, dataWithoutTokens, "Login successful");
  }

  async logout(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    await this.userAuthService.logoutUser(userId);

    // Clear access token cookie
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    // Clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh-token",
    });

    return ResponseFormatter.success(res, null, "Logged out successfully");
  }

  async refreshToken(req: Request, res: Response) {
    // Get refresh token from cookie instead of body
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return ResponseFormatter.error(
        res,
        { type: "AuthenticationError", message: "Refresh token not found" },
        401,
        "Refresh token not found"
      );
    }

    const result = await this.userAuthService.refreshToken(refreshToken);

    // Set new access token in cookie (1 hour expiration)
    res.cookie("accessToken", result["access_token"], {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
      path: "/",
    });

    // Set new refresh token in cookie (7 days expiration)
    res.cookie("refreshToken", result["refresh_token"], {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/api/auth/refresh-token",
    });

    // Return minimal response (no tokens in body)
    return ResponseFormatter.success(res, null, "Tokens refreshed successfully");
  }

  async getMe(req: AuthRequest, res: Response) {
    const { token, ...userWithoutToken } = req.user || {};
    return ResponseFormatter.success(res, userWithoutToken, "User retrieved successfully");
  }
}
