export interface ProgressProps {
  tag?: React.ReactType | string;
  animated?: boolean;
  striped?: boolean;
  complete?: boolean;
  value?: number | string;
  max?: number | string;
  className?: string;
  color?: string;
}

declare const Progress: React.FC<ProgressProps>;

export default Progress;
