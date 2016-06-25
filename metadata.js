var Metadata = function(data) {
  this.domainCount = Object.keys(data).length;
  var averages = this.getAvgs(data);
  this.avgComing = averages.avgComing;
  this.avgGoing = averages.avgGoing;
  this.averageEdge = this.getRelativeAverageEdge(data);
  if (this.maxComing === 0 && this.maxGoing === 0) {
    console.debug("No data was given");
    return;
  }
  this.angleInterval = Math.PI * 2 / this.domainCount;
};

Metadata.prototype.getRelativeAverageEdge = function(data) {
  var sum = 0;
  var count = 0;
  for (var domain in data) {
    data[domain].referredBy.forEach(function(visit) {
      sum += visit.count; 
      count++;
    });
  }
  return sum / count;
};

Metadata.prototype.getAvgs = function(data) {
  var totalGoing = 0;
  var totalComing = 0;
  var count = 0;
  for (var domain in data) {
    totalGoing += data[domain].totalComing;
    totalComing += data[domain].totalGoing;
    count++;
  }
  return {
    avgComing: totalComing / count,
    avgGoing: totalGoing / count,
  };
};
