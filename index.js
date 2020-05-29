var path = $('#path');

Draggable.create("#indicator", {
  type: "rotation",
  throwProps: true,
  maxRotation: 360,
  onDrag: function() {
    var i = this.rotation;
    path.css('stroke-dashoffset', 620*(1-i/360));
  },
});