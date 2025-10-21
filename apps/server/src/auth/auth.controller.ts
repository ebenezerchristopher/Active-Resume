import { Controller, Get, InternalServerErrorException, Res, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GoogleGuard } from "./guards/google.guard";
import { UserWithSecrets } from "@active-resume/dto";
import { restUser } from "@/server/user/decorators/user.decorator";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { ErrorMessage } from "@active-resume/utils";
import { payloadSchema } from "./utils/payload";
import { getCookieOptions } from "./utils/cookie";
import { Response } from "express";
import { GitHubGuard } from "./guards/github.guard";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private async exchangeToken(id: string, email: string, isTwoFactorAuth = false) {
    try {
      const payload = payloadSchema.parse({ id, isTwoFactorAuth });

      const accessToken = this.authService.generateToken("access", payload);
      const refreshToken = this.authService.generateToken("refresh", payload);

      // Set Refresh Token in Database
      await this.authService.setRefreshToken(email, refreshToken);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new InternalServerErrorException(error, ErrorMessage.SomethingWentWrong);
    }
  }

  private async handleAuthenticationResponse(
    user: UserWithSecrets,
    response: Response,
    isTwoFactorAuth = false,
    redirect = false,
  ) {
    let status = "authenticated";

    const baseUrl = this.configService.get("PUBLIC_URL");
    const tunnelUrl = this.configService.get("TUNNEL_URL");
    const redirectUrl = tunnelUrl
      ? new URL(`${tunnelUrl}/auth/callback`)
      : new URL(`${baseUrl}/auth/callback`);

    const { accessToken, refreshToken } = await this.exchangeToken(
      user.id,
      user.email,
      isTwoFactorAuth,
    );

    response.cookie("Authentication", accessToken, getCookieOptions("access"));
    response.cookie("Refresh", refreshToken, getCookieOptions("refresh"));

    if (user.twoFactorEnabled && !isTwoFactorAuth) status = "2fa_required";

    redirectUrl.searchParams.set("status", status);
    if (redirect) response.redirect(redirectUrl.toString());
  }

  // OAuth2 Routes
  @ApiTags("OAuth", "Google")
  @Get("google")
  @UseGuards(GoogleGuard)
  googleLogin() {
    return;
  }

  @ApiTags("OAuth", "Google")
  @Get("google/callback")
  @UseGuards(GoogleGuard)
  async googleCallback(
    @restUser() user: UserWithSecrets,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.handleAuthenticationResponse(user, response, false, true);
  }

  @ApiTags("OAuth", "GitHub")
  @Get("github")
  @UseGuards(GitHubGuard)
  githubLogin() {
    return;
  }

  @ApiTags("OAuth", "GitHub")
  @Get("github/callback")
  @UseGuards(GitHubGuard)
  async githubCallback(
    @restUser() user: UserWithSecrets,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.handleAuthenticationResponse(user, response, false, true);
  }
}
