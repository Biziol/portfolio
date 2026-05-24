export interface Rewiew {
  id: number;
  author: string;
  stars: number;
  comment: string;
  creationDate: string;
}

export const rewiewPayload: Rewiew = {
  id: 0,
  author: "",
  stars: 1,
  comment: "",
  creationDate: "",
};
