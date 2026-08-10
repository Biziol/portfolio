export interface Argument {
  id: number;
  text: string;
  workAndTrainingId: number | null;
}

export const ArgumentPayload: Argument = {
  id: 0,
  text: "",
  workAndTrainingId: null,
};
