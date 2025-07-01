export interface JwtPayload {
  email: string;
  sub: number;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    username: string;
  };
}

export interface RegisterResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface RequestUser {
  userId: number;
  email: string;
}
