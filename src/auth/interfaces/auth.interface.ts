export interface JwtPayload {
  email: string;
  sub: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    username: string;
    name?: string;
    isTwoFactorAuthenticationEnabled: boolean;
  };
}

export interface RegisterResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface RequestUser {
  userId: string;
  email: string;
}
