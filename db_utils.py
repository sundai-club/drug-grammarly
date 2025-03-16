import psycopg2

def search_drugs(drug_name_1, drug_name_2):
    results_list = []  # Initialize an empty list to store the results

    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(
            dbname = "drug_interaction_database",
            user = "myuser",
            password = "password",
            host = "localhost",
            port = "5432"
        )
        cursor = conn.cursor()

        # Case-insensitive search using ILIKE
        query = """
            SELECT drug_name_1, drug_name_2, side_effect_name
            FROM drug_side_effect_table
            WHERE drug_name_1 ILIKE %s AND drug_name_2 ILIKE %s
        """
        
        # Execute the query with case-insensitive parameters
        cursor.execute(query, (drug_name_1, drug_name_2))

        # Fetch all matching results
        results = cursor.fetchall()

        # Store the results in the list
        if results:
            results_list = results  # Store the results in the list
        else:
            results_list = []  # If no results found, return an empty list

    except Exception as e:
        print(f"Error: {e}")
    finally:
        # Close the database connection
        cursor.close()
        conn.close()

    return results_list  # Return the results as a list of lists


# if __name__ == "__main__":
#     # Example usage
#     drug_name_1 = "Sevoflurane"
#     drug_name_2 = "Aminophylline"

#     results = search_drugs(drug_name_1, drug_name_2)

#     if results:
#         print("Search results:")
#         for result in results:
#             print(result)
#     else:
#         print("No results found.")