import React, { PropTypes } from 'react';
import Picker from 'rmc-picker';
import GregorianCalendar from 'gregorian-calendar';
import defaultLocale from './locale/en_US';
import classnames from 'classnames';

function getDaysInMonth(now, selYear, selMonth) {
  const date = now.clone();
  date.set(selYear, selMonth, 1);
  date.rollMonth(1);
  date.addDayOfMonth(-1);
  return date.getDayOfMonth();
}

const DATETIME = 'datetime';
const DATE = 'date';
const TIME = 'time';

const DatePicker = React.createClass({
  propTypes: {
    date: PropTypes.object,
    defaultDate: PropTypes.object,
    prefixCls: PropTypes.string,
    pickerPrefixCls: PropTypes.string,
    className: PropTypes.string,
    minDate: PropTypes.object,
    maxDate: PropTypes.object,
    mode: PropTypes.string,
    locale: PropTypes.object,
    onDateChange: PropTypes.func,
    disabled: PropTypes.bool,
    format: PropTypes.Array,
  },

  getDefaultProps() {
    return {
      locale: defaultLocale,
      prefixCls: 'rmc-date-picker',
      pickerPrefixCls: 'rmc-picker',
      mode: DATE,
      onDateChange() {
      },
      disabled: false,
      format: ['years', 'months', 'days'],
    };
  },

  getInitialState() {
    return {
      date: this.props.date || this.props.defaultDate,
    };
  },

  componentWillReceiveProps(nextProps) {
    if ('date' in nextProps) {
      this.setState({
        date: nextProps.date,
      });
    }
  },

  onValueChange(type, value) {
    const props = this.props;
    let newValue = this.getDate().clone();
    if (props.mode === DATETIME || props.mode === DATE) {
      switch (type) {
        case 'years':
          newValue.setYear(value);
          break;
        case 'months':
          newValue.rollSetMonth(value);
          break;
        case 'days':
          newValue.rollSetDayOfMonth(value);
          break;
        case 'hours':
          newValue.setHourOfDay(value);
          break;
        case 'minutes':
          newValue.setMinutes(value);
          break;
        default:
          break;
      }
    } else {
      switch (type) {
        case 'hours':
          newValue.setHourOfDay(value);
          break;
        case 'minutes':
          newValue.setMinutes(value);
          break;
        default:
          break;
      }
    }
    newValue = this.clipDate(newValue);
    if (!('date' in this.props)) {
      this.setState({
        date: newValue,
      });
    }
    props.onDateChange(newValue);
  },

  getDefaultMinDate() {
    if (!this.defaultMinDate) {
      this.defaultMinDate = this.getGregorianCalendar();
      this.defaultMinDate.set(2000, 1, 1, 0, 0, 0);
    }
    return this.defaultMinDate;
  },

  getDefaultMaxDate() {
    if (!this.defaultMaxDate) {
      this.defaultMaxDate = this.getGregorianCalendar();
      // also for time mode
      this.defaultMaxDate.set(2030, 1, 1, 23, 59, 59);
    }
    return this.defaultMaxDate;
  },

  getNow() {
    if (!this.now) {
      this.now = this.getGregorianCalendar();
      this.now.setTime(Date.now());
    }
    return this.now;
  },

  getDate() {
    return this.state.date || this.getNow();
  },

  getMinYear() {
    return this.getMinDate().getYear();
  },

  getMaxYear() {
    return this.getMaxDate().getYear();
  },

  getMinMonth() {
    return this.getMinDate().getMonth();
  },

  getMaxMonth() {
    return this.getMaxDate().getMonth();
  },

  getMinDay() {
    return this.getMinDate().getDayOfMonth();
  },

  getMaxDay() {
    return this.getMaxDate().getDayOfMonth();
  },

  getMinHour() {
    return this.getMinDate().getHourOfDay();
  },

  getMaxHour() {
    return this.getMaxDate().getHourOfDay();
  },

  getMinMinute() {
    return this.getMinDate().getMinutes();
  },

  getMaxMinute() {
    return this.getMaxDate().getMinutes();
  },

  getMinDate() {
    return this.props.minDate || this.getDefaultMinDate();
  },

  getMaxDate() {
    return this.props.maxDate || this.getDefaultMaxDate();
  },

  getDateData() {
    const props = this.props;
    const locale = this.props.locale;
    const date = this.getDate();
    const selYear = date.getYear();
    const selMonth = date.getMonth();
    const minDateYear = this.getMinYear();
    const maxDateYear = this.getMaxYear();
    const minDateMonth = this.getMinMonth();
    const maxDateMonth = this.getMaxMonth();
    const minDateDay = this.getMinDay();
    const maxDateDay = this.getMaxDay();
    const years = [];
    for (let i = minDateYear; i <= maxDateYear; i++) {
      years.push({
        value: i,
        label: i + locale.year,
      });
    }

    const months = [];
    let minMonth = 0;
    let maxMonth = 11;
    if (minDateYear === selYear) {
      minMonth = minDateMonth;
    }
    if (maxDateYear === selYear) {
      maxMonth = maxDateMonth;
    }
    for (let i = minMonth; i <= maxMonth; i++) {
      months.push({
        value: i,
        label: (i + 1) + locale.month,
      });
    }

    const days = [];
    let minDay = 1;
    let maxDay = getDaysInMonth(date, selYear, selMonth);

    if (minDateYear === selYear && minDateMonth === selMonth) {
      minDay = minDateDay;
    }
    if (maxDateYear === selYear && maxDateMonth === selMonth) {
      maxDay = maxDateDay;
    }
    for (let i = minDay; i <= maxDay; i++) {
      days.push({
        value: i,
        label: i + locale.day,
      });
    }
    if (!Array.isArray(props.format)) {
      return [{
        key: 'years',
        value: years,
      }, {
        key: 'months',
        value: months,
      }, {
        key: 'days',
        value: days,
      }];
    }
    const dateSequence = props.format.map((item) => {
      if (item === 'years') {
        return {
          key: item,
          value: years,
        };
      } else if (item === 'months') {
        return {
          key: item,
          value: months,
        };
      } else if (item === 'days') {
        return {
          key: item,
          value: days,
        };
      }
    });
    return dateSequence;
  },
  getTimeData() {
    let minHour = 0;
    let maxHour = 23;
    let minMinute = 0;
    let maxMinute = 59;
    const { mode, locale } = this.props;
    const date = this.getDate();
    const minDateMinute = this.getMinMinute();
    const maxDateMinute = this.getMaxMinute();
    const minDateHour = this.getMinHour();
    const maxDateHour = this.getMaxHour();
    const hour = date.getHourOfDay();
    if (mode === DATETIME) {
      const year = date.getYear();
      const month = date.getMonth();
      const day = date.getDayOfMonth();
      const minDateYear = this.getMinYear();
      const maxDateYear = this.getMaxYear();
      const minDateMonth = this.getMinMonth();
      const maxDateMonth = this.getMaxMonth();
      const minDateDay = this.getMinDay();
      const maxDateDay = this.getMaxDay();
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

    const hours = [];
    for (let i = minHour; i <= maxHour; i++) {
      hours.push({
        value: i,
        label: i + locale.hour,
      });
    }

    const minutes = [];
    for (let i = minMinute; i <= maxMinute; i++) {
      minutes.push({
        value: i,
        label: i + locale.minute,
      });
    }
    return [{
      key: 'hours',
      value: hours,
    }, {
      key: 'minutes',
      value: minutes,
    }];
  },
  getGregorianCalendar() {
    return new GregorianCalendar(this.props.locale.calendar);
  },
  clipDate(date) {
    const { mode } = this.props;
    const minDate = this.getMinDate();
    const maxDate = this.getMaxDate();
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
      const maxHour = maxDate.getHourOfDay();
      const maxMinutes = maxDate.getMinutes();
      const minHour = minDate.getHourOfDay();
      const minMinutes = minDate.getMinutes();
      const hour = date.getHourOfDay();
      const minutes = date.getMinutes();
      if (hour < minHour || hour === minHour && minutes < minMinutes) {
        return minDate.clone();
      }
      if (hour > maxHour || hour === maxHour && minutes > maxMinutes) {
        return maxDate.clone();
      }
    }
    return date;
  },
  formatDateValue() {
    const { format } = this.props;
    const date = this.getDate();
    if (!Array.isArray(format)) {
      return [date.getYear(), date.getMonth(), date.getDayOfMonth()];
    }
    const values = format.map((item) => {
      if (item === 'years') {
        return date.getYear();
      } else if (item === 'months') {
        return date.getMonth();
      } else if (item === 'days') {
        return date.getDayOfMonth();
      }
    });
    return values;
  },
  render() {
    const props = this.props;
    const { mode, prefixCls, pickerPrefixCls, className, disabled } = props;
    let dataSource = [];
    let value = [];
    if (mode === DATETIME || mode === DATE) {
      dataSource = [...this.getDateData()];
      value = this.formatDateValue();
    }

    if (mode === DATETIME || mode === TIME) {
      const date = this.getDate();
      dataSource = dataSource.concat(this.getTimeData());
      value = value.concat([date.getHourOfDay(), date.getMinutes()]);
    }
    const inner = dataSource.map((items, i) => {
      return (<div key={i} className={`${prefixCls}-item`}>
        <Picker
          prefixCls={pickerPrefixCls}
          pure={false}
          selectedValue={value[i]}
          onValueChange={this.onValueChange.bind(this, items.key)}
          disabled={disabled}
        >
          {items.value}
        </Picker>
      </div>);
    });

    return (<div className={classnames(className, prefixCls)}>
      {inner}
    </div>);
  },
});

export default DatePicker;
