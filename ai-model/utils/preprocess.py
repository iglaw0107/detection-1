import pandas as pd

def preprocess_data(df):
    # Convert time → hour
    df['hour'] = pd.to_datetime(df['time'], format='%H:%M').dt.hour

    # Convert date → day of week
    df['day'] = pd.to_datetime(df['date']).dt.dayofweek

    
    hotspot_locations = ['Delhi']
    df['is_hotspot'] = df['location'].apply(
        lambda x: 1 if x in hotspot_locations else 0
    )

    # Encode categorical variables
    df = pd.get_dummies(df, columns=['location'])

    return df