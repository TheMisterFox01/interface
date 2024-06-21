import { useTheme } from '@material-ui/core/styles';
import React, { useRef, useEffect } from 'react';

type PriceDynamicsWithTimestamp = {
  timestamp: number;
  averagePrice: number;
};

type CurrencyChartProps = {
  priceDynamics: PriceDynamicsWithTimestamp[];
};

type Point = {
  x: number;
  y: number;
};

type chartColors = {
  color: string;
  gradientTop: string;
  gradientBottom: string;
};

const CurrencyChart = ({ priceDynamics }: CurrencyChartProps) => {
  const theme = useTheme()
  const canvasRef = useRef(null);

  const prepareDataForChart = (
    preparedData: PriceDynamicsWithTimestamp[],
  ): PriceDynamicsWithTimestamp[] => {
    let minPrice = preparedData[0].averagePrice;
    let maxPrice = preparedData[0].averagePrice;

    preparedData.map((row) => {
      if (row.averagePrice < minPrice) {
        minPrice = row.averagePrice;
      }
      if (row.averagePrice > maxPrice) {
        maxPrice = row.averagePrice;
      }
    });

    maxPrice -= minPrice;

    const preparedChartData = preparedData.map((row) => {
      const preparedChartRow = {} as PriceDynamicsWithTimestamp;
      preparedChartRow.averagePrice = 40 - ((row.averagePrice - minPrice) * 40) / maxPrice + 5;
      if (isNaN(preparedChartRow.averagePrice)) {
        preparedChartRow.averagePrice = 0;
      }
      preparedChartRow.timestamp = row.timestamp;
      return preparedChartRow;
    });

    return preparedChartData;
  };

  const selectColors = (preparedData: PriceDynamicsWithTimestamp[]): chartColors => {
    const colors: chartColors = {} as chartColors;


    colors.color = theme.palette.custom.opacity.percent50.gray;
    colors.gradientTop = theme.palette.custom.opacity.percent25.gray;
    colors.gradientBottom = theme.palette.custom.opacity.percent0.gray;

    if (
      preparedData[preparedData.length - 2].averagePrice >
      preparedData[preparedData.length - 1].averagePrice
    ) {
      colors.color = theme.palette.custom.opacity.percent50.red;
      colors.gradientTop = theme.palette.custom.opacity.percent25.red;
      colors.gradientBottom = theme.palette.custom.opacity.percent0.red;
    } else if (
      preparedData[preparedData.length - 2].averagePrice <
      preparedData[preparedData.length - 1].averagePrice
    ) {
      colors.color = theme.palette.custom.opacity.percent50.green;
      colors.gradientTop = theme.palette.custom.opacity.percent25.green;
      colors.gradientBottom = theme.palette.custom.opacity.percent0.green;
    }

    return colors;
  };

  const drawBeizerCurve = (
    ctx: CanvasRenderingContext2D,
    preparedChartData: PriceDynamicsWithTimestamp[],
  ) => {
    const step = 150 / (preparedChartData.length - 1);
    const beizerDelta = step / 2;
    let stepCount = 1;
    let previousPoint: Point = { x: 0, y: 0 } as Point;

    ctx.moveTo(0, preparedChartData[0].averagePrice);
    previousPoint.x = 0;
    previousPoint.y = preparedChartData[0].averagePrice;
    stepCount = 1;

    for (let i = 1; i < preparedChartData.length; ++i) {
      ctx.bezierCurveTo(
        previousPoint.x + beizerDelta,
        previousPoint.y,
        step * stepCount - beizerDelta,
        preparedChartData[i].averagePrice,
        step * stepCount,
        preparedChartData[i].averagePrice,
      );

      previousPoint.x = step * stepCount;
      previousPoint.y = preparedChartData[i].averagePrice;
      stepCount += 1;
    }
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    const chartColors = selectColors(priceDynamics);
    let preparedChartData = prepareDataForChart(priceDynamics);
    if (preparedChartData.length > 7) {
      preparedChartData = preparedChartData.slice(preparedChartData.length - 7);
    }

    ctx.clearRect(0, 0, 150, 55);

    ctx.strokeStyle = chartColors.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    drawBeizerCurve(ctx, preparedChartData);
    ctx.stroke();

    let gradient = ctx.createLinearGradient(0, 0, 0, 55);
    gradient.addColorStop(0.0, chartColors.gradientTop);
    gradient.addColorStop(1.0, chartColors.gradientBottom);

    ctx.beginPath();
    drawBeizerCurve(ctx, preparedChartData);
    ctx.bezierCurveTo(150, 20, 150, 45, 150, 55);
    ctx.bezierCurveTo(150, 55, 0, 55, 0, 55);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
  };

  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current as unknown as HTMLCanvasElement;
    if (priceDynamics === null || priceDynamics.length < 2) {
      canvas.remove();
      return;
    }
    const context = canvas.getContext('2d');

    draw(context as unknown as CanvasRenderingContext2D);
  }, [draw]);

  return <canvas ref={canvasRef} width="150" height="55" />;
};

export default CurrencyChart;
