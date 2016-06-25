function getCursorXY(canvas, event) {
  return {
    x: event.clientX,
    y: event.clientY, 
  };
}

function getDistance(x1, y1, x2, y2) {
  var distance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  return Math.abs(distance);
}
