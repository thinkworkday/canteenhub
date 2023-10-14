

import moment from 'moment';

export const DateItem = (props) => {
  const { date, size, display } = props;

  return (
    <div className={`date-item size-${size} ${display}`}>
      <div className="month">{moment(date).format('MMM')}</div>
      <div className="day">{moment(date).format('D')}</div>
      <div className="year">{moment(date).format('YYYY')}</div>
    </div>
  );
};
