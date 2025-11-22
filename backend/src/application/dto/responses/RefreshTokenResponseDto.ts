export class RefreshTokenResponseDto {
  constructor(
    private access_token: string,
    private expires_in: number,
    private token_type: string
  ) {}

  toJSON() {
    return {
      status: 200,
      success: true,
      data: {
        access_token: this.access_token,
        expires_in: this.expires_in,
        token_type: this.token_type,
      },
      error: null,
    };
  }
}
