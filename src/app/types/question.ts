export type Question = {
  id: number;
  question: string;
  options: string[];
  answer: number;
  roomId?: number;
};

export type Room = {
  id: number;
  code: string;
  questions?: Question[];
}