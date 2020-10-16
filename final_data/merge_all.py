import pandas as pd

a = pd.read_csv("data.csv")
b = pd.read_csv("output_states.csv")
b = b.dropna(axis=1)
#merged = a.merge(b, on = 'Number', how='right')
merged = b.merge(a, on='Index')
merged.to_csv("output.csv", index=False)
