export type Place = 'home' | 'work' | { custom: string };

export class Todo {
  id: string;
  title: string;
  isFinish: boolean;
  place?: Place;

  constructor(id: string, title: string, isFinish: boolean, place?: Place) {
    this.id = id;
    this.title = title;
    this.isFinish = isFinish;
    this.place = place;
  }
}
