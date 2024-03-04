import { Figures } from '../enums/figures'

export interface IAddinFigure {
  'id': number | string,
  presentation_id: string,
  name: string,
  slide: number,
  size: { width: number, height: number },
  bounds: { top: number, left: number },
  unique_id: string,
  shapename: string,
  date_time: string,
  content_config: any,
  created_at: string,
  updated_at: string,
  figureName: Figures,
}