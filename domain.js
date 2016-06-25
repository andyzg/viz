var Domain = function(name) {
  this.name = name;
  this.referralTo = [];
  this.referredBy = [];
  this.totalComing = 0;
  this.totalGoing = 0;
}

Domain.prototype.addReferralTo = function(domain, count) {
  this.referralTo.push({
    count: count,
    domain: domain,
  });
  this.totalGoing += count;
}

Domain.prototype.addReferralBy = function(domain, count) {
  this.referredBy.push({
    count: count,
    domain: domain,
  });
  this.totalComing += count;
}
