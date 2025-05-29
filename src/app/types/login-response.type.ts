// export type LoginResponse = {
//   token: string,
//   email: string
// }
export type LoginResponse = {
  token: string;
  id: number;
  email: string;
  tipoUsuario: 'INSTITUICAO' | 'ADMIN';
  instituicao?: {
    id: number;
    nomeInstituicao: string;
    imagemPerfil: string | null;
  };
}
