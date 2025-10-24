export type Coordinate = { x: number, y: number };

export type Brush = {
  size: number,
  color: string
};

export type Layer = {
  segments: Array<Segment>,
  brush: Brush,
};

export type Segment = {
  from: Coordinate,
  to: Coordinate,
};