import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Text from "ol/style/Text";
import RegularShape from "ol/style/RegularShape";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import { getArea, getLength } from "ol/Sphere";
import LineString from "ol/geom/LineString";
import Point from "ol/geom/Point";
import { poly } from "googleapis/build/src/apis/poly";
import type { Feature } from "ol";
import { Polygon } from "ol/geom";
import type { Geometry } from "ol/geom";
import type { FeatureLike } from "ol/Feature";
import type { Coordinate } from "ol/coordinate";

export const style = new Style({
  fill: new Fill({
    color: "rgba(255, 255, 255, 0.2)",
  }),
  stroke: new Stroke({
    color: "rgba(0, 0, 0, 0.5)",
    lineDash: [10, 10],
    width: 2,
  }),
  image: new CircleStyle({
    radius: 5,
    stroke: new Stroke({
      color: "rgba(0, 0, 0, 0.7)",
    }),
    fill: new Fill({
      color: "rgba(255, 255, 255, 0.2)",
    }),
  }),
});

export const labelStyle = new Style({
  text: new Text({
    font: "14px Calibri,sans-serif",
    fill: new Fill({
      color: "rgba(255, 255, 255, 1)",
    }),
    backgroundFill: new Fill({
      color: "rgba(0, 0, 0, 0.7)",
    }),
    padding: [3, 3, 3, 3],
    textBaseline: "bottom",
    offsetY: -15,
  }),
  image: new RegularShape({
    radius: 8,
    points: 3,
    angle: Math.PI,
    displacement: [0, 10],
    fill: new Fill({
      color: "rgba(0, 0, 0, 0.7)",
    }),
  }),
});

export const tipStyle = new Style({
  text: new Text({
    font: "12px Calibri,sans-serif",
    fill: new Fill({
      color: "rgba(255, 255, 255, 1)",
    }),
    backgroundFill: new Fill({
      color: "rgba(0, 0, 0, 0.4)",
    }),
    padding: [2, 2, 2, 2],
    textAlign: "left",
    offsetX: 15,
  }),
});

export const modifyStyle = new Style({
  image: new CircleStyle({
    radius: 5,
    stroke: new Stroke({
      color: "rgba(0, 0, 0, 0.7)",
    }),
    fill: new Fill({
      color: "rgba(0, 0, 0, 0.4)",
    }),
  }),
  text: new Text({
    text: "Drag to modify",
    font: "12px Calibri,sans-serif",
    fill: new Fill({
      color: "rgba(255, 255, 255, 1)",
    }),
    backgroundFill: new Fill({
      color: "rgba(0, 0, 0, 0.7)",
    }),
    padding: [2, 2, 2, 2],
    textAlign: "left",
    offsetX: 15,
  }),
});

export const segmentStyle = new Style({
  text: new Text({
    font: "12px Calibri,sans-serif",
    fill: new Fill({
      color: "rgba(255, 255, 255, 1)",
    }),
    backgroundFill: new Fill({
      color: "rgba(0, 0, 0, 0.4)",
    }),
    padding: [2, 2, 2, 2],
    textBaseline: "bottom",
    offsetY: -12,
  }),
  image: new RegularShape({
    radius: 6,
    points: 3,
    angle: Math.PI,
    displacement: [0, 8],
    fill: new Fill({
      color: "rgba(0, 0, 0, 0.4)",
    }),
  }),
});

export const formatLength = function (line: LineString) {
  const length = getLength(line);
  let output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + " km";
  } else {
    output = Math.round(length * 100) / 100 + " m";
  }
  return output;
};

export const formatArea = function (polygon: Polygon) {
  const area = getArea(polygon);
  let output;
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + " km\xB2";
  } else {
    output = Math.round(area * 100) / 100 + " m\xB2";
  }
  return output;
};

const segmentStyles = [segmentStyle];

export function styleFunction(feature: FeatureLike, segments, drawType, tip) {
  const styles = [style];
  const geometry = feature.getGeometry();
  const type = geometry.getType();
  let point, label, line;
  if (!drawType || drawType === type) {
    if (type === "Polygon") {
      point = (geometry as Polygon).getInteriorPoint();
      label = formatArea(geometry as Polygon);
      line = new LineString((geometry as Polygon).getCoordinates()[0]);
    } else if (type === "LineString") {
      point = new Point((geometry as LineString).getLastCoordinate());
      label = formatLength(geometry as LineString);
      line = geometry;
    }
  }
  if (segments && line) {
    let count = 0;
    line.forEachSegment(function (a, b) {
      const segment = new LineString([a, b]);
      const label = formatLength(segment);
      if (segmentStyles.length - 1 < count) {
        segmentStyles.push(segmentStyle.clone());
      }
      const segmentPoint = new Point(segment.getCoordinateAt(0.5));
      segmentStyles[count].setGeometry(segmentPoint);
      segmentStyles[count].getText().setText(label);
      styles.push(segmentStyles[count]);
      count++;
    });
  }
  if (label) {
    const centerpoint = point?.translate(0, 15);
    labelStyle.setGeometry(centerpoint);
    labelStyle.getText().setText(label);
    styles.push(labelStyle);
  }

  return styles;
}

export function getRectangleCenteredAt(start: Coordinate, end: Coordinate, thickness: number): Polygon {
  const [y1, x1] = start;
  const [y2, x2] = end;
  const slope = (y2 - y1) / (x2 - x1);
  const islope = -1 / slope;
  const deltaX = Math.sqrt(Math.pow(thickness, 2) / (1 + Math.pow(islope, 2)));
  const deltaY = deltaX * islope;
  return new Polygon([
    [
      [y1 - deltaY, x1 - deltaX],
      [y1 + deltaY, x1 + deltaX],
      [y2 + deltaY, x2 + deltaX],
      [y2 - deltaY, x2 - deltaX],
    ],
  ]);
}

export function getSlope(start: Coordinate, end: Coordinate): number {
  const [x1, y1] = start;
  const [x2, y2] = end;
  const deltaY = y2 - y1 === 0 ? 0.0001 : y2 - y1;
  const deltaX = x2 - x1 === 0 ? 0.0001 : x2 - x1;
  return deltaY / deltaX;
}

export function getWrappingPolygonOld(lineString: LineString, thickness: number) {
  const points: Coordinate[] = lineString.getCoordinates();
  const slopes: number[] = [];
  lineString.forEachSegment((start, end) => {
    slopes.push(getSlope(start, end));
  });
  const slopesWithCaps: number[] = [slopes[0], ...slopes, slopes[slopes.length - 1]];
  const plusPoints: Coordinate[] = [];
  const minusPoints: Coordinate[] = [];
  points.forEach((point, index) => {
    const [x, y] = point;
    const avgSlope = (slopesWithCaps[index] + slopesWithCaps[index + 1]) / 2;

    const islope = index === 0 || index == points.length - 1 ? -1 / avgSlope : avgSlope;
    const deltaX = Math.sqrt(Math.pow(thickness, 2) / (1 + Math.pow(islope, 2)));
    const deltaY = deltaX * islope;

    console.log("averageSlope", avgSlope, "islope", islope, "deltaX", deltaX, "deltaY", deltaY);
    plusPoints.push([x + deltaX, y + deltaY]);
    minusPoints.push([x - deltaX, y - deltaY]);
  });

  return new Polygon([[...plusPoints, ...minusPoints.reverse()]]);
}

export function getWrappingPolygon(lineString: LineString, thickness: number) {
  const points: Coordinate[] = lineString.getCoordinates();
  const slopes: number[] = [];
  lineString.forEachSegment((start, end) => {
    slopes.push(getSlope(start, end));
  });
  const slopesWithCaps: number[] = [slopes[0], ...slopes, slopes[slopes.length - 1]];
  const plusPoints: Coordinate[] = [];
  const minusPoints: Coordinate[] = [];
  points.forEach((point, index) => {
    const [x, y] = point;

    const m1 = -1 / slopesWithCaps[index];
    const m2 = -1 / slopesWithCaps[index + 1];

    //const islope = index === 0 || index == points.length - 1 ? -1 / avgSlope : avgSlope;
    const deltaX1 = (slopesWithCaps[index] > 0 ? 1 : -1) * Math.sqrt(Math.pow(thickness, 2) / (1 + Math.pow(m1, 2)));
    const deltaY1 = deltaX1 * m1; //* (m1 < 0 ? -1 : 1);
    const deltaX2 = (slopesWithCaps[index + 1] > 0 ? 1 : -1) * Math.sqrt(Math.pow(thickness, 2) / (1 + Math.pow(m2, 2)));
    const deltaY2 = deltaX2 * m2; //* (m2 < 0 ? -1 : 1);

    const deltaX = deltaX1 + deltaX2;
    const deltaY = (true ? -1 : 1) * (Math.abs(deltaY1) + Math.abs(deltaY2));
    //if (m2 > 0 !== m1 > 0) {
    // plusPoints.push([x + deltaY, y + deltaX]);
    // minusPoints.push([x - deltaY, y - deltaX]);
    //} else {
    plusPoints.push([x + deltaX, y + deltaY]);
    minusPoints.push([x - deltaX, y - deltaY]);
    // }

    //console.log("averageSlope", avgSlope, "islope", islope, "deltaX", deltaX, "deltaY", deltaY);
    //console.log("m1", m1, "m2", m2, "deltaX", deltaX, deltaX1, deltaX2, "deltaY", deltaY, deltaY1, deltaY2);
  });

  return new Polygon([[...plusPoints, ...minusPoints.reverse()]]);
}
