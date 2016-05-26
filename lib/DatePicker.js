'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rmcPicker = require('rmc-picker');

var _rmcPicker2 = _interopRequireDefault(_rmcPicker);

var _gregorianCalendar = require('gregorian-calendar');

var _gregorianCalendar2 = _interopRequireDefault(_gregorianCalendar);

var _en_US = require('./locale/en_US');

var _en_US2 = _interopRequireDefault(_en_US);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getDaysInMonth(now, selYear, selMonth) {
  var date = now.clone();
  date.set(selYear, selMonth, 1);
  date.rollMonth(1);
  date.addDayOfMonth(-1);
  return date.getDayOfMonth();
}

var DATETIME = 'datetime';
var DATE = 'date';
var TIME = 'time';

var DatePicker = _react2["default"].createClass({
  displayName: 'DatePicker',

  propTypes: {
    date: _react.PropTypes.object,
    defaultDate: _react.PropTypes.object,
    prefixCls: _react.PropTypes.string,
    pickerPrefixCls: _react.PropTypes.string,
    className: _react.PropTypes.string,
    minDate: _react.PropTypes.object,
    maxDate: _react.PropTypes.object,
    mode: _react.PropTypes.string,
    locale: _react.PropTypes.object,
    onDateChange: _react.PropTypes.func,
    disabled: _react.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      locale: _en_US2["default"],
      prefixCls: 'rmc-date-picker',
      pickerPrefixCls: 'rmc-picker',
      mode: DATE,
      onDateChange: function onDateChange() {},

      disabled: false
    };
  },
  getInitialState: function getInitialState() {
    return {
      date: this.props.date || this.props.defaultDate
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if ('date' in nextProps) {
      this.setState({
        date: nextProps.date
      });
    }
  },
  onValueChange: function onValueChange(index, value) {
    var props = this.props;
    var newValue = this.getDate().clone();
    if (props.mode === DATETIME || props.mode === DATE) {
      switch (index) {
        case 0:
          newValue.setYear(value);
          break;
        case 1:
          newValue.rollSetMonth(value);
          break;
        case 2:
          newValue.rollSetDayOfMonth(value);
          break;
        case 3:
          newValue.setHourOfDay(value);
          break;
        case 4:
          newValue.setMinutes(value);
          break;
        default:
          break;
      }
    } else {
      switch (index) {
        case 0:
          newValue.setHourOfDay(value);
          break;
        case 1:
          newValue.setMinutes(value);
          break;
        default:
          break;
      }
    }
    newValue = this.clipDate(newValue);
    if (!('date' in this.props)) {
      this.setState({
        date: newValue
      });
    }
    props.onDateChange(newValue);
  },
  getDefaultMinDate: function getDefaultMinDate() {
    if (!this.defaultMinDate) {
      this.defaultMinDate = this.getGregorianCalendar();
      this.defaultMinDate.set(2000, 1, 1, 0, 0, 0);
    }
    return this.defaultMinDate;
  },
  getDefaultMaxDate: function getDefaultMaxDate() {
    if (!this.defaultMaxDate) {
      this.defaultMaxDate = this.getGregorianCalendar();
      // also for time mode
      this.defaultMaxDate.set(2030, 1, 1, 23, 59, 59);
    }
    return this.defaultMaxDate;
  },
  getNow: function getNow() {
    if (!this.now) {
      this.now = this.getGregorianCalendar();
      this.now.setTime(Date.now());
    }
    return this.now;
  },
  getDate: function getDate() {
    return this.state.date || this.getNow();
  },
  getMinYear: function getMinYear() {
    return this.getMinDate().getYear();
  },
  getMaxYear: function getMaxYear() {
    return this.getMaxDate().getYear();
  },
  getMinMonth: function getMinMonth() {
    return this.getMinDate().getMonth();
  },
  getMaxMonth: function getMaxMonth() {
    return this.getMaxDate().getMonth();
  },
  getMinDay: function getMinDay() {
    return this.getMinDate().getDayOfMonth();
  },
  getMaxDay: function getMaxDay() {
    return this.getMaxDate().getDayOfMonth();
  },
  getMinHour: function getMinHour() {
    return this.getMinDate().getHourOfDay();
  },
  getMaxHour: function getMaxHour() {
    return this.getMaxDate().getHourOfDay();
  },
  getMinMinute: function getMinMinute() {
    return this.getMinDate().getMinutes();
  },
  getMaxMinute: function getMaxMinute() {
    return this.getMaxDate().getMinutes();
  },
  getMinDate: function getMinDate() {
    return this.props.minDate || this.getDefaultMinDate();
  },
  getMaxDate: function getMaxDate() {
    return this.props.maxDate || this.getDefaultMaxDate();
  },
  getDateData: function getDateData() {
    var locale = this.props.locale;
    var date = this.getDate();
    var selYear = date.getYear();
    var selMonth = date.getMonth();
    var minDateYear = this.getMinYear();
    var maxDateYear = this.getMaxYear();
    var minDateMonth = this.getMinMonth();
    var maxDateMonth = this.getMaxMonth();
    var minDateDay = this.getMinDay();
    var maxDateDay = this.getMaxDay();
    var years = [];
    for (var i = minDateYear; i <= maxDateYear; i++) {
      years.push({
        value: i,
        label: i + locale.year
      });
    }

    var months = [];
    var minMonth = 0;
    var maxMonth = 11;
    if (minDateYear === selYear) {
      minMonth = minDateMonth;
    }
    if (maxDateYear === selYear) {
      maxMonth = maxDateMonth;
    }
    for (var _i = minMonth; _i <= maxMonth; _i++) {
      months.push({
        value: _i,
        label: _i + 1 + locale.month
      });
    }

    var days = [];
    var minDay = 1;
    var maxDay = getDaysInMonth(date, selYear, selMonth);

    if (minDateYear === selYear && minDateMonth === selMonth) {
      minDay = minDateDay;
    }
    if (maxDateYear === selYear && maxDateMonth === selMonth) {
      maxDay = maxDateDay;
    }
    for (var _i2 = minDay; _i2 <= maxDay; _i2++) {
      days.push({
        value: _i2,
        label: _i2 + locale.day
      });
    }
    return [years, months, days];
  },
  getTimeData: function getTimeData() {
    var minHour = 0;
    var maxHour = 23;
    var minMinute = 0;
    var maxMinute = 59;
    var _props = this.props;
    var mode = _props.mode;
    var locale = _props.locale;

    var date = this.getDate();
    var minDateMinute = this.getMinMinute();
    var maxDateMinute = this.getMaxMinute();
    var minDateHour = this.getMinHour();
    var maxDateHour = this.getMaxHour();
    var hour = date.getHourOfDay();
    if (mode === DATETIME) {
      var year = date.getYear();
      var month = date.getMonth();
      var day = date.getDayOfMonth();
      var minDateYear = this.getMinYear();
      var maxDateYear = this.getMaxYear();
      var minDateMonth = this.getMinMonth();
      var maxDateMonth = this.getMaxMonth();
      var minDateDay = this.getMinDay();
      var maxDateDay = this.getMaxDay();
      if (minDateYear === year && minDateMonth === month && minDateDay === day) {
        minHour = minDateHour;
        if (minDateHour === hour) {
          minMinute = minDateMinute;
        }
      }
      if (maxDateYear === year && maxDateMonth === month && maxDateDay === day) {
        maxHour = maxDateHour;
        if (maxDateHour === hour) {
          maxMinute = maxDateMinute;
        }
      }
    } else {
      minHour = minDateHour;
      if (minDateHour === hour) {
        minMinute = minDateMinute;
      }
      maxHour = maxDateHour;
      if (maxDateHour === hour) {
        maxMinute = maxDateMinute;
      }
    }

    var hours = [];
    for (var i = minHour; i <= maxHour; i++) {
      hours.push({
        value: i,
        label: i + locale.hour
      });
    }

    var minutes = [];
    for (var _i3 = minMinute; _i3 <= maxMinute; _i3++) {
      minutes.push({
        value: _i3,
        label: _i3 + locale.minute
      });
    }
    return [hours, minutes];
  },
  getGregorianCalendar: function getGregorianCalendar() {
    return new _gregorianCalendar2["default"](this.props.locale.calendar);
  },
  clipDate: function clipDate(date) {
    var mode = this.props.mode;

    var minDate = this.getMinDate();
    var maxDate = this.getMaxDate();
    if (mode === DATETIME) {
      if (date.getTime() < minDate.getTime()) {
        return minDate.clone();
      }
      if (date.getTime() > maxDate.getTime()) {
        return maxDate.clone();
      }
    } else if (mode === DATE) {
      if (date.compareToDay(minDate) < 0) {
        return minDate.clone();
      }
      if (date.compareToDay(maxDate) > 0) {
        return maxDate.clone();
      }
    } else {
      var maxHour = maxDate.getHourOfDay();
      var maxMinutes = maxDate.getMinutes();
      var minHour = minDate.getHourOfDay();
      var minMinutes = minDate.getMinutes();
      var hour = date.getHourOfDay();
      var minutes = date.getMinutes();
      if (hour < minHour || hour === minHour && minutes < minMinutes) {
        return minDate.clone();
      }
      if (hour > maxHour || hour === maxHour && minutes > maxMinutes) {
        return maxDate.clone();
      }
    }
    return date;
  },
  render: function render() {
    var _this = this;

    var props = this.props;
    var mode = props.mode;
    var prefixCls = props.prefixCls;
    var pickerPrefixCls = props.pickerPrefixCls;
    var className = props.className;
    var disabled = props.disabled;

    var date = this.getDate();
    var dataSource = [];
    var value = [];
    if (mode === DATETIME || mode === DATE) {
      dataSource = [].concat(_toConsumableArray(this.getDateData()));
      value = [date.getYear(), date.getMonth(), date.getDayOfMonth()];
    }

    if (mode === DATETIME || mode === TIME) {
      dataSource = dataSource.concat(this.getTimeData());
      value = value.concat([date.getHourOfDay(), date.getMinutes()]);
    }

    var inner = dataSource.map(function (items, i) {
      return _react2["default"].createElement(
        'div',
        { key: i, className: prefixCls + '-item' },
        _react2["default"].createElement(
          _rmcPicker2["default"],
          {
            prefixCls: pickerPrefixCls,
            pure: false,
            selectedValue: value[i],
            onValueChange: _this.onValueChange.bind(_this, i),
            disabled: disabled
          },
          items
        )
      );
    });

    return _react2["default"].createElement(
      'div',
      { className: (0, _classnames2["default"])(className, prefixCls) },
      inner
    );
  }
});

exports["default"] = DatePicker;
module.exports = exports['default'];