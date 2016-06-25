var REFERRER = 0;
var DESTINATION = 1;
var COUNT = 2;

var Viz = function(impressions, canvasDOM, canvas) {
  // Properties used for drawing
  this.data = {};
  this.circles = {};
  this.circlesIndex = [];
  this.canvas = canvas;
  this.canvasDOM = canvasDOM;

  // Keep track of which place the cursor is pointing
  this.currentCursorIndex = 0;

  // Sizing of the page
  this.pageWidth = document.documentElement.clientWidth;
  this.pageHeight = document.documentElement.clientHeight;
  this.canvas.width = this.pageWidth;
  this.canvas.height = this.pageHeight;
  this.canvasDOM.width = this.pageWidth;
  this.canvasDOM.height = this.pageHeight;
  this.centerX = this.canvas.width / 2;
  this.centerY = this.canvas.height / 2;

  // TODO: Fix this, it's not working
  // Readjustment from resizing
  window.addEventListener('resize', function() {
    this.pageWidth = document.documentElement.clientWidth;
    this.pageHeight = document.documentElement.clientHeight;
    this.canvas.width = this.pageWidth;
    this.canvas.height = this.pageHeight;
    this.canvasDOM.width = this.pageWidth;
    this.canvasDOM.height = this.pageHeight;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.draw();
  }.bind(this));

  this.canvasDOM.onclick = this.mouseClickHandler.bind(this);

  this.processData(impressions);
  this.draw();
}

// Updates every domain
Viz.prototype.draw = function() {
  for (var domain in this.circles) {
    this.circles[domain].drawOutgoingConnections(this.canvas, this.data, this.circles, this.centerX, this.centerY, this.metadata);
    this.circles[domain].draw(this.canvas, this.centerX, this.centerY);
  }
}

Viz.prototype.processData = function(impressions) {
  // Build a graph of all of the domains
  impressions.forEach(function(d) {
    if (!(d[REFERRER] in this.data)) {
      this.data[d[REFERRER]] = new Domain(d[REFERRER]);
    }
    if (!(d[DESTINATION] in this.data)) {
      this.data[d[DESTINATION]] = new Domain(d[DESTINATION]);
    }
    this.data[d[REFERRER]].addReferralTo(d[DESTINATION], d[COUNT]) ;
    this.data[d[DESTINATION]].addReferralBy(d[REFERRER], d[COUNT]);
  }, this);

  // Filter out all of the content with very little traffic
  var tempData = {};
  var filter = this.getTopX(this.data, DOMAIN_COUNT);
  var count = 0;
  for (var domain in this.data) {
    var impressionCount = this.data[domain].totalComing + this.data[domain].totalGoing;
    if (impressionCount > filter) {
      tempData[domain] = this.data[domain];
      count++;
    }
  }
  this.data = tempData;

  // Build metadata used to normalize the size
  this.metadata = new Metadata(this.data);

  // Instantiate all of the circles with relative sizes
  var currentAngle = 0;
  for (var domain in this.data) {
    var x = Math.cos(currentAngle) * CANVAS_RADIUS;
    var y = Math.sin(currentAngle) * CANVAS_RADIUS;
    var scale =
      (this.data[domain].totalComing
      + this.data[domain].totalGoing) /
      (this.metadata.avgComing +
      this.metadata.avgGoing);
    this.circles[domain] = new Circle(x, y, DOMAIN_RADIUS, domain, currentAngle, scale);
    this.circlesIndex.push(domain);
    currentAngle += this.metadata.angleInterval
  }
};

// This function returns the top num domains in the data
// based on the number of going and coming
Viz.prototype.getTopX = function(data, num) {
  var impression = [];
  for (var domain in data) {
    impression.push(
      parseInt(data[domain].totalGoing + data[domain].totalComing)
    );
  }
  impression.sort(function(a, b) {
    return a - b;
  });
  if (impression.length > num) {
    return impression[impression.length - num - 1];
  }
  return 0;
};

Viz.prototype.mouseMoveHandler = function(event) {
  var mousePosition = getCursorXY(this.canvasDOM, event);
  var x = mousePosition.x - this.centerX;
  var y = mousePosition.y - this.centerY;
  var angle = Math.atan(y / x);

  // Getting the correct angle in radians
  if (x < 0) {
    // Second quadrant & Third quadrant
    angle = Math.PI + angle;
  } else if (x > 0 && y < 0) {
    // Fourth quadrant
    angle = Math.PI * 2 + angle;
  }

  // Determine what is the potential candidate for the domain
  this.currentCursorIndex = parseInt((angle + Math.PI * 2 / this.circlesIndex.length / 2) / Math.PI / 2 * this.circlesIndex.length) % this.circlesIndex.length;
  var circleX = this.circles[this.circlesIndex[this.currentCursorIndex]].x + this.centerX;
  var circleY = this.circles[this.circlesIndex[this.currentCursorIndex]].y + this.centerY;

  if (getDistance(circleX, circleY, mousePosition.x, mousePosition.y) < DOMAIN_RADIUS) {
    this.canvasDOM.style.cursor = "pointer";
  } else {
    this.canvasDOM.style.cursor = "default";
  }
}

Viz.prototype.mouseClickHandler = function(event) {
  if (this.canvasDOM.style.cursor !== "pointer") {
    return
  } else {
    this.showData(this.data[this.circlesIndex[this.currentCursorIndex]]);
  }
}

Viz.prototype.showData = function(data) {
  var div = document.getElementById("data");
  div.innerHTML = "";
  var title = document.createElement("h4");
  title.innerHTML = data.name;
  div.appendChild(title);

  var referBy = document.createElement("p");
  referBy.innerHTML = "Referrals by:";
  div.appendChild(referBy);
  for (var i in data.referredBy) {
    var referral = document.createElement("p");
    referral.innerHTML = data.referredBy[i].domain + ", " + data.referredBy[i].count;
    div.appendChild(referral);
  }

  var referTo = document.createElement("p");
  referTo.innerHTML = "Referrals to:";
  div.appendChild(referTo);
  for (var i in data.referralTo) {
    var referral = document.createElement("p");
    referral.innerHTML = data.referralTo[i].domain + ", " + data.referralTo[i].count;
    div.appendChild(referral);
  }

  console.log(title);
  console.log(data);
}

var canvas = document.getElementById("canvas");
var Visualiation = new Viz(impressions, canvas, canvas.getContext('2d'));
