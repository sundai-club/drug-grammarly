import psycopg2
import csv

DB_NAME = "drug_interaction_database"
DB_USER = "myuser"
DB_PASSWORD = "password"
DB_HOST = "localhost"
DB_PORT = "5432"

conn = psycopg2.connect(
    dbname="postgres", user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT
)
conn.autocommit = True
cursor = conn.cursor()

cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{DB_NAME}';")
exists = cursor.fetchone()
if not exists:
    cursor.execute(f"CREATE DATABASE {DB_NAME};")

cursor.close()
conn.close()

conn = psycopg2.connect(
    dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT
)
cursor = conn.cursor()

##drop table
cursor.execute("DROP TABLE IF EXISTS drug_side_effect_table;")


cursor.execute("""
    CREATE TABLE IF NOT EXISTS drug_side_effect_table (
        id SERIAL PRIMARY KEY,
        num_row INTEGER,
        stitch_id_1 VARCHAR(100),
        stitch_id_2 VARCHAR(100),
        side_effect_id VARCHAR(100),
        side_effect_name VARCHAR(100),
        drug_name_1 VARCHAR(100),
        drug_name_2 VARCHAR(100)
    );
""")

csv_file = "../drug_data_no_nans.csv"

with open(csv_file, "r", newline='', encoding="utf-8") as f:
    # Skip the header row if it exists
    next(f)
    cursor.copy_from(f, 'drug_side_effect_table', sep=',', columns=('num_row','stitch_id_1', 'stitch_id_2', 'side_effect_id', 'side_effect_name', 'drug_name_1', 'drug_name_2'))


conn.commit()
cursor.close()
conn.close()

print("Database, table, and data inserted successfully.")
