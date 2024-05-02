import os
import json
import pyodbc
import azure.functions as func

def insert_grocery_item(conn_string, item_name, amount):
    try:
        with pyodbc.connect(conn_string) as conn:
            cursor = conn.cursor()
            cursor.execute(f"INSERT INTO dbo.GroceryList (Item, Amount) VALUES ('{item_name}', {amount})")
            conn.commit()
    except pyodbc.Error as e:
        raise RuntimeError(f"Database error: {str(e)}")
    except Exception as e:
        raise RuntimeError(f"Error: {str(e)}")

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        req_body = req.get_json()
        item_name = req_body.get('item_name')
        amount = req_body.get('amount')

        if not item_name or not amount:
            return func.HttpResponse("Item name and amount are required.", status_code=400)

        AZURE_CONN_STRING = os.environ.get("AzureSQLConnectionString")
        insert_grocery_item(AZURE_CONN_STRING, item_name, amount)
        
        return func.HttpResponse("Item inserted successfully.", status_code=200)
    except RuntimeError as e:
        return func.HttpResponse(str(e), status_code=500)
    except Exception as e:
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)
