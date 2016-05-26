'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DatePicker = require('./DatePicker');

var _DatePicker2 = _interopRequireDefault(_DatePicker);

var _gregorianCalendar = require('gregorian-calendar');

var _gregorianCalendar2 = _interopRequireDefault(_gregorianCalendar);

var _en_US = require('./locale/en_US');

var _en_US2 = _interopRequireDefault(_en_US);

var _utils = require('./utils');

var _Popup = require('rmc-picker/lib/Popup');

var _Popup2 = _interopRequireDefault(_Popup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PROPS = ['onDismiss', 'children', 'style', 'okText', 'dismissText', 'title', 'className', 'popupTransitionName', 'maskTransitionName'];

var PopupDatePicker = _react2["default"].createClass({
  displayName: 'PopupDatePicker',

  propTypes: {
    visible: _react.PropTypes.bool,
    mode: _react.PropTypes.string,
    onPickerChange: _react.PropTypes.func,
    onChange: _react.PropTypes.func,
    popupPrefixCls: _react.PropTypes.string,
    prefixCls: _react.PropTypes.string,
    pickerPrefixCls: _react.PropTypes.string,
    onVisibleChange: _react.PropTypes.func,
    locale: _react.PropTypes.object,
    date: _react.PropTypes.object
  },
  getDefaultProps: function getDefaultProps() {
    return {
      onVisibleChange: _utils.noop,
      popupPrefixCls: 'rmc-picker-popup',
      mode: 'datetime',
      locale: _en_US2["default"],
      onChange: _utils.noop,
      onDismiss: _utils.noop,
      onPickerChange: _utils.noop
    };
  },
  getInitialState: function getInitialState() {
    return {
      pickerDate: null,
      visible: this.props.visible || false
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if ('visible' in nextProps) {
      this.setVisibleState(nextProps.visible);
    }
  },
  onPickerChange: function onPickerChange(pickerDate) {
    this.setState({
      pickerDate: pickerDate
    });
    this.props.onPickerChange(pickerDate);
  },
  onOk: function onOk() {
    this.props.onChange(this.state.pickerDate || this.props.date);
  },
  setVisibleState: function setVisibleState(visible) {
    this.setState({
      visible: visible
    });
    if (!visible) {
      this.setState({
        pickerDate: null
      });
    }
  },
  getNow: function getNow(props) {
    var date = this.getGregorianCalendar(props);
    date.setTime(Date.now());
    return date;
  },
  getGregorianCalendar: function getGregorianCalendar(props) {
    return new _gregorianCalendar2["default"]((props || this.props).locale.calendar);
  },
  getModal: function getModal() {
    var props = this.props;
    var dpProps = {};
    if (props.minDate) {
      dpProps.minDate = props.minDate;
    }
    if (props.maxDate) {
      dpProps.maxDate = props.maxDate;
    }
    if (props.pickerPrefixCls) {
      dpProps.pickerPrefixCls = props.pickerPrefixCls;
    }
    if (props.prefixCls) {
      dpProps.prefixCls = props.prefixCls;
    }
    return _react2["default"].createElement(_DatePicker2["default"], _extends({
      date: this.state.pickerDate || props.date,
      mode: props.mode,
      locale: props.locale,
      onDateChange: this.onPickerChange
    }, dpProps));
  },
  fireVisibleChange: function fireVisibleChange(visible) {
    if (this.state.visible !== visible) {
      if (!('visible' in this.props)) {
        this.setVisibleState(visible);
      }
      this.props.onVisibleChange(visible);
    }
  },
  render: function render() {
    var props = (0, _utils.pick)(this.props, PROPS);
    return _react2["default"].createElement(_Popup2["default"], _extends({}, props, {
      onVisibleChange: this.fireVisibleChange,
      onOk: this.onOk,
      content: this.getModal(),
      prefixCls: this.props.popupPrefixCls,
      visible: this.state.visible
    }));
  }
});

exports["default"] = PopupDatePicker;
module.exports = exports['default'];