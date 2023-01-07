from dateutil.rrule import rrule, DAILY
from datetime import datetime, timedelta

def generate_range_of_dates(start_date, end_date):
    start_date = datetime.strptime(start_date, '%Y-%m-%d')
    end_date = datetime.strptime(end_date, '%Y-%m-%d')
    dates = list(rrule(DAILY, dtstart=start_date, until=end_date))

    return [datetime.strftime(date, '%Y-%m-%d') for date in dates]