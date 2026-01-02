import { Request, Response } from "express";
import { UserAuthService } from "../../application/services/UserAuthService";
import { AuthRequest } from "../middlewares/authMiddleware";
import { ResponseFormatter } from "../utils/ResponseFormatter";
import { ChangePasswordUseCase } from "../../application/use-cases/users/ChangePasswordUseCase";
import { UpdateCurrentUserUseCase } from "../../application/use-cases/users/UpdateCurrentUserUseCase";

export class AuthController {
  constructor(
    private userAuthService: UserAuthService,
    private changePasswordUseCase?: ChangePasswordUseCase,
    private updateCurrentUserUseCase?: UpdateCurrentUserUseCase
  ) {}

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
      path: "/auth/refresh-token",
    });

    // Return response with only user info (no tokens)
    const responseJson = result.toJSON();
    const { refreshToken, accessToken, ...dataWithoutTokens } =
      responseJson.data;

    return ResponseFormatter.success(
      res,
      dataWithoutTokens,
      "Login successful"
    );
  }

  async logout(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return ResponseFormatter.error(
        res,
        { type: "AuthenticationError", message: "User not authenticated" },
        401,
        "User not authenticated"
      );
    }
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
      path: "/auth/refresh-token",
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

    // Clear any existing refresh token cookies and set new refresh token in cookie (7 days expiration)
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/auth/refresh-token",
    });

    res.cookie("refreshToken", result["refresh_token"], {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/auth/refresh-token",
    });

    // Return minimal response (no tokens in body)
    return ResponseFormatter.success(
      res,
      null,
      "Tokens refreshed successfully"
    );
  }

  async getMe(req: AuthRequest, res: Response) {
    const { token, ...userWithoutToken } = req.user || {};
    return ResponseFormatter.success(
      res,
      userWithoutToken,
      "User retrieved successfully"
    );
  }

  async updateProfile(req: AuthRequest, res: Response) {
    if (!this.updateCurrentUserUseCase) {
      return ResponseFormatter.error(
        res,
        {
          type: "InternalServerError",
          message: "Update profile not available",
        },
        500,
        "Update profile not available"
      );
    }

    const userId = req.user?.id;
    if (!userId) {
      return ResponseFormatter.error(
        res,
        { type: "AuthenticationError", message: "User not authenticated" },
        401,
        "User not authenticated"
      );
    }

    const updatedUser = await this.updateCurrentUserUseCase.execute(
      userId,
      req.body
    );
    return ResponseFormatter.success(
      res,
      updatedUser,
      "Profile updated successfully"
    );
  }

  async changePassword(req: AuthRequest, res: Response) {
    if (!this.changePasswordUseCase) {
      return ResponseFormatter.error(
        res,
        {
          type: "InternalServerError",
          message: "Change password not available",
        },
        500,
        "Change password not available"
      );
    }

    const userId = req.user?.id;
    if (!userId) {
      return ResponseFormatter.error(
        res,
        { type: "AuthenticationError", message: "User not authenticated" },
        401,
        "User not authenticated"
      );
    }

    const { currentPassword, newPassword } = req.body;
    await this.changePasswordUseCase.execute(
      userId,
      currentPassword,
      newPassword
    );
    return ResponseFormatter.success(
      res,
      null,
      "Password changed successfully"
    );
  }
}
