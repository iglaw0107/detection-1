# # utils/preprocess.py
# import pandas as pd

# def preprocess_data(df, target_col='crime_type'):
    
#     if 'time_of_occurrence' in df.columns:
#         df['hour'] = pd.to_datetime(df['time_of_occurrence'], errors='coerce').dt.hour
#     elif 'time' in df.columns:
#         df['hour'] = pd.to_datetime(df['time'], errors='coerce').dt.hour
#     else:
#         df['hour'] = 0

#     if 'date_of_occurrence' in df.columns:
#         dt = pd.to_datetime(df['date_of_occurrence'], errors='coerce')
#         df['day_of_week'] = dt.dt.dayofweek
#         df['month'] = dt.dt.month
#     else:
#         df['day_of_week'] = 0
#         df['month'] = 0

#     if 'date_case_closed' in df.columns:
#         dcc = pd.to_datetime(df['date_case_closed'], errors='coerce')
#         df['case_close_hour'] = dcc.dt.hour
#         df['case_close_month'] = dcc.dt.month

#     hotspot_locations = ['Delhi']
#     if 'city' in df.columns:
#         df['is_hotspot'] = df['city'].apply(lambda x: 1 if x in hotspot_locations else 0)
#     elif 'location' in df.columns:
#         df['is_hotspot'] = df['location'].apply(lambda x: 1 if x in hotspot_locations else 0)
#     else:
#         df['is_hotspot'] = 0

#     # ✅ Drop all date/time columns BEFORE get_dummies
#     date_cols = ['time_of_occurrence', 'time', 'date_of_occurrence', 
#                  'date_reported', 'date_case_closed', 'report_number']
#     df = df.drop(columns=[c for c in date_cols if c in df.columns])

#     # ✅ One-hot encode only remaining categoricals, exclude target
#     cat_cols = df.select_dtypes(include=['object']).columns.tolist()
#     if target_col in cat_cols:
#         cat_cols.remove(target_col)

#     df = pd.get_dummies(df, columns=cat_cols, dummy_na=False)  # ✅ dummy_na=False

#     return df



# utils/preprocess.py
import pandas as pd

# These are cities considered hotspots — load from env/config in future
DEFAULT_HOTSPOTS = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad']

def extract_hour(series):
    """Try multiple time formats to extract hour."""
    # Try HH:MM format first (your current dataset)
    parsed = pd.to_datetime(series, format='%H:%M', errors='coerce')
    if parsed.notna().sum() == 0:
        # Try full datetime
        parsed = pd.to_datetime(series, errors='coerce')
    return parsed.dt.hour.fillna(0).astype(int)

def preprocess_data(df, target_col='crime_type', hotspot_cities=None):
    if hotspot_cities is None:
        hotspot_cities = DEFAULT_HOTSPOTS

    # ── Time features
    time_col = next((c for c in ['time_of_occurrence', 'time'] if c in df.columns), None)
    if time_col:
        df['hour'] = extract_hour(df[time_col])
    else:
        df['hour'] = 0

    # Time of day buckets (useful feature)
    df['time_of_day'] = pd.cut(
        df['hour'],
        bins=[-1, 5, 11, 17, 20, 23],
        labels=['night', 'morning', 'afternoon', 'evening', 'late_night']
    ).astype(str)

    # ── Date features
    date_col = next((c for c in ['date_of_occurrence', 'date'] if c in df.columns), None)
    if date_col:
        dt = pd.to_datetime(df[date_col], errors='coerce')
        df['day_of_week'] = dt.dt.dayofweek.fillna(0).astype(int)
        df['month'] = dt.dt.month.fillna(0).astype(int)
        df['is_weekend'] = df['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)
    else:
        df['day_of_week'] = 0
        df['month'] = 0
        df['is_weekend'] = 0

    # ── Case close time (if exists — your current dataset has this)
    if 'date_case_closed' in df.columns:
        dcc = pd.to_datetime(df['date_case_closed'], errors='coerce')
        df['case_close_hour'] = dcc.dt.hour.fillna(0).astype(int)
        df['case_close_month'] = dcc.dt.month.fillna(0).astype(int)

    # ── Hotspot flag
    city_col = next((c for c in ['city', 'location'] if c in df.columns), None)
    if city_col:
        df['is_hotspot'] = df[city_col].apply(
            lambda x: 1 if str(x).strip() in hotspot_cities else 0
        )
    else:
        df['is_hotspot'] = 0

    # ── Drop raw date/time columns before encoding
    drop_cols = [
        'time_of_occurrence', 'time', 'date_of_occurrence', 'date',
        'date_reported', 'date_case_closed', 'report_number', 'case_closed'
    ]
    df = df.drop(columns=[c for c in drop_cols if c in df.columns])

    # ── One-hot encode categoricals (exclude target)
    cat_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
    if target_col in cat_cols:
        cat_cols.remove(target_col)

    df = pd.get_dummies(df, columns=cat_cols, dummy_na=False)

    return df