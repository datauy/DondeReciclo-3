export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    password: string;
    sex: string,
    state: string,
    neighbor: string,
    age: number,
    access_token: string,
    expires_in: number
  }
}
