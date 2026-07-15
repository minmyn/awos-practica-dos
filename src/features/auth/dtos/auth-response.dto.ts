export interface AuthResponseDto {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  token: string;
  expiresIn?: string;
}