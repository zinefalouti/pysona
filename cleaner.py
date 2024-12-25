def clean_sqlite_dump(input_file, output_file):
    try:
        # Open the file with a potential UTF-16 encoding and try to detect BOM
        with open(input_file, 'r', encoding='utf-16-sig') as infile:
            sql_data = infile.read()
    except UnicodeDecodeError:
        # If UTF-16 fails, try UTF-8 with ignoring errors
        with open(input_file, 'r', encoding='utf-8', errors='ignore') as infile:
            sql_data = infile.read()

    # Now clean the SQL data
    # Remove PRAGMA statements
    sql_data = remove_pragma_statements(sql_data)
    
    # Replace AUTOINCREMENT with SERIAL (if necessary for PostgreSQL)
    sql_data = sql_data.replace("AUTOINCREMENT", "SERIAL")

    # Add any other necessary clean-up transformations here, such as:
    # - Removing unsupported SQLite features
    # - Updating data types for PostgreSQL compatibility
    # - Fixing any other specific issues for your target database
    sql_data = clean_sql_data(sql_data)

    # Write the cleaned SQL data to the output file
    with open(output_file, 'w', encoding='utf-8') as outfile:
        outfile.write(sql_data)

def remove_pragma_statements(sql_data):
    """
    Remove any PRAGMA statements from the SQL dump.
    PRAGMA statements are specific to SQLite and should not be included in PostgreSQL.
    """
    lines = sql_data.splitlines()
    cleaned_lines = [line for line in lines if not line.strip().startswith("PRAGMA")]
    return "\n".join(cleaned_lines)

def clean_sql_data(sql_data):
    """
    Additional clean-up of the SQL data, such as:
    - Removing SQLite-specific types or keywords
    - Replacing certain SQL syntax for PostgreSQL compatibility
    """
    # Example: Remove unsupported SQLite types
    sql_data = sql_data.replace("TEXT", "VARCHAR")
    sql_data = sql_data.replace("INTEGER", "BIGINT")
    
    # You can add more replacements here based on the exact content of your dump file.
    
    return sql_data

if __name__ == "__main__":
    # Specify the paths to your input and output files
    input_file = 'dumpfile.sql'  # Replace with the path to your SQLite dump file
    output_file = 'cleaned_output.sql'  # Replace with the desired output file path
    
    # Clean the SQL dump file
    clean_sqlite_dump(input_file, output_file)

    print(f"SQL dump cleaned and saved to {output_file}")




