const originalGetContext = HTMLCanvasElement.prototype.getContext;

HTMLCanvasElement.prototype.getContext = function getContext(type, options) {
  if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") {
    return null;
  }
  return originalGetContext.call(this, type, options);
};
