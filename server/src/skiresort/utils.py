from dateutil.rrule import rrule, DAILY
from datetime import datetime, timedelta
from collections import namedtuple

def generate_range_of_dates(start_date, end_date):
    start_date = datetime.strptime(start_date, '%Y-%m-%d')
    end_date = datetime.strptime(end_date, '%Y-%m-%d')
    dates = list(rrule(DAILY, dtstart=start_date, until=end_date))

    return [datetime.strftime(date, '%Y-%m-%d') for date in dates]


def date_range_overlap(first_date_range, second_date_range):
    if len(second_date_range) == 0:
        return False
    Range = namedtuple('Range', ['start', 'end'])

    print(len(first_date_range))
    print(len(second_date_range))

    r1 = Range(start=datetime.strptime(first_date_range[0], "%Y-%m-%d"), end=datetime.strptime(first_date_range[len(first_date_range) - 1], "%Y-%m-%d"))
    r2 = Range(start=datetime.strptime(second_date_range[0], "%Y-%m-%d"), end=datetime.strptime(second_date_range[len(second_date_range) - 1], "%Y-%m-%d"))

    latest_start = max(r1.start, r2.start)
    earliest_end = min(r1.end, r2.end)

    delta = (earliest_end - latest_start).days + 1
    overlap = max(0, delta)

    print(overlap)

    if overlap >= 0:
        return True
    return False 