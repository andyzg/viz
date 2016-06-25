var Circle = function(x, y, r, domain, angle, scale) {
  this.x = parseInt(x, 10);
  this.y = parseInt(y, 10);
  this.r = r;
  this.angle = angle;
  this.scale = scale;
  this.domain = domain;
  this.color = this.randomColor();
  if (this.domain.indexOf("facebook") !== -1) {
    this.color = "#3B5998";  
  }
}

// Draws the circle of this domain name
Circle.prototype.draw = function(canvas, centerX, centerY) {
  canvas.beginPath();
  canvas.arc(this.x+centerX, this.y+centerY, this.r, 0, Math.PI * 2);
  canvas.closePath();
  canvas.fillStyle = this.color;
  canvas.fill();
}

// There's no point in drawing incoming as well since each outgoing maps to 
// an incoming
Circle.prototype.drawOutgoingConnections = function(canvas, data, circles, centerX, centerY, metadata) {
  var domain = data[this.domain];
  domain.referralTo.forEach(function(target) {
    if (!(target.domain in circles)) {
      return; 
    }
    var circle = circles[target.domain];
    var domain = data[target.domain];
    var width = target.count / metadata.averageEdge;
    
    canvas.strokeStyle = this.color;
    canvas.lineWidth = width;
    canvas.beginPath();
    canvas.moveTo(circles[this.domain].x+centerX, circles[this.domain].y+centerY);

    if (target.domain === this.domain) {
      var cwx = Math.cos(this.angle - ANGLE_CHANGE) * (RADIUS_CHANGE) + centerX; 
      var cwy = Math.sin(this.angle - ANGLE_CHANGE) * (RADIUS_CHANGE) + centerY; 
      var ccwx = Math.cos(this.angle + ANGLE_CHANGE) * (RADIUS_CHANGE) + centerX; 
      var ccwy = Math.sin(this.angle + ANGLE_CHANGE) * (RADIUS_CHANGE) + centerY; 
      canvas.bezierCurveTo(cwx, cwy, ccwx, ccwy, circles[this.domain].x+centerX, circles[this.domain].y+centerY);
    } else {
      canvas.bezierCurveTo(centerX, centerY, centerX, centerY, circle.x+centerX, circle.y+centerY);
    }

    canvas.stroke();
    canvas.closePath();
  }, this);
}

Circle.prototype.randomColor = function() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}
