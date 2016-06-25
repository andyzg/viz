var CANVAS_RADIUS = 150;
var DOMAIN_RADIUS = 15;
var DOMAIN_COUNT = 20;

/*
 * Angle change sets the bezier points + or -
 * ANGLE_CHANGE from the original circle
 * Radius change is how much farther the bezier 
 * points are. If it's positive, it goes outside
 * the circle, and if it's negative, it goes inside
 */
var ANGLE_CHANGE = 0.3;
var RADIUS_CHANGE = 250 + CANVAS_RADIUS;
