import os
import json
import pyodbc
import azure.functions as func

def fetch_grocery_list(conn_string):
    try:
        with pyodbc.connect(conn_string) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT Item, Amount FROM dbo.GroceryList FOR JSON AUTO, INCLUDE_NULL_VALUES")
            row = cursor.fetchone()
            if row:
                return str(row[0])
            else:
                return "[]"  # Return empty JSON array if no data is fetched
    except pyodbc.Error as e:
        raise RuntimeError(f"Database error: {str(e)}")
    except Exception as e:
        raise RuntimeError(f"Error: {str(e)}")

def main(req: func.HttpRequest) -> func.HttpResponse:
    AZURE_CONN_STRING = os.environ.get("AzureSQLConnectionString")
    try:
        json_data = fetch_grocery_list(AZURE_CONN_STRING)
        return func.HttpResponse(json_data, status_code=200, mimetype="application/json")
    except RuntimeError as e:
        return func.HttpResponse(str(e), status_code=500)
