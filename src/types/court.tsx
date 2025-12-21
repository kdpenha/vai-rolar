import { Nivel } from "./level";

export interface Court {
  id: string;
  nome_local: string;
  photo_url: string | null;
  data_hora: string;
  nivel: Nivel;
  criado_por: string;
  latitude: number | null;
  longitude: number | null;
  started_at: string;
  ended_at: string;
  status: string;
  label: string;
}