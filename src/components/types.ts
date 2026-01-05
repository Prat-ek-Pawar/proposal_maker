export interface TrainingData {
  sourceType: "text" | "pdf" | "url";
  content: string;
  name: string;
}

export interface VisualData {
  primaryColor?: string;
  secondaryColor?: string;
  headerText?: string;
  footerText?: string;
}

export interface ReplicaState {
  isReplicaActive: boolean;
  visualData: VisualData | null;
}
