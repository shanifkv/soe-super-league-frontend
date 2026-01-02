import { teamNameToIdMap } from "../teamMap";

export interface Manager {
  id: string;
  name: string;
  teamId: number | null;
  bio?: string;
  thumbnail_id?: string;
}

export const managers: Manager[] = [
  { id: "51", name: "SHANIF KV", teamId: teamNameToIdMap["FC CUBA"], bio: "", thumbnail_id: "135" },
  { id: "53", name: "JASSIM MM", teamId: teamNameToIdMap["FC CUBA"], bio: "", thumbnail_id: "121" },
  { id: "54", name: "NAJI", teamId: teamNameToIdMap["FC BAVERIA"], bio: "", thumbnail_id: "138" },
  { id: "55", name: "ARIN", teamId: teamNameToIdMap["FC BAVERIA"], bio: "", thumbnail_id: "128" },
  { id: "56", name: "PRANAV KRISHNA", teamId: teamNameToIdMap["GUNNERS FC"], bio: "", thumbnail_id: "124" },
  { id: "57", name: "MIDHUN", teamId: teamNameToIdMap["GUNNERS FC"], bio: "", thumbnail_id: "133" },
  { id: "58", name: "SUFIYAN", teamId: teamNameToIdMap["PALLIYANGADI FC"], bio: "", thumbnail_id: "127" },
  { id: "59", name: "SHABAS", teamId: teamNameToIdMap["PALLIYANGADI FC"], bio: "", thumbnail_id: "137" },
  { id: "60", name: "RASIM", teamId: teamNameToIdMap["FC MALABARIES"], bio: "", thumbnail_id: "136" },
  { id: "61", name: "SOURADH", teamId: teamNameToIdMap["FC MALABARIES"], bio: "", thumbnail_id: "126" },
  { id: "62", name: "ADNAN", teamId: teamNameToIdMap["AL QADR FC"], bio: "", thumbnail_id: "131" },
  { id: "63", name: "ASHMU", teamId: teamNameToIdMap["AL QADR FC"], bio: "", thumbnail_id: "122" },
  { id: "65", name: "ABHAY", teamId: teamNameToIdMap["BELLARI UNITED"], bio: "", thumbnail_id: "132" },
  { id: "66", name: "JITH", teamId: teamNameToIdMap["BELLARI UNITED"], bio: "", thumbnail_id: "123" },
  { id: "67", name: "AQUIB", teamId: teamNameToIdMap["AETOZ FC"], bio: "", thumbnail_id: "125" },
  { id: "68", name: "VASIL", teamId: teamNameToIdMap["AETOZ FC"], bio: "", thumbnail_id: "134" },
  { id: "69", name: "ANAND UNNI", teamId: teamNameToIdMap["DESHAM FC"], bio: "", thumbnail_id: "130" },
  { id: "70", name: "VISHNU DEV", teamId: teamNameToIdMap["DESHAM FC"], bio: "", thumbnail_id: "140" },
  { id: "71", name: "AJSAL AMEEN", teamId: teamNameToIdMap["CLUB DE FUMINGO"], bio: "", thumbnail_id: "129" },
  { id: "72", name: "ARZAM", teamId: teamNameToIdMap["CLUB DE FUMINGO"], bio: "", thumbnail_id: "139" }
];
