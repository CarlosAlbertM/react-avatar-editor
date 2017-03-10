(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod);
        global.index = mod.exports;
    }
})(this, function (exports, module) {
  
  'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isTouchDevice = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && ('ontouchstart' in window || navigator.msMaxTouchPoints > 0));

var draggableEvents = {
  touch: {
    react: {
      down: 'onTouchStart',
      mouseDown: 'onMouseDown',
      drag: 'onTouchMove',
      drop: 'onTouchEnd',
      move: 'onTouchMove',
      mouseMove: 'onMouseMove',
      up: 'onTouchEnd',
      mouseUp: 'onMouseUp'
    },
    native: {
      down: 'touchstart',
      mouseDown: 'mousedown',
      drag: 'touchmove',
      drop: 'touchend',
      move: 'touchmove',
      mouseMove: 'mousemove',
      up: 'touchend',
      mouseUp: 'mouseup'
    }
  },
  desktop: {
    react: {
      down: 'onMouseDown',
      drag: 'onDragOver',
      drop: 'onDrop',
      move: 'onMouseMove',
      up: 'onMouseUp'
    },
    native: {
      down: 'mousedown',
      drag: 'dragStart',
      drop: 'drop',
      move: 'mousemove',
      up: 'mouseup'
    }
  }
};
var deviceEvents = isTouchDevice ? draggableEvents.touch : draggableEvents.desktop;

// Draws a rounded rectangle on a 2D context.
var drawRoundedRect = function drawRoundedRect(context, x, y, width, height, borderRadius) {
  if (borderRadius === 0) {
    context.rect(x, y, width, height);
  } else {
    var widthMinusRad = width - borderRadius;
    var heightMinusRad = height - borderRadius;
    context.translate(x, y);
    context.arc(borderRadius, borderRadius, borderRadius, Math.PI, Math.PI * 1.5);
    context.lineTo(widthMinusRad, 0);
    context.arc(widthMinusRad, borderRadius, borderRadius, Math.PI * 1.5, Math.PI * 2);
    context.lineTo(width, heightMinusRad);
    context.arc(widthMinusRad, heightMinusRad, borderRadius, Math.PI * 2, Math.PI * 0.5);
    context.lineTo(borderRadius, height);
    context.arc(borderRadius, heightMinusRad, borderRadius, Math.PI * 0.5, Math.PI);
    context.translate(-x, -y);
  }
};

// Define global variables for standard.js
/* global Image, FileReader */

var AvatarEditor = function (_React$Component) {
  _inherits(AvatarEditor, _React$Component);

  function AvatarEditor(props) {
    _classCallCheck(this, AvatarEditor);

    var _this = _possibleConstructorReturn(this, (AvatarEditor.__proto__ || Object.getPrototypeOf(AvatarEditor)).call(this, props));

    _this.state = {
      drag: false,
      my: null,
      mx: null,
      image: {
        x: 0.5,
        y: 0.5
      }
    };


    _this.setCanvas = _this.setCanvas.bind(_this);
    _this.handleMouseMove = _this.handleMouseMove.bind(_this);
    _this.handleMouseDown = _this.handleMouseDown.bind(_this);
    _this.handleMouseUp = _this.handleMouseUp.bind(_this);
    _this.handleDragOver = _this.handleDragOver.bind(_this);
    _this.handleDrop = _this.handleDrop.bind(_this);
    return _this;
  }

  _createClass(AvatarEditor, [{
    key: 'isVertical',
    value: function isVertical() {
      return this.props.rotate % 180 !== 0;
    }
  }, {
    key: 'getDimensions',
    value: function getDimensions() {
      var _props = this.props,
          width = _props.width,
          height = _props.height,
          rotate = _props.rotate,
          border = _props.border;


      var canvas = {};

      var canvasWidth = width + border * 2;
      var canvasHeight = height + border * 2;

      if (this.isVertical()) {
        canvas.width = canvasHeight;
        canvas.height = canvasWidth;
      } else {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
      }

      return {
        canvas: canvas,
        rotate: rotate,
        width: width,
        height: height,
        border: border
      };
    }
  }, {
    key: 'getImage',
    value: function getImage() {
      // get relative coordinates (0 to 1)
      var cropRect = this.getCroppingRect();
      var image = this.state.image;

      // get actual pixel coordinates
      cropRect.x *= image.resource.width;
      cropRect.y *= image.resource.height;
      cropRect.width *= image.resource.width;
      cropRect.height *= image.resource.height;

      // create a canvas with the correct dimensions
      var canvas = document.createElement('canvas');

      if (this.isVertical()) {
        canvas.width = cropRect.height;
        canvas.height = cropRect.width;
      } else {
        canvas.width = cropRect.width;
        canvas.height = cropRect.height;
      }

      // draw the full-size image at the correct position,
      // the image gets truncated to the size of the canvas.
      var context = canvas.getContext('2d');

      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate(this.props.rotate * Math.PI / 180);
      context.translate(-(canvas.width / 2), -(canvas.height / 2));

      if (this.isVertical()) {
        context.translate((canvas.width - canvas.height) / 2, (canvas.height - canvas.width) / 2);
      }

      context.drawImage(image.resource, -cropRect.x, -cropRect.y);

      return canvas;
    }

    /**
     * Get the image scaled to original canvas size.
     * This was default in 4.x and is now kept as a legacy method.
     */

  }, {
    key: 'getImageScaledToCanvas',
    value: function getImageScaledToCanvas() {
      var _getDimensions = this.getDimensions(),
          width = _getDimensions.width,
          height = _getDimensions.height;

      var canvas = document.createElement('canvas');

      if (this.isVertical()) {
        canvas.width = height;
        canvas.height = width;
      } else {
        canvas.width = width;
        canvas.height = height;
      }

      // don't paint a border here, as it is the resulting image
      this.paintImage(canvas.getContext('2d'), this.state.image, 0);

      return canvas;
    }
  }, {
    key: 'getXScale',
    value: function getXScale() {
      var canvasAspect = this.props.width / this.props.height;
      var imageAspect = this.state.image.width / this.state.image.height;

      return Math.min(1, canvasAspect / imageAspect);
    }
  }, {
    key: 'getYScale',
    value: function getYScale() {
      var canvasAspect = this.props.height / this.props.width;
      var imageAspect = this.state.image.height / this.state.image.width;

      return Math.min(1, canvasAspect / imageAspect);
    }
  }, {
    key: 'getCroppingRect',
    value: function getCroppingRect() {
      var position = this.props.position || { x: this.state.image.x, y: this.state.image.y },
          width = 1 / this.props.scale * this.getXScale(),
          height = 1 / this.props.scale * this.getYScale();

      var croppingRect = {
        x: position.x - width / 2,
        y: position.y - height / 2,
        width: width,
        height: height
      };

      var xMin = 0,
          xMax = 1 - croppingRect.width,
          yMin = 0,
          yMax = 1 - croppingRect.height;

      // If the cropping rect is larger than the image, then we need to change
      // our maxima & minima for x & y to allow the image to appear anywhere up
      // to the very edge of the cropping rect.
      var isLargerThanImage = width > 1 || height > 1;

      if (isLargerThanImage) {
        xMin = -croppingRect.width;
        xMax = 1;
        yMin = -croppingRect.height;
        yMax = 1;
      }

      return _extends({}, croppingRect, {
        x: Math.max(xMin, Math.min(croppingRect.x, xMax)),
        y: Math.max(yMin, Math.min(croppingRect.y, yMax))
      });
    }
  }, {
    key: 'isDataURL',
    value: function isDataURL(str) {
      if (str === null) {
        return false;
      }
      var regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+=[a-z\-]+)?)?(;base64)?,[a-z0-9!$&',()*+;=\-._~:@\/?%\s]*\s*$/i;
      return !!str.match(regex);
    }
  }, {
    key: 'loadImage',
    value: function loadImage(imageURL) {
      var imageObj = new Image();
      imageObj.onload = this.handleImageReady.bind(this, imageObj);
      imageObj.onerror = this.props.onLoadFailure;
      if (!this.isDataURL(imageURL) && this.props.crossOrigin) imageObj.crossOrigin = this.props.crossOrigin;
      imageObj.src = imageURL;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var context = _reactDom2.default.findDOMNode(this.canvas).getContext('2d');
      if (this.props.image) {
        this.loadImage(this.props.image);
      }
      this.paint(context);
      if (document) {
        var nativeEvents = deviceEvents.native;
        document.addEventListener(nativeEvents.move, this.handleMouseMove, false);
        document.addEventListener(nativeEvents.up, this.handleMouseUp, false);
        if (isTouchDevice) {
          document.addEventListener(nativeEvents.mouseMove, this.handleMouseMove, false);
          document.addEventListener(nativeEvents.mouseUp, this.handleMouseUp, false);
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (document) {
        var nativeEvents = deviceEvents.native;
        document.removeEventListener(nativeEvents.move, this.handleMouseMove, false);
        document.removeEventListener(nativeEvents.up, this.handleMouseUp, false);
        if (isTouchDevice) {
          document.removeEventListener(nativeEvents.mouseMove, this.handleMouseMove, false);
          document.removeEventListener(nativeEvents.mouseUp, this.handleMouseUp, false);
        }
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var context = _reactDom2.default.findDOMNode(this.canvas).getContext('2d');
      context.clearRect(0, 0, this.getDimensions().canvas.width, this.getDimensions().canvas.height);
      this.paint(context);
      this.paintImage(context, this.state.image, this.props.border);

      if (prevProps.image !== this.props.image || prevProps.width !== this.props.width || prevProps.height !== this.props.height || prevProps.position !== this.props.position || prevProps.scale !== this.props.scale || prevProps.rotate !== this.props.rotate || prevState.my !== this.state.my || prevState.mx !== this.state.mx || prevState.image.x !== this.state.image.x || prevState.image.y !== this.state.image.y) {
        this.props.onImageChange();
      }
    }
  }, {
    key: 'handleImageReady',
    value: function handleImageReady(image) {
      var imageState = this.getInitialSize(image.width, image.height);
      imageState.resource = image;
      imageState.x = 0.5;
      imageState.y = 0.5;
      this.setState({ drag: false, image: imageState }, this.props.onImageReady);
      this.props.onLoadSuccess(imageState);
    }
  }, {
    key: 'getInitialSize',
    value: function getInitialSize(width, height) {
      var newHeight = void 0;
      var newWidth = void 0;

      var dimensions = this.getDimensions();
      var canvasRatio = dimensions.height / dimensions.width;
      var imageRatio = height / width;

      if (canvasRatio > imageRatio) {
        newHeight = this.getDimensions().height;
        newWidth = width * (newHeight / height);
      } else {
        newWidth = this.getDimensions().width;
        newHeight = height * (newWidth / width);
      }

      return {
        height: newHeight,
        width: newWidth
      };
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      if (newProps.image && this.props.image !== newProps.image || this.props.width !== newProps.width || this.props.height !== newProps.height) {
        this.loadImage(newProps.image);
      }
    }
  }, {
    key: 'paintImage',
    value: function paintImage(context, image, border) {
      if (image.resource) {
        var position = this.calculatePosition(image, border);

        context.save();

        context.translate(context.canvas.width / 2, context.canvas.height / 2);
        context.rotate(this.props.rotate * Math.PI / 180);
        context.translate(-(context.canvas.width / 2), -(context.canvas.height / 2));

        if (this.isVertical()) {
          context.translate((context.canvas.width - context.canvas.height) / 2, (context.canvas.height - context.canvas.width) / 2);
        }

        context.globalCompositeOperation = 'destination-over';
        context.drawImage(image.resource, position.x, position.y, position.width, position.height);

        context.restore();
      }
    }
  }, {
    key: 'calculatePosition',
    value: function calculatePosition(image, border) {
      image = image || this.state.image;

      var croppingRect = this.getCroppingRect();

      var width = image.width * this.props.scale;
      var height = image.height * this.props.scale;

      var x = border - croppingRect.x * width;
      var y = border - croppingRect.y * height;

      return {
        x: x,
        y: y,
        height: height,
        width: width
      };
    }
  }, {
    key: 'paint',
    value: function paint(context) {
      context.save();
      context.translate(0, 0);
      context.fillStyle = 'rgba(' + this.props.color.slice(0, 4).join(',') + ')';

      var borderRadius = this.props.borderRadius;
      var dimensions = this.getDimensions();
      var borderSize = dimensions.border;
      var height = dimensions.canvas.height;
      var width = dimensions.canvas.width;

      // clamp border radius between zero (perfect rectangle) and half the size without borders (perfect circle or "pill")
      borderRadius = Math.max(borderRadius, 0);
      borderRadius = Math.min(borderRadius, width / 2 - borderSize, height / 2 - borderSize);

      context.beginPath();
      // inner rect, possibly rounded
      drawRoundedRect(context, borderSize, borderSize, width - borderSize * 2, height - borderSize * 2, borderRadius);
      context.rect(width, 0, -width, height); // outer rect, drawn "counterclockwise"
      context.fill('evenodd');

      context.restore();
    }
  }, {
    key: 'handleMouseDown',
    value: function handleMouseDown(e) {
      e = e || window.event;
      // if e is a touch event, preventDefault keeps
      // corresponding mouse events from also being fired
      // later.
      e.preventDefault();
      this.setState({
        drag: true,
        mx: null,
        my: null
      });
    }
  }, {
    key: 'handleMouseUp',
    value: function handleMouseUp() {
      if (this.state.drag) {
        this.setState({ drag: false });
        this.props.onMouseUp();
      }
    }
  }, {
    key: 'handleMouseMove',
    value: function handleMouseMove(e) {
      e = e || window.event;
      if (this.state.drag === false) {
        return;
      }

      var mousePositionX = e.targetTouches ? e.targetTouches[0].pageX : e.clientX;
      var mousePositionY = e.targetTouches ? e.targetTouches[0].pageY : e.clientY;

      var newState = {
        mx: mousePositionX,
        my: mousePositionY
      };

      var rotate = this.props.rotate;

      rotate %= 360;
      rotate = rotate < 0 ? rotate + 360 : rotate;
      rotate -= rotate % 90;

      if (this.state.mx && this.state.my) {
        var mx = this.state.mx - mousePositionX;
        var my = this.state.my - mousePositionY;

        var width = this.state.image.width * this.props.scale;
        var height = this.state.image.height * this.props.scale;

        var _getCroppingRect = this.getCroppingRect(),
            lastX = _getCroppingRect.x,
            lastY = _getCroppingRect.y;

        lastX *= width;
        lastY *= height;

        // helpers to calculate vectors
        var toRadians = function toRadians(degree) {
          return degree * (Math.PI / 180);
        };
        var cos = Math.cos(toRadians(rotate));
        var sin = Math.sin(toRadians(rotate));

        var x = lastX + mx * cos + my * sin;
        var y = lastY + -mx * sin + my * cos;

        var relativeWidth = 1 / this.props.scale * this.getXScale();
        var relativeHeight = 1 / this.props.scale * this.getYScale();

        var position = {
          x: x / width + relativeWidth / 2,
          y: y / height + relativeHeight / 2
        };

        this.props.onPositionChange(position);

        newState.image = _extends({}, this.state.image, position);
      }

      this.setState(newState);

      this.props.onMouseMove();
    }
  }, {
    key: 'handleDragOver',
    value: function handleDragOver(e) {
      e = e || window.event;
      e.preventDefault();
    }
  }, {
    key: 'handleDrop',
    value: function handleDrop(e) {
      var _this2 = this;

      e = e || window.event;
      e.stopPropagation();
      e.preventDefault();

      if (e.dataTransfer && e.dataTransfer.files.length) {
        this.props.onDropFile(e);
        var reader = new FileReader();
        var file = e.dataTransfer.files[0];
        reader.onload = function (e) {
          return _this2.loadImage(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }, {
    key: 'setCanvas',
    value: function setCanvas(canvas) {
      this.canvas = canvas;
    }
  }, {
    key: 'render',
    value: function render() {
      var defaultStyle = {
        cursor: this.state.drag ? 'grabbing' : 'grab'
      };

      var attributes = {
        width: this.getDimensions().canvas.width,
        height: this.getDimensions().canvas.height,
        style: _extends({}, defaultStyle, this.props.style)
      };

      attributes[deviceEvents.react.down] = this.handleMouseDown;
      attributes[deviceEvents.react.drag] = this.handleDragOver;
      attributes[deviceEvents.react.drop] = this.handleDrop;
      if (isTouchDevice) attributes[deviceEvents.react.mouseDown] = this.handleMouseDown;

      return _react2.default.createElement('canvas', _extends({ ref: this.setCanvas }, attributes));
    }
  }]);

  return AvatarEditor;
}(_react2.default.Component);

AvatarEditor.propTypes = {
  scale: _react2.default.PropTypes.number,
  rotate: _react2.default.PropTypes.number,
  image: _react2.default.PropTypes.string,
  border: _react2.default.PropTypes.number,
  borderRadius: _react2.default.PropTypes.number,
  width: _react2.default.PropTypes.number,
  height: _react2.default.PropTypes.number,
  position: _react2.default.PropTypes.shape({
    x: _react2.default.PropTypes.number,
    y: _react2.default.PropTypes.number
  }),
  color: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.number),
  style: _react2.default.PropTypes.object,
  crossOrigin: _react2.default.PropTypes.oneOf(['', 'anonymous', 'use-credentials']),

  onDropFile: _react2.default.PropTypes.func,
  onLoadFailure: _react2.default.PropTypes.func,
  onLoadSuccess: _react2.default.PropTypes.func,
  onImageReady: _react2.default.PropTypes.func,
  onImageChange: _react2.default.PropTypes.func,
  onMouseUp: _react2.default.PropTypes.func,
  onMouseMove: _react2.default.PropTypes.func,
  onPositionChange: _react2.default.PropTypes.func
};
AvatarEditor.defaultProps = {
  scale: 1,
  rotate: 0,
  border: 25,
  borderRadius: 0,
  width: 200,
  height: 200,
  color: [0, 0, 0, 0.5],
  style: {},
  onDropFile: function onDropFile() {},
  onLoadFailure: function onLoadFailure() {},
  onLoadSuccess: function onLoadSuccess() {},
  onImageReady: function onImageReady() {},
  onImageChange: function onImageChange() {},
  onMouseUp: function onMouseUp() {},
  onMouseMove: function onMouseMove() {},
  onPositionChange: function onPositionChange() {}
};

 module.exports = AvatarEditor;
});
