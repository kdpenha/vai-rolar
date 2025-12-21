import { Court } from "./court";
import { Attendance } from "./attendance";

export interface CourtListDisplayProps {
  courts: Court[];
  attendances: Attendance[];
  loading: boolean;
  page: number;
  fetchData: (page: number) => void;
}