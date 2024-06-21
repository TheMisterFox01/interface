import React, { ChangeEvent, useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import TextField from './TextField';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const DatePicker = ({
  label,
  className = '',
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: {
  label: string;
  className?: string;
  startDate: any;
  endDate: any;
  setStartDate: (date: any) => void;
  setEndDate: (date: any) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [tempRange, setTempRange] = useState('');
  const [error, setError] = useState(false);
  const ref = React.useRef(null);
  const styles = useStyles();

  const handleClick = (e: any) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: any) => {
    // @ts-ignore
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const formatDate = (date: any) => {
    let dt;
    if (date == null) {
      dt = new Date();
    } else {
      dt = new Date(date);
    }
    const year = dt.getFullYear();
    const month = dt.getMonth() + 1;
    const day = dt.getDate();
    return `${year}-${month > 9 ? month : '0' + month.toString()}-${
      day > 9 ? day : '0' + day.toString()
    }`;
  };

  useEffect(() => {
    setStart(startDate);
    setEnd(endDate);
    setTempRange('from ' + formatDate(startDate) + ' to ' + formatDate(endDate));
    setError(false);
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return function () {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    setStart(startDate);
    setTempRange('from ' + formatDate(startDate) + ' to ' + formatDate(endDate));
  }, [startDate]);

  useEffect(() => {
    setEnd(endDate);
    setTempRange('from ' + formatDate(startDate) + ' to ' + formatDate(endDate));
  }, [endDate]);

  const updateDates = (start: Date | null, end: Date | null) => {
    if (start != null) {
      setStartDate(start);
    }
    if (end != null) {
      setEndDate(end);
    }
    setTempRange('from ' + formatDate(start) + ' to ' + formatDate(end));
    setError(false);
  };

  const handleManualDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    try {
      const valueSplitted = value.split(' ');
      if (valueSplitted.length != 4 || valueSplitted[0] != 'from' || valueSplitted[2] != 'to') {
        setTempRange(value);
        setError(true);
      }
      const tempDt1 = new Date(valueSplitted[1]);
      const tempDt2 = new Date(valueSplitted[3]);
      if (isNaN(tempDt1 as any) || isNaN(tempDt2 as any)) {
        setTempRange(value);
        setError(true);
        return;
      }

      const splittedDt1 = valueSplitted[1].split('-');
      const splittedDt2 = valueSplitted[3].split('-');
      if (
        splittedDt1.length != 3 ||
        splittedDt1[0].length != 4 ||
        splittedDt1[1].length != 2 ||
        splittedDt1[2].length != 2
      ) {
        setTempRange(value);
        setError(true);
        return;
      }
      if (
        splittedDt2.length != 3 ||
        splittedDt2[0].length != 4 ||
        splittedDt2[1].length != 2 ||
        splittedDt2[2].length != 2
      ) {
        setTempRange(value);
        setError(true);
        return;
      }

      try {
        tempDt1.toISOString();
        tempDt2.toISOString();
      } catch {
        setError(true);
        setTempRange(value);
        return;
      }
      setStartDate(valueSplitted[1]);
      setEndDate(valueSplitted[3]);
      setTempRange(value);
      setError(false);
    } catch {
      setError(true);
      setTempRange(value);
      return;
    }
  };

  return (
    <div className={className}>
      <TextField
        className={styles.text}
        label={label}
        readonly={false}
        onClick={handleClick}
        value={tempRange}
        onChange={handleManualDateChange}
        error={error}
      />
      {isOpen && (
        <div className={styles.content} ref={ref}>
          <ReactDatePicker
            selectsRange={true}
            startDate={start}
            endDate={end}
            onChange={(update) => {
              const [start, end] = update;
              updateDates(start, end);
              setStart(start);
              setEnd(end);
            }}
            inline
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      text: {
        width: '300px',
      },
      content: {
        position: 'absolute',
        zIndex: 100,
        marginTop: '10px',
        '& .react-datepicker__day-names': {
          display: 'none',
        },
        '.react-datepicker__year-read-view--down-arrow, .react-datepicker__month-read-view--down-arrow, .react-datepicker__month-year-read-view--down-arrow, .react-datepicker__navigation-icon::before':
          {
            borderColor: theme.palette.text.secondary,
            borderStyle: 'solid',
            borderWidth: '3px 3px 0 0',
            content: '""',
            display: 'block',
            height: '9px',
            position: 'absolute',
            top: '6px',
            width: '9px',
          },
        '& .react-datepicker': {
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '14px',
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          display: 'inline-block',
          position: 'relative',
          padding: '10px',
          borderRadius: '6px',
          boxShadow:
            theme.palette.type === 'light'
              ? '0px 6px 15px -2px #ccc, 0px 0px 0px 1px #ccc'
              : '0px 6px 15px -2px #222, 0px 0px 0px 1px #222',
        },
        '& .react-datepicker__header': {
          textAlign: 'center',
          padding: '8px 0 20px 0',
          position: 'relative',
        },
        '& .react-datepicker__current-month, & .react-datepicker-time__header, & .react-datepicker-year-header':
          {
            color: theme.palette.text.primary,
            fontWeight: 'bold',
            fontSize: '14px',
          },
        '& .react-datepicker-time__header': {
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        },
        '& .react-datepicker__navigation': {
          alignItems: 'center',
          background: 'none',
          display: 'flex',
          justifyContent: 'center',
          textAlign: 'center',
          cursor: 'pointer',
          position: 'absolute',
          top: '12px',
          padding: 0,
          border: 'none',
          zIndex: 1,
          height: '32px',
          width: '32px',
          textIndent: '-999em',
          overflow: 'hidden',
        },
        '& .react-datepicker__navigation--previous': {
          left: '2px',
        },
        '& .react-datepicker__navigation--next': {
          right: '2px',
        },
        '& .react-datepicker__navigation--years-previous': {
          top: '4px',
        },
        '& .react-datepicker__navigation--years-upcoming': {
          top: '-4px',
        },
        '& .react-datepicker__navigation-icon::before': {
          borderColor: theme.palette.text.primary,
          borderStyle: 'solid',
          borderWidth: '3px 3px 0 0',
          content: '""',
          display: 'block',
          height: '9px',
          position: 'absolute',
          top: '6px',
          width: '9px',
        },
        '& .react-datepicker__navigation-icon--next': {
          left: '-2px',
        },
        '& .react-datepicker__navigation-icon--next::before': {
          transform: 'rotate(45deg)',
          left: '-7px',
        },
        '& .react-datepicker__navigation-icon--previous': {
          right: '-2px',
        },
        '& .react-datepicker__navigation-icon--previous::before': {
          transform: 'rotate(225deg)',
          right: '-7px',
        },
        '& .react-datepicker__day-name, & .react-datepicker__day, & .react-datepicker__time-name': {
          color: theme.palette.text.primary,
          display: 'inline-block',
          width: '36px',
          lineHeight: '36px',
          textAlign: 'center',
          margin: '2px',
        },
        '& .react-datepicker__day, & .react-datepicker__month-text, & .react-datepicker__quarter-text, & .react-datepicker__year-text':
          {
            cursor: 'pointer',
            borderRadius: '4px',
          },
        '& .react-datepicker__day:hover, & .react-datepicker__month-text:hover, & .react-datepicker__quarter-text:hover, & .react-datepicker__year-text:hover':
          {
            backgroundColor: theme.palette.background.default,
            opacity: 0.8,
          },
        '& .react-datepicker__day--today, & .react-datepicker__month-text--today, & .react-datepicker__quarter-text--today, & .react-datepicker__year-text--today':
          {
            fontWeight: 'bold',
          },
        '& .react-datepicker__day--highlighted, & .react-datepicker__month-text--highlighted, & .react-datepicker__quarter-text--highlighted, & .react-datepicker__year-text--highlighted':
          {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.default,
          },
        '& .react-datepicker__day--highlighted:hover, & .react-datepicker__month-text--highlighted:hover, & .react-datepicker__quarter-text--highlighted:hover, & .react-datepicker__year-text--highlighted:hover':
          {
            backgroundColor: theme.palette.primary.main,
          },
        '& .react-datepicker__day--highlighted-custom-1, & .react-datepicker__month-text--highlighted-custom-1, & .react-datepicker__quarter-text--highlighted-custom-1, & .react-datepicker__year-text--highlighted-custom-1':
          {
            color: theme.palette.background.default,
          },
        '& .react-datepicker__day--highlighted-custom-2, & .react-datepicker__month-text--highlighted-custom-2, & .react-datepicker__quarter-text--highlighted-custom-2, & .react-datepicker__year-text--highlighted-custom-2':
          {
            color: theme.palette.background.default,
          },
        '& .react-datepicker__day--holidays, & .react-datepicker__month-text--holidays, & .react-datepicker__quarter-text--holidays, & .react-datepicker__year-text--holidays':
          {
            position: 'relative',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.default,
          },
        '& .react-datepicker__day--holidays .holiday-overlay, & .react-datepicker__month-text--holidays .holiday-overlay, & .react-datepicker__quarter-text--holidays .holiday-overlay, & .react-datepicker__year-text--holidays .holiday-overlay':
          {
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.default,
            padding: '4px',
            whiteSpace: 'nowrap',
            visibility: 'hidden',
            opacity: 0,
            transition: 'visibility 0s, opacity 0.3s ease-in-out',
          },
        '& .react-datepicker__day--holidays:hover, & .react-datepicker__month-text--holidays:hover, & .react-datepicker__quarter-text--holidays:hover, & .react-datepicker__year-text--holidays:hover':
          {
            backgroundColor: theme.palette.primary.main,
          },
        '& .react-datepicker__day--holidays:hover .holiday-overlay, & .react-datepicker__month-text--holidays:hover .holiday-overlay, & .react-datepicker__quarter-text--holidays:hover .holiday-overlay, & .react-datepicker__year-text--holidays:hover .holiday-overlay':
          {
            visibility: 'visible',
            opacity: 1,
          },
        '& .react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range, & .react-datepicker__month-text--selected, & .react-datepicker__month-text--in-selecting-range, & .react-datepicker__month-text--in-range, & .react-datepicker__quarter-text--selected, & .react-datepicker__quarter-text--in-selecting-range, & .react-datepicker__quarter-text--in-range, & .react-datepicker__year-text--selected, & .react-datepicker__year-text--in-selecting-range, & .react-datepicker__year-text--in-range':
          {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.default,
          },
        '& .react-datepicker__day--selected:hover, .react-datepicker__day--in-selecting-range:hover, .react-datepicker__day--in-range:hover, & .react-datepicker__month-text--selected:hover, & .react-datepicker__month-text--in-selecting-range:hover, & .react-datepicker__month-text--in-range:hover, & .react-datepicker__quarter-text--selected:hover, & .react-datepicker__quarter-text--in-selecting-range:hover, & .react-datepicker__quarter-text--in-range:hover, & .react-datepicker__year-text--selected:hover, & .react-datepicker__year-text--in-selecting-range:hover, & .react-datepicker__year-text--in-range:hover':
          {
            backgroundColor: theme.palette.primary.main,
          },
        '& .react-datepicker__day--keyboard-selected, & .react-datepicker__month-text--keyboard-selected, & .react-datepicker__quarter-text--keyboard-selected, & .react-datepicker__year-text--keyboard-selected':
          {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.default,
          },
        '& .react-datepicker__day--keyboard-selected:hover, & .react-datepicker__month-text--keyboard-selected:hover, & .react-datepicker__quarter-text--keyboard-selected:hover, & .react-datepicker__year-text--keyboard-selected:hover':
          {
            backgroundColor: theme.palette.primary.main,
          },
        '& .react-datepicker__day--in-selecting-range:not(.react-datepicker__day--in-range, & .react-datepicker__month-text--in-range, & .react-datepicker__quarter-text--in-range, & .react-datepicker__year-text--in-range), & .react-datepicker__month-text--in-selecting-range:not(.react-datepicker__day--in-range, & .react-datepicker__month-text--in-range, & .react-datepicker__quarter-text--in-range, & .react-datepicker__year-text--in-range), & .react-datepicker__quarter-text--in-selecting-range:not(.react-datepicker__day--in-range, & .react-datepicker__month-text--in-range, & .react-datepicker__quarter-text--in-range, & .react-datepicker__year-text--in-range), & .react-datepicker__year-text--in-selecting-range:not(.react-datepicker__day--in-range, & .react-datepicker__month-text--in-range, & .react-datepicker__quarter-text--in-range, & .react-datepicker__year-text--in-range)':
          {
            backgroundColor: theme.palette.primary.main,
          },
        '& .react-datepicker__month--selecting-range .react-datepicker__day--in-range:not(.react-datepicker__day--in-selecting-range, & .react-datepicker__month-text--in-selecting-range, & .react-datepicker__quarter-text--in-selecting-range, & .react-datepicker__year-text--in-selecting-range), .react-datepicker__year--selecting-range .react-datepicker__day--in-range:not(.react-datepicker__day--in-selecting-range, & .react-datepicker__month-text--in-selecting-range, & .react-datepicker__quarter-text--in-selecting-range, & .react-datepicker__year-text--in-selecting-range), & .react-datepicker__month--selecting-range .react-datepicker__month-text--in-range:not(.react-datepicker__day--in-selecting-range, & .react-datepicker__month-text--in-selecting-range, & .react-datepicker__quarter-text--in-selecting-range, & .react-datepicker__year-text--in-selecting-range), & .react-datepicker__year--selecting-range .react-datepicker__month-text--in-range:not(.react-datepicker__day--in-selecting-range, & .react-datepicker__month-text--in-selecting-range, & .react-datepicker__quarter-text--in-selecting-range, & .react-datepicker__year-text--in-selecting-range), & .react-datepicker__month--selecting-range .react-datepicker__quarter-text--in-range:not(.react-datepicker__day--in-selecting-range, & .react-datepicker__month-text--in-selecting-range, & .react-datepicker__quarter-text--in-selecting-range, & .react-datepicker__year-text--in-selecting-range), & .react-datepicker__year--selecting-range .react-datepicker__quarter-text--in-range:not(.react-datepicker__day--in-selecting-range, & .react-datepicker__month-text--in-selecting-range, & .react-datepicker__quarter-text--in-selecting-range, & .react-datepicker__year-text--in-selecting-range), & .react-datepicker__month--selecting-range .react-datepicker__year-text--in-range:not(.react-datepicker__day--in-selecting-range, & .react-datepicker__month-text--in-selecting-range, & .react-datepicker__quarter-text--in-selecting-range, & .react-datepicker__year-text--in-selecting-range), & .react-datepicker__year--selecting-range .react-datepicker__year-text--in-range:not(.react-datepicker__day--in-selecting-range, & .react-datepicker__month-text--in-selecting-range, & .react-datepicker__quarter-text--in-selecting-range, & .react-datepicker__year-text--in-selecting-range)':
          {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.default,
          },
        '& .react-datepicker__aria-live': {
          position: 'absolute',
          clipPath: 'circle(0)',
          border: 0,
          height: '1px',
          margin: '-1px',
          overflow: 'hidden',
          padding: 0,
          width: '1px',
          whiteSpace: 'nowrap',
        },
      },
    }),
  { name: 'DatePicker' },
);
